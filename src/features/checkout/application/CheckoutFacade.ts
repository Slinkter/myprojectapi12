/**
 * @file CheckoutFacade.ts
 * @description Fachada que unifica y orquesta el flujo completo de checkout: validación, descuentos, envío, pasarela de pago y persistencia transaccional (Facade Pattern).
 * @architecture Application Layer - Checkout Facade (GoF Facade Pattern)
 */

import type { ICartItem } from "@/features/cart/domain/cartTypes";
import type { PaymentMethod, ICardInfo, IValidationErrors } from "@/features/checkout/application/types";
import type { IDiscountCode } from "@/features/checkout/application/useDiscountValidation";
import type { ICheckoutRepository } from "@/features/checkout/domain/repositories/ICheckoutRepository";
import { firestoreCheckoutRepository } from "@/features/checkout/infrastructure/FirestoreCheckoutRepository";
import { PaymentStrategyFactory } from "@/features/checkout/domain/factories/PaymentStrategyFactory";
import { DiscountStrategyFactory } from "@/features/checkout/domain/factories/DiscountStrategyFactory";
import { StandardShippingStrategy } from "@/features/checkout/domain/strategies/StandardShippingStrategy";
import type { IShippingStrategy } from "@/features/checkout/domain/strategies/IShippingStrategy";
import { eventBus, DomainEvents } from "@/shared/infrastructure/eventBus";

/**
 * Parámetros para ejecutar el flujo de checkout a través de la fachada.
 */
export interface ICheckoutExecutionParams {
  userId: string;
  email: string;
  cart: ICartItem[];
  paymentMethod: PaymentMethod;
  cardInfo: ICardInfo;
  appliedDiscount?: IDiscountCode | null;
}

/**
 * Resultado estructurado devuelto por la fachada de checkout.
 */
export interface ICheckoutExecutionResult {
  success: boolean;
  orderId: string;
  transactionId: string;
  subtotal: number;
  discountAmount: number;
  shippingCost: number;
  finalTotal: number;
  error?: string;
  validationErrors?: IValidationErrors;
}

/**
 * @class CheckoutFacade
 * @description Fachada del proceso de pago que oculta la complejidad del cálculo de descuentos, tarifas de envío,
 * selección de pasarelas y transacciones atómicas de base de datos.
 */
export class CheckoutFacade {
  private checkoutRepo: ICheckoutRepository;
  private shippingStrategy: IShippingStrategy;

  /**
   * @param {ICheckoutRepository} [checkoutRepo] Repositorio inyectable para persistencia.
   * @param {IShippingStrategy} [shippingStrategy] Estrategia inyectable de envíos.
   */
  constructor(
    checkoutRepo: ICheckoutRepository = firestoreCheckoutRepository,
    shippingStrategy: IShippingStrategy = new StandardShippingStrategy()
  ) {
    this.checkoutRepo = checkoutRepo;
    this.shippingStrategy = shippingStrategy;
  }

  /**
   * Calcula el desglose financiero completo antes de procesar el pago.
   *
   * @param {ICartItem[]} cart Artículos en el carrito.
   * @param {IDiscountCode | null} [appliedDiscount] Cupón validado.
   * @returns {{ subtotal: number; totalItems: number; discountAmount: number; shippingCost: number; finalTotal: number }}
   */
  public calculateFinancials(
    cart: ICartItem[],
    appliedDiscount?: IDiscountCode | null
  ): {
    subtotal: number;
    totalItems: number;
    discountAmount: number;
    shippingCost: number;
    finalTotal: number;
  } {
    let subtotal = 0;
    let totalItems = 0;

    for (let i = 0; i < cart.length; i++) {
      const item = cart[i];
      subtotal += item.price * item.quantity;
      totalItems += item.quantity;
    }

    let discountAmount = 0;
    if (appliedDiscount) {
      const discountStrategy = DiscountStrategyFactory.createFromDiscount(appliedDiscount);
      discountAmount = discountStrategy.calculateDiscount(subtotal);
    }

    const discountedSubtotal = Math.max(0, subtotal - discountAmount);
    const shippingCost = this.shippingStrategy.calculateShipping(subtotal, totalItems);
    const finalTotal = Math.round((discountedSubtotal + shippingCost) * 100) / 100;

    return {
      subtotal,
      totalItems,
      discountAmount,
      shippingCost,
      finalTotal,
    };
  }

