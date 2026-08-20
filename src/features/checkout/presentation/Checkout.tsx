/**
 * @file Checkout.tsx
 * @description Página principal del proceso de pago con formulario interactivo y resumen en tiempo real.
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
const STEPS = ["Carrito", "Envío", "Pago"];

/**
 * Componente principal de la página de checkout.
 * Muestra el formulario de pago y el resumen del pedido.
 * Redirige al inicio si el carrito está vacío.
 *
 * @remarks
 * **Secuencia de carga:**
 * 1. `useCheckout()` orquesta reducer + validación + submit.
 * 2. `CheckoutHeader` muestra pasos visuales (`CheckoutSteps`).
 * 3. `PaymentMethodSelector` -> usuario elige visa/mastercard/bitcoin.
 * 4. `PaymentFormContainer` -> `CardForm` si es tarjeta, o mensaje si es bitcoin.
 * 5. `DiscountInput` -> `useDiscountValidation()` valida código async (500ms delay).
 * 6. `OrderSummary` muestra items + subtotal + descuento + total con números tabulares.
 * 7. `PaymentSubmitButton` -> validación + `useCheckoutSubmit()` -> navigate.
 * 8. `CheckoutSuccess` recibe orderId vía `useLocation().state`.
 *
 * @returns {JSX.Element} Página completa de checkout.
 */
const Checkout = () => {
    useLogLifecycle("Checkout");
    const { cart, totalPrice, removeFromCart, clearCart } = useCart();
    const [isProcessing, setIsProcessing] = useState(false);

    const {
        paymentMethod,
        cardInfo,
        errors,
        cardType,
        handlePayment,
        handlePaymentFieldChange,
        selectPaymentMethod,
    } = useCheckout(cart, totalPrice, clearCart);

    if (cart.length === 0) {
        return <Navigate to="/" replace />;
    }

    const handlePaymentClick = async () => {
        setIsProcessing(true);
        try {
            await handlePayment();
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <main className="min-h-[85vh] bg-slate-50/50 dark:bg-slate-950/20 py-6">
            <div className="mx-auto max-w-5xl px-4 sm:px-6">
                <div className="flex flex-col gap-6">
                    {/* Indicador visual de los pasos del proceso */}
                    <CheckoutSteps steps={STEPS} currentStep={2} />

                    {/* Encabezado con retorno y distintivo de seguridad */}
                    <CheckoutHeader />

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                        {/* Formulario de Pago (Columna izquierda) */}
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handlePaymentClick();
                            }}
                            className="lg:col-span-7 flex flex-col gap-5"
                            aria-label="Formulario de pago"
                        >
                            {/* Selector de Método de pago */}
                            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-card text-card-foreground shadow-sm p-4 sm:p-5">
                                <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                                    1. Método de pago
                                </h2>
                                <PaymentMethodSelector
                                    currentMethod={paymentMethod}
                                    onMethodChange={selectPaymentMethod}
                                />
                            </div>

                            {/* Datos de tarjeta o pasarela */}
                            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-card text-card-foreground shadow-sm p-4 sm:p-5">
                                <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                                    2. Información de pago
                                </h2>
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

                            {/* Botón de confirmación y badges de seguridad */}
                            <PaymentSubmitButton
                                isDisabled={cart.length === 0}
                                isProcessing={isProcessing}
                                method={paymentMethod}
                            />

                            <SecurityBadge />
                        </form>

                        {/* Resumen del pedido (Columna derecha) */}
                        <aside className="lg:col-span-5 lg:sticky lg:top-24">
                            <OrderSummary
                                items={cart}
                                totalPrice={totalPrice}
                                onRemove={removeFromCart}
                            />
                        </aside>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Checkout;
