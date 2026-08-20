/**
 * @file checkoutFirestore.ts
 * @description Servicio de infraestructura para realizar transacciones de pago en Firestore y actualizar stock.
 * @architecture Infrastructure Layer - Checkout Firestore Transaction
 */

import { doc, runTransaction, collection, Timestamp, DocumentReference } from "firebase/firestore";
import { db } from "@/shared/lib/firebase";
import type { ICartItem } from "@/features/cart/domain/cartTypes";

import type { IOrderDocument } from "@/features/orders/domain/orderTypes";

/**
 * Registra una compra en la colección 'compras' y deduce el stock de los productos
 * de forma atómica usando una transacción de Firestore.
 */
export const recordPurchaseAndUpdateStock = async (
  userId: string,
  email: string,
  cart: ICartItem[],
  total: number,
  paymentMethod: string
): Promise<string> => {
  const orderId = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  await runTransaction(db, async (transaction) => {
    // 1. Validar y descontar stock para cada producto en el carrito (Lectura paralela en transacción)
    const productRefs = cart.map((item) => ({
      item,
      docRef: doc(db, "products", String(item.id)),
    }));

    const productSnapshots = await Promise.all(
      productRefs.map((p) => transaction.get(p.docRef))
    );

    const productUpdates: Array<{ docRef: DocumentReference; newStock: number }> = [];

    productSnapshots.forEach((productSnapshot, index) => {
      const { item, docRef } = productRefs[index];

      if (!productSnapshot.exists()) {
        throw new Error(`El producto "${item.title}" no existe en la base de datos.`);
      }

      const currentStock = productSnapshot.data().stock ?? 0;
      if (currentStock < item.quantity) {
        throw new Error(`Stock insuficiente para "${item.title}". Disponible: ${currentStock}, Solicitado: ${item.quantity}`);
      }

      productUpdates.push({
        docRef,
        newStock: currentStock - item.quantity,
      });
    });

    // 2. Aplicar las actualizaciones de stock
    for (const update of productUpdates) {
      transaction.update(update.docRef, { stock: update.newStock });
    }

    // 3. Crear el documento de la compra
    const now = Timestamp.now();
    const purchaseRef = doc(collection(db, "compras"), orderId);
    const purchaseData: IOrderDocument = {
      orderId,
      userId,
      email,
      items: cart.map((item) => ({
        productId: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        thumbnail: item.thumbnail || "",
      })),
      total,
      paymentMethod,
      status: "validando_compra",
      adminNotes: "Pedido recibido. En proceso de verificación de pago.",
      statusHistory: [
        {
          status: "validando_compra",
          timestamp: now,
          note: "Orden creada exitosamente. Esperando validación del comercio.",
          updatedBy: "Sistema / Checkout",
        },
      ],
      createdAt: now,
      updatedAt: now,
    };

    transaction.set(purchaseRef, purchaseData);
  });

  return orderId;
};
