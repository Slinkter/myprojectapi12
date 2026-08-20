/**
 * @file HomeContent.tsx
 * @description Componente principal de la página de inicio que orquesta la búsqueda,
 * filtrado por categorías, visualización de catálogo y modal de detalle.
 * @architecture Pages Layer - Vista Principal
 */

import { useState, useCallback, useMemo, useDeferredValue } from "react";
import { useSearchParams } from "react-router-dom";
import { m } from "framer-motion";
import { useProducts } from "@/features/products/application/useProducts";
import type { IProduct } from "@/features/products/domain/productTypes";
import { useProductModalContext } from "@/features/products/application/useProductModalContext";
import { SearchInput } from "@/features/products/presentation/components/SearchInput";
import SkeletonGrid from "@/features/products/presentation/SkeletonGrid";
import ProductList from "@/features/products/presentation/ProductList";
import ProductDetailModal from "@/features/products/presentation/ProductDetailModal";
import { useLogLifecycle } from "@/shared/hooks";
import { useCategories } from "@/features/products/application/useCategories";
import { slideUp } from "@/shared/lib/animations";
import { X, Sparkles, Package, Plus } from "lucide-react";
import { useAuth } from "@/features/auth/application/AuthContext";
import { ProductFormModal } from "@/features/products/presentation/ProductFormModal";
import { deleteProduct } from "@/features/products/infrastructure/productsFirestore";
import { useQueryClient } from "@tanstack/react-query";

type SortOption = "default" | "price-asc" | "price-desc" | "rating-desc" | "name-asc";

/** Expresión regular para separar términos de búsqueda por espacios en blanco, izada a nivel de módulo (js-hoist-regexp). */
const WHITESPACE_SPLIT_REGEX = /\s+/;

/**
 * @component HomeContent
 * Renderiza el contenido principal de la página de inicio.
 *
 * @remarks
 * **Secuencia de carga y optimizaciones:**
 * 1. `ProductModalProvider` envuelve el árbol (contexto para modal de detalle).
 * 2. `HomeContent` lee `category` de URL vía `useSearchParams`.
 * 3. Búsqueda concurrente no bloqueante mediante `useDeferredValue` (rerender-use-deferred-value).
 * 4. Filtrado en paso único combinando criterios de título, descripción, categoría y marca (js-combine-iterations).
 * 5. Mapeo O(1) de categorías usando `Map` (js-set-map-lookups).
 * 6. Hero section animado con `slideUp`.
 * 7. `ProductList` memoizado con transición de opacidad diferida.
 * 8. `ProductDetailModal` renderizado bajo demanda.
 *
 * @returns {JSX.Element} Vista principal de la tienda.
 */
