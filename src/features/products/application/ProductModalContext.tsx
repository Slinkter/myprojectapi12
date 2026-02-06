// src/features/products/application/ProductModalContext.tsx
import { createContext, useContext, ReactNode } from "react";
import { useProductModal, UseProductModalResult } from "./useProductModal"; // Importamos el hook y la interfaz

// Creamos el contexto con un valor inicial de `undefined`.
// El `useProductModalContext` garantizará que nunca se use un valor `undefined` si se usa dentro del `Provider`.
const ProductModalContext = createContext<UseProductModalResult | undefined>(undefined);

/**
 * Hook personalizado para acceder al contexto del modal del producto.
 * Lanza un error si se usa fuera de un `ProductModalProvider`.
 * @returns {UseProductModalResult}
 */
export const useProductModalContext = (): UseProductModalResult => {
  const context = useContext(ProductModalContext);
  if (context === undefined) {
    throw new Error(
      "useProductModalContext must be used within a ProductModalProvider",
    );
  }
  return context;
};

interface ProductModalProviderProps {
  children: ReactNode;
}

/**
 * Componente proveedor para el contexto del modal del producto.
 * Encapsula la lógica para el modal del producto utilizando el hook useProductModal
 * y proporciona el estado y las funciones a sus hijos.
 */
export const ProductModalProvider = ({ children }: ProductModalProviderProps) => {
  const value = useProductModal(); // El hook ya devuelve UseProductModalResult
  return (
    <ProductModalContext.Provider value={value}>
      {children}
    </ProductModalContext.Provider>
  );
};