/**
 * @file CartActionsContext.ts
 * @description Contexto de React para las acciones y despachadores estables del carrito de compras.
 * @architecture Application Layer - Cart Actions Context (Prevents Render Storms)
 */

import { createContext, useContext } from "react";
import type { ICartActionsContextValue } from "@/features/cart/domain/cartTypes";

/**
 * Contexto de React exclusivo para callbacks y despachadores estables del carrito.
 */
export const CartActionsContext = createContext<ICartActionsContextValue | undefined>(undefined);

/**
 * Hook para acceder únicamente a las acciones estables del carrito.
 * Los componentes que consumen este hook no se re-renderizan cuando cambian los items o el drawer.
 *
 * @returns {ICartActionsContextValue} Despachadores estables del carrito.
 * @throws {Error} Si se usa fuera de un CartProvider.
 */
export const useCartActions = (): ICartActionsContextValue => {
    const context = useContext(CartActionsContext);
    if (!context) {
        throw new Error("useCartActions debe usarse dentro de un CartProvider");
    }
    return context;
};
