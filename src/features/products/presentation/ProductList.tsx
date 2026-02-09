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
import clsx from 'clsx';

/**
 * @interface ProductListProps
 * @description Propiedades para el componente ProductList.
 * @property {ProductInterface[]} products - Lista de productos cargados actualmente
 * @property {boolean} loading - Indica si hay una operación de carga en curso
 * @property {string} error - Mensaje de error si la carga falló, o null si fue exitosa
 * @property {boolean} hasMore - Indica si existen más productos disponibles para cargar
 * @property {function} loadMore - Función para solicitar la siguiente página de productos
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
        return <p className={clsx("page-home__info-message")}>No products found.</p>;
    }

    return (
        <>
            <ProductGrid products={products} />

            <div className={clsx("page-home__pagination")}>
                {hasMore && (
                    <button
                        onClick={loadMore}
                        disabled={loading}
                        className={clsx(
                            "page-home__load-more-button flex items-center justify-center gap-2",
                            loading && "opacity-70 cursor-not-allowed"
                        )}
                        aria-label="Load more products"
                    >
                        {loading ? (
                            <>
                                <div className={clsx("animate-spin rounded-full h-5 w-5 border-b-2 border-white")} />
                                <span>Loading...</span>
                            </>
                        ) : (
                            "Load More"
                        )}
                    </button>
                )}

                {!hasMore && products.length > 0 && (
                    <p className={clsx("page-home__info-message")}>
                        You have reached the end of the list.
                    </p>
                )}
            </div>
        </>
    );
});

ProductList.displayName = "ProductList";

export default ProductList;