export const HomeContent = () => {
    useLogLifecycle("HomeContent");
    const [searchParams, setSearchParams] = useSearchParams();
    const categoryQuery = searchParams.get("category") || undefined;

    const {
        products,
        initialLoading,
        isLoading,
        error,
        loadMoreProducts,
        hasMore,
    } = useProducts(categoryQuery);

    const { selectedProduct, isModalOpen, closeProductModal } =
        useProductModalContext();

    const { data: categories } = useCategories();
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<SortOption>("default");

    const { user } = useAuth();
    const isAdmin = user?.role === "admin";
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState<IProduct | null>(null);
    const queryClient = useQueryClient();

    const handleEditProduct = useCallback((product: IProduct) => {
        setProductToEdit(product);
        setIsFormOpen(true);
    }, []);

    const handleDeleteProduct = useCallback(async (id: number) => {
        if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
            try {
                await deleteProduct(id);
                await queryClient.invalidateQueries({ queryKey: ["products"] });
            } catch (error) {
                console.error(error);
                alert("Error al eliminar el producto.");
            }
        }
    }, [queryClient]);

    // Valor diferido para evitar bloqueos durante la búsqueda en tiempo real (rerender-use-deferred-value)
    const deferredSearchQuery = useDeferredValue(searchQuery);
    const isStale = searchQuery !== deferredSearchQuery;

    // Mapa O(1) para resolución instantánea de nombres de categoría por slug (js-set-map-lookups / js-index-maps)
    const categoryMap = useMemo(() => {
        const map = new Map<string, string>();
        if (categories) {
            for (const category of categories) {
                map.set(category.slug, category.name);
            }
        }
        return map;
    }, [categories]);

    // Filtrado de productos en una única pasada combinada (js-combine-iterations)
    const filteredProducts = useMemo(() => {
        const query = deferredSearchQuery.trim().toLowerCase();
        if (!query) return products;

        const searchTokens = query.split(WHITESPACE_SPLIT_REGEX);
        const results = [];

        for (const p of products) {
            const title = p.title.toLowerCase();
            const desc = p.description.toLowerCase();
            const category = p.category ? p.category.toLowerCase() : "";
            const brand = p.brand ? p.brand.toLowerCase() : "";

            let allTokensMatch = true;
            for (const token of searchTokens) {
                if (
                    !title.includes(token) &&
                    !desc.includes(token) &&
                    !category.includes(token) &&
                    !brand.includes(token)
                ) {
                    allTokensMatch = false;
                    break;
                }
            }

            if (allTokensMatch) {
                results.push(p);
            }
        }

        return results;
    }, [deferredSearchQuery, products]);

    // Ordenamiento dinámico de productos
    const sortedProducts = useMemo(() => {
        if (sortBy === "default") return filteredProducts;
        return [...filteredProducts].sort((a, b) => {
            if (sortBy === "price-asc") return a.price - b.price;
            if (sortBy === "price-desc") return b.price - a.price;
            if (sortBy === "rating-desc") return (b.rating ?? 0) - (a.rating ?? 0);
            if (sortBy === "name-asc") return a.title.localeCompare(b.title);
            return 0;
        });
    }, [filteredProducts, sortBy]);

    const handleSearchChange = useCallback((query: string) => {
        setSearchQuery(query);
    }, []);

    const clearCategoryFilter = useCallback(() => {
        setSearchParams((prevParams) => {
            const nextParams = new URLSearchParams(prevParams);
            nextParams.delete("category");
            return nextParams;
        });
    }, [setSearchParams]);

    const activeCategoryName = categoryQuery
        ? (categoryMap.get(categoryQuery) ?? categoryQuery)
        : undefined;

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
                    Encuentra lo que necesitas con envíos rápidos, garantía
                    extendida y precios justos. Más de 100 productos
                    seleccionados para ti.
                </p>
            </m.div>

            <div className="flex flex-col gap-4 mb-10 items-center max-w-xl mx-auto w-full">
                <div className="flex flex-wrap sm:flex-nowrap gap-2.5 w-full items-center">
                    <SearchInput
                        value={searchQuery}
                        onChange={handleSearchChange}
                        isPending={isStale}
                        placeholder="Buscar productos por nombre, descripción o categoría..."
                        className="w-full flex-1"
                    />
                    <div className="flex items-center gap-2 shrink-0">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as SortOption)}
                            className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 shrink-0 cursor-pointer shadow-sm"
                            aria-label="Ordenar productos"
                        >
                            <option value="default">Destacados</option>
                            <option value="price-asc">Precio: menor a mayor</option>
                            <option value="price-desc">Precio: mayor a menor</option>
                            <option value="rating-desc">Mejor valorados</option>
                            <option value="name-asc">Nombre: A - Z</option>
                        </select>

                        {isAdmin && (
                            <button
                                type="button"
                                onClick={() => {
                                    setProductToEdit(null);
                                    setIsFormOpen(true);
                                }}
                                className="h-10 px-4 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover active:scale-95 transition-all shadow-md shadow-primary/20 flex items-center gap-1.5 shrink-0 cursor-pointer"
                            >
                                <Plus size={14} />
                                Nuevo
                            </button>
                        )}
                    </div>
                </div>

                {categoryQuery && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                            Categoría:
                        </span>
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
                        {sortedProducts.length} resultado
                        {sortedProducts.length !== 1 ? "s" : ""} para &quot;
                        {searchQuery}&quot;
                    </p>
                )}
            </div>

            {initialLoading && <SkeletonGrid />}
            {!initialLoading && (
                <ProductList
                    products={sortedProducts}
                    isLoading={isLoading}
                    error={error}
                    hasMore={hasMore && !searchQuery}
                    loadMoreProducts={loadMoreProducts}
                    onEdit={handleEditProduct}
                    onDelete={handleDeleteProduct}
                />
            )}
            {selectedProduct && (
                <ProductDetailModal
                    product={selectedProduct}
                    isOpen={isModalOpen}
                    onClose={closeProductModal}
                />
            )}
            <ProductFormModal
                isOpen={isFormOpen}
                onClose={() => {
                    setIsFormOpen(false);
                    setProductToEdit(null);
                }}
                productToEdit={productToEdit}
            />
        </div>
    );
};
