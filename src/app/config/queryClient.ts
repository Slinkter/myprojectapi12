/**
 * @file queryClient.ts
 * @description Configuración del cliente de TanStack Query (React Query).
 * Define las opciones por defecto para caché, reintentos y comportamiento de red.
 * @architecture Infrastructure Layer - Query Client Configuration
 */
import { QueryClient } from "@tanstack/react-query";

/**
 * Instancia global de QueryClient.
 * Configurada con tiempos de stale/cache optimizados para e-commerce.
 *
 * @property {object} defaultOptions.queries
 * @property {number} staleTime - 5 minutos (tiempo que los datos se consideran frescos)
 * @property {number} gcTime - 30 minutos (tiempo que la caché persiste)
 * @property {number} retry - 2 reintentos en caso de fallo
 */

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // Data is considered fresh for 5 minutes
            gcTime: 1000 * 60 * 30, // Cache persists for 30 minutes
            retry: 2, // Retry failed requests twice
            refetchOnWindowFocus: false, // Don't refetch on window focus (can be enabled if needed)
            refetchOnReconnect: true, // Refetch on reconnect
        },
    },
});
