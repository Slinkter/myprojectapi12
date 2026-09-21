/**
 * @file types.ts
 * @description Definiciones de tipos puros del dominio de Checkout.
 * @architecture Domain Layer - Checkout Domain Types
 */

import type { ICartItem } from "@/features/cart/domain/cartTypes";

export type { ICartItem };

/**
 * Métodos de pago soportados por el dominio.
 */
export type PaymentMethod = "visa" | "mastercard" | "bitcoin";

/**
 * Información de tarjeta de crédito/débito para procesamiento de pago.
 */
export interface ICardInfo {
  /** Número de la tarjeta (sin espacios) */
  number: string;
  /** Nombre del titular como aparece en la tarjeta */
  name: string;
  /** Fecha de expiración en formato MM/YY */
  expiry: string;
  /** Código de seguridad (CVC/CVV) */
  cvc: string;
}

/**
 * Mapeo de errores de validación de los campos de tarjeta.
 */
export interface IValidationErrors {
  number?: string;
  name?: string;
  expiry?: string;
  cvc?: string;
}

/**
 * Representa un código de descuento válido con su tipo y valor.
 */
export interface IDiscountCode {
  code: string;
  discount: number;
  type: "percentage" | "fixed";
}
