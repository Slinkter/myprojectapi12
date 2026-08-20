/**
 * @file DiscountStrategyFactory.ts
 * @description Fábrica para la instanciación de estrategias de cálculo de descuentos comerciales (Factory Pattern).
 * @architecture Domain Layer - Discount Strategy Factory (Factory Pattern)
 */

import type { IDiscountCode } from "@/features/checkout/application/useDiscountValidation";
import type { IDiscountStrategy } from "@/features/checkout/domain/strategies/IDiscountStrategy";
import { PercentageDiscountStrategy } from "@/features/checkout/domain/strategies/PercentageDiscountStrategy";
import { FixedDiscountStrategy } from "@/features/checkout/domain/strategies/FixedDiscountStrategy";

/**
 * @class DiscountStrategyFactory
 * @description Construye la estrategia de descuento correcta a partir del tipo de cupón.
 */
export class DiscountStrategyFactory {
  /**
   * Crea una instancia de estrategia de descuento basada en el cupón validado.
   *
   * @param {IDiscountCode} discount Objeto de cupón validado con tipo y valor.
   * @returns {IDiscountStrategy} Estrategia concreta de descuento.
   */
  public static createFromDiscount(discount: IDiscountCode): IDiscountStrategy {
    if (discount.type === "percentage") {
      return new PercentageDiscountStrategy(discount.code, discount.discount);
    }
    return new FixedDiscountStrategy(discount.code, discount.discount);
  }
}
