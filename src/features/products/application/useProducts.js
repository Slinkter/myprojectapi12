import { useInfiniteQuery } from '@tanstack/react-query';
import { getProducts } from '../infrastructure/productsApi';

/**
 * Custom hook to manage fetching and paginating products using React Query.
 * Provides automatic caching, request deduplication, and optimized refetching.
 * @returns {{
 *  products: Array<Object>,
 *  error: string | null,
 *  loading: boolean,
 *  initialLoading: boolean,
 *  hasMore: boolean,
 *  loadMore: () => void,
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
  } = useInfiniteQuery({
    queryKey: ['products'],
    queryFn: ({ pageParam = 1 }) => getProducts(pageParam),
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.reduce(
        (acc, page) => acc + page.products.length,
        0
      );
      return totalFetched < lastPage.total ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });

  // Flatten all pages into a single array of products
  const products = data?.pages.flatMap((page) => page.products) ?? [];

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
