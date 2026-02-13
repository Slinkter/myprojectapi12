/**
 * @file productsApi.ts
 * @description Servicio de infraestructura para interactuar con la API de productos.
 * @architecture Infrastructure Layer - Fetching de productos
 */

import { apiClient } from "@/app/api/apiClient";
import { ProductsApiResponse } from "../application/types";

/**
 * Número de productos a obtener por página.
 *
 * @remarks
 * Se elige un límite de 20 para equilibrar entre tener suficiente contenido para llenar la pantalla
 * (incluso en pantallas grandes) y mantener el tamaño de la carga inicial pequeño para el rendimiento móvil.
 */
const LIMIT = 20;

/**
 * Obtiene una lista paginada de productos de la API externa.
 *
 * @remarks
 * Esta función maneja la lógica de convertir un número de página legible por humanos
 * en los parámetros `limit` y `skip` requeridos por la API de DummyJSON.
 *
 * @param page - El número de página a recuperar (basado en 1).
 * @returns Una promesa que se resuelve con los productos y los metadatos de paginación.
 *
 * @example
 * ```typescript
 * const firstPage = await getProducts(1);
 * ```
 */
export const getProducts = async (
    page: number,
): Promise<ProductsApiResponse> => {
    const skip = (page - 1) * LIMIT;
    const endpoint = `/products?limit=${LIMIT}&skip=${skip}`;
    return apiClient<ProductsApiResponse>(endpoint);
};
