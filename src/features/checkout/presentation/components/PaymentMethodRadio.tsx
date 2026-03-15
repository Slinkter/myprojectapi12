import { KeyboardEvent } from "react";
import { useLogLifecycle } from "@/shared/hooks";
import { cn } from "@/lib/utils";
import { HiCheckCircle } from "react-icons/hi2";
import { FaBitcoin } from "react-icons/fa";

interface IPaymentMethodRadioProps {
    id: string;
    label: string;
    checked: boolean;
    onChange: () => void;
}

const PaymentMethodRadio = ({
    id,
    label,
    checked,
    onChange,
}: IPaymentMethodRadioProps) => {
    useLogLifecycle("PaymentMethodRadio");
    const handleKeyDown = (e: KeyboardEvent<HTMLLabelElement>) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onChange();
        }
    };

    return (
        <div className="relative h-full">
            <input
                id={id}
                type="radio"
                name="paymentMethod"
                className="sr-only"
                checked={checked}
                onChange={onChange}
                aria-label={`Pagar con ${label}`}
            />
            <label
                htmlFor={id}
                className={cn(
                    "flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 h-24",
                    checked
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                )}
                role="button"
                tabIndex={0}
                onKeyDown={handleKeyDown}
            >
                <div className="flex items-center justify-center mb-1">
                    {id === "visa" && (
                        <span className="font-bold text-blue-600 text-sm">VISA</span>
                    )}
                    {id === "mastercard" && (
                        <div className="flex -space-x-1">
                            <div className="w-4 h-4 rounded-full bg-red-500"></div>
                            <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                        </div>
                    )}
                    {id === "bitcoin" && (
                        <FaBitcoin className="text-orange-500 w-5 h-5" />
                    )}
                </div>
                <span className="text-xs font-medium">{label}</span>
                {checked && (
                    <HiCheckCircle className="absolute top-2 right-2 w-4 h-4 text-primary" />
                )}
            </label>
        </div>
    );
};

export default PaymentMethodRadio;
