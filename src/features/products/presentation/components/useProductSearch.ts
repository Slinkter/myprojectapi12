import { useState, useCallback } from 'react'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { useInfiniteQuery } from '@tanstack/react-query'
import { getProducts } from '@/features/products/infrastructure/productsApi'
import type { IProduct } from '@/features/products/application/types'

const LIMIT = 20

/**
 * Resultado del hook useProductSearch.
 * @interface IUseProductSearchResult
 * @property {string} searchQuery - Valor actual del input de búsqueda.
 * @property {string} debouncedSearch - Valor del input tras aplicar debounce (350ms).
 * @property {(query: string) => void} setSearchQuery - Actualiza el término de búsqueda.
 * @property {IProduct[]} products - Lista plana de productos filtrados/coincidentes.
 * @property {boolean} isLoading - Indica si hay una operación de carga en curso.
 * @property {boolean} isSearching - True cuando se está realizando una búsqueda activa.
 * @property {boolean} hasMore - Indica si existen más páginas disponibles.
 * @property {() => void} loadMoreProducts - Dispara la carga de la siguiente página.
 * @property {string | null} error - Mensaje de error si la consulta falló, o null.
 */
interface IUseProductSearchResult {
  searchQuery: string
  debouncedSearch: string
  setSearchQuery: (query: string) => void
  products: IProduct[]
  isLoading: boolean
  isSearching: boolean
  hasMore: boolean
  loadMoreProducts: () => void
  error: string | null
}

/**
 * Hook para búsqueda de productos con debounce y paginación infinita.
 *
 * @remarks
 * Utiliza `useInfiniteQuery` de TanStack Query con queryKey `["products", "search", debouncedSearch]`.
 * Aplica debounce de 350ms al término de búsqueda antes de ejecutar la consulta.
 * Cada página solicita `LIMIT` (20) productos. La paginación se controla con `hasNextPage`.
 *
 * @returns Estado y controladores para la búsqueda de productos.
 * @see IUseProductSearchResult - Estructura completa del valor retornado.
 * @see getProducts - Función de infraestructura que realiza la petición HTTP.
 */
export function useProductSearch(): IUseProductSearchResult {
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

  const loadMoreProducts = useCallback(() => {
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
    loadMoreProducts,
    error: error?.message || null,
  }
}
