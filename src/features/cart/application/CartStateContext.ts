/**
 * @file CartStateContext.ts
 * @description Contexto de React para el estado reactivo de datos del carrito (items, totales, visibilidad).
 * @architecture Application Layer - Cart State Context
 */

import { createContext, useContext } from "react";
import type { ICartStateContextValue } from "@/features/cart/domain/cartTypes";

/**
 * Contexto de React exclusivo para datos reactivos del carrito.
 */
export const CartStateContext = createContext<ICartStateContextValue | undefined>(undefined);

/**
 * Hook para acceder únicamente al estado de datos del carrito.
 *
 * @returns {ICartStateContextValue} Estado reactivo del carrito.
 * @throws {Error} Si se usa fuera de un CartProvider.
 */
export const useCartState = (): ICartStateContextValue => {
    const context = useContext(CartStateContext);
    if (!context) {
        throw new Error("useCartState debe usarse dentro de un CartProvider");
    }
    return context;
};
