import { useState, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { m } from "framer-motion";
import { useProducts } from "@/features/products/application/useProducts";
import { useProductModalContext } from "@/features/products/application/useProductModalContext";
import { SearchInput } from "@/features/products/presentation/components/SearchInput";
import SkeletonGrid from "@/features/products/presentation/SkeletonGrid";
import ProductList from "@/features/products/presentation/ProductList";
import ProductDetailModal from "@/features/products/presentation/ProductDetailModal";
import { useDebounce, useLogLifecycle } from "@/shared/hooks";
import { useCategories } from "@/features/products/application/useCategories";
import { slideUp } from "@/shared/lib/animations";

import { X, Sparkles, Package } from "lucide-react";

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

    const activeCategoryName = categories?.find(c => c.slug === categoryQuery)?.name || categoryQuery;

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Hero section — thesis-driven */}
            <m.div
                variants={slideUp}
                initial="hidden"
                animate="visible"
                className="relative mb-14 mt-4 text-center"
            >
                <div className="absolute inset-0 -z-10 overflow-hidden rounded-3xl">
                    <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-violet-500/5 dark:bg-violet-500/10 rounded-full blur-3xl" />
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 dark:bg-primary/15 text-primary text-xs font-bold tracking-wider mb-5 border border-primary/10 dark:border-primary/20">
                    <Sparkles size={13} />
                    Catálogo premium
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 leading-[1.08]">
                    Descubre productos
                    <span className="block mt-1 bg-gradient-to-r from-emerald-600 via-emerald-500 to-violet-500 bg-clip-text text-transparent">
                        que marcan la diferencia
                    </span>
                </h1>
                <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed mt-4">
                    Encuentra lo que necesitas con envíos rápidos, garantía extendida y precios justos.
                    Más de 100 productos seleccionados para ti.
                </p>
            </m.div>

            <div className="flex flex-col gap-4 mb-10 items-center max-w-xl mx-auto">
                <SearchInput
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Buscar productos por nombre, descripción o categoría..."
                    style={{ width: "100%" }}
                />

                {categoryQuery && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-500 dark:text-slate-400">Categoría:</span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary dark:bg-primary/20">
                            <Package size={12} />
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
