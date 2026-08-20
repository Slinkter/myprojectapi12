/**
 * @file useProductSearch.ts
 * @description Hook de aplicación para búsqueda remota de productos con debounce y paginación infinita con TanStack Query.
 * @architecture Application Layer - Products Search Use Case
 */

import { useState, useCallback } from 'react';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getProducts } from '@/features/products/infrastructure/productsApi';
import type { IProduct } from '@/features/products/application/types';

const LIMIT = 20;

/**
 * Resultado del hook useProductSearch.
 * @interface IUseProductSearchResult
 */
export interface IUseProductSearchResult {
  searchQuery: string;
  debouncedSearch: string;
  setSearchQuery: (query: string) => void;
  products: IProduct[];
  isLoading: boolean;
  isSearching: boolean;
  hasMore: boolean;
  loadMoreProducts: () => void;
  error: string | null;
}

/**
 * Hook para búsqueda de productos con debounce y paginación infinita.
 *
 * @returns {IUseProductSearchResult} Estado y controladores para la búsqueda de productos.
 */
export function useProductSearch(): IUseProductSearchResult {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 350);

  const {
    data,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
    error,
  } = useInfiniteQuery({
    queryKey: ['products', 'search', debouncedSearch] as const,
    queryFn: async ({ pageParam = 1 }) => {
      const skip = (pageParam - 1) * LIMIT;
      return getProducts(skip, LIMIT);
    },
    getNextPageParam: (lastPage, allPages) => {
      const currentCount = allPages.length * LIMIT;
      return currentCount < lastPage.total ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const products = data ? data.pages.flatMap((page) => page.products) : [];

  const loadMoreProducts = useCallback(() => {
    if (hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetching, fetchNextPage]);

  return {
    searchQuery,
    debouncedSearch,
    setSearchQuery,
    products,
    isLoading,
    isSearching: isFetching,
    hasMore: Boolean(hasNextPage),
    loadMoreProducts,
    error: error ? error.message : null,
  };
}
