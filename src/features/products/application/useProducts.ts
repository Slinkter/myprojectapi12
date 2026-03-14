/**
 * @file useProducts.ts
 * @description Hook personalizado para gestión de productos con paginación infinita usando React Query.
 * @architecture Application Layer - Custom Hook
 */

import { useInfiniteQuery } from "@tanstack/react-query";
import { getProducts } from "@/features/products/infrastructure/productsApi";
import type {
    IProduct,
    IUseProductsResult,
} from "@/features/products/application/types";

/**
 * Cantidad de productos por página para la paginación infinita.
 */
const PRODUCTS_PER_PAGE = 20;

/**
 * Hook para obtener y gestionar la lista de productos con scroll infinito.
 * @param {string} [category] - Categoría opcional para filtrar los productos.
 * @returns {IUseProductsResult} Objeto con productos, estados de carga y funciones de paginación.
 */
export const useProducts = (category?: string): IUseProductsResult => {
    const {
        isLoading: isInitialLoading,
        error,
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ["products", category] as const,
        queryFn: async ({ pageParam = 1 }) => {
            const skip = (pageParam - 1) * PRODUCTS_PER_PAGE;
            return getProducts(skip, PRODUCTS_PER_PAGE, category);
        },
        getNextPageParam: (lastPage, allPages) => {
            const totalFetched = allPages.length * PRODUCTS_PER_PAGE;
            return totalFetched < lastPage.total
                ? allPages.length + 1
                : undefined;
        },
        initialPageParam: 1,
    });

    const products: IProduct[] =
        data?.pages.flatMap((page) => page.products) ?? [];

    return {
        products,
        error: error?.message || null,
        isLoading: isInitialLoading || isFetchingNextPage,
        initialLoading: isInitialLoading,
        hasMore: hasNextPage ?? false,
        loadMoreProducts: fetchNextPage,
        isLoadingMore: isFetchingNextPage,
    };
};
