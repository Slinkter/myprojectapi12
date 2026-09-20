/**
 * @file ProductModalContext.ts
 * @description Contexto y hook para la gestión del estado del modal de producto.
 * @architecture Application Layer - Product Modal Context & Consumer Hook
 */

import { createContext, useContext } from "react";
import type { IUseProductModalResult } from "@/features/products/application/types";

/**
 * Contexto de React para compartir el estado del modal de producto.
 */
export const ProductModalContext = createContext<
    IUseProductModalResult | undefined
>(undefined);

/**
 * Hook para acceder al contexto del modal de producto.
 *
 * @throws {Error} Si se usa fuera de un ProductModalProvider.
 * @returns {IUseProductModalResult} Estado y controladores del modal de producto.
 */
export const useProductModalContext = (): IUseProductModalResult => {
    const context = useContext(ProductModalContext);
    if (context === undefined) {
        throw new Error(
            "useProductModalContext debe usarse dentro de un ProductModalProvider",
        );
    }
    return context;
};
