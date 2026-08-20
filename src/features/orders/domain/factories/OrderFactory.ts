/**
 * @file OrderFactory.ts
 * @description Fábrica para la creación y estandarización de documentos de pedidos (Order Factory Pattern).
 * Encapsula la generación de IDs, formateo de items, cálculo de estados iniciales y auditoría.
 * @architecture Domain Layer - Order Factory (Factory Pattern)
 */

import { Timestamp } from "firebase/firestore";
import type { ICartItem } from "@/features/cart/domain/cartTypes";
import type { IOrderDocument, IOrderItem } from "@/features/orders/domain/orderTypes";

/**
 * Parámetros para la creación de una nueva orden a través de OrderFactory.
 */
export interface ICreateOrderParams {
  userId: string;
  email: string;
  cart: ICartItem[];
  subtotal: number;
  discountAmount?: number;
  appliedDiscountCode?: string;
  shippingCost?: number;
  total: number;
  paymentMethod: string;
  adminNotes?: string;
}

/**
 * @class OrderFactory
 * @description Fábrica dominial que centraliza la instanciación de entidades de pedido con validación de integridad.
 */
export class OrderFactory {
  /**
   * Genera un identificador único y legible para la orden con formato `ORD-TIMESTAMP-HASH`.
   *
   * @returns {string} Identificador único de orden.
   */
  public static generateOrderId(): string {
    const timestampPart = Date.now().toString(36).toUpperCase();
    const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `ORD-${timestampPart}-${randomPart}`;
  }

  /**
   * Mapea y sanitiza los items del carrito a la estructura formal de items de orden.
   *
   * @param {ICartItem[]} cart Lista de items provenientes del carrito.
   * @returns {IOrderItem[]} Lista de items formateados para persistencia.
   */
  public static mapCartItems(cart: ICartItem[]): IOrderItem[] {
    return cart.map((item) => ({
      productId: item.id,
      title: item.title,
      price: item.price,
      quantity: item.quantity,
      thumbnail: item.thumbnail || "",
    }));
  }

  /**
   * Crea una nueva instancia de `IOrderDocument` lista para persistencia en Firestore.
   *
   * @param {ICreateOrderParams} params Datos necesarios para la creación del pedido.
   * @returns {IOrderDocument} Objeto de orden estandarizado e inmutable.
   */
  public static createNewOrder(params: ICreateOrderParams): IOrderDocument {
    const orderId = this.generateOrderId();
    const now = Timestamp.now();
    const mappedItems = this.mapCartItems(params.cart);

    return {
      orderId,
      userId: params.userId,
      email: params.email,
      items: mappedItems,
      subtotal: params.subtotal,
      discountAmount: params.discountAmount || 0,
      appliedDiscountCode: params.appliedDiscountCode || undefined,
      shippingCost: params.shippingCost || 0,
      total: params.total,
      paymentMethod: params.paymentMethod,
      status: "validando_compra",
      adminNotes: params.adminNotes || "Pedido recibido. En proceso de verificación de pago.",
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
  }
}
