import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTicketById, updateTicketStatus } from '@/lib/mock-api';
import type { TicketStatus } from '@/types';

/**
 * useTicket — fetch a single ticket by id.
 * queryKey: ['ticket', id] — staleTime: 30s.
 */
export function useTicket(id: string) {
  return useQuery({
    queryKey: ['ticket', id],
    queryFn: () => getTicketById(id),
    enabled: !!id,
    staleTime: 30_000,
    retry: (failureCount, error) => {
      // Do not retry on 404-like errors
      if (error instanceof Error && error.message.includes('not found')) return false;
      return failureCount < 2;
    },
  });
}

/**
 * useUpdateTicketStatus — mutation to change a ticket's status.
 * onSuccess: invalidates both ['ticket', id] and ['tickets'].
 */
export function useUpdateTicketStatus(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (status: TicketStatus) => updateTicketStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', id] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
}
