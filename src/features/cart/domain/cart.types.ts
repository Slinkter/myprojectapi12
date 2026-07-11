import type { IProduct } from '@/features/products/application/types'

/**
 * @interface CartItem
 * @description Artículo individual dentro del carrito de compras.
 * Contiene los datos del producto y la cantidad seleccionada.
 */
export interface CartItem {
  /** Identificador único del producto */
  id: number
  /** Nombre del producto */
  title: string
  /** Precio unitario del producto */
  price: number
  /** Cantidad de unidades en el carrito */
  quantity: number
  /** URL de la imagen miniatura del producto */
  thumbnail: string
  /** Stock disponible del producto */
  stock: number
}

/**
 * @interface CartState
 * @description Estado global del carrito de compras.
 * Almacena los artículos y el estado de visibilidad del drawer.
 */
export interface CartState {
  /** Lista de artículos en el carrito */
  items: CartItem[]
  /** Indica si el drawer del carrito está abierto */
  isOpen: boolean
}

/**
 * @interface CartSummary
 * @description Resumen numérico del carrito con totales calculados.
 */
export interface CartSummary {
  /** Cantidad total de unidades sumando todos los artículos */
  totalItems: number
  /** Precio total del carrito */
  totalPrice: number
  /** Número de artículos distintos en el carrito */
  itemCount: number
}

/**
 * @interface CartContextValue
 * @description Valor del contexto del carrito de compras.
 * Expone el estado del carrito y todas las acciones disponibles.
 */
export interface CartContextValue {
  /** Lista de artículos en el carrito */
  cart: CartItem[]
  /** Indica si el drawer del carrito está visible */
  isCartOpen: boolean
  /** Precio total calculado de todos los artículos */
  totalPrice: number
  /** Agrega un producto al carrito con la cantidad especificada */
  addToCart: (product: IProduct, quantity: number) => void
  /** Elimina un producto del carrito por su ID */
  removeFromCart: (productId: number) => void
  /** Vacía el carrito por completo */
  clearCart: () => void
  /** Abre el drawer del carrito */
  openCart: () => void
  /** Cierra el drawer del carrito */
  closeCart: () => void
  /** Alterna la visibilidad del drawer del carrito */
  toggleCart: () => void
}

/**
 * @interface CartProviderProps
 * @description Props del componente CartProvider.
 */
export interface CartProviderProps {
  /** Componentes hijos que tendrán acceso al contexto del carrito */
  children: React.ReactNode
}

/**
 * @interface IValidationResult
 * @description Resultado de una validación al agregar un producto al carrito.
 */
export interface IValidationResult {
  /** Indica si el producto puede ser agregado al carrito */
  isValid: boolean
  /** Mensaje de error descriptivo si la validación falla; null si es válido */
  error: string | null
}
