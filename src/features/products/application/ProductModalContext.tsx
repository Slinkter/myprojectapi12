/* eslint-disable react-refresh/only-export-components */
/**
 * @file ProductModalContext.tsx
 * @description Definición del contexto y proveedor para la gestión del modal de productos en toda la aplicación.
 * @architecture Application Layer - Contexto de modal de producto
 */

import { createContext, useContext, ReactNode } from "react";
import { useProductModal, UseProductModalResult } from "./useProductModal";

/**
 * Contexto de React para el estado del modal del producto.
 * @constant {React.Context<UseProductModalResult | undefined>}
 */
const ProductModalContext = createContext<UseProductModalResult | undefined>(undefined);

/**
 * @function useProductModalContext
 * @description Hook para acceder a las funciones y estado del modal de producto desde cualquier componente hijo.
 * @architecture Capa de Aplicación - Hook de consumo de contexto
 * 
 * @returns {UseProductModalResult} El estado y las funciones del modal.
 * @throws {Error} Si se utiliza fuera de un ProductModalProvider.
 */
export const useProductModalContext = (): UseProductModalResult => {
  const context = useContext(ProductModalContext);
  if (context === undefined) {
    throw new Error(
      "useProductModalContext debe usarse dentro de un ProductModalProvider",
    );
  }
  return context;
};

/**
 * @interface ProductModalProviderProps
 * @description Props para el componente ProductModalProvider.
 */
interface ProductModalProviderProps {
  /** Componentes hijos que tendrán acceso al contexto */
  children: ReactNode;
}

/**
 * @component ProductModalProvider
 * @description Proveedor que envuelve la aplicación o una parte de ella para habilitar el modal de productos.
 * Utiliza el hook useProductModal internamente para centralizar el estado.
 * 
 * @param {ProductModalProviderProps} props - Propiedades del componente.
 * @returns {JSX.Element} El proveedor del contexto con los hijos envueltos.
 */
export const ProductModalProvider = ({ children }: ProductModalProviderProps) => {
  const value = useProductModal();
  return (
    <ProductModalContext.Provider value={value}>
      {children}
    </ProductModalContext.Provider>
  );
};