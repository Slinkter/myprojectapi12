/**
 * @file apiClient.ts
 * @description Cliente de API estandarizado para la aplicación.
 * Proporciona una capa de abstracción sobre fetch con manejo estructurado de errores.
 * @architecture Capa de Aplicación - Infraestructura de API
 */

import { config } from "@/app/config/env";

const BASE_URL = config.api.baseUrl;

/**
 * Clase personalizada para errores de API que incluye metadatos adicionales.
 */
export class ApiError extends Error {
  constructor(
    public message: string,
    public status: number,
    public statusText: string,
    public data?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Cliente de API basado en fetch con manejo de tipos y errores.
 * 
 * @template T - Tipo esperado de la respuesta.
 * @param {string} endpoint - URL relativa del recurso.
 * @param {RequestInit} [options={}] - Opciones de configuración de la petición.
 * @returns {Promise<T>} Promesa con los datos tipados.
 * @throws {ApiError} Si la respuesta no es exitosa.
 * 
 * @example
 * const products = await apiClient<IProductsApiResponse>('/products');
 */
export const apiClient = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> => {
  const url = `${BASE_URL}${endpoint}`;
  
  const requestOptions: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = null;
      }

      throw new ApiError(
        `Error en la petición API (${response.status})`,
        response.status,
        response.statusText,
        errorData
      );
    }

    // Si la respuesta está vacía (204 No Content), devolvemos null o {}
    if (response.status === 204) {
      return {} as T;
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    
    // Error de red o error inesperado
    throw new ApiError(
      error instanceof Error ? error.message : "Error de red desconocido",
      500,
      "Internal Network Error"
    );
  }
};
