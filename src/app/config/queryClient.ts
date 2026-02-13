/**
 * @file queryClient.ts
 * @description Configuración del cliente de TanStack Query (React Query).
 * Define las opciones por defecto para caché, reintentos y comportamiento de red.
 * @architecture Capa de Infraestructura - Configuración del Cliente de Query
 */
import { QueryClient } from "@tanstack/react-query";

/**
 * Instancia global de QueryClient.
 *
 * @remarks
 * Esta instancia centraliza la estrategia de obtención de datos y caché para la aplicación.
 *
 * Justificación de las opciones por defecto:
 * - `staleTime` (5 min): En un contexto de comercio electrónico, los datos de los productos (precios, títulos)
 *   no cambian cada segundo. 5 minutos es un equilibrio seguro para reducir las llamadas a la API
 *   mientras se mantienen los datos frescos.
 * - `gcTime` (30 min): Mantiene los datos en memoria más tiempo para permitir una navegación rápida
 *   hacia atrás y adelante entre productos.
 * - `retry` (2): Proporciona resiliencia contra fallos de red transitorios
 *   sin causar una carga excesiva en el servidor durante las interrupciones.
 * - `refetchOnWindowFocus` (false): Evita re-obtenciones innecesarias al
 *   cambiar de pestaña en el navegador, ahorrando ancho de banda.
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
