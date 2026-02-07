/**
 * @file useProductModal.ts
 * @description Hook personalizado para gestionar el estado de visibilidad y item seleccionado del modal de producto.
 * @architecture Application Layer - Gestión de estado de modal
 */

import { useState, useCallback } from "react";
import { Product } from "./types";

/**
 * @interface UseProductModalResult
 * @description Estructura del objeto devuelto por el hookuseProductModal.
 */
export interface UseProductModalResult {
  /** Indica si el modal está actualmente visible */
  isModalOpen: boolean;
  /** El producto seleccionado para mostrar detalles, o null si no hay ninguno */
  selectedProduct: Product | null;
  /** Función para abrir el modal con un producto específico */
  handleOpenModal: (product: Product) => void;
  /** Función para cerrar el modal y limpiar el producto seleccionado */
  handleCloseModal: () => void;
}

/**
 * @function useProductModal
 * @description Hook que encapsula la lógica de apertura y cierre del modal de detalles de producto.
 * Utiliza useCallback para estabilizar las referencias de las funciones de control.
 * 
 * @returns {UseProductModalResult} Estado y manejadores para el modal.
 */
export const useProductModal = (): UseProductModalResult => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  /**
   * Abre el modal y establece el producto seleccionado.
   * @function handleOpenModal
   */
  const handleOpenModal = useCallback((product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  }, []);

  /**
   * Cierra el modal y resetea el producto seleccionado.
   * @function handleCloseModal
   */
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