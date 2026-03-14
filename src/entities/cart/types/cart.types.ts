import type { IProduct } from '@/features/products/application/types'

export interface CartItem {
  id: number
  title: string
  price: number
  quantity: number
  thumbnail: string
  stock: number
}

export interface CartState {
  items: CartItem[]
  isOpen: boolean
}

export interface CartSummary {
  totalItems: number
  totalPrice: number
  itemCount: number
}

export interface CartContextValue {
  cart: CartItem[]
  isCartOpen: boolean
  totalPrice: number
  addToCart: (product: IProduct, quantity: number) => void
  removeFromCart: (productId: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
}

export interface CartProviderProps {
  children: React.ReactNode
}

export interface IValidationResult {
  isValid: boolean
  error: string | null
}
