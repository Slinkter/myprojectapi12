/**
 * @file productsApi.ts
 * @description Servicio de infraestructura para interactuar con la API de productos.
 * @architecture Infrastructure Layer - Fetching de productos
 */

import { apiClient } from "@/app/api/apiClient";
import { IProductsApiResponse } from "@/features/products/application/types";

const LIMIT = 20;

export const getProducts = async (
  page: number,
): Promise<IProductsApiResponse> => {
  const skip = (page - 1) * LIMIT;
  const endpoint = `/products?limit=${LIMIT}&skip=${skip}`;
  const rpta = apiClient<IProductsApiResponse>(endpoint);
  return rpta;
};
