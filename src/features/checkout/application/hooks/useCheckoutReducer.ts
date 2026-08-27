/**
 * @file useCheckoutReducer.ts
 * @description Hook que encapsula el uso del reducer puro de checkout junto con su estado inicial.
 * Centraliza la maquina de estados del formulario para reducir la verbosidad del orquestador.
 * @architecture Capa de Aplicacion - Checkout State Hook
 */

import { useReducer, type Dispatch } from "react";
import {
    checkoutReducer,
    initialState,
} from "@/features/checkout/application/checkoutReducer";
import type {
    ICheckoutState,
    CheckoutAction,
} from "@/features/checkout/application/types";

export { checkoutReducer, initialState };

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
 * @hook useCheckoutReducer
 * @description Instancia el `useReducer` de checkout. Expone el estado y el `dispatch`
 * a los hooks de validacion y envio para que el orquestador principal quede limpio.
 *
 * @returns {ICheckoutReducerResult} Objeto con `state` y `dispatch`.
 *
 * @example
 * const { state, dispatch } = useCheckoutReducer();
 */
export function useCheckoutReducer(): ICheckoutReducerResult {
    const [state, dispatch] = useReducer(checkoutReducer, initialState);

    return { state, dispatch };
}