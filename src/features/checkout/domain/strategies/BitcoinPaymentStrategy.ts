/**
 * @file BitcoinPaymentStrategy.ts
 * @description Estrategia concreta de pago mediante criptomonedas (Bitcoin / Crypto Gateway).
 * @architecture Domain Layer - Concrete Payment Strategy (Strategy Pattern)
 */

import type { PaymentMethod, ICardInfo, IValidationErrors } from "@/features/checkout/application/types";
import type { IPaymentStrategy, IPaymentResult } from "@/features/checkout/domain/strategies/IPaymentStrategy";

/**
 * @class BitcoinPaymentStrategy
 * @description Estrategia para procesar pagos descentralizados en Bitcoin u otras criptomonedas.
 */
export class BitcoinPaymentStrategy implements IPaymentStrategy {
  public readonly id: PaymentMethod = "bitcoin";
  public readonly name = "Bitcoin / Cripto";
  public readonly requiresCardDetails = false;

  /**
   * Los pagos en Bitcoin no requieren validación de formulario de tarjeta tradicional.
   *
   * @param {ICardInfo} _cardInfo Objeto ignorado.
   * @returns {IValidationErrors} Objeto vacío indicando que no hay errores de tarjeta.
   */
  public validate(_cardInfo: ICardInfo): IValidationErrors {
    return {};
  }

  /**
   * Simula la creación y confirmación de la transacción en la red blockchain.
   *
   * @param {number} amount Monto equivalente en USD.
   * @returns {Promise<IPaymentResult>} Resultado de la transacción cripto.
   */
  public async processPayment(amount: number): Promise<IPaymentResult> {
    if (amount <= 0) {
      return {
        success: false,
        transactionId: "",
        error: "El monto en criptomoneda debe ser superior a 0.",
      };
    }

    // Simulación de verificación de bloque (250ms)
    await new Promise((resolve) => setTimeout(resolve, 250));

    const transactionId = `BTC-HASH-${Date.now().toString(16).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    return {
      success: true,
      transactionId,
    };
  }
}
