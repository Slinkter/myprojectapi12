import { CheckCircle } from "lucide-react";
import { FaBitcoin } from "react-icons/fa";
import { cn } from "@/shared/lib/cn";
import { useLogLifecycle } from "@/shared/hooks";

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

    return (
        <div
            onClick={onChange}
            className={cn(
                "cursor-pointer relative h-24 flex flex-col items-center justify-center transition-all duration-200 rounded-xl border-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30",
                checked
                    ? "border-emerald-600 dark:border-emerald-500 bg-emerald-50/10 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400"
                    : "border-slate-200 dark:border-slate-800 bg-card text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900"
            )}
            role="radio"
            aria-checked={checked}
            aria-label={label}
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") {
                    e.preventDefault();
                    onChange();
                }
            }}
        >
            <div className="flex flex-col items-center justify-center gap-1">
                <div aria-hidden="true">
                    {id === "visa" && (
                        <span className="font-extrabold text-blue-600 dark:text-blue-400 text-sm tracking-wider">VISA</span>
                    )}
                    {id === "mastercard" && (
                        <div className="flex relative">
                            <div className="w-4 h-4 rounded-full bg-red-500" />
                            <div className="w-4 h-4 rounded-full bg-amber-500 -ml-1.5" />
                        </div>
                    )}
                    {id === "bitcoin" && (
                        <FaBitcoin className="text-amber-500 w-5 h-5" />
                    )}
                </div>
                <span className="text-xs font-semibold">{label}</span>
            </div>
            {checked && (
                <div aria-hidden="true" className="absolute top-2 right-2 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle className="h-4 w-4" />
                </div>
            )}
        </div>
    );
};

export default PaymentMethodRadio;