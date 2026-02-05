/**
 * @file useProductModal
 * @architecture Hook de la capa de aplicación - gestiona el estado de apertura/cierre del modal y el producto seleccionado
 * @side-effects Ninguno - gestión de estado pura
 * @perf useCallback previene la recreación de la función en cada renderizado
 */
import { useState, useCallback } from "react";

/**
 * @typedef {object} Product
 * @property {number} id - El ID del producto.
 * @property {string} title - El título del producto.
 * @property {string} description - La descripción del producto.
 * @property {number} price - El precio del producto.
 * @property {string} thumbnail - La URL de la miniatura del producto.
 * @property {number} stock - El stock disponible del producto.
 */

/**
 * @typedef {object} UseProductModalResult
 * @property {boolean} isModalOpen - Si el modal está abierto.
 * @property {Product | null} selectedProduct - El producto actualmente seleccionado para mostrar en el modal.
 * @property {(product: Product) => void} handleOpenModal - Función para abrir el modal con un producto específico.
 * @property {() => void} handleCloseModal - Función para cerrar el modal.
 */

/**
 * Hook personalizado para gestionar el estado del modal de detalles del producto.
 * Este hook encapsula la lógica para abrir y cerrar el modal,
 * y mantiene un registro del producto que está actualmente seleccionado.
 *
 * @returns {UseProductModalResult}
 */
export const useProductModal = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const handleOpenModal = useCallback((product) => {
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
