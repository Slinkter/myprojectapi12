/**
 * @file PaymentMethodRadio.tsx
 * @description Botón de selección de método de pago accesible.
 * Estilo de tarjeta seleccionable con estados visuales claros.
 * @architecture Presentation Layer - Checkout Components
 */
import { KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

/**
 * @interface PaymentMethodRadioProps
 * @property {string} id - ID único para el input y label
 * @property {string} label - Texto a mostrar en el botón
 * @property {boolean} checked - Si este método es el seleccionado
 * @property {function} onChange - Handler al seleccionar este método
 */
interface IPaymentMethodRadioProps {
    id: string;
    label: string;
    checked: boolean;
    onChange: () => void;
}

/**
 * Componente de opción de método de pago.
 * Accesible mediante teclado (Enter/Space).
 *
 * @component
 */
const PaymentMethodRadio = ({
    id,
    label,
    checked,
    onChange,
}: IPaymentMethodRadioProps) => {
    const handleKeyDown = (e: KeyboardEvent<HTMLLabelElement>) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onChange();
        }
    };

    return (
        <div className="relative">
            <input
                id={id}
                type="radio"
                name="paymentMethod"
                className="sr-only" // Usar sr-only para accesibilidad sin romper layout
                checked={checked}
                onChange={onChange}
                aria-label={`Pagar con ${label}`}
            />
            <label
                htmlFor={id}
                className={cn(
                    "flex flex-col items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 h-full",
                    "hover:shadow-lg hover:border-amber-300 dark:hover:border-amber-900 group",
                    checked
                        ? "border-amber-500 bg-amber-50/50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 shadow-inner"
                        : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800",
                    "focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2",
                )}
                role="button"
                tabIndex={0}
                onKeyDown={handleKeyDown}
            >
                {/* Simulated Icon based on label */}
                <div
                    className={cn(
                        "mb-3 text-2xl transition-transform duration-300",
                        checked
                            ? "scale-110"
                            : "scale-100 grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100",
                    )}
                >
                    {id === "visa" && (
                        <span className="font-serif italic font-black text-blue-700 dark:text-blue-400 text-xl tracking-tighter">
                            VISA
                        </span>
                    )}
                    {id === "mastercard" && (
                        <div className="flex -space-x-2">
                            <div className="w-6 h-6 rounded-full bg-red-500/90 shadow-sm border border-white/10"></div>
                            <div className="w-6 h-6 rounded-full bg-amber-500/90 shadow-sm border border-white/10"></div>
                        </div>
                    )}
                    {id === "bitcoin" && (
                        <span className="text-orange-500 font-bold">₿</span>
                    )}
                </div>

                <span className="text-xs font-bold uppercase tracking-widest">
                    {label}
                </span>

                {checked && (
                    <div className="absolute top-3 right-3 text-amber-500 animate-in zoom-in duration-300">
                        <svg
                            className="w-5 h-5 drop-shadow-sm"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                )}
            </label>
        </div>
    );
};

export default PaymentMethodRadio;
