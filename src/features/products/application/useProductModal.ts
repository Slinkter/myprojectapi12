import { useState, useCallback } from "react";
import { IProduct, IUseProductModalResult } from "./types";

export const useProductModal = (): IUseProductModalResult => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(
        null,
    );

    const handleOpenModal = useCallback((product: IProduct) => {
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
