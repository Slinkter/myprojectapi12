/**
 * @file useProducts.ts
 * @description Hook personalizado para gestión de productos con paginación infinita usando React Query.
 * @architecture Application Layer - Custom Hook
 */

import { InfiniteData } from "@tanstack/react-query";
import { useInfiniteQuery } from "@tanstack/react-query";
import { UseInfiniteQueryResult } from "@tanstack/react-query";
import { getProducts } from "../infrastructure/productsApi";
import { IProduct, IProductsApiResponse, IUseProductsResult } from "./types";

/**
 * @function useProducts
 * @description Hook personalizado para obtener productos paginados con scroll infinito.
 * Utiliza React Query para el cacheo y gestión del estado de carga.
 * @architecture Capa de Aplicación - Hook de obtención de datos
 *
 * @returns {IUseProductsResult} Objeto con la lista de productos acumulados, estados de carga y función para cargar más.
 *
 * @example
 * const { products, loading, loadMore, hasMore } = useProducts();
 */
export const useProducts = (): IUseProductsResult => {
    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        isLoading,
    }: UseInfiniteQueryResult<
        InfiniteData<IProductsApiResponse>,
        Error
    > = useInfiniteQuery<
        IProductsApiResponse,
        Error,
        InfiniteData<IProductsApiResponse>,
        ["products"],
        number
    >({
        queryKey: ["products"],
        queryFn: ({ pageParam = 1 }) => getProducts(pageParam),
        getNextPageParam: (
            lastPage: IProductsApiResponse,
            allPages: IProductsApiResponse[],
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

    const products: IProduct[] =
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
