/**
 * @file PaymentStrategyFactory.ts
 * @description Fábrica para la instanciación de estrategias de pago según el método seleccionado (Factory Pattern).
 * @architecture Domain Layer - Payment Strategy Factory (Factory Pattern)
 */

import type { PaymentMethod } from "@/features/checkout/application/types";
import type { IPaymentStrategy } from "@/features/checkout/domain/strategies/IPaymentStrategy";
import { CreditCardPaymentStrategy } from "@/features/checkout/domain/strategies/CreditCardPaymentStrategy";
import { BitcoinPaymentStrategy } from "@/features/checkout/domain/strategies/BitcoinPaymentStrategy";

/**
 * @class PaymentStrategyFactory
 * @description Crea y retorna la estrategia de pago adecuada para 'visa', 'mastercard' o 'bitcoin'.
 */
export class PaymentStrategyFactory {
  private static readonly visaStrategy = new CreditCardPaymentStrategy("visa");
  private static readonly mastercardStrategy = new CreditCardPaymentStrategy("mastercard");
  private static readonly bitcoinStrategy = new BitcoinPaymentStrategy();

  /**
   * Obtiene la instancia de la estrategia de pago asociada al identificador.
   *
   * @param {PaymentMethod} method Identificador del método ('visa' | 'mastercard' | 'bitcoin').
   * @returns {IPaymentStrategy} Instancia de la estrategia concreta.
   */
  public static getStrategy(method: PaymentMethod): IPaymentStrategy {
    switch (method) {
      case "mastercard":
        return this.mastercardStrategy;
      case "bitcoin":
        return this.bitcoinStrategy;
      case "visa":
      default:
        return this.visaStrategy;
    }
  }
}
