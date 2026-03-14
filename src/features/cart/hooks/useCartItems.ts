/**
 * @file useCartItems.ts
 * @description Hook para gestionar los items del carrito.
 * Usa useState con persistencia manual en localStorage.
 * @architecture Application Layer - Hook
 */

import { useState, useEffect, useCallback } from 'react'
import type { ICartItem } from '@/features/cart/domain/cartTypes'
import type { IProduct } from '@/features/products/application/types'

const CART_STORAGE_KEY = 'cart-items'

function getStoredCart(): ICartItem[] {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function useCartItems() {
  const [items, setItems] = useState<ICartItem[]>(() => getStoredCart())

  // Persistir en localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    } catch (error) {
      console.error('Error saving cart to localStorage:', error)
    }
  }, [items])

  const addItem = useCallback((product: IProduct, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, {
        id: product.id,
        title: product.title,
        description: product.description,
        price: product.price,
        quantity,
        thumbnail: product.thumbnail,
        stock: product.stock,
      }]
    })
  }, [])

  const removeItem = useCallback((productId: number) => {
    setItems(prev => prev.filter(item => item.id !== productId))
  }, [])

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }
    setItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    )
  }, [removeItem])

  const clearCart = useCallback(() => setItems([]), [])

  return { items, addItem, removeItem, updateQuantity, clearCart }
}
