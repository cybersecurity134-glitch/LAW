import { QueryClient } from '@tanstack/react-query';

// Central QueryClient configured for high-performance caching of legal data
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Legal statutes and provisions change rarely, so consider them fresh for 10 minutes
      staleTime: 10 * 60 * 1000,
      // Keep cached data in memory for 1 hour to prevent redundant network requests across navigation
      gcTime: 60 * 60 * 1000,
      // Prevent refetch churn when users switch tabs or windows while reading statutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      retry: 1,
    },
  },
});
