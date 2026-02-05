/**
 * @file ProductModalContext
 * @architecture Capa de aplicación - gestiona el estado del modal de detalles del producto
 * @side-effects Ninguno - delega al hook useProductModal
 * @perf El contexto previene el prop drilling para el estado del modal
 */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from "react";
import PropTypes from "prop-types";
import { useProductModal } from "./useProductModal";

/**
 * @typedef {import('./useProductModal').UseProductModalResult} UseProductModalResult
 */

/**
 * Contexto para el modal del producto.
 * @type {React.Context<UseProductModalResult>}
 */
const ProductModalContext = createContext(null);

/**
 * Hook personalizado para acceder al contexto del modal del producto.
 * @returns {UseProductModalResult}
 */
export const useProductModalContext = () => {
  const context = useContext(ProductModalContext);
  if (!context) {
    throw new Error(
      "useProductModalContext must be used within a ProductModalProvider"
    );
  }
  return context;
};

/**
 * Componente proveedor para el contexto del modal del producto.
 * Encapsula la lógica para el modal del producto utilizando el hook useProductModal
 * y proporciona el estado y las funciones a sus hijos.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 */
export const ProductModalProvider = ({ children }) => {
  const value = useProductModal();
  return (
    <ProductModalContext.Provider value={value}>
      {children}
    </ProductModalContext.Provider>
  );
};

ProductModalProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
