/**
 * @file ordersFirestore.ts
 * @description Servicio de infraestructura para gestionar pedidos en Firestore en tiempo real,
 * auditoría de cambios de estado, notas del administrador y anulación con devolución de stock.
 * @architecture Infrastructure Layer - Orders Firestore Integration
 */

import { 
  collection, 
  getDocs, 
  doc, 
  runTransaction,
  query, 
  where, 
  orderBy, 
  onSnapshot,
  Timestamp,
  Unsubscribe 
} from "firebase/firestore";
import { db } from "@/shared/lib/firebase";
import type { IOrderDocument, OrderStatus, IOrderStatusHistoryItem } from "@features/orders/domain/orderTypes";

export type { IOrderDocument, OrderStatus, IOrderStatusHistoryItem };

const COMPRAS_COLLECTION = "compras";

/**
 * Suscripción en tiempo real a todos los pedidos registrados (para administradores).
 */
export const subscribeToAllOrders = (
  onUpdate: (orders: IOrderDocument[]) => void,
  onError?: (err: Error) => void
): Unsubscribe => {
  const comprasRef = collection(db, COMPRAS_COLLECTION);
  const q = query(comprasRef, orderBy("createdAt", "desc"));
  
  return onSnapshot(
    q,
    (snapshot) => {
      const orders: IOrderDocument[] = [];
      snapshot.forEach((docSnap) => {
        orders.push(docSnap.data() as IOrderDocument);
      });
      onUpdate(orders);
    },
    (error) => {
      console.error("Error en tiempo real de todos los pedidos:", error);
      if (onError) onError(error);
    }
  );
};

/**
 * Suscripción en tiempo real a los pedidos de un cliente específico.
 */
export const subscribeToUserOrders = (
  userId: string,
  onUpdate: (orders: IOrderDocument[]) => void,
  onError?: (err: Error) => void
): Unsubscribe => {
  const comprasRef = collection(db, COMPRAS_COLLECTION);
  // Usamos únicamente where sin orderBy para evitar requerir índices compuestos en Firestore
  const q = query(
    comprasRef, 
    where("userId", "==", userId)
  );
  
  return onSnapshot(
    q,
    (snapshot) => {
      const orders: IOrderDocument[] = [];
      snapshot.forEach((docSnap) => {
        orders.push(docSnap.data() as IOrderDocument);
      });
      // Ordenamos en memoria descendentemente por fecha
      orders.sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return timeB - timeA;
      });
      onUpdate(orders);
    },
    (error) => {
      console.error(`Error en tiempo real para pedidos del usuario ${userId}:`, error);
      if (onError) onError(error);
    }
  );
};

/**
 * Obtiene todos los pedidos de forma puntual (One-shot).
 */
export const getAllOrders = async (): Promise<IOrderDocument[]> => {
  const comprasRef = collection(db, COMPRAS_COLLECTION);
  const q = query(comprasRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  
  const orders: IOrderDocument[] = [];
  snapshot.forEach((docSnap) => {
    orders.push(docSnap.data() as IOrderDocument);
  });
  return orders;
};

/**
 * Obtiene los pedidos de un cliente específico de forma puntual (One-shot).
 */
export const getOrdersForUser = async (userId: string): Promise<IOrderDocument[]> => {
  const comprasRef = collection(db, COMPRAS_COLLECTION);
  const q = query(
    comprasRef, 
    where("userId", "==", userId)
  );
  const snapshot = await getDocs(q);
  
  const orders: IOrderDocument[] = [];
  snapshot.forEach((docSnap) => {
    orders.push(docSnap.data() as IOrderDocument);
  });
  orders.sort((a, b) => {
    const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
    const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
    return timeB - timeA;
  });
  return orders;
};

/**
 * Actualiza el estado de un pedido, agrega notas/observaciones del administrador
 * y registra el cambio en el historial. Si el estado cambia a 'anulado' o 'rechazado',
 * restaura automáticamente el stock de los productos en Firestore mediante una transacción.
 */
export const updateOrderStatusAndNotes = async (
  orderId: string,
  newStatus: OrderStatus,
  note: string = "",
  updatedBy: string = "Admin",
  restoreStock: boolean = true
): Promise<void> => {
  const orderRef = doc(db, COMPRAS_COLLECTION, orderId);

  await runTransaction(db, async (transaction) => {
    const orderSnap = await transaction.get(orderRef);
    if (!orderSnap.exists()) {
      throw new Error(`El pedido ${orderId} no existe.`);
    }

    const orderData = orderSnap.data() as IOrderDocument;
    const oldStatus = orderData.status;
    const now = Timestamp.now();

    // 1. Si el pedido se anula o rechaza por primera vez y se solicita restaurar stock
    const isNowCancelled = newStatus === "anulado" || newStatus === "rechazado";
    const wasAlreadyCancelled = oldStatus === "anulado" || oldStatus === "rechazado";

    if (isNowCancelled && !wasAlreadyCancelled && restoreStock && orderData.items) {
      // Optimizamos obteniendo todas las lecturas de los documentos de forma paralela al inicio de la transacción
      const productRefs = orderData.items.map(item => ({
        ref: doc(db, "products", String(item.productId)),
        quantity: item.quantity
      }));

      const productSnaps = await Promise.all(
        productRefs.map(p => transaction.get(p.ref))
      );

      productSnaps.forEach((productSnap, index) => {
        if (productSnap.exists()) {
          const currentStock = productSnap.data().stock ?? 0;
          const target = productRefs[index];
          transaction.update(target.ref, { stock: currentStock + target.quantity });
        }
      });
    }

    // 2. Construir nuevo item de historial
    const historyItem: IOrderStatusHistoryItem = {
      status: newStatus,
      timestamp: now,
      note: note || `Estado actualizado a "${newStatus}"`,
      updatedBy,
    };

    const currentHistory = orderData.statusHistory || [];
    const updatedHistory = [...currentHistory, historyItem];

    // 3. Actualizar la orden
    transaction.update(orderRef, {
      status: newStatus,
      adminNotes: note || orderData.adminNotes || "",
      statusHistory: updatedHistory,
      updatedAt: now,
    });
  });
};
