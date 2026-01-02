/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from "react";
import PropTypes from "prop-types";
import { useProductModal } from "./useProductModal";

/**
 * @typedef {import('./useProductModal').UseProductModalResult} UseProductModalResult
 */

/**
 * Context for the product modal.
 * @type {React.Context<UseProductModalResult>}
 */
const ProductModalContext = createContext(null);

/**
 * Custom hook to access the product modal context.
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
 * Provider component for the product modal context.
 * It encapsulates the logic for the product modal using the useProductModal hook
 * and provides the state and functions to its children.
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
