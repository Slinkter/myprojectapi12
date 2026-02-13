/**
 * @file Checkout.tsx
 * @description Página principal del proceso de pago.
 * Rediseñada para una experiencia de usuario premium, segura y clara.
 * @architecture Capa de Presentación - Feature de Checkout
 */
import { Link } from "react-router-dom";
import { useCheckout } from "../application/useCheckout";
import PaymentMethodRadio from "./components/PaymentMethodRadio";
import CardForm from "./components/CardForm";
import { cn } from "@/lib/utils";
import { ArrowLeft, ShieldCheck, Lock } from "lucide-react";

/**
 * @component Checkout
 * @description Contenedor principal para la vista de Checkout.
 * Utiliza el hook useCheckout para manejar la lógica de negocio.
 *
 * @returns {JSX.Element} La página de checkout.
 */
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

    const showCardForm =
        paymentMethod === "visa" || paymentMethod === "mastercard";

    return (
        <main
            className={cn("checkout-page min-h-[80vh] flex items-center justify-center p-4")}
            role="main"
            aria-labelledby="checkout-title"
        >
            <div className={cn("w-full max-w-2xl bg-(--bg-card) rounded-3xl shadow-xl border border-(--border-light) overflow-hidden")}>
                
                {/* Cabecera */}
                <div className={cn("p-6 sm:p-8 border-b border-(--border-light) bg-(--bg-input)/30")}>
                    <div className={cn("flex items-center justify-between mb-4")}>
                        <Link 
                            to="/" 
                            className={cn("text-sm font-medium text-(--text-secondary) hover:text-(--text-primary) transition-colors flex items-center gap-1")}
                        >
                            <ArrowLeft className="w-4 h-4" /> Volver a la Tienda
                        </Link>
                        <div className={cn("flex items-center gap-2 text-green-600 dark:text-green-400 text-xs font-bold uppercase tracking-wider")}>
                            <ShieldCheck className="w-4 h-4" />
                            Pago Seguro
                        </div>
                    </div>
                    <h1
                        id="checkout-title"
                        className={cn("text-3xl font-extrabold text-(--text-primary) tracking-tight")}
                    >
                        Detalles de Pago
                    </h1>
                    <p className={cn("text-(--text-secondary) mt-2")}>
                        Complete su compra de forma segura.
                    </p>
                </div>

                <div className={cn("p-6 sm:p-8")}>
                    {/* Selector de Método de Pago */}
                    <div className={cn("mb-8")}>
                        <label className={cn("block text-sm font-semibold text-(--text-primary) mb-4 uppercase tracking-wide")}>
                            Seleccione Método de Pago
                        </label>
                        <fieldset className={cn("grid grid-cols-1 sm:grid-cols-3 gap-4")}>
                            <legend className={cn("sr-only")}>
                                Selección del método de pago
                            </legend>

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
                    <div className={cn("min-h-[300px] transition-all duration-300 ease-in-out")}>
                        {showCardForm ? (
                            <CardForm
                                cardInfo={cardInfo}
                                errors={errors}
                                cardType={cardType}
                                onChange={handleCardInfoChange}
                            />
                        ) : (
                            <div className={cn("flex flex-col items-center justify-center h-full py-12 bg-(--bg-input)/50 rounded-2xl border border-dashed border-(--border-light)")}>
                                <div className={cn("w-16 h-16 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center mb-4 text-3xl")}>
                                    ₿
                                </div>
                                <p className={cn("text-lg font-medium text-(--text-primary)")}>Pagar con Bitcoin</p>
                                <p className={cn("text-sm text-(--text-secondary) mt-1 text-center max-w-xs")}>
                                    Será redirigido a nuestra pasarela de pago cripto segura.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Botón de Pago */}
                    <button
                        onClick={handlePayment}
                        className={cn(
                            "w-full mt-8 py-4 px-6 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 transform active:scale-[0.98]",
                            isPaymentDisabled
                                ? "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none"
                                : "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-1"
                        )}
                        disabled={isPaymentDisabled}
                        aria-label={`Pagar ahora con ${paymentMethod}`}
                        aria-disabled={isPaymentDisabled}
                    >
                        {paymentMethod === 'bitcoin' ? 'Proceder al Pago Cripto' : 'Pagar Ahora'}
                    </button>
                    
                    <p className={cn("text-xs text-center text-(--text-secondary) mt-6 flex items-center justify-center gap-1")}>
                        <Lock className="w-3 h-3" />
                        Las transacciones están encriptadas y son seguras.
                    </p>
                </div>
            </div>
        </main>
    );
};

export default Checkout;
