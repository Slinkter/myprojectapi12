/**
 * @file queryClient.js
 * @description Configuración para el cliente `@tanstack/react-query`.
 *   Este archivo inicializa una instancia `QueryClient` singleton con opciones predeterminadas
 *   para las consultas, optimizando el comportamiento de caché y recarga de datos en toda la aplicación.
 * @architecture Centraliza la configuración global para React Query, influyendo en cómo se obtienen,
 *   almacenan en caché y mantienen actualizados los datos a lo largo del ciclo de vida de la aplicación.
 * @sideeffects Crea una instancia `QueryClient` singleton que gestiona el almacenamiento en caché de datos y los estados de las consultas.
 * @perf Configurado con `staleTime` de 5 minutos y `gcTime` de 30 minutos para asegurar una frescura óptima de los datos
 *   y una gestión eficiente de la memoria, previniendo recargas innecesarias y eliminando entradas de caché no utilizadas.
 */
import { QueryClient } from "@tanstack/react-query";

/**
 * @constant {QueryClient} queryClient
 * @description Una instancia de `QueryClient` configurada con opciones predeterminadas para todas las consultas.
 *   Estas opciones dictan las estrategias de caché, recarga y manejo de errores.
 * @property {object} defaultOptions.queries - Opciones predeterminadas aplicadas a todos los hooks `useQuery`.
 * @property {number} defaultOptions.queries.staleTime - Cuánto tiempo se considera que los datos están frescos (5 minutos).
 * @property {number} defaultOptions.queries.gcTime - Cuánto tiempo permanecen los datos no utilizados en la caché antes de la recolección de basura (30 minutos).
 * @property {number} defaultOptions.queries.retry - Número de reintentos para una consulta fallida (2 veces).
 * @property {boolean} defaultOptions.queries.refetchOnWindowFocus - Si se deben recargar los datos cuando la ventana recupera el foco (deshabilitado).
 * @property {boolean} defaultOptions.queries.refetchOnReconnect - Si se deben recargar los datos cuando se restablece la conexión de red (habilitado).
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
