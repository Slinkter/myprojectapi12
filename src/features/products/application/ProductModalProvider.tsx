/**
 * @file ProductModalProvider.tsx
 * @description Proveedor que gestiona el estado global del modal de detalles de producto.
 * @architecture Application Layer - Provider Component
 */

import { useProductModal } from "@/features/products/application/useProductModal";
import { ProductModalContext } from "@/features/products/application/ProductModalContext";
import { IProductModalProviderProps } from "@/features/products/application/types";
import { useLogLifecycle } from "@/shared/hooks";

/**
 * Proveedor de contexto para el modal de producto.
 *
 * @remarks
 * Envuelve la aplicación (o una sección) para que cualquier componente hijo
 * pueda acceder al estado y controladores del modal mediante `useProductModalContext`.
 * Internamente delega la lógica de estado a `useProductModal`.
 *
 * @component
 * @param props.children - Elementos hijos que heredan el contexto del modal.
 * @returns Elemento JSX con el Provider del contexto.
 * @see IProductModalProviderProps - Tipo de las props.
 * @see ProductModalContext - Contexto compartido.
 * @see useProductModal - Hook que gestiona el estado interno.
 */
export const ProductModalProvider = ({
    children,
}: IProductModalProviderProps) => {
    useLogLifecycle("ProductModalProvider");
    const {
        isModalOpen,
        selectedProduct,
        openProductModal,
        closeProductModal,
    } = useProductModal();

    const value = {
        isModalOpen,
        selectedProduct,
        openProductModal,
        closeProductModal,
    };

    return (
        <ProductModalContext.Provider value={value}>
            {children}
        </ProductModalContext.Provider>
    );
};
