import { useState, useCallback } from 'react'
import { useCartItems } from './useCartItems'
import { useCartSummary } from './useCartSummary'

export function useCart() {
  const { items, addItem, removeItem, updateQuantity, clearCart } = useCartItems()
  const { totalItems, totalPrice } = useCartSummary(items)
  const [isCartOpen, setIsCartOpen] = useState(false)

  const openCart = useCallback(() => setIsCartOpen(true), [])
  const closeCart = useCallback(() => setIsCartOpen(false), [])
  const toggleCart = useCallback(() => setIsCartOpen(prev => !prev), [])

  return {
    cart: items,
    items,
    totalItems,
    totalPrice,
    isCartOpen,
    addItem,
    removeItem,
    removeFromCart: removeItem,
    updateQuantity,
    clearCart,
    openCart,
    closeCart,
    toggleCart,
  }
}
