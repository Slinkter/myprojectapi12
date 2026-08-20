/**
 * @file CheckoutHeader.tsx
 * @description Encabezado de la página de checkout con navegación de retorno e indicador de seguridad SSL.
 * @architecture Capa de Presentación - Checkout
 */

import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { useLogLifecycle } from "@/shared/hooks";

/**
 * Componente que renderiza el encabezado del checkout.
 * Incluye un botón de retroceso accesible, el título "Finalizar Compra" y un distintivo de pago seguro SSL.
 *
 * @returns {JSX.Element} Encabezado del checkout.
 */
const CheckoutHeader = () => {
  useLogLifecycle("CheckoutHeader");
  return (
    <header className="pb-4 border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between mb-2">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors no-underline rounded-lg px-2 py-1 -ml-2 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" /> Volver a la tienda
        </Link>
        <span className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 shadow-2xs">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          Pago Seguro SSL 256-bit
        </span>
      </div>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight" id="checkout-title">
        Finalizar Compra
      </h1>
      <p className="text-xs sm:text-sm text-muted-foreground mt-1">
        Completa los datos de pago para procesar tu orden de forma segura
      </p>
    </header>
  );
};

export default CheckoutHeader;