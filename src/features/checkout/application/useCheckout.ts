/**
 * @file useCheckout.ts
 * @description Hook personalizado para manejar la lógica de negocio del proceso de pago (checkout).
 * Orquesta tres hooks internos: el reducer de estado, la validación y el envío,
 * delegando la ejecución del pago en CheckoutFacade.
 * @architecture Capa de Aplicación - Lógica de Negocio de Checkout (Orquestador)
 */

import { useCallback } from "react";
import type { ChangeEvent } from "react";
import { useCheckoutReducer } from "@/features/checkout/application/checkoutReducer";
import { useCheckoutValidation } from "@/features/checkout/application/hooks/useCheckoutValidation";
import { useCheckoutSubmit } from "@/features/checkout/application/hooks/useCheckoutSubmit";
import {
    formatCardNumber,
    formatExpiryDate,
} from "@/features/checkout/domain/formatters";
import type {
    PaymentMethod,
    ICardInfo,
    IUseCheckoutReturn,
} from "@/features/checkout/application/types";
import type { ICartItem } from "@/features/cart/domain/cartTypes";
import type { IDiscountCode } from "@/features/checkout/application/useDiscountValidation";
import { calculateOrderFinancials } from "@/features/checkout/domain/financials";

/**
 * @hook useCheckout
 * @description Hook principal para el checkout. Combina el reducer de estado,
 * el hook de validación, el hook de envío y el cálculo financiero unificado,
 * exponiendo los handlers del formulario y los montos finales.
 *
 * @param {ICartItem[]} cart - Array de items en el carrito.
 * @param {number} [_totalPrice] - Precio total base del carrito (opcional para retrocompatibilidad).
 * @param {() => void} [clearCart] - Función para limpiar el carrito tras comprar.
 * @param {IDiscountCode | null} [appliedDiscount] - Código de descuento aplicado opcional.
 * @returns {IUseCheckoutReturn} Objeto con estado, handlers y desglose financiero.
 */
export const useCheckout = (
    cart: ICartItem[],
    _totalPrice?: number,
    clearCart: () => void = () => {},
    appliedDiscount?: IDiscountCode | null,
): IUseCheckoutReturn => {
    const { state, dispatch } = useCheckoutReducer();
    const financials = calculateOrderFinancials(cart, appliedDiscount);
    const {
        setTouched,
        setIsSubmitted,
        handleBlur,
        visibleErrors,
        isPaymentDisabled,
    } = useCheckoutValidation(state, dispatch);
    const { handlePayment } = useCheckoutSubmit({
        state,
        dispatch,
        setTouched,
        setIsSubmitted,
        cart,
        appliedDiscount,
        clearCart,
    });

    const handlePaymentFieldChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const { name } = e.target;
            let { value } = e.target;

            setTouched((prev) => ({ ...prev, [name]: true }));

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
        [dispatch, setTouched],
    );

    /**
     * @function selectPaymentMethod
     * @description Cambia el método de pago seleccionado y limpia el estado
     * de validación visual (campos revisados y flag de envío).
     * @param {PaymentMethod} method - Método de pago a seleccionar.
     */
    const selectPaymentMethod = useCallback(
        (method: PaymentMethod) => {
            dispatch({ type: "SET_PAYMENT_METHOD", payload: method });
            setTouched({});
            setIsSubmitted(false);
        },
        [dispatch, setTouched, setIsSubmitted],
    );

    const { paymentMethod, cardInfo, cardType } = state;

    return {
        paymentMethod,
        cardInfo,
        errors: visibleErrors,
        cardType,
        handlePayment,
        handlePaymentFieldChange,
        handleBlur,
        selectPaymentMethod,
        isPaymentDisabled,
        financials,
    };
};