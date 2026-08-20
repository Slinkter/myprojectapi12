/**
 * @file CheckoutSuccess.tsx
 * @description Pantalla de confirmación de pago y recibo detallado de la orden.
 * @architecture Capa de Presentación - Checkout
 */

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  CheckCircle2,
  Package,
  CreditCard,
  ArrowLeft,
  Copy,
  Check,
  Calendar,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/shared/ui/Button";
import { useLogLifecycle } from "@/shared/hooks";
import type { ICartItem } from "@/features/cart/domain/cartTypes";

/**
 * @interface OrderState
 * @description Estructura del estado de la orden completada proveniente de react-router.
 */
const getPaymentMethodDisplay = (method: string): string => {
  const normalized = method.toLowerCase();
  if (normalized === "visa") return "Tarjeta Visa";
  if (normalized === "mastercard") return "Tarjeta Mastercard";
  if (normalized === "bitcoin") return "Bitcoin (BitPay)";
  if (normalized === "credit_card") return "Tarjeta de crédito";
  if (normalized === "debit_card") return "Tarjeta de débito";
  return method;
};

interface OrderState {
  /** Identificador único de la orden generada */
  orderId: string;
  /** Lista de productos comprados */
  items: ICartItem[];
  /** Monto total pagado */
  total: number;
  /** Método de pago utilizado ("visa", "mastercard", "bitcoin", etc.) */
  paymentMethod: string;
}

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const formatPrice = (price: number): string => priceFormatter.format(price);

/**
 * Componente que muestra la pantalla de confirmación exitosa del pago.
 * Incluye recibo desglosado, botón para copiar el número de orden, detalles del método de pago
 * y botones de retorno a la tienda.
 *
 * @returns {JSX.Element} Vista de pago exitoso.
 */
const CheckoutSuccess = () => {
  useLogLifecycle("CheckoutSuccess");
  const location = useLocation();
  const state = location.state as OrderState | null;
  const [copied, setCopied] = useState(false);

  const handleCopyOrderId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback si clipboard API no está disponible
      setCopied(false);
    }
  };

  if (!state) {
    return (
      <div className="flex items-center justify-center p-4 min-h-[70vh]">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-card text-card-foreground shadow-lg p-8 max-w-[420px] w-full text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Package className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold mb-2">No hay pedido activo</h2>
          <p className="text-sm text-muted-foreground mb-6">
            No encontramos información de un pedido reciente. Visita nuestra tienda para descubrir productos.
          </p>
          <Link to="/" className="no-underline block">
            <Button className="w-full h-11 rounded-xl font-semibold">
              Explorar productos
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const { orderId, items, total, paymentMethod } = state;
  const purchaseDate = new Date().toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex items-center justify-center p-4 sm:p-6 min-h-[75vh]">
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-card text-card-foreground shadow-xl p-6 sm:p-8 max-w-[540px] w-full animate-in fade-in zoom-in-95 duration-300">
        {/* Cabecera de éxito */}
        <div className="text-center mb-6">
          <div
            aria-hidden="true"
            className="flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 mx-auto mb-4 ring-8 ring-emerald-50 dark:ring-emerald-950/20"
          >
            <CheckCircle2 className="w-9 h-9" strokeWidth={2} />
          </div>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 mb-2">
            ¡Pago Confirmado!
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            ¡Gracias por tu compra!
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-sm mx-auto">
            Hemos procesado tu pedido con éxito y comenzamos a prepararlo de inmediato.
          </p>
        </div>

        {/* Tarjeta de Recibo */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 p-4 sm:p-5 mb-6 space-y-4">
          {/* Número de orden con botón de copiado */}
          <div className="flex items-center justify-between bg-background p-3 rounded-lg border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-2 min-w-0">
              <Package className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">
                  Número de orden
                </span>
                <span className="font-mono text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 truncate block">
                  {orderId}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleCopyOrderId(orderId)}
              className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors shrink-0 cursor-pointer"
              title="Copiar número de orden al portapapeles"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-600 dark:text-emerald-400">¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>

          {/* Metadatos: Fecha y Método de pago */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-background border border-slate-200/60 dark:border-slate-800">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-slate-600 dark:text-slate-300 font-medium truncate">
                {purchaseDate}
              </span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-background border border-slate-200/60 dark:border-slate-800">
              <CreditCard className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-slate-600 dark:text-slate-300 font-medium truncate">
                {getPaymentMethodDisplay(paymentMethod)}
              </span>
            </div>
          </div>

          <div className="h-px bg-slate-200 dark:bg-slate-800" />

          {/* Desglose de artículos comprados */}
          <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between text-xs sm:text-sm"
              >
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  <div className="w-7 h-7 rounded bg-slate-200 dark:bg-slate-800 shrink-0 overflow-hidden">
                    <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-slate-700 dark:text-slate-300 truncate">
                    {item.title}
                    <span className="text-slate-400 dark:text-slate-500 ml-1.5 font-medium tabular-nums">
                      ×{item.quantity}
                    </span>
                  </span>
                </div>
                <span className="font-semibold text-slate-800 dark:text-slate-200 tabular-nums shrink-0">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="h-px bg-slate-200 dark:bg-slate-800" />

          {/* Total pagado */}
          <div className="flex items-center justify-between pt-1">
            <div>
              <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                Total Pagado
              </span>
              <span className="text-[11px] text-muted-foreground block">
                (Impuestos y envío incluidos)
              </span>
            </div>
            <span className="text-xl sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
              {formatPrice(total)}
            </span>
          </div>
        </div>

        {/* Garantía y confirmación */}
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-xs mb-6 font-medium">
          <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>Confirmación enviada al correo. Tu compra cuenta con 30 días de garantía.</span>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/" className="no-underline flex-1">
            <Button className="w-full h-11 rounded-xl font-semibold shadow-md gap-2">
              <ShoppingBag className="h-4 w-4" />
              Seguir comprando
            </Button>
          </Link>
          <Link to="/" className="no-underline flex-1">
            <Button
              variant="outline"
              className="w-full h-11 rounded-xl font-semibold gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al inicio
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
