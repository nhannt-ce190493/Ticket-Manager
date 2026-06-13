import { useQuery } from '@tanstack/react-query';
import { getTickets } from '@/lib/mock-api';

/**
 * useTickets — fetches the ticket list, optionally filtered by a search term.
 *
 * - queryKey includes searchTerm so each distinct search has its own cache entry.
 * - staleTime: 30 000 ms (data is considered fresh for 30 s).
 */
export function useTickets(searchTerm: string) {
  return useQuery({
    queryKey: ['tickets', searchTerm],
    queryFn: () => getTickets(searchTerm || undefined),
    staleTime: 30_000,
  });
}
