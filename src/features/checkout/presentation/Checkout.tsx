/**
 * @file Checkout.tsx
 * @description Página principal del proceso de pago.
 * Diseño limpio y profesional.
 * @architecture Capa de Presentación - Feature de Checkout
 */
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useLogLifecycle } from "@/shared/hooks";
import { useCheckout } from "@/features/checkout/application/useCheckout";
import { useCart } from "@/features/cart/application/useCart";
import { CheckoutSteps } from "@/features/checkout/presentation/components/CheckoutSteps";
import CheckoutHeader from "@/features/checkout/presentation/CheckoutHeader";
import PaymentMethodSelector from "@/features/checkout/presentation/PaymentMethodSelector";
import PaymentFormContainer from "@/features/checkout/presentation/PaymentFormContainer";
import PaymentSubmitButton from "@/features/checkout/presentation/PaymentSubmitButton";
import SecurityBadge from "@/features/checkout/presentation/SecurityBadge";
import { OrderSummary } from "@/features/checkout/presentation/components/OrderSummary";

/**
 * Pasos del proceso de checkout para el componente CheckoutSteps.
 * @type {string[]}
 */
const STEPS = ['Carrito', 'Pago', 'Confirmación'];

/**
 * Componente principal de la página de checkout.
 * Muestra el formulario de pago y el resumen del pedido.
 * Redirige al inicio si el carrito está vacío.
 *
 * @returns {JSX.Element} Página completa de checkout.
 */
const Checkout = () => {
  useLogLifecycle("Checkout");
  const { cart, totalPrice, removeFromCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    paymentMethod,
    cardInfo,
    errors,
    cardType,
    handlePayment,
    handlePaymentFieldChange,
    selectPaymentMethod,
  } = useCheckout();

  if (cart.length === 0) {
    return <Navigate to="/" replace />;
  }


  const handlePaymentClick = async () => {
    setIsProcessing(true)
    try {
      await handlePayment()
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50/50 dark:bg-slate-950/20 py-4">
      <div className="mx-auto max-w-5xl px-4">
        <div className="flex flex-col gap-5">
          {/* Estados */}
          <CheckoutSteps steps={STEPS} currentStep={1} />

          {/* Header */}
          <CheckoutHeader />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Formulario */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handlePaymentClick();
              }}
              className="flex flex-col gap-4"
              aria-label="Formulario de pago"
            >
              {/* Método de pago */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-card text-card-foreground shadow-sm p-4">
                <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Método de pago</h2>
                <PaymentMethodSelector
                  currentMethod={paymentMethod}
                  onMethodChange={selectPaymentMethod}
                />
              </div>

              {/* Datos de tarjeta */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-card text-card-foreground shadow-sm p-4">
                <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Datos de la tarjeta</h2>
                <PaymentFormContainer
                  paymentMethod={paymentMethod}
                  cardProps={{
                    cardInfo,
                    errors,
                    cardType,
                    onChange: handlePaymentFieldChange,
                  }}
                />
              </div>

              <PaymentSubmitButton
                isDisabled={cart.length === 0}
                isProcessing={isProcessing}
                method={paymentMethod}
              />

              <SecurityBadge />
            </form>

            {/* Resumen del pedido */}
            <div className="sticky top-20 h-fit">
              <OrderSummary 
                items={cart} 
                totalPrice={totalPrice}
                onRemove={removeFromCart}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Checkout;