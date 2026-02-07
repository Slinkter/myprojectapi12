/**
 * @file productsApi.ts
 * @description Servicio de infraestructura para interactuar con la API de productos.
 * @architecture Infrastructure Layer - Fetching de productos
 */

import { apiClient } from "@/app/api/apiClient";
import { ProductsApiResponse } from "../application/types";

/**
 * Límite de productos por página para la paginación.
 * @constant {number}
 */
const LIMIT = 20;

/**
 * @function getProducts
 * @description Obtiene una lista paginada de productos de la API externa.
 * Calcula automáticamente el parámetro 'skip' basado en la página solicitada.
 * 
 * @param {number} page - El número de página a obtener (basado en 1).
 * @returns {Promise<ProductsApiResponse>} Promesa con los datos de los productos y metadatos de paginación.
 * 
 * @example
 * const data = await getProducts(1);
 * console.log(data.products);
 */
export const getProducts = async (page: number): Promise<ProductsApiResponse> => {
    const skip = (page - 1) * LIMIT;
    const endpoint = `/products?limit=${LIMIT}&skip=${skip}`;
    return apiClient<ProductsApiResponse>(endpoint);
};
