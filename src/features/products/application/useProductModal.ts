import { useState, useCallback } from "react";
import { Product, UseProductModalResult } from "./types";

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
