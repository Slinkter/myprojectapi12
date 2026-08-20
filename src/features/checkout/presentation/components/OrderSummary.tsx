/**
 * @file OrderSummary.tsx
 * @description Componente de resumen del pedido con lista de items, descuentos y totales con cifras tabulares.
 * @architecture Capa de Presentación - Componente de Checkout
 */

import { ShoppingBag, Sparkles, Truck } from 'lucide-react';
import { useLogLifecycle } from "@/shared/hooks";
import type { ICartItem } from '@/features/cart/domain/cartTypes';
import { OrderItemRow } from '@features/checkout/presentation/components/OrderItemRow';
import { DiscountInput } from '@features/checkout/presentation/components/DiscountInput';
import { AppliedDiscountBadge } from '@features/checkout/presentation/components/AppliedDiscountBadge';
import { PriceRow } from '@features/checkout/presentation/components/PriceRow';
import { useDiscountValidation, calculateDiscountAmount } from '@/features/checkout/application/useDiscountValidation';

/**
 * @interface IOrderSummaryProps
 * @description Propiedades del componente OrderSummary.
 */
export interface IOrderSummaryProps {
  /** Items del carrito a mostrar en el resumen */
  items: ICartItem[];
  /** Precio total del carrito */
  totalPrice: number;
  /** Callback opcional para eliminar un item */
  onRemove?: (id: number) => void;
  /** Estilos en línea opcionales */
  style?: React.CSSProperties;
}

/**
 * Componente que muestra el resumen completo del pedido incluyendo:
 * lista de productos con scroll suave, input de código de descuento con sugerencias rápidas,
 * badge de cupón aplicado, barra de progreso para envío gratis y totales con cifras tabulares.
 *
 * @param {IOrderSummaryProps} props - Propiedades del componente.
 * @returns {JSX.Element} Resumen del pedido.
 */
export function OrderSummary({ items, totalPrice, onRemove, style }: IOrderSummaryProps) {
  useLogLifecycle("OrderSummary");
  const {
    code,
    setCode,
    appliedDiscount,
    error,
    isApplying,
    applyDiscount,
    removeDiscount,
  } = useDiscountValidation();

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const hasItems = totalItems > 0;
  const isFreeShipping = hasItems && totalPrice >= 50;
  const shipping = isFreeShipping ? 0 : hasItems ? 9.99 : 0;
  const discountAmount = calculateDiscountAmount(appliedDiscount, totalPrice);
  const discountedSubtotal = Math.max(0, totalPrice - discountAmount);
  const finalTotal = discountedSubtotal + shipping;

  const progressToFreeShipping = Math.min(100, Math.round((totalPrice / 50) * 100));

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-card text-card-foreground shadow-sm p-4 sm:p-5" style={style}>
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800/80">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <ShoppingBag className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          Resumen del Pedido
        </h3>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          {totalItems} {totalItems === 1 ? 'artículo' : 'artículos'}
        </span>
      </div>

      {/* Lista de productos */}
      <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1 mb-4 scrollbar-thin">
        {items.map((item) => (
          <OrderItemRow 
            key={item.id} 
            item={item} 
            onRemove={onRemove || (() => {})}
          />
        ))}
      </div>

      {/* Cupón de descuento */}
      {!appliedDiscount ? (
        <DiscountInput
          code={code}
          isApplying={isApplying}
          error={error}
          onApply={applyDiscount}
          onChange={setCode}
        />
      ) : (
        <AppliedDiscountBadge
          discount={appliedDiscount}
          onRemove={removeDiscount}
        />
      )}

      {/* Indicador de envío gratis */}
      {hasItems && (
        <div className="mb-4 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 text-xs">
          <div className="flex items-center justify-between mb-1.5 font-medium">
            <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <Truck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              {isFreeShipping ? '¡Envío gratuito conseguido!' : `Faltan $${(50 - totalPrice).toFixed(2)} para envío gratis`}
            </span>
            <span className="font-bold tabular-nums text-slate-500 dark:text-slate-400">{progressToFreeShipping}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressToFreeShipping}%` }}
            />
          </div>
        </div>
      )}

      {/* Desglose de precios */}
      <div className="flex flex-col gap-1.5 pt-3 border-t border-slate-200 dark:border-slate-800">
        <PriceRow
          label={`Subtotal`}
          value={`$${totalPrice.toFixed(2)}`}
        />

        {discountAmount > 0 && (
          <PriceRow
            label={
              <span className="flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                Descuento
              </span>
            }
            value={`-$${discountAmount.toFixed(2)}`}
            variant="success"
          />
        )}

        <PriceRow
          label="Envío estándar"
          value={
            isFreeShipping ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold tracking-wide">
                GRATIS
              </span>
            ) : (
              `$${shipping.toFixed(2)}`
            )
          }
          variant={isFreeShipping ? 'success' : 'default'}
        />

        <PriceRow
          label="Total a pagar"
          value={`$${finalTotal.toFixed(2)}`}
          variant="highlight"
        />
      </div>
    </div>
  );
}