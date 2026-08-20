/**
 * @file CartContext.ts
 * @description Definición del contexto de React y hook useCart para el carrito de compras.
 * @architecture Application Layer - Context Definition
 */

import { createContext, useContext } from "react";
import type { ICartContextValue } from "@/features/cart/domain/cartTypes";

/**
 * Contexto de React para el carrito de compras.
 * Se inicializa como undefined; su valor es provisto por CartProvider.
 */
export const CartContext = createContext<ICartContextValue | undefined>(
    undefined,
);

/**
 * Hook para acceder al contexto del carrito.
 *
 * @returns {ICartContextValue} Estado y acciones del carrito
 * @throws {Error} Si se usa fuera de un CartProvider
 */
export const useCart = (): ICartContextValue => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart debe usarse dentro de un CartProvider");
    }
    return context;
};
