/**
 * @file queryClient.ts
 * @description Configuración del cliente de TanStack Query (React Query).
 * Define las opciones por defecto para caché, reintentos y comportamiento de red.
 * @architecture Infrastructure Layer - Query Client Configuration
 */
import { QueryClient } from "@tanstack/react-query";

/**
 * Global QueryClient instance.
 *
 * @remarks
 * This instance centralizes the data fetching and caching strategy for the app.
 *
 * Justification for default options:
 * - `staleTime` (5 min): In an e-commerce context, product data (prices, titles)
 *   doesn't change every second. 5 minutes is a safe balance to reduce API
 *   calls while keeping data fresh.
 * - `gcTime` (30 min): Keeps data in memory longer to allow fast navigation
 *   back and forth between products.
 * - `retry` (2): Provides resilience against transient network failures
 *   without causing excessive load on the server during outages.
 * - `refetchOnWindowFocus` (false): Prevents unnecessary re-fetches when
 *   switching browser tabs, saving bandwidth.
 */
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,
            gcTime: 1000 * 60 * 30,
            retry: 2,
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
        },
    },
});
