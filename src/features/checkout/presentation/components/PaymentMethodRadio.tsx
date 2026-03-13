/**
 * @file PaymentMethodRadio.tsx
 * @description Botón de selección de método de pago accesible.
 * Estilo de tarjeta seleccionable con estados visuales claros.
 * @architecture Presentation Layer - Checkout Components
 */
import { KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import { HiCheckCircle } from "react-icons/hi2";
import { FaBitcoin } from "react-icons/fa";

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
                    "hover:shadow-lg hover:border-primary/50 group",
                    checked
                        ? "border-primary bg-primary/10 text-primary shadow-inner"
                        : "border-border bg-card text-muted-foreground hover:bg-accent",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
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
                        <FaBitcoin className="text-orange-500 w-7 h-7" />
                    )}
                </div>

                <span className="text-xs font-bold uppercase tracking-widest">
                    {label}
                </span>

                {checked && (
                    <div className="absolute top-3 right-3 text-primary animate-in zoom-in duration-300">
                        <HiCheckCircle className="w-6 h-6 drop-shadow-sm" />
                    </div>
                )}
            </label>
        </div>
    );
};

export default PaymentMethodRadio;