  /**
   * Ejecuta el flujo integral de checkout de forma sincronizada.
   *
   * @param {ICheckoutExecutionParams} params Parámetros de compra y pago.
   * @returns {Promise<ICheckoutExecutionResult>} Resultado de la ejecución del checkout.
   */
  public async executeCheckout(
    params: ICheckoutExecutionParams
  ): Promise<ICheckoutExecutionResult> {
    const { userId, email, cart, paymentMethod, cardInfo, appliedDiscount } = params;

    // 1. Validar autenticación
    if (!userId || !email) {
      return {
        success: false,
        orderId: "",
        transactionId: "",
        subtotal: 0,
        discountAmount: 0,
        shippingCost: 0,
        finalTotal: 0,
        error: "Debes iniciar sesión para completar la compra.",
      };
    }

    // 2. Validar carrito
    if (!cart || cart.length === 0) {
      return {
        success: false,
        orderId: "",
        transactionId: "",
        subtotal: 0,
        discountAmount: 0,
        shippingCost: 0,
        finalTotal: 0,
        error: "El carrito de compras está vacío.",
      };
    }

    // 3. Calcular montos financieros consolidados
    const { subtotal, discountAmount, shippingCost, finalTotal } = this.calculateFinancials(
      cart,
      appliedDiscount
    );

    // 4. Obtener y validar estrategia de pago
    const paymentStrategy = PaymentStrategyFactory.getStrategy(paymentMethod);
    if (paymentStrategy.requiresCardDetails) {
      const validationErrors = paymentStrategy.validate(cardInfo);
      const hasErrors = Object.values(validationErrors).some((msg) => Boolean(msg));

      if (hasErrors) {
        return {
          success: false,
          orderId: "",
          transactionId: "",
          subtotal,
          discountAmount,
          shippingCost,
          finalTotal,
          error: "Por favor corrige los errores en el formulario de pago.",
          validationErrors,
        };
      }
    }

    // 5. Procesar cobro en la pasarela
    const paymentResult = await paymentStrategy.processPayment(finalTotal, cardInfo);
    if (!paymentResult.success) {
      return {
        success: false,
        orderId: "",
        transactionId: "",
        subtotal,
        discountAmount,
        shippingCost,
        finalTotal,
        error: paymentResult.error || "El cobro fue rechazado por la pasarela de pagos.",
      };
    }

    // 6. Registrar orden y actualizar stock de forma atómica en el repositorio
    try {
      const orderId = await this.checkoutRepo.recordPurchaseAndUpdateStock({
        userId,
        email,
        cart,
        subtotal,
        discountAmount,
        appliedDiscount,
        shippingCost,
        total: finalTotal,
        paymentMethod,
      });

      // 7. Emitir evento de dominio para desacoplamiento y analítica
      eventBus.emit(DomainEvents.ORDER_PLACED, {
        orderId,
        userId,
        finalTotal,
        itemsCount: cart.length,
      });

      return {
        success: true,
        orderId,
        transactionId: paymentResult.transactionId,
        subtotal,
        discountAmount,
        shippingCost,
        finalTotal,
      };
    } catch (dbError) {
      console.error("CheckoutFacade: Error registrando orden en Firestore:", dbError);
      return {
        success: false,
        orderId: "",
        transactionId: paymentResult.transactionId,
        subtotal,
        discountAmount,
        shippingCost,
        finalTotal,
        error: (dbError as Error).message || "Error al registrar la compra en la base de datos.",
      };
    }
  }
}

/** Instancia singleton de CheckoutFacade */
export const checkoutFacade = new CheckoutFacade();
