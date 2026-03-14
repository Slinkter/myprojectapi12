/**
 * @file Checkout.tsx
 * @description Página principal del proceso de pago.
 * Rediseñada para una experiencia de usuario premium, segura y clara.
 * @architecture Capa de Presentación - Feature de Checkout
 */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCheckout } from "@/features/checkout/application/useCheckout";
import { useCart } from "@/features/cart/application/useCart";
import PaymentMethodRadio from "@/features/checkout/presentation/components/PaymentMethodRadio";
import CardForm from "@/features/checkout/presentation/components/CardForm";
import { OrderSummary } from "@/features/checkout/presentation/components/OrderSummary";
import { CheckoutSteps } from "@/features/checkout/presentation/components/CheckoutSteps";
import { IoArrowBack, IoShieldCheckmarkOutline, IoLockClosedOutline, IoSync } from 'react-icons/io5';

import { Button } from "@/components/ui/button";

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

  const showCardForm =
    paymentMethod === "visa" || paymentMethod === "mastercard";

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
            <div className="p-8 border-b border-border bg-background/50">
              <CheckoutSteps steps={steps} currentStep={1} />
              <div className="flex items-center justify-between mb-6">
                <Link
                  to="/"
                  className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <IoArrowBack className="w-4 h-4" /> Volver a la Tienda
                </Link>
                <div className="flex items-center gap-2 text-success text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-success/10 rounded-full border border-success/30">
                  <IoShieldCheckmarkOutline className="w-3.5 h-3.5" />
                  Pago Seguro
                </div>
              </div>
              <h1
                id="checkout-title"
                className="text-3xl font-extrabold text-foreground tracking-tight"
              >
                Detalles de Pago
              </h1>
              <p className="text-muted-foreground mt-2 font-medium">
                Tu pago será procesado de forma segura y encriptada.
              </p>
            </div>

            <div className="p-8">
              {/* Selector de Método de Pago */}
              <div className="mb-8">
                <label htmlFor="payment-method" className="block text-xs font-bold text-muted-foreground mb-4 uppercase tracking-widest">
                  Seleccione Método de Pago
                </label>
                <fieldset id="payment-method" className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <legend className="sr-only">Selección del método de pago</legend>

                  <PaymentMethodRadio
                    id="visa"
                    label="Visa"
                    checked={paymentMethod === "visa"}
                    onChange={() => selectPaymentMethod("visa")}
                  />

                  <PaymentMethodRadio
                    id="mastercard"
                    label="Mastercard"
                    checked={paymentMethod === "mastercard"}
                    onChange={() => selectPaymentMethod("mastercard")}
                  />

                  <PaymentMethodRadio
                    id="bitcoin"
                    label="Bitcoin"
                    checked={paymentMethod === "bitcoin"}
                    onChange={() => selectPaymentMethod("bitcoin")}
                  />
                </fieldset>
              </div>

              {/* Formulario de Tarjeta */}
              <div className="min-h-[300px] transition-all duration-300 ease-in-out">
                {showCardForm ? (
                  <CardForm
                    cardInfo={cardInfo}
                    errors={errors}
                    cardType={cardType}
                    onChange={handlePaymentFieldChange}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-12 bg-background rounded-2xl border-2 border-dashed border-border animate-in fade-in zoom-in-95 duration-500">
                    <div className="w-20 h-20 bg-warning/20 rounded-full flex items-center justify-center mb-4 text-4xl text-warning shadow-inner">
                      ₿
                    </div>
                    <h3 className="text-xl font-bold text-foreground">
                      Pagar con Bitcoin
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2 text-center max-w-xs px-4">
                      Será redirigido a nuestra pasarela de pago cripto segura de
                      **BitPay**.
                    </p>
                  </div>
                )}
              </div>

              {/* Botón de Pago */}
              <Button
                onClick={handlePaymentClick}
                disabled={isPaymentDisabled || cart.length === 0 || isProcessing}
                className="w-full mt-10 h-14 text-lg font-bold"
                size="lg"
                aria-label={`Pagar ahora con ${paymentMethod}`}
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <IoSync className="w-5 h-5 animate-spin" />
                    Procesando...
                  </span>
                ) : paymentMethod === "bitcoin" ? (
                  <span className="flex items-center gap-2">
                    Proceder al Pago Cripto{" "}
                    <IoArrowBack className="w-5 h-5 rotate-180" />
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Pagar Ahora <IoShieldCheckmarkOutline className="w-5 h-5" />
                  </span>
                )}
              </Button>

              <div className="flex flex-col items-center gap-2 mt-8 py-4 bg-background rounded-xl">
                <p className="text-[11px] text-muted-foreground font-medium flex items-center gap-2 uppercase tracking-widest">
                  <IoLockClosedOutline className="w-3.5 h-3.5" />
                  Transacción encriptada SSL de 256 bits
                </p>
              </div>
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
