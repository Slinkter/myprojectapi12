import { useLocalStorage } from '@/shared/hooks/useLocalStorage'
import type { CartItem } from '@/entities/cart/types/cart.types'
import type { IProduct } from '@/features/products/application/types'

export function useCartItems() {
  const [items, setItems] = useLocalStorage<CartItem[]>('cart-items', [])

  const addItem = (product: IProduct, quantity = 1) => {
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
        price: product.price,
        quantity,
        thumbnail: product.thumbnail,
        stock: product.stock,
      }]
    })
  }

  const removeItem = (productId: number) => {
    setItems(prev => prev.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }
    setItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => setItems([])

  return { items, addItem, removeItem, updateQuantity, clearCart }
}
