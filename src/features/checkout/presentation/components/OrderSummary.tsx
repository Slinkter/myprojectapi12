import { HiOutlineShoppingBag } from 'react-icons/hi2'
import { useLogLifecycle } from "@/shared/hooks";
import type { CartItem } from '@/features/cart/domain/cartTypes';
import { cn } from '@/shared/lib/cn'
import { OrderItemRow } from './OrderItemRow'
import { DiscountInput } from './DiscountInput'
import { AppliedDiscountBadge } from './AppliedDiscountBadge'
import { PriceRow } from './PriceRow'
import { useDiscountValidation, calculateDiscountAmount } from '@/features/checkout/application/useDiscountValidation'

interface IOrderSummaryProps {
  items: CartItem[]
  totalPrice: number
  onRemove?: (id: number) => void
  className?: string
}

export function OrderSummary({ items, totalPrice, onRemove, className }: IOrderSummaryProps) {
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
    <div
      className={cn(
        'bg-background border border-border rounded-2xl p-4',
        className
      )}
    >
      <h3 className="font-bold text-base text-foreground mb-3 flex items-center gap-2">
        <HiOutlineShoppingBag className="w-4 h-4 text-primary" />
        Resumen del Pedido
      </h3>

      <div className="space-y-2 mb-4">
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

      <div className="border-t border-border pt-3 space-y-2">
        <PriceRow
          label={
            <span className="text-xs text-muted-foreground">
              Subtotal ({totalItems})
            </span>
          }
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
              <span className="text-success font-medium">GRATIS</span>
            ) : (
              `$${shipping.toFixed(2)}`
            )
          }
          variant={shipping === 0 ? 'success' : 'default'}
        />

        {hasItems && shipping > 0 && totalPrice < 50 && (
          <p className="text-xs text-warning bg-warning/10 p-2 rounded">
            ¡Agrega ${(50 - totalPrice).toFixed(2)} más para envío gratis!
          </p>
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
