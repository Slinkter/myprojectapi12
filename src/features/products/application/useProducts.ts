// src/features/products/application/useProducts.ts
import {
  useInfiniteQuery,
  UseInfiniteQueryResult,
  InfiniteData,
  // Removed unused imports: FetchNextPageOptions, FetchNextPageResult
} from "@tanstack/react-query";
import { getProducts } from "../infrastructure/productsApi";
import { Product, ProductsApiResponse } from "./types";

/**
 * Hook personalizado para gestionar la obtención y paginación de productos utilizando React Query.
 * Proporciona caché automática, deduplicación de solicitudes y refetching optimizado.
 *
 * @returns {{
 *  products: Product[],
 *  error: string | null,
 *  loading: boolean,
 *  initialLoading: boolean,
 *  hasMore: boolean,
 *  loadMore: (options?: Parameters<typeof useInfiniteQuery>[0]['queryFn']) => ReturnType<typeof useInfiniteQuery>['fetchNextPage'],
 *  isLoadingMore: boolean
 * }}
 */
export const useProducts = () => {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
  }: UseInfiniteQueryResult<InfiniteData<ProductsApiResponse>, Error> = useInfiniteQuery<
    ProductsApiResponse, // TQueryFnData: type of each page's data
    Error, // TError: type of the error
    InfiniteData<ProductsApiResponse>, // TData: type of the data structure returned by the hook (InfiniteData)
    ["products"], // TQueryKey: type of the query key
    number // TPageParam: type of the page parameter
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

  // Flatten all pages into a single array of products
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
