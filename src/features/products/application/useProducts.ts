/**
 * @file useProducts.ts
 * @description Hook personalizado para gestión de productos con paginación infinita usando React Query.
 * @architecture Application Layer - Custom Hook
 */

import { useInfiniteQuery } from "@tanstack/react-query";
import { getProducts } from "@/features/products/infrastructure/productsApi";
import type { Product } from "@/entities/product/types/product.types";
import type { IUseProductsResult } from "@/features/products/application/types";

const LIMIT = 20;

export const useProducts = (): IUseProductsResult => {
  const {
    isLoading,
    error,
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["products"] as const,
    queryFn: async ({ pageParam = 1 }) => {
      const skip = (pageParam - 1) * LIMIT
      const response = await getProducts(skip, LIMIT)
      return response
    },
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.reduce(
        (acc, page) => acc + page.products.length,
        0,
      );
      return totalFetched < lastPage.total ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const products: Product[] =
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
