/**
 * @file apiClient.ts
 * @description Cliente HTTP base para la aplicación.
 * Provee una envoltura alrededor de fetch para manejar URLs base y headers comunes.
 * @architecture Capa de Infraestructura - Cliente de API Core
 */

import { config } from "@/app/config/env";

const BASE_URL = config.api.baseUrl;

/**
 * Cliente HTTP base para la aplicación.
 *
 * @remarks
 * Este es un cliente HTTP asíncrono genérico que envuelve la API nativa `fetch`.
 * Maneja automáticamente la URL base, establece encabezados JSON predeterminados y
 * realiza un manejo básico de errores para respuestas que no son OK.
 *
 * @typeParam T - La forma esperada de los datos de respuesta JSON.
 * @param endpoint - La ruta específica del endpoint de la API (ej., "/products").
 * @param options - Configuración opcional para la solicitud `fetch`.
 * @returns Una promesa que se resuelve con los datos JSON analizados de tipo `T`.
 *
 * @throws {Error} Si el estado de la respuesta de red no es OK (2xx).
 *
 * @example
 * ```typescript
 * interface User { id: number; name: string; }
 * const user = await apiClient<User>('/users/1');
 * ```
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
