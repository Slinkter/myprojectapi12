/**
 * @file useProductModalContext.ts
 * @description Hook para acceder al contexto del modal de producto.
 * @architecture Application Layer - Custom Hook
 */

import { useContext } from "react";
import { ProductModalContext } from "@/features/products/application/ProductModalContext";

/**
 * Hook para acceder al contexto del modal de producto.
 *
 * @remarks
 * Consume `ProductModalContext` y verifica que el contexto esté definido.
 * Si se invoca fuera del árbol de `ProductModalProvider`, lanza un error.
 *
 * @throws {Error} Si se usa fuera de un ProductModalProvider.
 * @returns El valor del contexto con el estado y controladores del modal.
 * @see ProductModalContext - Contexto de React creado con createContext.
 * @see ProductModalProvider - Proveedor que debe envolver la aplicación.
 */
export const useProductModalContext = () => {
    const context = useContext(ProductModalContext);
    if (context === undefined) {
        throw new Error(
            "useProductModalContext debe usarse dentro de un ProductModalProvider",
        );
    }
    return context;
};
