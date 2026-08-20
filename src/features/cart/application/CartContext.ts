/**
 * @file CartContext.ts
 * @description Definición del contexto de React y hook useCart combinado para el carrito de compras.
 * @architecture Application Layer - Unified Cart Context & Hooks
 */

import { createContext, useContext } from "react";
import type { ICartContextValue } from "@/features/cart/domain/cartTypes";
import { useCartState } from "@/features/cart/application/CartStateContext";
import { useCartActions } from "@/features/cart/application/CartActionsContext";

export { useCartState, useCartActions };

/**
 * Contexto de React para el carrito de compras unificado (mantiene retrocompatibilidad).
 */
export const CartContext = createContext<ICartContextValue | undefined>(
    undefined,
);

/**
 * Hook combinado para acceder tanto al estado como a las acciones del carrito.
 * Para componentes de solo acciones o solo lectura, se recomienda usar useCartActions o useCartState.
 *
 * @returns {ICartContextValue} Estado y acciones del carrito.
 * @throws {Error} Si se usa fuera de un CartProvider.
 */
export const useCart = (): ICartContextValue => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart debe usarse dentro de un CartProvider");
    }
    return context;
};
