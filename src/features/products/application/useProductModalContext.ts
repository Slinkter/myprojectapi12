/**
 * @file useProductModalContext.ts
 * @description Hook para acceder al contexto del modal de producto.
 * @architecture Application Layer - Custom Hook
 */

import { useContext } from "react";
import { ProductModalContext } from "@/features/products/application/ProductModalContext";

/**
 * @function useProductModalContext
 * @description Hook para acceder a las funciones y estado del modal de producto.
 * @throws {Error} Si se usa fuera de un ProductModalProvider.
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
