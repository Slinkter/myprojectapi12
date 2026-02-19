/**
 * @file ProductModalProvider.tsx
 * @description Proveedor que gestiona el estado global del modal de detalles de producto.
 * @architecture Application Layer - Provider Component
 */

import { useProductModal } from "@/features/products/application/useProductModal";
import { ProductModalContext } from "@/features/products/application/ProductModalContext";
import { IProductModalProviderProps } from "@/features/products/application/types";

/**
 * @component ProductModalProvider
 * @description Proveedor que envuelve la aplicación para dar acceso al estado del modal.
 */
export const ProductModalProvider = ({
  children,
}: IProductModalProviderProps) => {
  const { isModalOpen, selectedProduct, handleOpenModal, handleCloseModal } =
    useProductModal();

  const value = {
    isModalOpen,
    selectedProduct,
    handleOpenModal,
    handleCloseModal,
  };

  return (
    <ProductModalContext.Provider value={value}>
      {children}
    </ProductModalContext.Provider>
  );
};
