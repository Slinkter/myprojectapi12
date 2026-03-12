/**
 * @file Checkout.tsx
 * @description Página principal del proceso de pago.
 * Rediseñada para una experiencia de usuario premium, segura y clara.
 * @architecture Capa de Presentación - Feature de Checkout
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCheckout } from "@/features/checkout/application/useCheckout";
import { useCart } from "@/features/cart/application/useCart";
import PaymentMethodRadio from "@/features/checkout/presentation/components/PaymentMethodRadio";
import CardForm from "@/features/checkout/presentation/components/CardForm";
import { OrderSummary } from "@/features/checkout/presentation/components/OrderSummary";
import { CheckoutSteps } from "@/features/checkout/presentation/components/CheckoutSteps";
import { ArrowLeft, ShieldCheck, Lock, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

const Checkout = () => {
  const {
    paymentMethod,
    cardInfo,
    errors,
    cardType,
    handlePayment,
    handleCardInfoChange,
    setPaymentMethod,
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
          <div className="bg-card rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            {/* Cabecera */}
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <CheckoutSteps steps={steps} currentStep={1} />
              <div className="flex items-center justify-between mb-6">
                <Link
                  to="/"
                  className="text-sm font-semibold text-slate-500 hover:text-amber-600 transition-colors flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" strokeWidth={2} /> Volver a la Tienda
                </Link>
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-green-50 dark:bg-green-900/20 rounded-full border border-green-100 dark:border-green-900/30">
                  <ShieldCheck className="w-3.5 h-3.5" strokeWidth={2} />
                  Pago Seguro
                </div>
              </div>
              <h1
                id="checkout-title"
                className="text-3xl font-extrabold text-foreground tracking-tight"
              >
                Detalles de Pago
              </h1>
              <p className="text-slate-500 mt-2 font-medium">
                Tu pago será procesado de forma segura y encriptada.
              </p>
            </div>

            <div className="p-8">
              {/* Selector de Método de Pago */}
              <div className="mb-8">
                <label htmlFor="payment-method" className="block text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest">
                  Seleccione Método de Pago
                </label>
                <fieldset id="payment-method" className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <legend className="sr-only">Selección del método de pago</legend>

                  <PaymentMethodRadio
                    id="visa"
                    label="Visa"
                    checked={paymentMethod === "visa"}
                    onChange={() => setPaymentMethod("visa")}
                  />

                  <PaymentMethodRadio
                    id="mastercard"
                    label="Mastercard"
                    checked={paymentMethod === "mastercard"}
                    onChange={() => setPaymentMethod("mastercard")}
                  />

                  <PaymentMethodRadio
                    id="bitcoin"
                    label="Bitcoin"
                    checked={paymentMethod === "bitcoin"}
                    onChange={() => setPaymentMethod("bitcoin")}
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
                    onChange={handleCardInfoChange}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-12 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-500">
                    <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center mb-4 text-4xl text-amber-600 shadow-inner">
                      ₿
                    </div>
                    <h3 className="text-xl font-bold text-foreground">
                      Pagar con Bitcoin
                    </h3>
                    <p className="text-sm text-slate-500 mt-2 text-center max-w-xs px-4">
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
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Procesando...
                  </span>
                ) : paymentMethod === "bitcoin" ? (
                  <span className="flex items-center gap-2">
                    Proceder al Pago Cripto{" "}
                    <ArrowLeft className="w-5 h-5 rotate-180" strokeWidth={2} />
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Pagar Ahora <ShieldCheck className="w-5 h-5" strokeWidth={2} />
                  </span>
                )}
              </Button>

              <div className="flex flex-col items-center gap-2 mt-8 py-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                <p className="text-[11px] text-slate-400 font-medium flex items-center gap-2 uppercase tracking-widest">
                  <Lock className="w-3.5 h-3.5" strokeWidth={2} />
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
