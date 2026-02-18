/**
 * @file ProductModalContext.tsx
 * @description Gestión de estado global para el modal de detalles de producto.
 * @architecture Application Layer - Context y Provider
 */

import { createContext, useContext } from "react";
import { useProductModal } from "./useProductModal";
import { IProductModalProviderProps, IUseProductModalResult } from "./types";

/**
 * Contexto para el modal de producto.
 */
export const ProductModalContext = createContext<
    IUseProductModalResult | undefined
>(undefined);

/**
 * @component ProductModalProvider
 * @description Proveedor que envuelve la aplicación para dar acceso al estado del modal.
 */
export const ProductModalProvider = ({
    children,
}: IProductModalProviderProps) => {
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

/**
 * @function useProductModalContext
 * @description Hook para acceder a las funciones y estado del modal de producto.
 * @throws {Error} Si se usa fuera de un ProductModalProvider.
 */
export const useProductModalContext = () => {
    const context = useContext(ProductModalContext);
    if (context === undefined) {
        throw new Error(
            "useProductModalContext debe usarse dentro de un ProductModalProvider",
        );
    }
    return context;
};
