/**
 * @file StandardShippingStrategy.ts
 * @description Estrategia de envío estándar con umbral de envío gratuito a partir de $50 USD.
 * @architecture Domain Layer - Concrete Shipping Strategy (Strategy Pattern)
 */

import type { IShippingStrategy } from "@/features/checkout/domain/strategies/IShippingStrategy";

/**
 * @class StandardShippingStrategy
 * @description Aplica tarifa plana de $9.99 USD para pedidos menores a $50 USD, y $0 para pedidos superiores o carritos vacíos.
 */
export class StandardShippingStrategy implements IShippingStrategy {
  private readonly FREE_SHIPPING_THRESHOLD = 50;
  private readonly STANDARD_FEE = 9.99;

  /**
   * Calcula la tarifa de envío estándar.
   *
   * @param {number} subtotal Importe base de los productos.
   * @param {number} totalItems Total de items en el carrito.
   * @returns {number} Costo de envío en USD.
   */
  public calculateShipping(subtotal: number, totalItems: number): number {
    if (totalItems <= 0 || subtotal <= 0) {
      return 0;
    }
    return subtotal >= this.FREE_SHIPPING_THRESHOLD ? 0 : this.STANDARD_FEE;
  }

  /**
   * Umbral para envío gratis ($50 USD).
   */
  public getFreeShippingThreshold(): number {
    return this.FREE_SHIPPING_THRESHOLD;
  }
}
