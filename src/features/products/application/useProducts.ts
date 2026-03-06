/**
 * @file useProducts.ts
 * @description Hook personalizado para gestión de productos con paginación infinita usando React Query.
 * @architecture Application Layer - Custom Hook
 */

import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";
import { getProducts } from "@/features/products/infrastructure/productsApi";
import { IProduct, IProductsApiResponse } from "@/features/products/domain/productTypes";
import { IUseProductsResult } from "@/features/products/application/types";

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
    isLoading,
    error,
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
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
      return totalFetched < lastPage.total ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const products: IProduct[] =
    data?.pages.flatMap((page) => page.products) ?? [];

  return {
    products,
    error: error?.message || null,
    loading: isFetchingNextPage,
    initialLoading: isLoading,
    hasMore: hasNextPage ?? false,
    loadMore: fetchNextPage,
    isLoadingMore: isFetchingNextPage,
  };
};
