import { useState, useCallback } from "react";
import { IProduct } from "@/features/products/application/types";
import { IUseProductModalResult } from "@/features/products/application/types";

/**
 * Hook para gestionar el estado del modal de detalle de producto.
 *
 * @remarks
 * Administra el estado local de apertura/cierre del modal y el producto seleccionado.
 * Las funciones `openProductModal` y `closeProductModal` están memoizadas con `useCallback`.
 *
 * @returns Estado y controladores del modal de producto.
 * @see IUseProductModalResult - Estructura del valor retornado.
 */
export const useProductModal = (): IUseProductModalResult => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(
        null,
    );

    /**
     * Abre el modal con el producto especificado.
     * @param product - Producto a mostrar en el modal.
     */
    const openProductModal = useCallback((product: IProduct) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    }, []);

    /**
     * Cierra el modal y limpia el producto seleccionado.
     */
    const closeProductModal = useCallback(() => {
        setSelectedProduct(null);
        setIsModalOpen(false);
    }, []);

    return {
        isModalOpen,
        selectedProduct,
        openProductModal,
        closeProductModal,
    };
};
