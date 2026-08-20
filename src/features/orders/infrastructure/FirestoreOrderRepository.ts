/**
 * @file FirestoreOrderRepository.ts
 * @description Adaptador de infraestructura que implementa IOrderRepository para la gestión de pedidos en Firestore.
 * @architecture Infrastructure Layer - Orders Repository Adapter (Repository Pattern)
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
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "@/shared/lib/firebase";
import type { IOrderRepository } from "@/features/orders/domain/repositories/IOrderRepository";
import type { IOrderDocument, OrderStatus } from "@/features/orders/domain/orderTypes";

const COMPRAS_COLLECTION = "compras";

/**
 * @class FirestoreOrderRepository
 * @description Repositorio concreto de órdenes con soporte de tiempo real y transacciones atómicas de stock.
 */
export class FirestoreOrderRepository implements IOrderRepository {
  /**
   * Suscripción en tiempo real a todos los pedidos para el panel de administración.
   */
  public subscribeToAllOrders(
    onUpdate: (orders: IOrderDocument[]) => void,
    onError?: (err: Error) => void
  ): Unsubscribe {
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
        console.error("FirestoreOrderRepository: Error en suscripción a todos los pedidos:", error);
        if (onError) onError(error);
      }
    );
  }

  /**
   * Suscripción en tiempo real a los pedidos de un usuario específico.
   */
  public subscribeToUserOrders(
    userId: string,
    onUpdate: (orders: IOrderDocument[]) => void,
    onError?: (err: Error) => void
  ): Unsubscribe {
    const comprasRef = collection(db, COMPRAS_COLLECTION);
    const q = query(comprasRef, where("userId", "==", userId));

    return onSnapshot(
      q,
      (snapshot) => {
        const orders: IOrderDocument[] = [];
        snapshot.forEach((docSnap) => {
          orders.push(docSnap.data() as IOrderDocument);
        });
        orders.sort((a, b) => {
          const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
          const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
          return timeB - timeA;
        });
        onUpdate(orders);
      },
      (error) => {
        console.error(`FirestoreOrderRepository: Error en suscripción para usuario ${userId}:`, error);
        if (onError) onError(error);
      }
    );
  }

  /**
   * Obtiene todos los pedidos de forma puntual (One-shot).
   */
  public async getAllOrders(): Promise<IOrderDocument[]> {
    const comprasRef = collection(db, COMPRAS_COLLECTION);
    const q = query(comprasRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    const orders: IOrderDocument[] = [];
    snapshot.forEach((docSnap) => {
      orders.push(docSnap.data() as IOrderDocument);
    });
    return orders;
  }

  /**
   * Actualiza el estado de un pedido y añade una entrada al historial de auditoría.
   */
  public async updateOrderStatus(
    orderId: string,
    newStatus: OrderStatus,
    note?: string,
    updatedBy: string = "Administrador"
  ): Promise<void> {
    const orderDocRef = doc(db, COMPRAS_COLLECTION, orderId);

    await runTransaction(db, async (transaction) => {
      const orderSnap = await transaction.get(orderDocRef);
      if (!orderSnap.exists()) {
        throw new Error(`El pedido "${orderId}" no existe.`);
      }

      const orderData = orderSnap.data() as IOrderDocument;
      const now = Timestamp.now();
      const currentHistory = orderData.statusHistory || [];

      const newHistoryItem = {
        status: newStatus,
        timestamp: now,
        note: note || `Estado actualizado a ${newStatus}`,
        updatedBy,
      };

      transaction.update(orderDocRef, {
        status: newStatus,
        adminNotes: note ? note : orderData.adminNotes,
        statusHistory: [...currentHistory, newHistoryItem],
        updatedAt: now,
      });
    });
  }

  /**
   * Anula un pedido y devuelve el stock a cada producto en una transacción atómica.
   */
  public async cancelOrderAndRestoreStock(
    orderId: string,
    note: string = "Pedido anulado. Stock devuelto a inventario.",
    updatedBy: string = "Administrador"
  ): Promise<void> {
    const orderDocRef = doc(db, COMPRAS_COLLECTION, orderId);

    await runTransaction(db, async (transaction) => {
      const orderSnap = await transaction.get(orderDocRef);
      if (!orderSnap.exists()) {
        throw new Error(`El pedido "${orderId}" no existe.`);
      }

      const orderData = orderSnap.data() as IOrderDocument;

      if (orderData.status === "anulado") {
        throw new Error("El pedido ya se encuentra anulado.");
      }

      // Restitución atómica de inventario
      for (const item of orderData.items) {
        const productRef = doc(db, "products", String(item.productId));
        const productSnap = await transaction.get(productRef);
        if (productSnap.exists()) {
          const currentStock = productSnap.data().stock ?? 0;
          transaction.update(productRef, { stock: currentStock + item.quantity });
        }
      }

      const now = Timestamp.now();
      const currentHistory = orderData.statusHistory || [];

      transaction.update(orderDocRef, {
        status: "anulado" as OrderStatus,
        adminNotes: note,
        statusHistory: [
          ...currentHistory,
          {
            status: "anulado" as OrderStatus,
            timestamp: now,
            note,
            updatedBy,
          },
        ],
        updatedAt: now,
      });
    });
  }
}

/** Instancia singleton del repositorio de pedidos de Firestore */
export const firestoreOrderRepository = new FirestoreOrderRepository();
