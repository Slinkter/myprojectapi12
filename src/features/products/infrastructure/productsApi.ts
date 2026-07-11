/**
 * @file productsApi.ts
 * @description Servicio de infraestructura para interactuar con la API de productos.
 * @architecture Infrastructure Layer - Fetching de productos
 */

import apiClient from "@/app/api/apiClient";
import type { IProductsApiResponse } from "@/features/products/domain/productTypes";

/**
 * Obtiene una lista paginada de productos de la API, opcionalmente filtrada por categoría.
 * 
 * @param {number} skip - Cantidad de elementos a saltar (offset).
 * @param {number} limit - Cantidad máxima de elementos a retornar.
 * @param {string} [category] - Categoría opcional para filtrar los productos.
 * @returns {Promise<IProductsApiResponse>} Promesa con la respuesta paginada de productos.
 */
export interface ICategory {
  slug: string;
  name: string;
  url: string;
}

/**
 * Obtiene la lista de categorías disponibles desde la API.
 * @returns {Promise<ICategory[]>}
 */
export const getCategories = async (): Promise<ICategory[]> => {
  return apiClient<ICategory[]>('/products/categories');
};

/**
 * Obtiene una lista paginada de productos de la API, opcionalmente filtrada por categoría.
 * 
 * @param {number} skip - Cantidad de elementos a saltar (offset).
 * @param {number} limit - Cantidad máxima de elementos a retornar.
 * @param {string} [category] - Categoría opcional para filtrar los productos.
 * @returns {Promise<IProductsApiResponse>} Promesa con la respuesta paginada de productos.
 */
export const getProducts = async (
  skip: number,
  limit: number,
  category?: string,
): Promise<IProductsApiResponse> => {
  const baseUrl = category ? `/products/category/${category}` : '/products';
  const endpoint = `${baseUrl}?limit=${limit}&skip=${skip}`;
  return apiClient<IProductsApiResponse>(endpoint);
};

