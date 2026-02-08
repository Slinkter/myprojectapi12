/**
 * @file useCheckout.ts
 * @description Hook personalizado para manejar la lógica de negocio del proceso de checkout.
 * Gestiona el estado del formulario, validaciones y selección de método de pago.
 * @architecture Application Layer - Checkout Business Logic
 */
import { useReducer, useEffect, ChangeEvent, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getCardType, validateCardInfo } from "./validation";
import {
    CheckoutState,
    CheckoutAction,
    PaymentMethod,
    CardInfo,
    ValidationErrors,
} from "./types";

/**
 * Hook principal para el checkout.
 * Centraliza la lógica de estado y validación del formulario de pago.
 *
 * @returns {object} Objeto con estado y handlers del checkout
 * @property {PaymentMethod} paymentMethod - Método de pago seleccionado
 * @property {CardInfo} cardInfo - Datos de la tarjeta
 * @property {ValidationErrors} errors - Errores de validación actuales
 * @property {string} cardType - Tipo de tarjeta detectado (visa/mastercard)
 * @property {Function} handlePayment - Función para procesar el pago
 * @property {Function} handleCardInfoChange - Handler para cambios en inputs
 * @property {Function} setPaymentMethod - Setter para método de pago
 * @property {boolean} isPaymentDisabled - Flag para deshabilitar botón de pago
 */

const initialState: CheckoutState = {
    paymentMethod: "visa",
    cardInfo: { number: "", name: "", expiry: "", cvc: "" },
    errors: {},
    cardType: "",
};

function checkoutReducer(
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

export const useCheckout = (): UseCheckoutReturn => {
    const [state, dispatch] = useReducer(checkoutReducer, initialState);
    const { paymentMethod, cardInfo, errors, cardType } = state;
    const navigate = useNavigate();

    useEffect(() => {
        if (paymentMethod === "bitcoin") {
            dispatch({ type: "SET_ERRORS", payload: {} });
        } else {
            const validationErrors: ValidationErrors =
                validateCardInfo(cardInfo);
            dispatch({ type: "SET_ERRORS", payload: validationErrors });
        }
        const newCardType = getCardType(cardInfo.number);
        if (newCardType !== cardType) {
            dispatch({ type: "SET_CARD_TYPE", payload: newCardType });
        }
    }, [paymentMethod, cardInfo, cardType]);

    const handlePayment = () => {
        if (paymentMethod === "bitcoin") {
            navigate("/checkout-success");
            return;
        }
        const validationErrors: ValidationErrors = validateCardInfo(cardInfo);
        dispatch({ type: "SET_ERRORS", payload: validationErrors });
        if (Object.keys(validationErrors).length === 0) {
            navigate("/checkout-success");
        }
    };

    const handleCardInfoChange = (e: ChangeEvent<HTMLInputElement>) => {
        let { name, value } = e.target;
        if (name === "number") {
            value = value
                .replace(/\D/g, "")
                .replace(/(.{4})/g, "$1 ")
                .trim();
        }
        if (name === "expiry") {
            // Automatically add slash for MM/YY format
            value = value
                .replace(/\D/g, "")
                .replace(/^(\d{2})$/, "$1/") // Add slash after 2 digits if only 2 digits
                .replace(/^(\d{2})\/(\d{2}).*$/, "$1/$2") // Limit to MM/YY
                .substring(0, 5); // Ensure max length of 5 (MM/YY)
        }
        dispatch({
            type: "SET_FIELD_VALUE",
            payload: { name: name as keyof CardInfo, value },
        });
    };

    const setPaymentMethod = (method: PaymentMethod) => {
        dispatch({ type: "SET_PAYMENT_METHOD", payload: method });
    };

    const isPaymentDisabled = useMemo(() => {
        if (paymentMethod === "bitcoin") return false;

        const hasErrors = Object.values(errors).some((e) => e);
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
