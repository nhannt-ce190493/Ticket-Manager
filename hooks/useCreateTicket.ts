import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { createTicket } from '@/lib/mock-api';
import type { CreateTicketFormData } from '@/lib/validations';

/**
 * useCreateTicket — mutation để tạo ticket mới.
 * onSuccess: invalidate ['tickets'] cache và redirect về /tickets.
 */
export function useCreateTicket() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: CreateTicketFormData) =>
      createTicket({ ...data, status: 'Open' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      router.push('/tickets');
    },
  });
}
