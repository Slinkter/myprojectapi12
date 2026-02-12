/**
 * @file useCheckout.ts
 * @description Hook personalizado para manejar la lógica de negocio del proceso de checkout.
 * Orquesta la validación, formateo y navegación.
 * @architecture Application Layer - Checkout Business Logic
 */
import { useReducer, useEffect, ChangeEvent, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { validateCardInfo } from "./validation";
import {
    getCardType,
    formatCardNumber,
    formatExpiryDate,
} from "../domain/formatters";
import { checkoutReducer, initialState } from "./checkoutReducer";
import {
    PaymentMethod,
    CardInfo,
    ValidationErrors,
} from "./types";

/**
 * @interface UseCheckoutReturn
 * @description Retorno del hook useCheckout.
 */
interface UseCheckoutReturn {
    paymentMethod: PaymentMethod;
    cardInfo: CardInfo;
    errors: ValidationErrors;
    cardType: string;
    handlePayment: () => void;
    handleCardInfoChange: (e: ChangeEvent<HTMLInputElement>) => void;
    setPaymentMethod: (method: PaymentMethod) => void;
    isPaymentDisabled: boolean;
}

/**
 * @function useCheckout
 * @description Hook principal para el checkout.
 * Centraliza la lógica de estado, validación y formateo.
 * 
 * @returns {UseCheckoutReturn} Objeto con estado y handlers.
 */
export const useCheckout = (): UseCheckoutReturn => {
    const [state, dispatch] = useReducer(checkoutReducer, initialState);
    const { paymentMethod, cardInfo, errors, cardType } = state;
    const navigate = useNavigate();

    // Efecto para validación en tiempo real (opcional, podría moverse a onBlur para menos ruido)
    useEffect(() => {
        if (paymentMethod === "bitcoin") {
            dispatch({ type: "SET_ERRORS", payload: {} });
        } else {
            const validationErrors: ValidationErrors = validateCardInfo(cardInfo);
            // Solo actualizar si los errores han cambiado para evitar loops infinitos si useEffect fuera dependiente de 'errors'
            // (En este caso dispatch es estable, pero es buena práctica no despachar si no es necesario)
            // Aquí simplificamos para mantener la lógica original pero limpia.
            dispatch({ type: "SET_ERRORS", payload: validationErrors });
        }
        
        const newCardType = getCardType(cardInfo.number);
        if (newCardType !== cardType) {
            dispatch({ type: "SET_CARD_TYPE", payload: newCardType });
        }
    }, [paymentMethod, cardInfo, cardType]);

    /**
     * Maneja el envío del formulario de pago.
     */
    const handlePayment = useCallback(() => {
        if (paymentMethod === "bitcoin") {
            navigate("/checkout-success");
            return;
        }

        const validationErrors: ValidationErrors = validateCardInfo(cardInfo);
        dispatch({ type: "SET_ERRORS", payload: validationErrors });

        if (Object.keys(validationErrors).length === 0) {
            navigate("/checkout-success");
        }
    }, [paymentMethod, cardInfo, navigate]);

    /**
     * Maneja cambios en los inputs con formateo automático.
     */
    const handleCardInfoChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const { name } = e.target;
        let { value } = e.target;

        if (name === "number") {
            value = formatCardNumber(value);
        } else if (name === "expiry") {
            value = formatExpiryDate(value);
        }

        dispatch({
            type: "SET_FIELD_VALUE",
            payload: { name: name as keyof CardInfo, value },
        });
    }, []);

    /**
     * Cambia el método de pago seleccionado.
     */
    const setPaymentMethod = useCallback((method: PaymentMethod) => {
        dispatch({ type: "SET_PAYMENT_METHOD", payload: method });
    }, []);

    /**
     * Determina si el botón de pago debe estar deshabilitado.
     */
    const isPaymentDisabled = useMemo(() => {
        if (paymentMethod === "bitcoin") return false;

        const hasErrors = Object.values(errors).some((e) => !!e); // Ensure boolean check
        const hasEmptyFields =
            !cardInfo.number ||
            !cardInfo.name ||
            !cardInfo.expiry ||
            !cardInfo.cvc;

        return hasErrors || hasEmptyFields;
    }, [paymentMethod, errors, cardInfo]);

    return {
        paymentMethod,
        cardInfo,
        errors,
        cardType,
        handlePayment,
        handleCardInfoChange,
        setPaymentMethod,
        isPaymentDisabled,
    };
};
