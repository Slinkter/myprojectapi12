import { HiOutlineShoppingBag, HiOutlineCube, HiOutlineTruck } from 'react-icons/hi2'
import type { CartItem } from '@/entities/cart/types/cart.types'
import { cn } from '@/shared/lib/cn'
import { OrderItemRow } from './OrderItemRow'
import { DiscountInput } from './DiscountInput'
import { AppliedDiscountBadge } from './AppliedDiscountBadge'
import { PriceRow } from './PriceRow'
import { useDiscountValidation, calculateDiscountAmount } from '@/features/checkout/application/useDiscountValidation'

interface IOrderSummaryProps {
  items: CartItem[]
  totalPrice: number
  className?: string
}

export function OrderSummary({ items, totalPrice, className }: IOrderSummaryProps) {
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
  const shipping = totalPrice >= 50 ? 0 : 9.99
  const discountAmount = calculateDiscountAmount(appliedDiscount, totalPrice)
  const discountedSubtotal = totalPrice - discountAmount
  const finalTotal = discountedSubtotal + shipping

  return (
    <div
      className={cn(
        'bg-card rounded-2xl p-6 border border-border shadow-soft',
        className
      )}
    >
      <h3 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2">
        <HiOutlineShoppingBag className="w-5 h-5 text-primary" />
        Resumen del Pedido
      </h3>

      <div className="space-y-3 mb-6">
        {items.map((item) => (
          <OrderItemRow key={item.id} item={item} />
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

      <div className="border-t border-border pt-4 space-y-2">
        <PriceRow
          label={
            <span className="flex items-center gap-2">
              <HiOutlineCube className="w-4 h-4" />
              Subtotal ({totalItems} productos)
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
          label={
            <span className="flex items-center gap-2">
              <HiOutlineTruck className="w-4 h-4" />
              Envío
            </span>
          }
          value={
            shipping === 0 ? (
              <span className="text-success">GRATIS</span>
            ) : (
              `$${shipping.toFixed(2)}`
            )
          }
          variant={shipping === 0 ? 'success' : 'default'}
        />

        {shipping > 0 && (
          <p className="text-xs text-warning bg-warning/10 p-2 rounded-lg">
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
