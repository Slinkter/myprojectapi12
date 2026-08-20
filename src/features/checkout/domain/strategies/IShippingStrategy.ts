/**
 * @file IShippingStrategy.ts
 * @description Interfaz de estrategia para el cálculo de costos de envío y umbrales de gratuidad (Strategy Pattern).
 * @architecture Domain Layer - Shipping Strategy Interface (Strategy Pattern)
 */

/**
 * Contrato para el cálculo dinámico de tarifas logísticas de envío.
 */
export interface IShippingStrategy {
  /**
   * Calcula el costo de envío correspondiente según el subtotal y la cantidad de artículos.
   *
   * @param {number} subtotal Importe total de los artículos antes de envío.
   * @param {number} totalItems Cantidad física de productos en el pedido.
   * @returns {number} Costo final de envío en USD (0 si es gratis o el carrito está vacío).
   */
  calculateShipping(subtotal: number, totalItems: number): number;

  /**
   * Obtiene el monto mínimo de compra requerido para envío gratuito.
   *
   * @returns {number} Umbral en USD.
   */
  getFreeShippingThreshold(): number;
}
