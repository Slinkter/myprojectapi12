/**
 * @file types.ts
 * @description Definiciones de tipos para el dominio de Checkout.
 * @architecture Application Layer - Checkout Types
 */

import { ChangeEvent } from "react";

/**
 * @interface CartItem
 * @description Estructura de un item en el contexto del checkout.
 * Mapea la información necesaria del producto y cantidad.
 */
export interface ICartItem {
    id: number;
    title: string;
    price: number;
    quantity: number;
}

/**
 * @type PaymentMethod
 * @description Métodos de pago soportados por la aplicación.
 */
export type PaymentMethod = "visa" | "mastercard" | "bitcoin";

/**
 * @interface CardInfo
 * @description Información de tarjeta de crédito/débito ingresada por el usuario.
 */
export interface ICardInfo {
    /** Número de la tarjeta (sin espacios) */
    number: string;
    /** Nombre del titular como aparece en la tarjeta */
    name: string;
    /** Fecha de expiración en formato MM/YY */
    expiry: string;
    /** Código de seguridad (CVC/CVV) */
    cvc: string;
}

/**
 * @interface ValidationErrors
 * @description Objeto que mapea campos de CardInfo a mensajes de error.
 * Si una propiedad no existe, el campo es válido.
 */
export interface IValidationErrors {
    number?: string;
    name?: string;
    expiry?: string;
    cvc?: string;
}

/**
 * @interface CheckoutState
 * @description Estado completo del flujo de checkout.
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
 * @type CheckoutAction
 * @description Acciones disponibles para el reducer de checkout.
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
 * @interface UseCheckoutReturn
 * @description Retorno del hook useCheckout.
 */
export interface IUseCheckoutReturn {
    paymentMethod: PaymentMethod;
    cardInfo: ICardInfo;
    errors: IValidationErrors;
    cardType: string;
    handlePayment: () => void;
    handleCardInfoChange: (e: ChangeEvent<HTMLInputElement>) => void;
    setPaymentMethod: (method: PaymentMethod) => void;
    isPaymentDisabled: boolean;
}
