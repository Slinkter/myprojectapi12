/**
 * @file FirestoreCheckoutRepository.ts
 * @description Adaptador de infraestructura para ejecutar la transacción atómica de compra y stock en Firestore.
 * @architecture Infrastructure Layer - Checkout Repository Adapter (Repository Pattern)
 */

import { doc, runTransaction, collection, DocumentReference } from "firebase/firestore";
import { db } from "@/shared/lib/firebase";
import type { ICheckoutRepository, IPurchaseTransactionParams } from "@/features/checkout/domain/repositories/ICheckoutRepository";
import { OrderFactory } from "@/features/orders/domain/factories/OrderFactory";

const COMPRAS_COLLECTION = "compras";
const PRODUCTS_COLLECTION = "products";

/**
 * @class FirestoreCheckoutRepository
 * @description Implementa ICheckoutRepository garantizando atomicidad ACID en la deducción de inventario y registro del pedido.
 */
export class FirestoreCheckoutRepository implements ICheckoutRepository {
  /**
   * Registra una compra en Firestore y actualiza el stock de forma atómica.
   *
   * @param {IPurchaseTransactionParams} params Parámetros completos de la transacción.
   * @returns {Promise<string>} Identificador único de la orden creada.
   */
  public async recordPurchaseAndUpdateStock(params: IPurchaseTransactionParams): Promise<string> {
    const orderDoc = OrderFactory.createNewOrder({
      userId: params.userId,
      email: params.email,
      cart: params.cart,
      subtotal: params.subtotal,
      discountAmount: params.discountAmount,
      appliedDiscountCode: params.appliedDiscount?.code,
      shippingCost: params.shippingCost,
      total: params.total,
      paymentMethod: params.paymentMethod,
    });

    await runTransaction(db, async (transaction) => {
      // 1. Validar y descontar stock para cada producto en el carrito (Lectura paralela en transacción)
      const productRefs = params.cart.map((item) => ({
        item,
        docRef: doc(db, PRODUCTS_COLLECTION, String(item.id)),
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
          throw new Error(
            `Stock insuficiente para "${item.title}". Disponible: ${currentStock}, Solicitado: ${item.quantity}`
          );
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
      const purchaseRef = doc(collection(db, COMPRAS_COLLECTION), orderDoc.orderId);
      transaction.set(purchaseRef, orderDoc);
    });

    return orderDoc.orderId;
  }
}

/** Instancia singleton del repositorio de checkout */
export const firestoreCheckoutRepository = new FirestoreCheckoutRepository();
