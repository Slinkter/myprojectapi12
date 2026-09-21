/**
 * @file financials.ts
 * @description Funciones y tipos para el cálculo financiero determinista del pedido (subtotal, descuentos, envío y total general).
 * Fuente única de verdad matemática para la presentación y la infraestructura de pagos.
 * @architecture Domain Layer - Checkout Financials
 */

import type { ICartItem } from "@/features/cart/domain/cartTypes";
import type { IDiscountCode } from "@/features/checkout/domain/types";
import { SHIPPING_CONFIG } from "@/features/checkout/domain/shipping";

/**
 * @interface IOrderFinancials
 * @description Desglose financiero completo y determinista de una orden de compra.
 */
export interface IOrderFinancials {
  /** Monto acumulado bruto de los artículos antes de descuentos y envío */
  subtotal: number;
  /** Cantidad física total de artículos en la orden */
  totalItems: number;
  /** Monto total deducido por aplicación de cupón o promoción */
  discountAmount: number;
  /** Subtotal una vez aplicado el descuento promocional */
  discountedSubtotal: number;
  /** Costo final de envío aplicable según umbrales de compra */
  shippingCost: number;
  /** Monto neto final a cobrar por la pasarela de pagos */
  finalTotal: number;
  /** Indica si la orden califica para envío gratuito */
  isFreeShipping: boolean;
  /** Porcentaje de progreso (0-100) hacia el umbral de envío gratuito */
  progressToFreeShipping: number;
}

/**
 * Calcula el monto exacto de descuento aplicable según el tipo de cupón.
 *
 * @param {IDiscountCode | null | undefined} appliedDiscount - Cupón promocional validado.
 * @param {number} subtotal - Monto bruto base sobre el que calcular el beneficio.
 * @returns {number} Monto a descontar, redondeado a dos decimales y sin superar el subtotal.
 */
export function calculateDiscountAmount(
  appliedDiscount: IDiscountCode | null | undefined,
  subtotal: number
): number {
  if (!appliedDiscount || subtotal <= 0) {
    return 0;
  }

  if (appliedDiscount.type === "percentage") {
    const rawDiscount = (subtotal * appliedDiscount.discount) / 100;
    return Math.round(rawDiscount * 100) / 100;
  }

  // Descuento de monto fijo
  return Math.min(appliedDiscount.discount, subtotal);
}

/**
 * @function calculateOrderFinancials
 * @description Módulo de cálculo financiero puro que procesa un carrito y calcula
 * subtotales, descuentos, tarifas de transporte y el total definitivo garantizando
 * consistencia matemática entre la vista de resumen y la pasarela de pagos.
 *
 * @param {ICartItem[]} cart - Lista de artículos presentes en el carrito.
 * @param {IDiscountCode | null | undefined} [appliedDiscount] - Código de descuento activo opcional.
 * @returns {IOrderFinancials} Objeto inmutable con todos los totales calculados.
 */
export function calculateOrderFinancials(
  cart: ICartItem[],
  appliedDiscount?: IDiscountCode | null
): IOrderFinancials {
  let rawSubtotal = 0;
  let totalItems = 0;

  for (let i = 0; i < cart.length; i++) {
    const item = cart[i];
    rawSubtotal += item.price * item.quantity;
    totalItems += item.quantity;
  }

  const subtotal = Math.round(rawSubtotal * 100) / 100;
  const hasItems = totalItems > 0;

  const discountAmount = calculateDiscountAmount(appliedDiscount, subtotal);
  const discountedSubtotal = Math.max(0, Math.round((subtotal - discountAmount) * 100) / 100);

  const isFreeShipping = hasItems && subtotal >= SHIPPING_CONFIG.FREE_SHIPPING_THRESHOLD;
  const shippingCost = !hasItems || isFreeShipping ? 0 : SHIPPING_CONFIG.STANDARD_FEE;

  const finalTotal = Math.round((discountedSubtotal + shippingCost) * 100) / 100;

  const progressToFreeShipping = Math.min(
    100,
    Math.round((subtotal / SHIPPING_CONFIG.FREE_SHIPPING_THRESHOLD) * 100)
  );

  return {
    subtotal,
    totalItems,
    discountAmount,
    discountedSubtotal,
    shippingCost,
    finalTotal,
    isFreeShipping,
    progressToFreeShipping,
  };
}
