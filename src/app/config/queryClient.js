/**
 * @file queryClient.js
 * @description Configuration for the `@tanstack/react-query` client.
 *   This file initializes a singleton `QueryClient` instance with default options
 *   for queries, optimizing caching and data refetching behavior across the application.
 * @architecture Centralizes global settings for React Query, influencing how data is fetched,
 *   cached, and kept up-to-date throughout the application's lifecycle.
 * @sideeffects Creates a singleton `QueryClient` instance that manages data caching and query states.
 * @perf Configured with `staleTime` of 5 minutes and `gcTime` of 30 minutes to ensure optimal data freshness
 *   and efficient memory management by preventing unnecessary refetches and pruning unused cache entries.
 */
import { QueryClient } from '@tanstack/react-query';

/**
 * @constant {QueryClient} queryClient
 * @description An instance of `QueryClient` configured with default options for all queries.
 *   These options dictate caching, refetching, and error handling strategies.
 * @property {object} defaultOptions.queries - Default options applied to all `useQuery` hooks.
 * @property {number} defaultOptions.queries.staleTime - How long data is considered fresh (5 minutes).
 * @property {number} defaultOptions.queries.gcTime - How long unused data remains in cache before garbage collection (30 minutes).
 * @property {number} defaultOptions.queries.retry - Number of times to retry a failed query (2 times).
 * @property {boolean} defaultOptions.queries.refetchOnWindowFocus - Whether to refetch data when window regains focus (disabled).
 * @property {boolean} defaultOptions.queries.refetchOnReconnect - Whether to refetch data when network connection is re-established (enabled).
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
