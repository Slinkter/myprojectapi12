/**
 * @file useCheckout
 * @architecture Hook de la capa de aplicación - gestiona el estado del formulario de checkout con useReducer
 * @side-effects Navegación a la página de éxito, validación en tiempo real a través de useEffect
 * @perf useReducer para estados complejos, useEffect valida en cada cambio de cardInfo
 */
import { useReducer, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCardType, validateCardInfo } from "./validation";

const initialState = {
    paymentMethod: "visa",
    cardInfo: { number: "", name: "", expiry: "", cvc: "" },
    errors: {},
    cardType: "",
};

/**
 * Función reductora para gestionar el estado del checkout.
 * Maneja la selección del método de pago, las actualizaciones de la información de la tarjeta, los errores de validación y la detección del tipo de tarjeta.
 *
 * @param {Object} state - Estado actual del checkout
 * @param {string} state.paymentMethod - Método de pago seleccionado ('visa', 'mastercard', 'bitcoin')
 * @param {Object} state.cardInfo - Información de la tarjeta de crédito
 * @param {string} state.cardInfo.number - Número de tarjeta (formateado con espacios)
 * @param {string} state.cardInfo.name - Nombre del titular de la tarjeta
 * @param {string} state.cardInfo.expiry - Fecha de caducidad (formato MM/AA)
 * @param {string} state.cardInfo.cvc - Código de verificación de la tarjeta
 * @param {Object} state.errors - Errores de validación para cada campo
 * @param {string} state.cardType - Tipo de tarjeta detectado ('visa', 'mastercard', '')
 * @param {Object} action - Objeto de acción
 * @param {string} action.type - Tipo de acción ('SET_FIELD_VALUE', 'SET_PAYMENT_METHOD', 'SET_ERRORS', 'SET_CARD_TYPE')
 * @param {*} action.payload - Payload de la acción (varía según el tipo de acción)
 * @returns {Object} Estado actualizado
 */function checkoutReducer(state, action) {
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
 * Hook personalizado para gestionar el estado y la validación del formulario de checkout.
 * Maneja la selección del método de pago, la entrada de información de la tarjeta, la validación en tiempo real,
 * la detección del tipo de tarjeta y el procesamiento del pago.
 *
 * Características:
 * - Formato automático del número de tarjeta (agrega espacios cada 4 dígitos)
 * - Formato automático de la fecha de caducidad (MM/AA)
 * - Validación en tiempo real del algoritmo de Luhn para números de tarjeta
 * - Detección del tipo de tarjeta (Visa/Mastercard)
 * - Soporte de pago con Bitcoin (omite la validación de la tarjeta)
 * - Navegación automática a la página de éxito en caso de pago válido
 *
 * @returns {Object} Estado y manejadores del checkout
 * @returns {string} returns.paymentMethod - Método de pago actualmente seleccionado
 * @returns {Object} returns.cardInfo - Información actual de la tarjeta
 * @returns {Object} returns.errors - Errores de validación para cada campo
 * @returns {string} returns.cardType - Tipo de tarjeta detectado ('visa', 'mastercard', '')
 * @returns {Function} returns.handlePayment - Valida y procesa el pago
 * @returns {Function} returns.handleCardInfoChange - Maneja los cambios de entrada de la tarjeta con formato automático
 * @returns {Function} returns.setPaymentMethod - Actualiza el método de pago seleccionado
 *
 * @example
 * const {
 *   paymentMethod,
 *   cardInfo,
 *   errors,
 *   cardType,
 *   handlePayment,
 *   handleCardInfoChange,
 *   setPaymentMethod
 * } = useCheckout();
 */export const useCheckout = () => {
    const [state, dispatch] = useReducer(checkoutReducer, initialState);
    const { paymentMethod, cardInfo, errors, cardType } = state;
    const navigate = useNavigate();

    useEffect(() => {
        if (paymentMethod === "bitcoin") {
            dispatch({ type: "SET_ERRORS", payload: {} });
        } else {
            const validationErrors = validateCardInfo(cardInfo);
            dispatch({ type: "SET_ERRORS", payload: validationErrors });
        }
        const newCardType = getCardType(cardInfo.number);
        if (newCardType !== cardType) {
            dispatch({ type: "SET_CARD_TYPE", payload: newCardType });
        }
    }, [paymentMethod, cardInfo, cardType]);

    /**
     * Maneja el envío del pago.
     * Para Bitcoin: navega directamente a la página de éxito.
     * Para pagos con tarjeta: valida la información de la tarjeta y navega a la página de éxito si es válida.
     */
    const handlePayment = () => {
        if (paymentMethod === "bitcoin") {
            navigate("/checkout-success");
            return;
        }
        const validationErrors = validateCardInfo(cardInfo);
        dispatch({ type: "SET_ERRORS", payload: validationErrors });
        if (Object.keys(validationErrors).length === 0) {
            navigate("/checkout-success");
        }
    };

        /**
         * Maneja los cambios de entrada de información de la tarjeta con formato automático.
         * - Número de tarjeta: Formato "XXXX XXXX XXXX XXXX"
         * - Caducidad: Formato "MM/AA"
         * - Otros campos: Sin formato
         *
         * @param {Event} e - Evento de cambio de entrada
         * @param {string} e.target.name - Nombre del campo de entrada ('number', 'name', 'expiry', 'cvc')
         * @param {string} e.target.value - Valor del campo de entrada
         */    const handleCardInfoChange = (e) => {
        let { name, value } = e.target;
        if (name === "number") {
            value = value
                .replace(/\D/g, "")
                .replace(/(.{4})/g, "$1 ")
                .trim();
        }
        if (name === "expiry") {
            value = value
                .replace(/\D/g, "")
                .replace(/(.{2})/, "$1/")
                .trim();
        }
        dispatch({ type: "SET_FIELD_VALUE", payload: { name, value } });
    };

    /**
     * Actualiza el método de pago seleccionado.
     * @param {string} method - Método de pago ('visa', 'mastercard', 'bitcoin')
     */
    const setPaymentMethod = (method) => {
        dispatch({ type: "SET_PAYMENT_METHOD", payload: method });
    };

    return {
        paymentMethod,
        cardInfo,
        errors,
        cardType,
        handlePayment,
        handleCardInfoChange,
        setPaymentMethod,
    };
};
