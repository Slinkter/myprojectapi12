/**
 * @file apiClient.ts
 * @description Cliente HTTP base para la aplicación.
 * Provee una envoltura alrededor de fetch para manejar URLs base y headers comunes.
 * @architecture Infrastructure Layer - Core API Client
 */

import { config } from "@/app/config/env";

const BASE_URL = config.api.baseUrl;

/**
 * Un cliente HTTP genérico y asíncrono para manejar solicitudes `fetch` a la API.
 * Construye la URL completa, aplica encabezados JSON predeterminados y maneja el estado de la respuesta de red.
 *
 * @template T El tipo esperado de los datos de la respuesta JSON.
 * @param {string} endpoint La ruta específica del endpoint de la API (ej. "/products", "/users").
 * @param {RequestInit} [options={}] Objeto de configuración opcional para la solicitud `fetch`.
 * @returns {Promise<T>} Una promesa que se resuelve con los datos de la respuesta JSON de la API.
 * @throws {Error} Lanza un `Error` si el estado de la respuesta de red no es `ok` (ej. `response.ok` es false).
 */
export const apiClient = async <T>(
    endpoint: string,
    options: RequestInit = {},
): Promise<T> => {
    const url = `${BASE_URL}${endpoint}`;

    const requestConfig: RequestInit = {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    };

    const response = await fetch(url, requestConfig);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json() as Promise<T>;
};
