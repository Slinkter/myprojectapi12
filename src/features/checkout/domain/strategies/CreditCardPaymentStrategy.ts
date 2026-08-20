/**
 * @file CreditCardPaymentStrategy.ts
 * @description Estrategia concreta de pago con tarjetas de crédito / débito (Visa / Mastercard) con validación de Luhn.
 * @architecture Domain Layer - Concrete Payment Strategy (Strategy Pattern)
 */

import type { PaymentMethod, ICardInfo, IValidationErrors } from "@/features/checkout/application/types";
import { validateCardInfo } from "@/features/checkout/application/validation";
import type { IPaymentStrategy, IPaymentResult } from "@/features/checkout/domain/strategies/IPaymentStrategy";

/**
 * @class CreditCardPaymentStrategy
 * @description Estrategia para procesar pagos con tarjeta aplicando validación Luhn y simulación de pasarela bancaria.
 */
export class CreditCardPaymentStrategy implements IPaymentStrategy {
  public readonly id: PaymentMethod;
  public readonly name: string;
  public readonly requiresCardDetails = true;

  /**
   * @param {PaymentMethod} method Tipo de tarjeta admitido ('visa' | 'mastercard').
   */
  constructor(method: "visa" | "mastercard" = "visa") {
    this.id = method;
    this.name = method === "visa" ? "Tarjeta Visa" : "Tarjeta Mastercard";
  }

  /**
   * Valida los datos de la tarjeta bancaria utilizando algoritmo de Luhn y reglas de expiración.
   *
   * @param {ICardInfo} cardInfo Datos del formulario de tarjeta.
   * @returns {IValidationErrors} Errores de validación si existen.
   */
  public validate(cardInfo: ICardInfo): IValidationErrors {
    return validateCardInfo(cardInfo);
  }

  /**
   * Simula el procesamiento seguro del cobro con la red de adquirencia bancaria.
   *
   * @param {number} amount Monto a debitar en USD.
   * @param {ICardInfo} [cardInfo] Información de la tarjeta.
   * @returns {Promise<IPaymentResult>} Resultado de la transacción bancaria.
   */
  public async processPayment(amount: number, cardInfo?: ICardInfo): Promise<IPaymentResult> {
    if (cardInfo) {
      const errors = this.validate(cardInfo);
      if (Object.values(errors).some(Boolean)) {
        return {
          success: false,
          transactionId: "",
          error: "Los datos de la tarjeta ingresada no son válidos.",
        };
      }
    }

    if (amount <= 0) {
      return {
        success: false,
        transactionId: "",
        error: "El importe de la transacción debe ser mayor a 0.",
      };
    }

    // Simulación de latencia de red bancaria (300ms)
    await new Promise((resolve) => setTimeout(resolve, 300));

    const transactionId = `CC-TX-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    return {
      success: true,
      transactionId,
    };
  }
}
