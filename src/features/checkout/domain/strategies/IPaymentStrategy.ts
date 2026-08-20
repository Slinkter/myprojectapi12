/**
 * @file IPaymentStrategy.ts
 * @description Interfaz de estrategia para el procesamiento y validación de métodos de pago (Strategy Pattern).
 * @architecture Domain Layer - Payment Strategy Interface (GoF Strategy Pattern)
 */

import type { PaymentMethod, ICardInfo, IValidationErrors } from "@/features/checkout/application/types";

/**
 * Resultado devuelto tras la ejecución de un intento de pago.
 */
export interface IPaymentResult {
  success: boolean;
  transactionId: string;
  error?: string;
}

/**
 * Contrato que toda estrategia concreta de pago debe implementar.
 */
export interface IPaymentStrategy {
  /** Identificador único del método de pago */
  readonly id: PaymentMethod;
  /** Nombre amigable para mostrar en UI */
  readonly name: string;
  /** Indica si esta pasarela exige datos de tarjeta bancaria */
  readonly requiresCardDetails: boolean;

  /**
   * Valida la información provista para el método de pago seleccionado.
   *
   * @param {ICardInfo} cardInfo Información de la tarjeta (si aplica).
   * @returns {IValidationErrors} Mapa de errores encontrados (vacío si todo es válido).
   */
  validate(cardInfo: ICardInfo): IValidationErrors;

  /**
   * Ejecuta el cobro del importe especificado contra la pasarela correspondiente.
   *
   * @param {number} amount Monto total en USD a cobrar.
   * @param {ICardInfo} [cardInfo] Información de pago asociada.
   * @returns {Promise<IPaymentResult>} Resultado del intento de transacción.
   */
  processPayment(amount: number, cardInfo?: ICardInfo): Promise<IPaymentResult>;
}
