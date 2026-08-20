/**
 * @file ICheckoutRepository.ts
 * @description Interfaz de repositorio de dominio para la persistencia atómica de transacciones de compra.
 * @architecture Domain Layer - Checkout Repository Interface
 */

import type { ICartItem } from "@/features/cart/domain/cartTypes";
import type { IDiscountCode } from "@/features/checkout/application/useDiscountValidation";

/**
 * Parámetros para registrar una orden de compra transaccional.
 */
export interface IPurchaseTransactionParams {
  userId: string;
  email: string;
  cart: ICartItem[];
  subtotal: number;
  discountAmount: number;
  appliedDiscount?: IDiscountCode | null;
  shippingCost: number;
  total: number;
  paymentMethod: string;
}

/**
 * Contrato del repositorio de checkout para ejecutar transacciones financieras y de stock.
 */
export interface ICheckoutRepository {
  /**
   * Registra una compra y deduce el stock de forma atómica en una transacción de base de datos.
   *
   * @param {IPurchaseTransactionParams} params Parámetros de la transacción de compra.
   * @returns {Promise<string>} Identificador único de la orden generada.
   */
  recordPurchaseAndUpdateStock(params: IPurchaseTransactionParams): Promise<string>;
}
