// src/features/checkout/application/useCheckout.ts
import { useReducer, useEffect, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { getCardType, validateCardInfo } from "./validation";
import {
  CheckoutState,
  CheckoutAction,
  PaymentMethod,
  CardInfo,
  ValidationErrors,
} from "./types";

const initialState: CheckoutState = {
  paymentMethod: "visa",
  cardInfo: { number: "", name: "", expiry: "", cvc: "" },
  errors: {},
  cardType: "",
};

function checkoutReducer(state: CheckoutState, action: CheckoutAction): CheckoutState {
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
}

export const useCheckout = (): UseCheckoutReturn => {
  const [state, dispatch] = useReducer(checkoutReducer, initialState);
  const { paymentMethod, cardInfo, errors, cardType } = state;
  const navigate = useNavigate();

  useEffect(() => {
    if (paymentMethod === "bitcoin") {
      dispatch({ type: "SET_ERRORS", payload: {} });
    } else {
      const validationErrors: ValidationErrors = validateCardInfo(cardInfo);
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