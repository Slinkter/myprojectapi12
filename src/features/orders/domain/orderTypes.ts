/**
 * @file orderTypes.ts
 * @description Definición de tipos y estados dominiales para el ciclo de vida de un pedido en el e-commerce.
 * @architecture Domain Layer - Orders
 */

import type { Timestamp } from "firebase/firestore";

/**
 * Estados del ciclo de vida del pedido:
 * - `validando_compra`: El pago está en revisión / validación.
 * - `en_almacen`: Pago aprobado, producto preparándose en almacén.
 * - `en_camino`: Pedido despachado con la empresa de envíos.
 * - `entregado`: El mensajero marcó el paquete como entregado.
 * - `recibido`: El cliente confirmó haber recibido su pedido a satisfacción.
 * - `entrega_fallida`: No se encontró al destinatario o hubo problemas de dirección.
 * - `rechazado`: Pago inválido o rechazado por administración.
 * - `anulado`: Pedido cancelado (con retorno de stock al inventario).
 */
export type OrderStatus =
  | "validando_compra"
  | "en_almacen"
  | "en_camino"
  | "entregado"
  | "recibido"
  | "entrega_fallida"
  | "rechazado"
  | "anulado";

export interface IOrderStatusHistoryItem {
  status: OrderStatus;
  timestamp: Timestamp;
  note?: string;
  updatedBy?: string;
}

export interface IOrderItem {
  productId: number;
  title: string;
  price: number;
  quantity: number;
  thumbnail?: string;
}

export interface IOrderDocument {
  orderId: string;
  userId: string;
  email: string;
  items: IOrderItem[];
  total: number;
  paymentMethod: string;
  status: OrderStatus;
  adminNotes?: string;
  statusHistory?: IOrderStatusHistoryItem[];
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, { label: string; description: string; color: string }> = {
  validando_compra: {
    label: "Validando Compra",
    description: "Estamos revisando los detalles del pago y la transacción.",
    color: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-700",
  },
  en_almacen: {
    label: "En Almacén",
    description: "El pago fue aprobado. Tu paquete se está empaquetando.",
    color: "bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-700",
  },
  en_camino: {
    label: "En Camino",
    description: "El paquete está en ruta hacia tu dirección de entrega.",
    color: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-700",
  },
  entregado: {
    label: "Entregado",
    description: "El transportista ha entregado el paquete en tu destino.",
    color: "bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-700",
  },
  recibido: {
    label: "Recibido por Cliente",
    description: "El cliente confirmó la recepción conforme de su producto.",
    color: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-700",
  },
  entrega_fallida: {
    label: "Entrega Fallida",
    description: "No fue posible realizar la entrega. Se coordinará un nuevo intento.",
    color: "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-700",
  },
  rechazado: {
    label: "Rechazado",
    description: "La transacción fue rechazada. Contacta a soporte.",
    color: "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-700",
  },
  anulado: {
    label: "Anulado",
    description: "Pedido cancelado. El stock fue retornado al inventario.",
    color: "bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
  },
};
