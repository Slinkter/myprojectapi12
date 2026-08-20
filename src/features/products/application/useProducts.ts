/**
 * @file useProducts.ts
 * @description Hook personalizado para gestión de productos con paginación infinita usando React Query.
 * @architecture Application Layer - Custom Hook
 */

import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getProducts } from "@/features/products/infrastructure/productsFirestore";
import type { IProduct, IUseProductsResult } from "@/features/products/application/types";

/** Cantidad de productos por página para la paginación infinita. */
const PRODUCTS_PER_PAGE = 20;

/**
 * Hook interno para ejecutar la consulta de paginación infinita con React Query.
 * @param category - Categoría opcional para filtrar los productos en la API.
 */
function useProductsQuery(category?: string) {
    return useInfiniteQuery({
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
}

/**
 * Hook para obtener y gestionar la lista de productos con paginación infinita.
 *
 * @remarks
 * Utiliza `useInfiniteQuery` de TanStack Query con queryKey `["products", category]`.
 * Calcula los estados derivados durante el renderizado (rerender-derived-state-no-effect) y
 * combina las páginas en una única estructura plana memoizada (js-combine-iterations).
 *
 * @param category - Categoría opcional para filtrar los productos. Cambiar este valor reinicia la consulta.
 * @returns {IUseProductsResult} Objeto con la lista plana de productos, estados de carga y control de paginación.
 * @see IUseProductsResult - Estructura completa del valor retornado.
 * @see getProducts - Función de infraestructura que realiza la petición HTTP.
 */
export const useProducts = (category?: string): IUseProductsResult => {
    const query = useProductsQuery(category);

    // Aplanar las páginas de productos mediante un bucle eficiente en useMemo (js-combine-iterations)
    const products = useMemo<IProduct[]>(() => {
        if (!query.data?.pages) return [];
        const flattened: IProduct[] = [];
        for (const page of query.data.pages) {
            for (const item of page.products) {
                flattened.push(item);
            }
        }
        return flattened;
    }, [query.data?.pages]);

    // Estados derivados calculados en línea durante el render sin efectos redundantes (rerender-derived-state-no-effect)
    const error = query.error?.message || null;
    const isLoading = query.isLoading || query.isFetchingNextPage;
    const initialLoading = query.isLoading;
    const hasMore = query.hasNextPage ?? false;
    const isLoadingMore = query.isFetchingNextPage;

    return {
        products,
        error,
        isLoading,
        initialLoading,
        hasMore,
        loadMoreProducts: query.fetchNextPage,
        isLoadingMore,
    };
};
