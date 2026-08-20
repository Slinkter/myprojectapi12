/**
 * @file index.ts
 * @description Public API barrel para la feature de Checkout y Procesamiento de Pagos (FSD Architecture).
 * @architecture Feature Layer - Checkout Public API Barrel
 */

// Domain
export * from "./domain/discounts";
export * from "./domain/formatters";
export * from "./domain/repositories/ICheckoutRepository";
export * from "./domain/strategies/IPaymentStrategy";
export * from "./domain/strategies/CreditCardPaymentStrategy";
export * from "./domain/strategies/BitcoinPaymentStrategy";
export * from "./domain/strategies/IDiscountStrategy";
export * from "./domain/strategies/PercentageDiscountStrategy";
export * from "./domain/strategies/FixedDiscountStrategy";
export * from "./domain/strategies/IShippingStrategy";
export * from "./domain/strategies/StandardShippingStrategy";
export * from "./domain/factories/PaymentStrategyFactory";
export * from "./domain/factories/DiscountStrategyFactory";

// Application
export * from "./application/types";
export * from "./application/validation";
export * from "./application/useCheckout";
export * from "./application/useDiscountValidation";
export * from "./application/CheckoutFacade";

// Infrastructure
export * from "./infrastructure/FirestoreCheckoutRepository";
export * from "./infrastructure/checkoutFirestore";

// Presentation
export { default as Checkout } from "./presentation/Checkout";
export { default as CheckoutSuccess } from "./presentation/CheckoutSuccess";
export { default as CheckoutHeader } from "./presentation/CheckoutHeader";
export { default as PaymentMethodSelector } from "./presentation/PaymentMethodSelector";
export { default as PaymentFormContainer } from "./presentation/PaymentFormContainer";
export { default as PaymentSubmitButton } from "./presentation/PaymentSubmitButton";
export { default as SecurityBadge } from "./presentation/SecurityBadge";
export * from "./presentation/components/OrderSummary";
export * from "./presentation/components/DiscountInput";
export * from "./presentation/components/AppliedDiscountBadge";
export * from "./presentation/components/PriceRow";
export * from "./presentation/components/OrderItemRow";
