/**
 * @file ProductList.tsx
 * @description Componente de alto nivel que gestiona la visualización de la lista de productos,
 * incluyendo estados de carga, error y paginación infinita.
 * @architecture Presentation Layer - Componente de Feature
 */

import { memo } from "react";
import { Product } from "../application/types";
import ProductGrid from "./ProductGrid";
import ErrorMessage from "@/components/common/ErrorMessage";
import LoadMoreButton from "./components/LoadMoreButton";
import { cn } from "@/lib/utils";

/**
 * @interface ProductListProps
 * @description Propiedades para el componente ProductList.
 * @property {Product[]} products - Lista de productos cargados actualmente
 * @property {boolean} loading - Indica si hay una operación de carga en curso
 * @property {string | null} error - Mensaje de error si la carga falló, o null si fue exitosa
 * @property {boolean} hasMore - Indica si existen más productos disponibles para cargar
 * @property {() => void} loadMore - Función para solicitar la siguiente página de productos
 */
interface ProductListProps {
    products: Product[];
    loading: boolean;
    error: string | null;
    hasMore: boolean;
    loadMore: () => void;
}

/**
 * @component ProductList
 * @description Orquesta el ProductGrid y los controles de paginación.
 * Maneja visualmente los estados de error y la carga progresiva mediante un botón "Load More".
 * Memoizado para optimizar el rendimiento durante actualizaciones de otros estados.
 * 
 * @param {ProductListProps} props - Propiedades del componente.
 * @returns {JSX.Element} La sección de lista de productos con controles.
 */
const ProductList = memo(({
    products,
    loading,
    error,
    hasMore,
    loadMore
}: ProductListProps) => {
    // Renderizado de estado de error
    if (error) {
        return (
            <ErrorMessage
                message={error}
                title="Failed to load products"
                action={{
                    label: "Try again",
                    onClick: loadMore
                }}
            />
        );
    }

    // Renderizado de estado vacío
    if (products.length === 0 && !loading) {
        return <p className={cn("page-home__info-message")}>No products found.</p>;
    }

    return (
        <>
            <ProductGrid products={products} />

            <div className={cn("page-home__pagination flex justify-center w-full mt-12 mb-8")}>
                {hasMore && (
                    <LoadMoreButton 
                        onClick={loadMore} 
                        loading={loading} 
                    />
                )}

                {!hasMore && products.length > 0 && (
                    <p className={cn("page-home__info-message text-center text-gray-500 dark:text-gray-400 mt-8")}>
                        You have reached the end of the list.
                    </p>
                )}
            </div>
        </>
    );
});

ProductList.displayName = "ProductList";

export default ProductList;
