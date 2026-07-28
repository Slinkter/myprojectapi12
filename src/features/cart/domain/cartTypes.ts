import { ReactNode } from "react";
import type { IProduct } from "@/entities/product";
import type { ICartItem } from "@/entities/cart-item";

export type { IProduct, ICartItem };

/**
 * Resultado de una comprobación de validación de un artículo del carrito.
 */
/**
 * Resultado de una comprobación de validación de un artículo del carrito.
 */
export interface IValidationResult {
    /** Indica si la validación fue exitosa */
    isValid: boolean;
    /**
     * Mensaje de error descriptivo si `isValid` es false.
     * @example "Stock insuficiente"
     */
    error: string | null;
}

/**
 * @interface CartContextValue
 * @description Valor del contexto del carrito. Define todas las propiedades y métodos
 * disponibles para los componentes que consumen el contexto.
 *
 * @property {CartItem[]} cart - Array de items en el carrito
 * @property {Function} addToCart - Función para agregar productos al carrito
 * @property {Function} removeFromCart - Función para eliminar productos del carrito
 * @property {Function} clearCart - Función para vaciar el carrito completamente
 * @property {boolean} isCartOpen - Estado de visibilidad del drawer del carrito
 * @property {Function} openCart - Función para abrir el drawer del carrito
 * @property {Function} closeCart - Función para cerrar el drawer del carrito
 * @property {Function} toggleCart - Función para alternar visibilidad del drawer
 * @property {number} totalPrice - Precio total de todos los items en el carrito
 * @property {number} totalItems - Cantidad total de productos en el carrito
 */
export interface ICartContextValue {
    cart: ICartItem[];
    isCartOpen: boolean;
    totalPrice: number;
    totalItems: number;
    addToCart: (product: IProduct, quantity: number) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;
}

/**
 * @interface CartProviderProps
 * @description Props del CartProvider
 * @property {ReactNode} children - Componentes hijos que tendrán acceso al contexto
 */
export interface ICartProviderProps {
    children: ReactNode;
}
