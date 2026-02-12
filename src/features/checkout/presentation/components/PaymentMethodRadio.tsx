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
interface PaymentMethodRadioProps {
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
}: PaymentMethodRadioProps) => {
    const handleKeyDown = (e: KeyboardEvent<HTMLLabelElement>) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onChange();
        }
    };

    return (
        <div className={cn("relative")}>
            <input
                id={id}
                type="radio"
                name="paymentMethod"
                className={cn("sr-only")} // Usar sr-only para accesibilidad sin romper layout
                checked={checked}
                onChange={onChange}
                aria-label={`Pay with ${label}`}
            />
            <label
                htmlFor={id}
                className={cn(
                    "flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 h-full",
                    "hover:shadow-md hover:border-amber-300 dark:hover:border-amber-700",
                    checked 
                        ? "border-amber-500 bg-amber-50/50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 shadow-sm" 
                        : "border-(--border-light) bg-(--bg-card) text-(--text-secondary) hover:bg-(--bg-input)/50",
                    "focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                )}
                role="button"
                tabIndex={0}
                onKeyDown={handleKeyDown}
            >
                {/* Simulated Icon based on label */}
                <div className={cn(
                    "mb-2 text-2xl transition-transform duration-300",
                    checked ? "scale-110" : "scale-100"
                )}>
                    {id === 'visa' && <span className="font-serif italic font-bold text-blue-800 dark:text-blue-400">Visa</span>}
                    {id === 'mastercard' && (
                        <div className="flex -space-x-2">
                            <div className="w-6 h-6 rounded-full bg-red-500/80 mix-blend-multiply dark:mix-blend-screen"></div>
                            <div className="w-6 h-6 rounded-full bg-yellow-500/80 mix-blend-multiply dark:mix-blend-screen"></div>
                        </div>
                    )}
                    {id === 'bitcoin' && <span className="text-orange-500">₿</span>}
                </div>
                
                <span className={cn("text-sm font-semibold")}>{label}</span>
                
                {checked && (
                    <div className={cn("absolute top-2 right-2 text-amber-500")}>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                    </div>
                )}
            </label>
        </div>
    );
};

export default PaymentMethodRadio;
