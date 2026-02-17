import { createContext, useContext } from "react";
import { useProductModal } from "./useProductModal";
import { ProductModalProviderProps, UseProductModalResult } from "./types";

const ProductModalContext = createContext<UseProductModalResult | undefined>(
  undefined,
);

export const ProductModalProvider = (props: ProductModalProviderProps) => {
  const { children } = props;
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
/* custom hook  */
export const useProductModalContext = (): UseProductModalResult => {
  const context = useContext(ProductModalContext);
  if (context === undefined) {
    throw new Error(" debe usarse dentro de un ProductModalProvider");
  }
  return context;
};
