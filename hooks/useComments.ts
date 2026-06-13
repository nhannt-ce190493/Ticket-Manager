import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCommentsByTicketId, addComment } from '@/lib/mock-api';
import type { Comment } from '@/types';

// ─── useComments ──────────────────────────────────────────────────────────────

/**
 * useComments — fetches all comments for a ticket.
 * queryKey: ['comments', ticketId]
 */
export function useComments(ticketId: string) {
  return useQuery<Comment[], Error>({
    queryKey: ['comments', ticketId],
    queryFn: () => getCommentsByTicketId(ticketId),
    enabled: !!ticketId,
    staleTime: 30_000,
  });
}

// ─── useAddComment ────────────────────────────────────────────────────────────

interface AddCommentVariables {
  ticketId: string;
  content: string;
}

/**
 * useAddComment — mutation to post a new comment.
 * onSuccess: invalidates ['comments', ticketId].
 * onError: the form input is NOT cleared — handled by the caller.
 */
export function useAddComment() {
  const queryClient = useQueryClient();

  return useMutation<Comment, Error, AddCommentVariables>({
    mutationFn: ({ ticketId, content }: AddCommentVariables) =>
      addComment(ticketId, content),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.ticketId] });
    },
  });
}
