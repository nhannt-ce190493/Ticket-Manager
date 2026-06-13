'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRef } from 'react';

export function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  // useRef ensures the QueryClient is created once per component lifetime,
  // not on every render, while still living outside the render cycle.
  const clientRef = useRef<QueryClient | null>(null);
  if (!clientRef.current) {
    clientRef.current = new QueryClient({
      defaultOptions: {
        queries: {
          // Keep data fresh for 30 seconds by default
          staleTime: 30_000,
          // Retry failed requests once before surfacing an error
          retry: 1,
        },
      },
    });
  }

  return (
    <QueryClientProvider client={clientRef.current}>
      {children}
    </QueryClientProvider>
  );
}
