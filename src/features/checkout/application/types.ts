// src/features/checkout/application/types.ts

// Assuming CartItem structure based on its usage in Cart.jsx
export interface CartItem {
    id: number;
    title: string;
    price: number;
    quantity: number;
}

export type PaymentMethod = "visa" | "mastercard" | "bitcoin";

export interface CardInfo {
    number: string;
    name: string;
    expiry: string; // MM/YY format
    cvc: string;
}

export interface ValidationErrors {
    number?: string;
    name?: string;
    expiry?: string;
    cvc?: string;
}

export interface CheckoutState {
    paymentMethod: PaymentMethod;
    cardInfo: CardInfo;
    errors: ValidationErrors;
    cardType: string; // 'visa' | 'mastercard' | ''
}

export type CheckoutAction =
    | { type: "SET_FIELD_VALUE"; payload: { name: keyof CardInfo; value: string } }
    | { type: "SET_PAYMENT_METHOD"; payload: PaymentMethod }
    | { type: "SET_ERRORS"; payload: ValidationErrors }
    | { type: "SET_CARD_TYPE"; payload: string }; // 'visa' | 'mastercard' | ''
