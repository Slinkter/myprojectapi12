/**
 * @file types.ts
 * @description Definiciones de tipos para la capa de aplicación de Checkout.
 * Re-exporta los tipos de dominio y define interfaces de estado de React.
 * @architecture Application Layer - Checkout Types
 */

import { ChangeEvent } from "react";
import type {
  PaymentMethod,
  ICardInfo,
  IValidationErrors,
  IDiscountCode,
  ICartItem,
} from "@/features/checkout/domain/types";

import type { IOrderFinancials } from "@/features/checkout/domain/financials";

export type { PaymentMethod, ICardInfo, IValidationErrors, IDiscountCode, ICartItem, IOrderFinancials };

/**
 * Estado completo del flujo de checkout en reducer.
 */
export interface ICheckoutState {
  /** Método de pago seleccionado actualmente */
  paymentMethod: PaymentMethod;
  /** Información del formulario de tarjeta */
  cardInfo: ICardInfo;
  /** Errores de validación actuales */
  errors: IValidationErrors;
  /** Tipo de tarjeta detectado (visa/mastercard) */
  cardType: string;
}

/**
 * Acciones disponibles para el reducer de checkout.
 */
export type CheckoutAction =
  | {
      type: "SET_FIELD_VALUE";
      payload: { name: keyof ICardInfo; value: string };
    }
  | { type: "SET_PAYMENT_METHOD"; payload: PaymentMethod }
  | { type: "SET_ERRORS"; payload: IValidationErrors }
  | { type: "SET_CARD_TYPE"; payload: string };

/**
 * Retorno del hook useCheckout.
 */
export interface IUseCheckoutReturn {
  paymentMethod: PaymentMethod;
  cardInfo: ICardInfo;
  errors: IValidationErrors;
  cardType: string;
  handlePayment: () => void | Promise<void>;
  handlePaymentFieldChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  selectPaymentMethod: (method: PaymentMethod) => void;
  isPaymentDisabled: boolean;
  financials?: IOrderFinancials;
}
