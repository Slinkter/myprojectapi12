/**
 * @file FixedDiscountStrategy.ts
 * @description Estrategia de descuento por monto fijo en USD sobre el subtotal.
 * @architecture Domain Layer - Concrete Discount Strategy (Strategy Pattern)
 */

import type { IDiscountStrategy } from "@/features/checkout/domain/strategies/IDiscountStrategy";

/**
 * @class FixedDiscountStrategy
 * @description Aplica una deducción fija en dólares (ej: $5, $15) sin exceder el subtotal.
 */
export class FixedDiscountStrategy implements IDiscountStrategy {
  public readonly code: string;
  public readonly fixedAmount: number;

  /**
   * @param {string} code Código de cupón (ej: 'SAVE5').
   * @param {number} fixedAmount Monto en USD a descontar.
   */
  constructor(code: string, fixedAmount: number) {
    this.code = code;
    this.fixedAmount = Math.max(0, fixedAmount);
  }

  /**
   * Calcula el descuento fijo asegurando que no supere el total del pedido.
   *
   * @param {number} subtotal Importe base.
   * @returns {number} Monto descontado.
   */
  public calculateDiscount(subtotal: number): number {
    if (subtotal <= 0) return 0;
    return Math.min(this.fixedAmount, subtotal);
  }

  /**
   * Descripción del beneficio.
   */
  public getDescription(): string {
    return `$${this.fixedAmount.toFixed(2)} USD de descuento directo`;
  }
}
