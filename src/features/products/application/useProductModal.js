import { useState, useCallback } from "react";

/**
 * @typedef {object} Product
 * @property {number} id - The product ID.
 * @property {string} title - The product title.
 * @property {string} description - The product description.
 * @property {number} price - The product price.
 * @property {string} thumbnail - The URL of the product thumbnail.
 * @property {number} stock - The available stock of the product.
 */

/**
 * @typedef {object} UseProductModalResult
 * @property {boolean} isModalOpen - Whether the modal is open.
 * @property {Product | null} selectedProduct - The product currently selected to be displayed in the modal.
 * @property {(product: Product) => void} handleOpenModal - Function to open the modal with a specific product.
 * @property {() => void} handleCloseModal - Function to close the modal.
 */

/**
 * Custom hook to manage the state of the product detail modal.
 * This hook encapsulates the logic for opening and closing the modal,
 * and keeps track of the product that is currently selected.
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
