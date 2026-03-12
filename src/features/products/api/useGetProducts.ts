import { useInfiniteQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/shared/constants/queryKeys'
import { httpClient } from '@/shared/api/httpClient'
import { mapProductsResponseFromApi } from '@/entities/product/mappers/product.mapper'
import type { ProductsApiResponse, Product, ProductFilters } from '@/entities/product/types/product.types'

const LIMIT = 20

interface UseProductsOptions {
  filters?: ProductFilters
}

interface UseProductsResult {
  products: Product[]
  error: string | null
  loading: boolean
  initialLoading: boolean
  hasMore: boolean
  loadMore: () => void
  isLoadingMore: boolean
}

export function useGetProducts({ filters }: UseProductsOptions = {}): UseProductsResult {
  const {
    isLoading,
    error,
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: QUERY_KEYS.products.list(filters as Record<string, unknown>),
    queryFn: async ({ pageParam = 1 }) => {
      const skip = (pageParam - 1) * LIMIT
      const params: Record<string, string> = {
        limit: String(LIMIT),
        skip: String(skip),
      }
      
      if (filters?.category) {
        params.category = filters.category
      }

      const raw = await httpClient.get<ProductsApiResponse>('/products', { params })
      return mapProductsResponseFromApi(raw)
    },
    getNextPageParam: (lastPage: { products: Product[]; total: number }, allPages: { products: Product[]; total: number }[]) => {
      const totalFetched = allPages.reduce((acc, page) => acc + page.products.length, 0)
      return totalFetched < lastPage.total ? allPages.length + 1 : undefined
    },
    initialPageParam: 1,
  })

  const products: Product[] = data?.pages.flatMap((page) => page.products) ?? []

  return {
    products,
    error: error?.message || null,
    loading: isFetchingNextPage,
    initialLoading: isLoading,
    hasMore: hasNextPage ?? false,
    loadMore: fetchNextPage,
    isLoadingMore: isFetchingNextPage,
  }
}
