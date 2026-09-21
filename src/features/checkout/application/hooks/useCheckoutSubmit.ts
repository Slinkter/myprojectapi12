/**
 * @file useCheckoutSubmit.ts
 * @description Hook de envio del checkout. Ejecuta el pago mediante la fachada,
 * limpia el carrito y navega a la confirmacion en caso de exito.
 * @architecture Capa de Aplicacion - Checkout Submit Hook
 */

import { useCallback } from "react";
import type { Dispatch, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import type {
    ICheckoutState,
    CheckoutAction,
} from "@/features/checkout/application/types";
import type { ICartItem } from "@/features/cart/domain/cartTypes";
import type { IDiscountCode } from "@/features/checkout/domain/types";
import { useAuth } from "@/features/auth/application/AuthContext";
import { checkoutFacade } from "@/features/checkout/application/CheckoutFacade";

/**
 * Parámetros necesarios para el hook useCheckoutSubmit.
 */
export interface ICheckoutSubmitParams {
    /** Estado actual del reducer de checkout. */
    state: ICheckoutState;
    /** Función para despachar acciones al reducer. */
    dispatch: Dispatch<CheckoutAction>;
    /** Setter para marcar todos los campos como revisados. */
    setTouched: React.Dispatch<SetStateAction<Record<string, boolean>>>;
    /** Setter para marcar el formulario como enviado. */
    setIsSubmitted: React.Dispatch<SetStateAction<boolean>>;
    /** Articulos presentes en el carrito. */
    cart: ICartItem[];
    /** Descuento validado aplicado, si existe. */
    appliedDiscount?: IDiscountCode | null;
    /** Función para vaciar el carrito tras una compra exitosa. */
    clearCart: () => void;
}

/**
 * Resultado del hook useCheckoutSubmit.
 */
export interface ICheckoutSubmitResult {
    /** Handler asincrono que procesa el pago y navega a la confirmacion. */
    handlePayment: () => Promise<void>;
}

/**
 * @hook useCheckoutSubmit
 * @description Encapsula la logica de envio del formulario de pago:
 * 1. Marca todos los campos como revisados y el formulario como enviado.
 * 2. Exige sesion iniciada antes de continuar.
 * 3. Delega la ejecucion en `CheckoutFacade.executeCheckout`.
 * 4. En caso de exito, limpia el carrito y navega a `/checkout-success` con el resumen.
 *
 * @param {ICheckoutSubmitParams} params - Estado, despachador, setters, carrito y descuento.
 * @returns {ICheckoutSubmitResult} Objeto con el handler `handlePayment`.
 *
 * @example
 * const { handlePayment } = useCheckoutSubmit({
 *     state,
 *     dispatch,
 *     setTouched,
 *     setIsSubmitted,
 *     cart,
 *     appliedDiscount,
 *     clearCart,
 * });
 */
export function useCheckoutSubmit({
    state,
    dispatch,
    setTouched,
    setIsSubmitted,
    cart,
    appliedDiscount,
    clearCart,
}: ICheckoutSubmitParams): ICheckoutSubmitResult {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handlePayment = useCallback(async () => {
        setIsSubmitted(true);
        setTouched({ number: true, name: true, expiry: true, cvc: true });

        if (!user) {
            toast.error("Por favor inicia sesión para continuar con el pago.");
            return;
        }

        const result = await checkoutFacade.executeCheckout({
            userId: user.uid,
            email: user.email || "cliente@tienda.com",
            cart,
            paymentMethod: state.paymentMethod,
            cardInfo: state.cardInfo,
            appliedDiscount,
        });

        if (!result.success) {
            if (result.validationErrors) {
                dispatch({ type: "SET_ERRORS", payload: result.validationErrors });
            }
            toast.error(result.error || "Error al procesar el pago.");
            return;
        }

        clearCart();
        navigate("/checkout-success", {
            state: {
                orderId: result.orderId,
                items: cart,
                subtotal: result.subtotal,
                discountAmount: result.discountAmount,
                shippingCost: result.shippingCost,
                total: result.finalTotal,
                paymentMethod: state.paymentMethod,
            },
        });
    }, [
        user,
        cart,
        state.paymentMethod,
        state.cardInfo,
        appliedDiscount,
        clearCart,
        navigate,
        setTouched,
        setIsSubmitted,
        dispatch,
    ]);

    return { handlePayment };
}