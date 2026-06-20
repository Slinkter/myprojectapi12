/**
 * @file Checkout.tsx
 * @description Página principal del proceso de pago.
 * Diseño limpio y profesional.
 * @architecture Capa de Presentación - Feature de Checkout
 */
import { useState, useEffect } from "react";
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

const STEPS = ['Carrito', 'Pago', 'Confirmación'];

const Checkout = () => {
  useLogLifecycle("Checkout");
  useEffect(() => {
    console.log('[Checkout] Component mounted!')
  }, [])
  
  const {
    paymentMethod,
    cardInfo,
    errors,
    cardType,
    handlePayment,
    handlePaymentFieldChange,
    selectPaymentMethod,
    isPaymentDisabled,
  } = useCheckout();

  const { cart, totalPrice, removeFromCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePaymentClick = async () => {
    setIsProcessing(true)
    try {
      await handlePayment()
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <main className="min-h-screen bg-background p-4 py-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Estados */}
        <CheckoutSteps steps={STEPS} currentStep={1} />

        {/* Header */}
        <CheckoutHeader />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Formulario */}
          <div className="space-y-4">
            {/* Método de pago */}
            <div className="bg-background border border-border rounded-xl p-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Método de pago</h3>
              <PaymentMethodSelector
                currentMethod={paymentMethod}
                onMethodChange={selectPaymentMethod}
              />
            </div>

            {/* Datos de tarjeta */}
            <div className="bg-background border border-border rounded-xl p-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-4">Datos de la tarjeta</h3>
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
              isDisabled={isPaymentDisabled || cart.length === 0}
              isProcessing={isProcessing}
              method={paymentMethod}
              onClick={handlePaymentClick}
            />

            <SecurityBadge />
          </div>

          {/* Resumen del pedido */}
          <div className="md:sticky md:top-6 h-fit">
            <OrderSummary 
              items={cart} 
              totalPrice={totalPrice}
              onRemove={removeFromCart}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Checkout;
