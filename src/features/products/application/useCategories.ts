/**
 * @file useCategories.ts
 * @description Hook de aplicación para obtener las categorías de productos con caché.
 * @architecture Application Layer - Hook de categorías
 */

import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/features/products/infrastructure/productsFirestore";
import type { ICategory } from "@/features/products/infrastructure/productsApi";

/**
 * Hook para obtener y gestionar la lista de categorías con caché prolongada.
 *
 * @remarks
 * Utiliza `useQuery` de TanStack Query con:
 * - queryKey `["categories"]` — estable, no depende de parámetros.
 * - `staleTime: 60 * 60 * 1000` (1 hora) para minimizar revalidaciones.
 * - Los datos se reutilizan entre sesiones gracias a la caché de React Query.
 *
 * @returns Objeto estándar de `useQuery<ICategory[], Error>` con `data`, `isLoading`, `error`, etc.
 * @see getCategories - Función de infraestructura que realiza la petición HTTP.
 * @see ICategory - Estructura de cada categoría.
 */
export const useCategories = () => {
  return useQuery<ICategory[], Error>({
    queryKey: ["categories"] as const,
    queryFn: getCategories,
    staleTime: 1000 * 60 * 60, // 1 hora
  });
};
