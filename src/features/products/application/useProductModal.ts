import { useState, useCallback } from "react";
import {
    IProduct,
    IUseProductModalResult,
} from "@/features/products/application/types";

/**
 * Custom hook for managing product modal state.
 * Provides functions to open and close a modal, along with the current modal state.
 * @returns An object containing modal state (isOpen, selectedProduct) and control functions (openProductModal, closeProductModal)
 */
export const useProductModal = (): IUseProductModalResult => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(
        null,
    );

    /**
     * Opens the product modal with the given product.
     * Sets the selected product and changes modal state to open.
     * @param product - The product object to display in the modal
     */
    const openProductModal = useCallback((product: IProduct) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    }, []);

    /**
     * Closes the product modal and clears the selected product.
     * Resets both modal state and selected product to their default values.
     */
    const closeProductModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    }, []);

    return {
        isModalOpen,
        selectedProduct,
        openProductModal,
        closeProductModal,
    };
};
