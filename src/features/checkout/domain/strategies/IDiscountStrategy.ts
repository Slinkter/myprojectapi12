/**
 * @file IDiscountStrategy.ts
 * @description Interfaz de estrategia para el cálculo dinámico de descuentos comerciales (Strategy Pattern).
 * @architecture Domain Layer - Discount Strategy Interface (Strategy Pattern)
 */

/**
 * Contrato que toda estrategia de descuento debe cumplir para computar reducciones de precio.
 */
export interface IDiscountStrategy {
  /** Código del cupón o identificador de la promoción */
  readonly code: string;

  /**
   * Calcula el importe exacto a descontar a partir del subtotal.
   *
   * @param {number} subtotal Importe base antes de descuentos.
   * @returns {number} Monto en USD a descontar (siempre <= subtotal y >= 0).
   */
  calculateDiscount(subtotal: number): number;

  /**
   * Devuelve una descripción legible de la promoción aplicada.
   *
   * @returns {string} Texto descriptivo (ej: "10% de descuento").
   */
  getDescription(): string;
}
