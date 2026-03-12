/**
 * @file productsApi.ts
 * @description Servicio de infraestructura para interactuar con la API de productos.
 * @architecture Infrastructure Layer - Fetching de productos
 */

import { apiClient } from "@/app/api/apiClient";
import type { ProductsApiResponse } from "@/entities/product/types/product.types";

export const getProducts = async (
  skip: number,
  limit: number,
): Promise<ProductsApiResponse> => {
  const endpoint = `/products?limit=${limit}&skip=${skip}`;
  const rpta = apiClient<ProductsApiResponse>(endpoint);
  return rpta;
};
