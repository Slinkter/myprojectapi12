/**
 * @file OrderSummary.tsx
 * @description Componente de resumen del pedido con lista de items, descuentos y totales.
 * @architecture Capa de Presentación - Componente de Checkout
 */

import { ShoppingBag } from 'lucide-react'
import { useLogLifecycle } from "@/shared/hooks";
import type { ICartItem } from '@/features/cart/domain/cartTypes';
import { OrderItemRow } from './OrderItemRow'
import { DiscountInput } from './DiscountInput'
import { AppliedDiscountBadge } from './AppliedDiscountBadge'
import { PriceRow } from './PriceRow'
import { useDiscountValidation, calculateDiscountAmount } from '@/features/checkout/application/useDiscountValidation'

/**
 * @interface IOrderSummaryProps
 * @description Propiedades del componente OrderSummary.
 */
export interface IOrderSummaryProps {
  /** Items del carrito a mostrar en el resumen */
  items: ICartItem[]
  /** Precio total del carrito */
  totalPrice: number
  /** Callback opcional para eliminar un item */
  onRemove?: (id: number) => void
  /** Estilos en línea opcionales */
  style?: React.CSSProperties
}

/**
 * Componente que muestra el resumen completo del pedido incluyendo:
 * lista de productos, input de código de descuento, badge de descuento aplicado,
 * subtotal, descuento, envío y total final.
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
  } = useDiscountValidation()

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0)
  const hasItems = totalItems > 0
  const shipping = hasItems && totalPrice >= 50 ? 0 : hasItems ? 9.99 : 0
  const discountAmount = calculateDiscountAmount(appliedDiscount, totalPrice)
  const discountedSubtotal = totalPrice - discountAmount
  const finalTotal = discountedSubtotal + shipping

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-card text-card-foreground shadow-sm p-4" style={style}>
      <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
        <ShoppingBag className="h-4 w-4" />
        Resumen del Pedido
      </h3>

      <div className="flex flex-col gap-2 mb-4">
        {items.map((item) => (
          <OrderItemRow 
            key={item.id} 
            item={item} 
            onRemove={onRemove || (() => {})}
          />
        ))}
      </div>

      {!appliedDiscount && (
        <DiscountInput
          code={code}
          isApplying={isApplying}
          error={error}
          onApply={applyDiscount}
          onChange={setCode}
        />
      )}

      {appliedDiscount && (
        <AppliedDiscountBadge
          discount={appliedDiscount}
          onRemove={removeDiscount}
        />
      )}

      <div className="flex flex-col gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
        <PriceRow
          label={`Subtotal (${totalItems})`}
          value={`$${totalPrice.toFixed(2)}`}
        />

        {discountAmount > 0 && (
          <PriceRow
            label="Descuento"
            value={`-$${discountAmount.toFixed(2)}`}
            variant="success"
          />
        )}

        <PriceRow
          label="Envío"
          value={
            shipping === 0 ? (
              <span className="text-green-600 font-medium">GRATIS</span>
            ) : (
              `$${shipping.toFixed(2)}`
            )
          }
          variant={shipping === 0 ? 'success' : 'default'}
        />

        {hasItems && shipping > 0 && totalPrice < 50 && (
          <span className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/50 p-2 rounded-lg block font-medium">
            ¡Agrega ${(50 - totalPrice).toFixed(2)} más para envío gratis!
          </span>
        )}

        <PriceRow
          label="Total"
          value={`$${finalTotal.toFixed(2)}`}
          variant="highlight"
        />
      </div>
    </div>
  )
}