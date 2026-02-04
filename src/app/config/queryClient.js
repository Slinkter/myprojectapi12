import { QueryClient } from '@tanstack/react-query';

/**
 * React Query Client Configuration
 * Configured with optimal defaults for caching and refetching
 */
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Data is considered fresh for 5 minutes
            staleTime: 1000 * 60 * 5,
            // Cache persists for 30 minutes
            gcTime: 1000 * 60 * 30,
            // Retry failed requests twice
            retry: 2,
            // Don't refetch on window focus (can be enabled if needed)
            refetchOnWindowFocus: false,
            // Refetch on reconnect
            refetchOnReconnect: true,
        },
    },
});
