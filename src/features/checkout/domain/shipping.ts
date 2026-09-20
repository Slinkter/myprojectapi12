/**
 * @file shipping.ts
 * @description Configuración centralizada y reglas de negocio para tarifas de envío.
 * @architecture Domain Layer - Shipping Configuration
 */

export const SHIPPING_CONFIG = {
  /** Umbral en USD a partir del cual el envío es gratuito */
  FREE_SHIPPING_THRESHOLD: 50,
  /** Tarifa estándar de envío en USD para pedidos inferiores al umbral */
  STANDARD_FEE: 9.99,
} as const;
