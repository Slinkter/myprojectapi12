import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useLogLifecycle } from "@/shared/hooks";

const CheckoutHeader = () => {
  useLogLifecycle("CheckoutHeader");
  return (
    <div className="p-4 border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between mb-3">
        <Link
          to="/"
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 transition-colors no-underline"
        >
          <ArrowLeft className="h-4 w-4" /> Volver
        </Link>
        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900">
          Pago Seguro
        </span>
      </div>
      <h1 className="text-3xl font-bold" id="checkout-title">
        Checkout
      </h1>
      <p className="text-sm text-muted-foreground mt-1">
        Completa los datos para realizar tu pago
      </p>
    </div>
  );
};

export default CheckoutHeader;