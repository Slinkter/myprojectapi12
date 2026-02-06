// src/app/config/queryClient.ts
import { QueryClient } from "@tanstack/react-query";

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