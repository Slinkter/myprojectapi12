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
 * @description Interface for the return value of the useProducts hook.
 */
export interface UseProductsResult {
  /** Array of flattened products from all pages */
  products: Product[];
  /** Error message if the query fails */
  error: string | null;
  /** True if fetching next page */
  loading: boolean;
  /** True if fetching the first page */
  initialLoading: boolean;
  /** True if there are more pages to fetch */
  hasMore: boolean;
  /** Function to fetch the next page */
  loadMore: () => void;
  /** True if specifically loading more data (next page) */
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
  }: UseInfiniteQueryResult<InfiniteData<ProductsApiResponse>, Error> = useInfiniteQuery<
    ProductsApiResponse,
    Error,
    InfiniteData<ProductsApiResponse>,
    ["products"],
    number
  >({
    queryKey: ["products"],
    queryFn: ({ pageParam = 1 }) => getProducts(pageParam),
    getNextPageParam: (lastPage: ProductsApiResponse, allPages: ProductsApiResponse[]) => {
      const totalFetched = allPages.reduce(
        (acc, page) => acc + page.products.length,
        0,
      );
      return totalFetched < lastPage.total ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const products: Product[] = data?.pages.flatMap((page) => page.products) ?? [];

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
