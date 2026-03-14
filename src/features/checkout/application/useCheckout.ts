/**
 * @file useCheckout.ts
 * @description Hook personalizado para manejar la lógica de negocio del proceso de pago (checkout).
 * Orquesta la validación, formateo y navegación.
 * @architecture Capa de Aplicación - Lógica de Negocio de Checkout
 */
import {
  useReducer,
  useEffect,
  ChangeEvent,
  useMemo,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import { validateCardInfo } from "@/features/checkout/application/validation";
import {
  getCardType,
  formatCardNumber,
  formatExpiryDate,
} from "@/features/checkout/domain/formatters";
import {
  checkoutReducer,
  initialState,
} from "@/features/checkout/application/checkoutReducer";
import {
  PaymentMethod,
  ICardInfo,
  IValidationErrors,
  IUseCheckoutReturn,
} from "@/features/checkout/application/types";

/**
 * @function detectCardType
 * @description Detecta el tipo de tarjeta basándose en el número.
 * @param {string} cardNumber - Número de tarjeta.
 * @returns {string} Tipo de tarjeta detectado.
 */
const detectCardType = (cardNumber: string): string => {
  return getCardType(cardNumber);
};

/**
 * @function hasValidationErrors
 * @description Verifica si existen errores de validación.
 * @param {IValidationErrors} errors - Objeto de errores de validación.
 * @returns {boolean} True si hay errores.
 */
const hasValidationErrors = (errors: IValidationErrors): boolean => {
  return Object.values(errors).some((e) => !!e);
};

/**
 * @function hasEmptyRequiredFields
 * @description Verifica si hay campos requeridos vacíos.
 * @param {ICardInfo} cardInfo - Información de la tarjeta.
 * @returns {boolean} True si hay campos vacíos.
 */
const hasEmptyRequiredFields = (cardInfo: ICardInfo): boolean => {
  return !cardInfo.number || !cardInfo.name || !cardInfo.expiry || !cardInfo.cvc;
};

/**
 * @function useCheckout
 * @description Hook principal para el checkout.
 * Centraliza la lógica de estado, validación y formateo.
 *
 * @returns {IUseCheckoutReturn} Objeto con estado y handlers.
 */
export const useCheckout = (): IUseCheckoutReturn => {
  const [state, dispatch] = useReducer(checkoutReducer, initialState);
  const { paymentMethod, cardInfo, errors, cardType } = state;
  const navigate = useNavigate();

  const handleCardTypeDetection = useCallback(() => {
    const newCardType = detectCardType(cardInfo.number);
    if (newCardType !== cardType) {
      dispatch({ type: "SET_CARD_TYPE", payload: newCardType });
    }
  }, [cardInfo.number, cardType]);

  // Efecto para validación en tiempo real (opcional, podría moverse a onBlur para menos ruido)
  useEffect(() => {
    if (paymentMethod === "bitcoin") {
      dispatch({ type: "SET_ERRORS", payload: {} });
    } else {
      const validationErrors: IValidationErrors = validateCardInfo(cardInfo);
      dispatch({ type: "SET_ERRORS", payload: validationErrors });
    }

    handleCardTypeDetection();
  }, [paymentMethod, cardInfo, cardType, handleCardTypeDetection]);

  /**
   * Maneja el envío del formulario de pago.
   */
  const handlePayment = useCallback(() => {
    if (paymentMethod === "bitcoin") {
      navigate("/checkout-success");
      return;
    }

    const validationErrors: IValidationErrors = validateCardInfo(cardInfo);
    dispatch({ type: "SET_ERRORS", payload: validationErrors });

    if (Object.keys(validationErrors).length === 0) {
      navigate("/checkout-success");
    }
  }, [paymentMethod, cardInfo, navigate]);

  /**
   * Handles changes to payment form input fields with automatic formatting.
   * Formats card numbers (adds spaces) and expiry dates (adds slash) as user types.
   * @param e - The change event from the input element
   * @returns void
   */
  const handlePaymentFieldChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { name } = e.target;
      let { value } = e.target;

      if (name === "number") {
        value = formatCardNumber(value);
      } else if (name === "expiry") {
        value = formatExpiryDate(value);
      }

      dispatch({
        type: "SET_FIELD_VALUE",
        payload: { name: name as keyof ICardInfo, value },
      });
    },
    [],
  );

  /**
   * Updates the selected payment method (e.g., credit card, bitcoin).
   * Clears any existing card info errors when switching methods.
   * @param method - The payment method to select (e.g., "credit_card", "bitcoin")
   * @returns void
   */
  const selectPaymentMethod = useCallback((method: PaymentMethod) => {
    dispatch({ type: "SET_PAYMENT_METHOD", payload: method });
  }, []);

  /**
   * Determines whether the payment submit button should be disabled.
   * For credit card: disabled if there are validation errors or empty required fields.
   * For bitcoin: always enabled (no card details needed).
   * @returns true if payment button should be disabled, false otherwise
   */
  const isPaymentDisabled = useMemo(() => {
    if (paymentMethod === "bitcoin") return false;

    const hasErrors = hasValidationErrors(errors);
    const hasEmptyFields = hasEmptyRequiredFields(cardInfo);

    return hasErrors || hasEmptyFields;
  }, [paymentMethod, errors, cardInfo]);

  return {
    paymentMethod,
    cardInfo,
    errors,
    cardType,
    handlePayment,
    handlePaymentFieldChange,
    selectPaymentMethod,
    isPaymentDisabled,
  };
};
