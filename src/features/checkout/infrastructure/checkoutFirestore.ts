/**
 * @file checkoutFirestore.ts
 * @description Servicio de infraestructura para realizar transacciones de pago en Firestore y actualizar stock.
 * @architecture Infrastructure Layer - Checkout Firestore Transaction (Delegates to FirestoreCheckoutRepository)
 */

import type { ICartItem } from "@/features/cart/domain/cartTypes";
import type { IDiscountCode } from "@/features/checkout/application/useDiscountValidation";
import { firestoreCheckoutRepository } from "@/features/checkout/infrastructure/FirestoreCheckoutRepository";

export type { IDiscountCode };

/**
 * Registra una compra en la colección 'compras' y deduce el stock de los productos
 * de forma atómica usando una transacción de Firestore a través del repositorio.
 *
 * @param {string} userId ID del usuario autenticado.
 * @param {string} email Correo del comprador.
 * @param {ICartItem[]} cart Items del carrito.
 * @param {number} total Total final cobrado.
 * @param {string} paymentMethod Método de pago utilizado.
 * @param {IDiscountCode | null} [appliedDiscount] Descuento aplicado si hubo cupón.
 * @param {number} [shippingCost] Costo de envío calculado.
 * @param {number} [subtotal] Subtotal base antes de descuentos.
 * @returns {Promise<string>} Identificador único de la orden generada.
 */
export const recordPurchaseAndUpdateStock = async (
  userId: string,
  email: string,
  cart: ICartItem[],
  total: number,
  paymentMethod: string,
  appliedDiscount?: IDiscountCode | null,
  shippingCost: number = 0,
  subtotal?: number
): Promise<string> => {
  const calculatedSubtotal = subtotal ?? cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = appliedDiscount
    ? appliedDiscount.type === "percentage"
      ? (calculatedSubtotal * appliedDiscount.discount) / 100
      : appliedDiscount.discount
    : 0;

  return firestoreCheckoutRepository.recordPurchaseAndUpdateStock({
    userId,
    email,
    cart,
    subtotal: calculatedSubtotal,
    discountAmount,
    appliedDiscount,
    shippingCost,
    total,
    paymentMethod,
  });
};
