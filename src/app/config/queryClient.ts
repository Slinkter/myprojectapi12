/**
 * @file queryClient.ts
 * @description Configuración del cliente de TanStack Query (React Query).
 * Define las opciones por defecto para caché, reintentos y comportamiento de red.
 * @architecture Capa de Infraestructura - Configuración del Cliente de Query
 */
import { QueryClient, QueryCache } from "@tanstack/react-query";

/** Instancia global de QueryClient para TanStack Query con configuración predeterminada. @remarks Configura staleTime en 5 min, gcTime en 30 min, reintentos: 2, y desactiva refetchOnWindowFocus. Incluye caché de consultas con logging en consola para éxito y error. */
export const queryClient = new QueryClient({
    queryCache: new QueryCache({
        onSuccess: (data, query) => {
            console.log(`[API] ✅ Success: ${query.queryKey}`, data);
        },
        onError: (error, query) => {
            console.log(`[API] ❌ Error: ${query.queryKey}`, error);
        },
    }),
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

