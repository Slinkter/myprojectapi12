/**
 * @file checkoutReducer.ts
 * @description Reducer y hook para manejar el estado del formulario de checkout.
 * Implementa una máquina de estados pura para la gestión de campos y errores.
 * @architecture Application Layer - Checkout State & Reducer Hook
 */

import { useReducer, type Dispatch } from "react";
import type {
  ICheckoutState,
  CheckoutAction,
} from "@/features/checkout/application/types";

/**
 * Estado inicial del formulario de checkout.
 */
export const initialState: ICheckoutState = {
  paymentMethod: "visa",
  cardInfo: { number: "", name: "", expiry: "", cvc: "" },
  errors: {},
  cardType: "",
};

/**
 * Reducer puro para gestionar transiciones de estado del checkout.
 *
 * @param {ICheckoutState} state - Estado actual.
 * @param {CheckoutAction} action - Acción despachada.
 * @returns {ICheckoutState} Nuevo estado.
 */
export function checkoutReducer(
  state: ICheckoutState,
  action: CheckoutAction,
): ICheckoutState {
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

/**
 * Resultado del hook useCheckoutReducer.
 */
export interface ICheckoutReducerResult {
  /** Estado actual del formulario de checkout. */
  state: ICheckoutState;
  /** Función para despachar acciones al reducer. */
  dispatch: Dispatch<CheckoutAction>;
}

/**
 * Hook que encapsula useReducer con checkoutReducer e initialState.
 *
 * @returns {ICheckoutReducerResult} Objeto con state y dispatch.
 */
export function useCheckoutReducer(): ICheckoutReducerResult {
  const [state, dispatch] = useReducer(checkoutReducer, initialState);
  return { state, dispatch };
}
