import { BackpackIcon } from '@radix-ui/react-icons'
import { Card, Heading, Flex, Text } from '@radix-ui/themes'
import { useLogLifecycle } from "@/shared/hooks";
import type { ICartItem } from '@/features/cart/domain/cartTypes';
import { OrderItemRow } from './OrderItemRow'
import { DiscountInput } from './DiscountInput'
import { AppliedDiscountBadge } from './AppliedDiscountBadge'
import { PriceRow } from './PriceRow'
import { useDiscountValidation, calculateDiscountAmount } from '@/features/checkout/application/useDiscountValidation'

interface IOrderSummaryProps {
  items: ICartItem[]
  totalPrice: number
  onRemove?: (id: number) => void
  style?: React.CSSProperties
}

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
    <Card size="2" style={style}>
      <Heading size="3" mb="3" style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
        <BackpackIcon />
        Resumen del Pedido
      </Heading>

      <Flex direction="column" gap="2" mb="4">
        {items.map((item) => (
          <OrderItemRow 
            key={item.id} 
            item={item} 
            onRemove={onRemove || (() => {})}
          />
        ))}
      </Flex>

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

      <Flex direction="column" gap="2" pt="3" style={{ borderTop: "1px solid var(--gray-5)" }}>
        <PriceRow
          label={
            <Text size="1" color="gray">
              Subtotal ({totalItems})
            </Text>
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
              <Text color="green" weight="medium">GRATIS</Text>
            ) : (
              `$${shipping.toFixed(2)}`
            )
          }
          variant={shipping === 0 ? 'success' : 'default'}
        />

        {hasItems && shipping > 0 && totalPrice < 50 && (
          <Text size="1" color="amber" style={{ backgroundColor: "var(--amber-2)", padding: "var(--space-2)", borderRadius: "var(--radius-2)", display: "block" }}>
            ¡Agrega ${(50 - totalPrice).toFixed(2)} más para envío gratis!
          </Text>
        )}

        <PriceRow
          label="Total"
          value={`$${finalTotal.toFixed(2)}`}
          variant="highlight"
        />
      </Flex>
    </Card>
  )
}
