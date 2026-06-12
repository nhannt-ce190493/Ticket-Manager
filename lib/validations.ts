import { z } from 'zod';

// ─── Auth Schemas ─────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required.' })
    .email('Please enter a valid email address.'),
  password: z
    .string({ required_error: 'Password is required.' })
    .min(6, 'Password must be at least 6 characters.'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

// ─── Ticket Schemas ───────────────────────────────────────────────────────────

export const createTicketSchema = z.object({
  title: z
    .string({ required_error: 'Title is required.' })
    .min(1, 'Title cannot be empty.')
    .max(100, 'Title must not exceed 100 characters.'),
  description: z
    .string({ required_error: 'Description is required.' })
    .min(1, 'Description cannot be empty.'),
  status: z.enum(['Open', 'In Progress', 'Done'], {
    required_error: 'Status is required.',
  }),
});

export type CreateTicketFormValues = z.infer<typeof createTicketSchema>;

export const updateTicketSchema = createTicketSchema.partial();

export type UpdateTicketFormValues = z.infer<typeof updateTicketSchema>;

// ─── Comment Schema ───────────────────────────────────────────────────────────

export const addCommentSchema = z.object({
  content: z
    .string({ required_error: 'Comment content is required.' })
    .min(1, 'Comment cannot be empty.')
    .max(2000, 'Comment must not exceed 2 000 characters.'),
});

export type AddCommentFormValues = z.infer<typeof addCommentSchema>;
