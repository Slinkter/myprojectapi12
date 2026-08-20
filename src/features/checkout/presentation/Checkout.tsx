/**
 * @file Checkout.tsx
 * @description Página principal del proceso de pago con formulario interactivo y resumen en tiempo real.
 * @architecture Capa de Presentación - Feature de Checkout
 */
import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
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
import { useAuth } from "@/features/auth/application/AuthContext";
import { LoginModal } from "@/features/auth/presentation/LoginModal";
import Loader from "@/shared/ui/Loader";
import { ShieldCheck } from "lucide-react";

/**
 * Pasos del proceso de checkout para el componente CheckoutSteps.
 * @type {string[]}
 */
const STEPS = ["Carrito", "Envío", "Pago"];

/**
 * Componente principal de la página de checkout.
 * Muestra el formulario de pago y el resumen del pedido.
 * Redirige al inicio si el carrito está vacío.
 */
const Checkout = () => {
    useLogLifecycle("Checkout");
    const { cart, totalPrice, removeFromCart, clearCart } = useCart();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const { user, loading } = useAuth();

    const {
        paymentMethod,
        cardInfo,
        errors,
        cardType,
        handlePayment,
        handlePaymentFieldChange,
        selectPaymentMethod,
    } = useCheckout(cart, totalPrice, clearCart);

    if (loading) {
        return <Loader />;
    }

    if (!user) {
        return (
            <div className="min-h-[70vh] py-16 px-4 max-w-lg mx-auto flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                    <ShieldCheck size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                    Inicia sesión para continuar
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                    Para registrar tu pedido de forma segura y asociar la compra a tu cuenta, por favor inicia sesión o crea una cuenta gratuita.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <button
                        onClick={() => setIsAuthModalOpen(true)}
                        className="flex-1 h-11 px-6 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-hover shadow-lg shadow-primary/25 cursor-pointer transition-all flex items-center justify-center"
                    >
                        Iniciar Sesión / Registro
                    </button>
                    <Link
                        to="/"
                        className="flex-1 h-11 px-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-bold text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center cursor-pointer transition-all no-underline"
                    >
                        Volver a la tienda
                    </Link>
                </div>
                <LoginModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
            </div>
        );
    }

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
