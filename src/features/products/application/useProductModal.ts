// src/features/products/application/useProductModal.ts
import { useState, useCallback } from "react";
import { Product } from "./types"; // Importamos la interfaz Product

/**
 * Interfaz que define la forma del valor de retorno del hook `useProductModal`.
 */
export interface UseProductModalResult {
  isModalOpen: boolean;
  selectedProduct: Product | null;
  handleOpenModal: (product: Product) => void;
  handleCloseModal: () => void;
}

/**
 * Hook personalizado para gestionar el estado del modal de detalles del producto.
 * Este hook encapsula la lógica para abrir y cerrar el modal,
 * y mantiene un registro del producto que está actualmente seleccionado.
 *
 * @returns {UseProductModalResult}
 */
export const useProductModal = (): UseProductModalResult => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleOpenModal = useCallback((product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  }, []);

  return {
    isModalOpen,
    selectedProduct,
    handleOpenModal,
    handleCloseModal,
  };
};