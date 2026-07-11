/**
 * @file useProducts.ts
 * @description Hook personalizado para gestión de productos con paginación infinita usando React Query.
 * @architecture Application Layer - Custom Hook
 */

import { useInfiniteQuery } from "@tanstack/react-query";
import { getProducts } from "@/features/products/infrastructure/productsApi";
import type {
    IProduct,
    IUseProductsResult,
} from "@/features/products/application/types";

/** Cantidad de productos por página para la paginación infinita. */
const PRODUCTS_PER_PAGE = 20;

/**
 * Hook para obtener y gestionar la lista de productos con paginación infinita.
 *
 * @remarks
 * Utiliza `useInfiniteQuery` de TanStack Query con queryKey `["products", category]`.
 * - `staleTime` por defecto de React Query (0ms).
 * - Cada página solicita `PRODUCTS_PER_PAGE` (20) elementos.
 * - `getNextPageParam` calcula si hay más páginas basándose en el total devuelto por la API.
 *
 * @param category - Categoría opcional para filtrar los productos. Cambiar este valor reinicia la consulta.
 * @returns Objeto con la lista plana de productos, estados de carga y control de paginación.
 * @see IUseProductsResult - Estructura completa del valor retornado.
 * @see getProducts - Función de infraestructura que realiza la petición HTTP.
 */
export const useProducts = (category?: string): IUseProductsResult => {
    const {
        isLoading: isInitialLoading,
        error,
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ["products", category] as const,
        queryFn: async ({ pageParam = 1 }) => {
            const skip = (pageParam - 1) * PRODUCTS_PER_PAGE;
            return getProducts(skip, PRODUCTS_PER_PAGE, category);
        },
        getNextPageParam: (lastPage, allPages) => {
            const totalFetched = allPages.length * PRODUCTS_PER_PAGE;
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
        isLoading: isInitialLoading || isFetchingNextPage,
        initialLoading: isInitialLoading,
        hasMore: hasNextPage ?? false,
        loadMoreProducts: fetchNextPage,
        isLoadingMore: isFetchingNextPage,
    };
};
