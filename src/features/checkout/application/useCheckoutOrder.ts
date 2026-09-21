/**
 * @file useCheckoutOrder.ts
 * @description Hook profundo de admisión de orden (Order Intake Hook) que consolida
 * la orquestación del formulario de pago, cupones de descuento, cálculo financiero determinista
 * y ejecución transaccional bajo una única interfaz cohesiva.
 * @architecture Application Layer - Deep Order Intake Hook
 */

import { useDiscountValidation, type IUseDiscountValidationReturn } from "@/features/checkout/application/useDiscountValidation";
import { useCheckout } from "@/features/checkout/application/useCheckout";
import type { ICartItem } from "@/features/cart/domain/cartTypes";
import type { IUseCheckoutReturn } from "@/features/checkout/application/types";
import type { IOrderFinancials } from "@/features/checkout/domain/financials";

/**
 * Parámetros de entrada para el hook profundo useCheckoutOrder.
 */
export interface IUseCheckoutOrderOptions {
  /** Colección de productos seleccionados en el carrito */
  cart: ICartItem[];
  /** Callback para vaciar el carrito tras confirmar la compra */
  clearCart?: () => void;
}

/**
 * Interfaz de retorno unificada que ofrece estado de pago, validaciones,
 * gestión de cupones y desglose financiero en una sola llamada.
 */
export interface IUseCheckoutOrderReturn extends IUseCheckoutReturn {
  /** Desglose financiero determinista calculado para la orden */
  financials: IOrderFinancials;
  /** Estado reactivo y handlers del subsistema de descuentos y cupones */
  discountState: IUseDiscountValidationReturn;
}

/**
 * @hook useCheckoutOrder
 * @description Hook profundo que consolida el flujo de admisión de órdenes.
 *
 * @param {IUseCheckoutOrderOptions} options - Opciones con carrito y callbacks.
 * @returns {IUseCheckoutOrderReturn} Objeto consolidado para la vista de pago.
 */
export function useCheckoutOrder({
  cart,
  clearCart = () => {},
}: IUseCheckoutOrderOptions): IUseCheckoutOrderReturn {
  const discountState = useDiscountValidation();
  const checkout = useCheckout(cart, undefined, clearCart, discountState.appliedDiscount);

  return {
    ...checkout,
    financials: checkout.financials!,
    discountState,
  };
}
