import { ArrowRight, Trash2, Truck } from "lucide-react";
import { Button } from "@/shared/ui/Button";
import { useLogLifecycle } from "@/shared/hooks";

const priceFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const formatPrice = (price: number): string => priceFormatter.format(price);

/** Umbral en dólares para obtener envío gratuito */
const FREE_SHIPPING_THRESHOLD = 50;
/** Costo estándar de envío */
const SHIPPING_COST = 9.99;

/**
 * @interface CartFooterProps
 * @description Propiedades del componente CartFooter.
 */
export interface CartFooterProps {
  /** Precio total de los productos en el carrito */
  totalPrice: number;
  /** Función para proceder al checkout / pasarela de pago */
  onCheckout: () => void;
  /** Función para vaciar todos los artículos del carrito */
  onClearCart: () => void;
}

/**
 * @component CartFooter
 * @description Pie del drawer del carrito con desglose detallado de precios (subtotal,
 * cálculo de envío con barra de progreso a envío gratis, total final) y botones de acción
 * de alta conversión para checkout y vaciado.
 *
 * @param {CartFooterProps} props - Propiedades del componente
 * @returns {JSX.Element} Pie del carrito con resumen y acciones
 */
export const CartFooter = ({
  totalPrice,
  onCheckout,
  onClearCart,
}: CartFooterProps) => {
  useLogLifecycle("CartFooter");

  const isFreeShipping = totalPrice >= FREE_SHIPPING_THRESHOLD;
  const shippingFee = isFreeShipping ? 0 : SHIPPING_COST;
  const grandTotal = totalPrice + shippingFee;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - totalPrice);
  const freeShippingProgress = Math.min(100, (totalPrice / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <div className="shrink-0 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 backdrop-blur-xs">
      {/* ── Desglose de Precios ── */}
      <div className="px-5 pt-4 pb-3 flex flex-col gap-2.5">
        {/* Banner de progreso para envío gratis */}
        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-300">
              <Truck size={14} className={isFreeShipping ? "text-emerald-500" : "text-amber-500"} />
              {isFreeShipping ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  ¡Envío gratuito aplicado!
                </span>
              ) : (
                <span>
                  Faltan <strong className="text-slate-800 dark:text-slate-100 tabular-nums">{formatPrice(remainingForFreeShipping)}</strong> para envío gratis
                </span>
              )}
            </span>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tabular-nums">
              {Math.round(freeShippingProgress)}%
            </span>
          </div>

          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                isFreeShipping
                  ? "bg-emerald-500"
                  : "bg-gradient-to-r from-amber-400 to-emerald-500"
              }`}
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Filas de Subtotal y Envío */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
          <span>Subtotal</span>
          <span className="font-semibold text-slate-700 dark:text-slate-200 tabular-nums">
            {formatPrice(totalPrice)}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Envío</span>
          <span className="font-semibold tabular-nums">
            {isFreeShipping ? (
              <span className="text-emerald-600 dark:text-emerald-400">Gratis</span>
            ) : (
              <span className="text-slate-700 dark:text-slate-200">{formatPrice(SHIPPING_COST)}</span>
            )}
          </span>
        </div>

        <div className="h-px bg-slate-200/80 dark:border-slate-800 my-0.5" />

        {/* Total Final */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-100 block leading-tight">
              Total
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500">
              Impuestos incluidos
            </span>
          </div>
          <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
            {formatPrice(grandTotal)}
          </span>
        </div>
      </div>

      {/* ── Botones de Acción (CTA) ── */}
      <div className="px-4 pb-5 pt-1 flex flex-col gap-2">
        <Button
          onClick={onCheckout}
          className="w-full h-11 rounded-xl text-sm font-bold gap-2 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:scale-[1.01] active:scale-[0.99] transition-[transform,colors,box-shadow] cursor-pointer"
        >
          <span>Proceder al Pago</span>
          <ArrowRight size={15} />
        </Button>

        <button
          type="button"
          onClick={onClearCart}
          className="w-full h-8 flex items-center justify-center gap-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer border-none bg-transparent"
        >
          <Trash2 size={12} />
          Vaciar carrito
        </button>
      </div>
    </div>
  );
};
