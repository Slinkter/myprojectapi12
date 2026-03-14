/**
 * @file Checkout.tsx
 * @description Página principal del proceso de pago.
 * Rediseñada para una experiencia de usuario premium, segura y clara.
 * @architecture Capa de Presentación - Feature de Checkout
 */
import { useState, useEffect } from "react";
import { useCheckout } from "@/features/checkout/application/useCheckout";
import { useCart } from "@/features/cart/application/useCart";
import { CheckoutSteps } from "@/features/checkout/presentation/components/CheckoutSteps";
import CheckoutHeader from "@/features/checkout/presentation/CheckoutHeader";
import PaymentMethodSelector from "@/features/checkout/presentation/PaymentMethodSelector";
import PaymentFormContainer from "@/features/checkout/presentation/PaymentFormContainer";
import PaymentSubmitButton from "@/features/checkout/presentation/PaymentSubmitButton";
import SecurityBadge from "@/features/checkout/presentation/SecurityBadge";
import { OrderSummary } from "@/features/checkout/presentation/components/OrderSummary";

const Checkout = () => {
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

  const { cart, totalPrice } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePaymentClick = async () => {
    setIsProcessing(true)
    try {
      await handlePayment()
    } finally {
      setIsProcessing(false)
    }
  }

  const steps = ['Carrito', 'Pago', 'Confirmación']

  return (
    <main
      className="min-h-[80vh] flex items-start justify-center p-4 py-8"
      role="main"
      aria-labelledby="checkout-title"
    >
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna Izquierda: Formulario */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-3xl shadow-2xl border border-border overflow-hidden">
            {/* Cabecera */}
            <CheckoutSteps steps={steps} currentStep={1} />
            <CheckoutHeader />

            <div className="p-8">
              {/* Selector de Método de Pago */}
              <PaymentMethodSelector
                currentMethod={paymentMethod}
                onMethodChange={selectPaymentMethod}
              />

              {/* Formulario de Tarjeta */}
              <PaymentFormContainer
                paymentMethod={paymentMethod}
                cardProps={{
                  cardInfo,
                  errors,
                  cardType,
                  onChange: handlePaymentFieldChange,
                }}
              />

              {/* Botón de Pago */}
              <PaymentSubmitButton
                isDisabled={isPaymentDisabled || cart.length === 0}
                isProcessing={isProcessing}
                method={paymentMethod}
                onClick={handlePaymentClick}
              />

              <SecurityBadge />
            </div>
          </div>
        </div>

        {/* Columna Derecha: Resumen del Pedido */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <OrderSummary items={cart} totalPrice={totalPrice} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Checkout;
