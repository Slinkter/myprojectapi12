/**
 * @file IOrderRepository.ts
 * @description Interfaz de repositorio de dominio para la gestión y suscripción de órdenes de compra.
 * @architecture Domain Layer - Repository Pattern Interface
 */

import type { Unsubscribe } from "firebase/firestore";
import type { IOrderDocument, OrderStatus } from "@/features/orders/domain/orderTypes";

/**
 * Contrato de persistencia y suscripción en tiempo real para el ciclo de vida de órdenes.
 */
export interface IOrderRepository {
  /**
   * Suscripción reactiva en tiempo real a todas las órdenes (vista administrativa).
   */
  subscribeToAllOrders(
    onUpdate: (orders: IOrderDocument[]) => void,
    onError?: (err: Error) => void
  ): Unsubscribe;

  /**
   * Suscripción reactiva en tiempo real a las órdenes de un usuario específico.
   */
  subscribeToUserOrders(
    userId: string,
    onUpdate: (orders: IOrderDocument[]) => void,
    onError?: (err: Error) => void
  ): Unsubscribe;

  /**
   * Obtiene todas las órdenes registradas de forma puntual (One-shot).
   */
  getAllOrders(): Promise<IOrderDocument[]>;

  /**
   * Actualiza el estado de una orden y registra la entrada en su historial de auditoría.
   */
  updateOrderStatus(
    orderId: string,
    newStatus: OrderStatus,
    note?: string,
    updatedBy?: string
  ): Promise<void>;

  /**
   * Anula un pedido y devuelve atómicamente el stock de los productos al inventario.
   */
  cancelOrderAndRestoreStock(
    orderId: string,
    note?: string,
    updatedBy?: string
  ): Promise<void>;
}
