/**
 * @file useProductModal.ts
 * @description Hook para gestionar el estado del modal de detalle de producto sin estados redundantes.
 * @architecture Application Layer - Custom Hook
 */

import { useState, useCallback } from "react";
import type { IProduct, IUseProductModalResult } from "@/features/products/application/types";

/**
 * Hook para gestionar el estado del modal de detalle de producto.
 *
 * @remarks
 * Administra el producto seleccionado y deriva el estado de visibilidad del modal directamente
 * sin necesidad de estados redundantes o efectos de sincronización (rerender-derived-state-no-effect).
 * Las funciones `openProductModal` y `closeProductModal` están memoizadas con `useCallback`.
 *
 * @returns {IUseProductModalResult} Estado y controladores del modal de producto.
 * @see IUseProductModalResult - Estructura del valor retornado.
 */
export const useProductModal = (): IUseProductModalResult => {
    const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);

    // Derivar isModalOpen directamente a partir de la presencia de selectedProduct (rerender-derived-state-no-effect)
    const isModalOpen = selectedProduct !== null;

    /**
     * Abre el modal con el producto especificado.
     * @param product - Producto a mostrar en el modal.
     */
    const openProductModal = useCallback((product: IProduct) => {
        setSelectedProduct(product);
    }, []);

    /**
     * Cierra el modal y limpia el producto seleccionado.
     */
    const closeProductModal = useCallback(() => {
        setSelectedProduct(null);
    }, []);

    return {
        isModalOpen,
        selectedProduct,
        openProductModal,
        closeProductModal,
    };
};
