/**
 * @file useCategories.ts
 * @description Hook de aplicación para obtener las categorías de productos con caché.
 * @architecture Application Layer - Hook de categorías
 */

import { useQuery } from "@tanstack/react-query";
import { getCategories, ICategory } from "@/features/products/infrastructure/productsApi";

/**
 * Hook para obtener y gestionar la lista de categorías con caché prolongada.
 * @returns Retorno estándar de useQuery con categorías.
 */
export const useCategories = () => {
  return useQuery<ICategory[], Error>({
    queryKey: ["categories"] as const,
    queryFn: getCategories,
    staleTime: 1000 * 60 * 60, // 1 hora
  });
};
