/**
 * @file PaymentMethodRadio.tsx
 * @description Botón de selección de método de pago accesible.
 * Funciona como un radio button pero con estilos personalizados de botón.
 * @architecture Presentation Layer - Checkout Components
 */
import { KeyboardEvent } from "react";

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
        <div className="flex items-center">
            <input
                id={id}
                type="radio"
                name="paymentMethod"
                className="hidden"
                checked={checked}
                onChange={onChange}
                aria-label={`Pay with ${label}`}
            />
            <label
                htmlFor={id}
                className={`checkout-payment-method-button w-full text-center p-3 cursor-pointer focus-within:ring-2 focus-within:ring-amber-500 ${
                    checked ? "checkout-payment-method-button--pressed" : ""
                }`}
                role="button"
                tabIndex={0}
                onKeyDown={handleKeyDown}
            >
                {label}
            </label>
        </div>
    );
};

export default PaymentMethodRadio;
