/**
 * @file useProducts.ts
 * @description Hook personalizado para gestión de productos con paginación infinita usando React Query.
 * @architecture Application Layer - Custom Hook
 */

import {
    useInfiniteQuery,
    UseInfiniteQueryResult,
    InfiniteData,
} from "@tanstack/react-query";
import { getProducts } from "../infrastructure/productsApi";
import { Product, ProductsApiResponse } from "./types";

/**
 * @interface UseProductsResult
 * @description Interfaz para el valor de retorno del hook useProducts.
 */
export interface UseProductsResult {
    /** Array de productos aplanados de todas las páginas */
    products: Product[];
    /** Mensaje de error si la consulta falla */
    error: string | null;
    /** Verdadero si se está obteniendo la siguiente página */
    loading: boolean;
    /** Verdadero si se está obteniendo la primera página */
    initialLoading: boolean;
    /** Verdadero si hay más páginas para obtener */
    hasMore: boolean;
    /** Función para obtener la siguiente página */
    loadMore: () => void;
    /** Verdadero si se está cargando específicamente más datos (siguiente página) */
    isLoadingMore: boolean;
}

/**
 * @function useProducts
 * @description Hook para obtener productos con paginación infinita.
 * Utiliza React Query para caché automática y deduplicación.
 * @architecture Application Layer
 *
 * @returns {UseProductsResult} Estado y funciones para gestión de productos
 *
 * @example
 * const { products, loading, loadMore, hasMore } = useProducts();
 */
export const useProducts = (): UseProductsResult => {
    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        isLoading,
    }: UseInfiniteQueryResult<
        InfiniteData<ProductsApiResponse>,
        Error
    > = useInfiniteQuery<
        ProductsApiResponse,
        Error,
        InfiniteData<ProductsApiResponse>,
        ["products"],
        number
    >({
        queryKey: ["products"],
        queryFn: ({ pageParam = 1 }) => getProducts(pageParam),
        getNextPageParam: (
            lastPage: ProductsApiResponse,
            allPages: ProductsApiResponse[],
        ) => {
            const totalFetched = allPages.reduce(
                (acc, page) => acc + page.products.length,
                0,
            );
            return totalFetched < lastPage.total
                ? allPages.length + 1
                : undefined;
        },
        initialPageParam: 1,
    });

    const products: Product[] =
        data?.pages.flatMap((page) => page.products) ?? [];

    return {
        products,
        error: error?.message || null,
        loading: isFetching,
        initialLoading: isLoading,
        hasMore: hasNextPage ?? false,
        loadMore: fetchNextPage,
        isLoadingMore: isFetchingNextPage,
    };
};
