/**
 * @file useCheckoutValidation.ts
 * @description Hook de validacion del formulario de checkout.
 * Ejecuta la validacion de la estrategia de pago seleccionada, detecta el tipo de
 * tarjeta y deriva los errores visibles y el estado del boton de pago.
 * @architecture Capa de Aplicacion - Checkout Validation Hook
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Dispatch } from "react";
import type { FocusEvent } from "react";
import type {
    ICheckoutState,
    CheckoutAction,
    IValidationErrors,
} from "@/features/checkout/application/types";
import { PaymentStrategyFactory } from "@/features/checkout/domain/factories/PaymentStrategyFactory";
import { getCardType } from "@/features/checkout/domain/formatters";

/**
 * Resultado del hook useCheckoutValidation.
 */
export interface ICheckoutValidationResult {
    /** Campos cuya validacion ya fue revisada por el usuario. */
    touched: Record<string, boolean>;
    /** Setter para marcar campos como revisados. */
    setTouched: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
    /** Indica si el formulario fue enviado al menos una vez. */
    isSubmitted: boolean;
    /** Setter para marcar el formulario como enviado. */
    setIsSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
    /** Handler para marcar un campo como revisado al salir de el (blur). */
    handleBlur: (e: FocusEvent<HTMLInputElement>) => void;
    /** True si existe al menos un error de validacion. */
    hasErrors: boolean;
    /** Errores filtrados: se muestran solo en campos revisados o tras el envio. */
    visibleErrors: IValidationErrors;
    /** True si el boton de pago debe estar deshabilitado. */
    isPaymentDisabled: boolean;
}

/**
 * @hook useCheckoutValidation
 * @description Orquesta la validacion dinamica del checkout:
 * 1. Usa la estrategia de pago seleccionada para validar los datos de la tarjeta.
 * 2. Detecta el tipo de tarjeta (visa/mastercard) y lo persiste en el reducer.
 * 3. Deriva los errores visibles y si el pago esta habilitado.
 *
 * @param {ICheckoutState} state - Estado actual del reducer de checkout.
 * @param {Dispatch<CheckoutAction>} dispatch - Función para despachar acciones.
 * @returns {ICheckoutValidationResult} Errores visibles, estado de envio y handlers.
 *
 * @example
 * const { visibleErrors, isPaymentDisabled, setTouched, setIsSubmitted } =
 *     useCheckoutValidation(state, dispatch);
 */
export function useCheckoutValidation(
    state: ICheckoutState,
    dispatch: Dispatch<CheckoutAction>,
): ICheckoutValidationResult {
    const { paymentMethod, cardInfo, cardType } = state;
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        const strategy = PaymentStrategyFactory.getStrategy(paymentMethod);

        dispatch({
            type: "SET_ERRORS",
            payload: strategy.requiresCardDetails
                ? strategy.validate(cardInfo)
                : {},
        });

        const newCardType = getCardType(cardInfo.number);
        if (newCardType !== cardType) {
            dispatch({ type: "SET_CARD_TYPE", payload: newCardType });
        }
    }, [paymentMethod, cardInfo, cardType, dispatch]);

    const handleBlur = useCallback((e: FocusEvent<HTMLInputElement>) => {
        const { name } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
    }, []);

    const hasErrors = useMemo(
        () => Object.values(state.errors).some(Boolean),
        [state.errors],
    );

    const isPaymentDisabled = useMemo(() => {
        const strategy = PaymentStrategyFactory.getStrategy(paymentMethod);
        if (!strategy.requiresCardDetails) return false;

        const hasEmptyFields =
            !cardInfo.number ||
            !cardInfo.name ||
            !cardInfo.expiry ||
            !cardInfo.cvc;

        return hasErrors || hasEmptyFields;
    }, [paymentMethod, cardInfo, hasErrors]);

    const visibleErrors = useMemo(() => {
        const result: IValidationErrors = {};
        (Object.keys(state.errors) as Array<keyof IValidationErrors>).forEach(
            (key) => {
                if (isSubmitted || touched[key]) {
                    result[key] = state.errors[key];
                }
            },
        );
        return result;
    }, [state.errors, touched, isSubmitted]);

    return {
        touched,
        setTouched,
        isSubmitted,
        setIsSubmitted,
        handleBlur,
        hasErrors,
        visibleErrors,
        isPaymentDisabled,
    };
}