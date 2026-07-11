/**
 * @file HomeContent.tsx
 * @description Página principal de la aplicación. Orquesta la carga de productos,
 * el estado de carga inicial, el modal de detalle y la paginación infinita.
 * @architecture Presentation Layer - Página
 */

import { useState, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts } from "@/features/products/application/useProducts";
import { useProductModalContext } from "@/features/products/application/useProductModalContext";
import { SearchInput } from "@/features/products/presentation/components/SearchInput";
import SkeletonGrid from "@/features/products/presentation/SkeletonGrid";
import ProductList from "@/features/products/presentation/ProductList";
import ProductDetailModal from "@/features/products/presentation/ProductDetailModal";
import { useDebounce, useLogLifecycle } from "@/shared/hooks";
import { useCategories } from "@/features/products/application/useCategories";

import { X } from "lucide-react";

/**
 * Componente principal del contenido de la página de inicio.
 * Orquesta la carga de productos, la búsqueda con debounce, el filtrado por categoría,
 * la paginación infinita y el modal de detalle de producto.
 *
 * @returns Elemento JSX con la página de inicio completa.
 */
export const HomeContent = () => {
    useLogLifecycle("HomeContent");
    const [searchParams, setSearchParams] = useSearchParams();
    const categoryQuery = searchParams.get("category") || undefined;

    const { products, initialLoading, isLoading, error, loadMoreProducts, hasMore } =
        useProducts(categoryQuery);
        
    const { selectedProduct, isModalOpen, closeProductModal } =
        useProductModalContext();

    const { data: categories } = useCategories();
    const [searchQuery, setSearchQuery] = useState("");
    const debouncedSearch = useDebounce(searchQuery, 350);

    const filteredProducts = useMemo(() => {
        if (!debouncedSearch) return products;
        const lowerQuery = debouncedSearch.toLowerCase();
        return products.filter(
            (p) =>
                p.title.toLowerCase().includes(lowerQuery) ||
                p.description.toLowerCase().includes(lowerQuery) ||
                p.category?.toLowerCase().includes(lowerQuery) ||
                p.brand?.toLowerCase().includes(lowerQuery)
        );
    }, [debouncedSearch, products]);

    const handleSearchChange = useCallback((query: string) => {
        setSearchQuery(query);
    }, []);

    const clearCategoryFilter = () => {
        searchParams.delete("category");
        setSearchParams(searchParams);
    };

    // Obtener el nombre amigable de la categoría actual
    const activeCategoryName = categories?.find(c => c.slug === categoryQuery)?.name || categoryQuery;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Elegant Hero / Welcome Header */}
            <div className="text-center mb-10 mt-6">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3 text-slate-900 dark:text-slate-50">
                    Descubre Productos Increíbles
                </h1>
                <p className="text-sm md:text-base text-slate-500 dark:text-slate-450 max-w-md mx-auto leading-relaxed">
                    Explora nuestra colección con envíos rápidos, garantías extendidas y ofertas exclusivas de temporada.
                </p>
            </div>

            <div className="flex flex-col gap-4 mb-10 items-center max-w-xl mx-auto">
                <SearchInput
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Buscar productos por nombre, descripción o categoría..."
                    style={{ width: "100%" }}
                />
                
                {/* Badge de Categoría Activa */}
                {categoryQuery && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-500 dark:text-slate-400">Categoría:</span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary dark:bg-primary/20">
                            {activeCategoryName}
                            <button
                                type="button"
                                onClick={clearCategoryFilter}
                                className="p-0.5 rounded-full cursor-pointer hover:bg-primary/20 text-primary/70 hover:text-primary transition-colors border-none bg-transparent flex items-center justify-center focus-visible:outline-2 focus-visible:outline-primary"
                                aria-label="Limpiar filtro de categoría"
                            >
                                <X size={12} />
                            </button>
                        </span>
                    </div>
                )}

                {searchQuery && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 text-center mt-1">
                        {filteredProducts.length} resultado{filteredProducts.length !== 1 ? "s" : ""} para &quot;{searchQuery}&quot;
                    </p>
                )}
            </div>

            {initialLoading && <SkeletonGrid />}
            {!initialLoading && (
                <ProductList
                    products={filteredProducts}
                    isLoading={isLoading}
                    error={error}
                    hasMore={hasMore && !searchQuery}
                    loadMoreProducts={loadMoreProducts}
                />
            )}
            {selectedProduct && (
                <ProductDetailModal
                    product={selectedProduct}
                    isOpen={isModalOpen}
                    onClose={closeProductModal}
                />
            )}
        </div>
    );
};
