import { useState, useCallback } from 'react'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { useInfiniteQuery } from '@tanstack/react-query'
import { getProducts } from '@/features/products/infrastructure/productsApi'
import type { IProduct } from '@/features/products/application/types'

const LIMIT = 20

interface UseProductSearchResult {
  searchQuery: string
  debouncedSearch: string
  setSearchQuery: (query: string) => void
  products: IProduct[]
  isLoading: boolean
  isSearching: boolean
  hasMore: boolean
  loadMore: () => void
  error: string | null
}

export function useProductSearch(): UseProductSearchResult {
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearch = useDebounce(searchQuery, 350)

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
      const skip = (pageParam - 1) * LIMIT
      return getProducts(skip, LIMIT)
    },
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.length * LIMIT
      return totalFetched < lastPage.total ? allPages.length + 1 : undefined
    },
    initialPageParam: 1,
  })

  const products: IProduct[] = data?.pages.flatMap((page) => page.products) ?? []

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetching) {
      fetchNextPage()
    }
  }, [hasNextPage, isFetching, fetchNextPage])

  return {
    searchQuery,
    debouncedSearch,
    setSearchQuery,
    products,
    isLoading,
    isSearching: isFetching && searchQuery.length > 0,
    hasMore: hasNextPage ?? false,
    loadMore,
    error: error?.message || null,
  }
}
