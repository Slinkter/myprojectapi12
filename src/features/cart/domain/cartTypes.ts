import { ReactNode } from "react";

export interface ICartItem {
    /** Identificador único del producto */
    id: number;
    /** Nombre visible del producto */
    title: string;
    /** Precio unitario en USD */
    price: number;
    /** Número de unidades actualmente en el carrito */
    quantity: number;
    /** URL de la imagen en miniatura del producto */
    thumbnail: string;
    /** Unidades totales disponibles en el almacén */
    stock: number;
}

/**
 * Representa un producto base del catálogo.
 */
export interface IProduct {
    /** ID único del producto */
    id: number;
    /** Nombre del producto */
    title: string;
    /** Precio del producto en USD */
    price: number;
    /** URL de la imagen del producto */
    thumbnail: string;
    /** Nivel de stock actual */
    stock: number;
}

/**
 * Resultado de una comprobación de validación de un artículo del carrito.
 */
/**
 * Resultado de una comprobación de validación de un artículo del carrito.
 */
export interface IValidationResult {
    /** Indica si la validación fue exitosa */
    valid: boolean;
    /**
     * Mensaje de error descriptivo si `valid` es false.
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
 */
export interface ICartContextValue {
    cart: ICartItem[];
    isCartOpen: boolean;
    totalPrice: number;
    addToCart: (product: IProduct, quantity: number) => void;
    removeFromCart: (productId: number) => void;
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
