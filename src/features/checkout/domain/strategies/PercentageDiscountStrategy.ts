/**
 * @file PercentageDiscountStrategy.ts
 * @description Estrategia de descuento porcentual basada en una tasa fija sobre el subtotal.
 * @architecture Domain Layer - Concrete Discount Strategy (Strategy Pattern)
 */

import type { IDiscountStrategy } from "@/features/checkout/domain/strategies/IDiscountStrategy";

/**
 * @class PercentageDiscountStrategy
 * @description Aplica un porcentaje de descuento (ej: 10%, 20%) sobre el subtotal.
 */
export class PercentageDiscountStrategy implements IDiscountStrategy {
  public readonly code: string;
  public readonly percentage: number;

  /**
   * @param {string} code Código de cupón (ej: 'WELCOME10').
   * @param {number} percentage Porcentaje a descontar (ej: 10 para 10%).
   */
  constructor(code: string, percentage: number) {
    this.code = code;
    this.percentage = Math.max(0, Math.min(100, percentage));
  }

  /**
   * Calcula el descuento porcentual en una sola operación aritmética.
   *
   * @param {number} subtotal Importe base.
   * @returns {number} Monto descontado.
   */
  public calculateDiscount(subtotal: number): number {
    if (subtotal <= 0) return 0;
    const discount = (subtotal * this.percentage) / 100;
    return Math.round(discount * 100) / 100;
  }

  /**
   * Descripción del beneficio.
   */
  public getDescription(): string {
    return `${this.percentage}% de descuento`;
  }
}
