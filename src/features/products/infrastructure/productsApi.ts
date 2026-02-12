/**
 * @file productsApi.ts
 * @description Servicio de infraestructura para interactuar con la API de productos.
 * @architecture Infrastructure Layer - Fetching de productos
 */

import { apiClient } from "@/app/api/apiClient";
import { ProductsApiResponse } from "../application/types";

/**
 * Number of products to fetch per page.
 *
 * @remarks
 * A limit of 20 is chosen to balance between enough content to fill the screen
 * (even on large displays) and keeping the initial payload small for mobile performance.
 */
const LIMIT = 20;

/**
 * Fetches a paginated list of products from the external API.
 *
 * @remarks
 * This function handles the logic of converting a human-readable page number
 * into the `limit` and `skip` parameters required by the DummyJSON API.
 *
 * @param page - The page number to retrieve (1-based).
 * @returns A promise resolving to the products and pagination metadata.
 *
 * @example
 * ```typescript
 * const firstPage = await getProducts(1);
 * ```
 */
export const getProducts = async (page: number): Promise<ProductsApiResponse> => {
    const skip = (page - 1) * LIMIT;
    const endpoint = `/products?limit=${LIMIT}&skip=${skip}`;
    return apiClient<ProductsApiResponse>(endpoint);
};
