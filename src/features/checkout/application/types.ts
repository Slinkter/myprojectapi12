/**
 * @file types.ts
 * @description Definiciones de tipos para el dominio de Checkout.
 * @architecture Application Layer - Checkout Types
 */

/**
 * @interface CartItem
 * @description Estructura de un item en el contexto del checkout.
 * Mapea la información necesaria del producto y cantidad.
 */
export interface CartItem {
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
export interface CardInfo {
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
export interface ValidationErrors {
    number?: string;
    name?: string;
    expiry?: string;
    cvc?: string;
}

/**
 * @interface CheckoutState
 * @description Estado completo del flujo de checkout.
 */
export interface CheckoutState {
    /** Método de pago seleccionado actualmente */
    paymentMethod: PaymentMethod;
    /** Información del formulario de tarjeta */
    cardInfo: CardInfo;
    /** Errores de validación actuales */
    errors: ValidationErrors;
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
          payload: { name: keyof CardInfo; value: string };
      }
    | { type: "SET_PAYMENT_METHOD"; payload: PaymentMethod }
    | { type: "SET_ERRORS"; payload: ValidationErrors }
    | { type: "SET_CARD_TYPE"; payload: string };
