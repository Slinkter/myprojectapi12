/**
 * @file apiClient.ts
 * @description Cliente HTTP base para la aplicación.
 * Provee una envoltura alrededor de fetch para manejar URLs base y headers comunes.
 * @architecture Infrastructure Layer - Core API Client
 */

import { config } from "@/app/config/env";

const BASE_URL = config.api.baseUrl;

/**
 * Base HTTP client for the application.
 *
 * @remarks
 * This is a generic asynchronous HTTP client that wraps the native `fetch` API.
 * It automatically handles the base URL, sets default JSON headers, and
 * performs basic error handling for non-OK responses.
 *
 * @typeParam T - The expected shape of the JSON response data.
 * @param endpoint - The specific API endpoint path (e.g., "/products").
 * @param options - Optional configuration for the `fetch` request.
 * @returns A promise that resolves to the parsed JSON data of type `T`.
 *
 * @throws {Error} If the network response status is not OK (2xx).
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
