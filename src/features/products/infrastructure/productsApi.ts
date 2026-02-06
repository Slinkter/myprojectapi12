// src/features/products/infrastructure/productsApi.ts
import { apiClient } from "@/app/api/apiClient";
import { ProductsApiResponse } from "../application/types";

const LIMIT = 20;

/**
 * Obtiene una lista paginada de productos de la API.
 * @param {number} page - El número de página a obtener, comenzando desde 1.
 * @returns {Promise<ProductsApiResponse>} Un objeto que contiene la lista de productos y el recuento total.
 */
export const getProducts = async (page: number): Promise<ProductsApiResponse> => {
    const skip = (page - 1) * LIMIT;
    const endpoint = `/products?limit=${LIMIT}&skip=${skip}`;
    return apiClient<ProductsApiResponse>(endpoint);
};
