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
 * Reducer function for managing checkout state.
 * Handles payment method selection, card information updates, validation errors, and card type detection.
 * 
 * @param {Object} state - Current checkout state
 * @param {string} state.paymentMethod - Selected payment method ('visa', 'mastercard', 'bitcoin')
 * @param {Object} state.cardInfo - Credit card information
 * @param {string} state.cardInfo.number - Card number (formatted with spaces)
 * @param {string} state.cardInfo.name - Cardholder name
 * @param {string} state.cardInfo.expiry - Expiry date (MM/YY format)
 * @param {string} state.cardInfo.cvc - Card verification code
 * @param {Object} state.errors - Validation errors for each field
 * @param {string} state.cardType - Detected card type ('visa', 'mastercard', '')
 * @param {Object} action - Action object
 * @param {string} action.type - Action type ('SET_FIELD_VALUE', 'SET_PAYMENT_METHOD', 'SET_ERRORS', 'SET_CARD_TYPE')
 * @param {*} action.payload - Action payload (varies by action type)
 * @returns {Object} Updated state
 */
function checkoutReducer(state, action) {
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
 * Custom hook for managing checkout form state and validation.
 * Handles payment method selection, card information input, real-time validation,
 * card type detection, and payment processing.
 * 
 * Features:
 * - Automatic card number formatting (adds spaces every 4 digits)
 * - Automatic expiry date formatting (MM/YY)
 * - Real-time Luhn algorithm validation for card numbers
 * - Card type detection (Visa/Mastercard)
 * - Bitcoin payment support (skips card validation)
 * - Automatic navigation to success page on valid payment
 * 
 * @returns {Object} Checkout state and handlers
 * @returns {string} returns.paymentMethod - Currently selected payment method
 * @returns {Object} returns.cardInfo - Current card information
 * @returns {Object} returns.errors - Validation errors for each field
 * @returns {string} returns.cardType - Detected card type ('visa', 'mastercard', '')
 * @returns {Function} returns.handlePayment - Validates and processes payment
 * @returns {Function} returns.handleCardInfoChange - Handles card input changes with auto-formatting
 * @returns {Function} returns.setPaymentMethod - Updates selected payment method
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
 */
export const useCheckout = () => {
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
     * Handles payment submission.
     * For Bitcoin: navigates directly to success page.
     * For card payments: validates card info and navigates to success if valid.
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
     * Handles card information input changes with automatic formatting.
     * - Card number: Formats as "XXXX XXXX XXXX XXXX"
     * - Expiry: Formats as "MM/YY"
     * - Other fields: No formatting
     * 
     * @param {Event} e - Input change event
     * @param {string} e.target.name - Input field name ('number', 'name', 'expiry', 'cvc')
     * @param {string} e.target.value - Input field value
     */
    const handleCardInfoChange = (e) => {
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
     * Updates the selected payment method.
     * @param {string} method - Payment method ('visa', 'mastercard', 'bitcoin')
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
