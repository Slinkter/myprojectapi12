import type { CartItem } from '@/entities/cart/types/cart.types'

export function useCartSummary(items: CartItem[]) {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  return { totalItems, totalPrice }
}
