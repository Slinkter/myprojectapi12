/**
 * @file cartTypes.ts
 * @description Definición de tipos y contratos para el estado reactivo y acciones del carrito de compras.
 * @architecture Domain Layer - Cart Types (Segregated State/Actions Contracts)
 */

import { ReactNode } from "react";
import type { IProduct } from "@/entities/product";
import type { ICartItem } from "@/entities/cart-item";

export type { IProduct, ICartItem };

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
 * @interface ICartStateContextValue
 * @description Estado reactivo de solo lectura del carrito de compras.
 * Los componentes que consumen este contexto solo se re-renderizan cuando los datos cambian.
 */
export interface ICartStateContextValue {
    /** Listado reactivo de items en el carrito */
    cart: ICartItem[];
    /** Estado de apertura del drawer lateral */
    isCartOpen: boolean;
    /** Monto total en USD calculado */
    totalPrice: number;
    /** Cantidad total de artículos físicos */
    totalItems: number;
}

/**
 * @interface ICartActionsContextValue
 * @description Métodos y despachadores estables de acciones sobre el carrito de compras.
 * Al estar memoizados, los componentes que solo ejecutan acciones (ej. ProductCard) no sufren re-renders.
 */
export interface ICartActionsContextValue {
    /** Agrega un producto con la cantidad indicada */
    addToCart: (product: IProduct, quantity: number) => void;
    /** Elimina un item por su ID */
    removeFromCart: (productId: number) => void;
    /** Modifica la cantidad de un item existente */
    updateQuantity: (productId: number, quantity: number) => void;
    /** Vacía el carrito completamente */
    clearCart: () => void;
    /** Abre el drawer del carrito */
    openCart: () => void;
    /** Cierra el drawer del carrito */
    closeCart: () => void;
    /** Alterna la visibilidad del drawer */
    toggleCart: () => void;
}

/**
 * @interface ICartContextValue
 * @description Valor unificado del contexto del carrito (mantiene retrocompatibilidad).
 */
export interface ICartContextValue extends ICartStateContextValue, ICartActionsContextValue {}

/**
 * @interface ICartProviderProps
 * @description Props del componente CartProvider.
 */
export interface ICartProviderProps {
    children: ReactNode;
}
