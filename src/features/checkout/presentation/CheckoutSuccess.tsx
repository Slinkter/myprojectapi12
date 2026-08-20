import { Link, useLocation } from "react-router-dom";
import React from "react";
import { CheckCircle2, Package, CreditCard, ArrowLeft } from "lucide-react";
import { Button } from "@/shared/ui/Button";
import { useLogLifecycle } from "@/shared/hooks";
import type { ICartItem } from "@/features/cart/domain/cartTypes";

const priceFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

const formatPrice = (price: number): string => priceFormatter.format(price);

interface OrderState {
    orderId: string;
    items: ICartItem[];
    total: number;
    paymentMethod: string;
}

const CheckoutSuccess: React.FC = () => {
    useLogLifecycle("CheckoutSuccess");
    const location = useLocation();
    const state = location.state as OrderState | null;

    if (!state) {
        return (
            <div className="flex items-center justify-center p-4 min-h-[70vh]">
                <div className="rounded-xl border bg-card text-card-foreground shadow p-8 max-w-[400px] w-full text-center">
                    <p className="text-sm text-muted-foreground mb-5">
                        No hay información de pedido disponible.
                    </p>
                    <Link to="/" className="no-underline">
                        <Button className="w-full h-11 rounded-xl font-semibold">
                            Volver a la tienda
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    const { orderId, items, total, paymentMethod } = state;

    return (
        <div className="flex items-center justify-center p-4 min-h-[70vh]">
            <div className="rounded-xl border bg-card text-card-foreground shadow p-6 sm:p-8 max-w-[480px] w-full">
                <div className="text-center">
                    <div
                        aria-hidden="true"
                        className="flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 mx-auto mb-4"
                    >
                        <CheckCircle2 className="w-8 h-8" strokeWidth={1.5} />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-semibold mb-1">
                        ¡Pago Exitoso!
                    </h2>
                    <p className="text-sm text-muted-foreground mb-5">
                        Gracias por tu compra. Tu pedido ha sido procesado.
                    </p>
                </div>

                <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-4 mb-5 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <Package size={14} />
                        <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                            {orderId}
                        </span>
                    </div>

                    <div className="h-px bg-slate-200 dark:bg-slate-800" />

                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between text-sm"
                        >
                            <span className="text-slate-700 dark:text-slate-300 truncate max-w-[60%]">
                                {item.title}
                                <span className="text-slate-400 dark:text-slate-500 ml-1">
                                    x{item.quantity}
                                </span>
                            </span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                                {formatPrice(item.price * item.quantity)}
                            </span>
                        </div>
                    ))}

                    <div className="h-px bg-slate-200 dark:bg-slate-800" />

                    <div className="flex items-center justify-between text-base">
                        <span className="font-bold text-slate-800 dark:text-slate-100">
                            Total
                        </span>
                        <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                            {formatPrice(total)}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <CreditCard size={14} />
                        <span className="capitalize">
                            {paymentMethod === "credit_card"
                                ? "Tarjeta de crédito"
                                : paymentMethod === "debit_card"
                                  ? "Tarjeta de débito"
                                  : paymentMethod}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <Link to="/" className="no-underline">
                        <Button className="w-full h-11 rounded-xl font-semibold">
                            Seguir comprando
                        </Button>
                    </Link>
                    <Link to="/" className="no-underline">
                        <Button
                            variant="ghost"
                            className="w-full h-11 rounded-xl font-semibold gap-2"
                        >
                            <ArrowLeft size={15} />
                            Volver al inicio
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CheckoutSuccess;
