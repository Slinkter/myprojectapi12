/**
 * @file checkoutReducer.ts
 * @description Reducer para manejar el estado complejo del formulario de checkout.
 * Implementa una máquina de estados simple para la gestión de campos y errores.
 * @architecture Application Layer - Checkout State
 */
import { CheckoutState, CheckoutAction } from "./types";

/**
 * Estado inicial del formulario de checkout.
 */
export const initialState: CheckoutState = {
    paymentMethod: "visa",
    cardInfo: { number: "", name: "", expiry: "", cvc: "" },
    errors: {},
    cardType: "",
};

/**
 * Reducer puro para gestionar transiciones de estado del checkout.
 * 
 * @param {CheckoutState} state - Estado actual.
 * @param {CheckoutAction} action - Acción despachada.
 * @returns {CheckoutState} Nuevo estado.
 */
export function checkoutReducer(
    state: CheckoutState,
    action: CheckoutAction,
): CheckoutState {
    switch (action.type) {
        case "SET_FIELD_VALUE":
            return {
                ...state,
                cardInfo: {
                    ...state.cardInfo,
                    [action.payload.name]: action.payload.value,
                },
            };
        case "SET_PAYMENT_METHOD":
            return {
                ...state,
                paymentMethod: action.payload,
            };
        case "SET_ERRORS":
            return {
                ...state,
                errors: action.payload,
            };
        case "SET_CARD_TYPE":
            return {
                ...state,
                cardType: action.payload,
            };
        default:
            return state;
    }
}
