// ─── Ticket Status ────────────────────────────────────────────────────────────

export type TicketStatus = 'Open' | 'In Progress' | 'Done';

// ─── Core Domain Models ───────────────────────────────────────────────────────

/**
 * Represents a support/work ticket.
 * title is validated to max 100 characters at the schema layer (see lib/validations.ts).
 */
export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  createdAt: string; // ISO-8601 date string
}

/**
 * Represents a comment posted on a ticket.
 */
export interface Comment {
  id: string;
  ticketId: string;
  content: string;
  createdAt: string; // ISO-8601 date string
}
