/**
 * lib/mock-api.ts
 *
 * Option A: module-level array for in-memory persistence.
 * All functions return Promises with a simulated latency via setTimeout.
 * No real HTTP calls are made; data resets on each server restart.
 */

import type { Ticket, Comment, TicketStatus } from '@/types';

// ─── Simulated Latency ────────────────────────────────────────────────────────

/** Default query latency: 400 ms */
const LATENCY_MS = 400;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), LATENCY_MS));
}

/** Custom-latency variant used for mutations that need a distinct delay. */
function delayMs<T>(value: T, ms: number): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

// ─── ID Generator ─────────────────────────────────────────────────────────────

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

// ─── Seed Data ────────────────────────────────────────────────────────────────

let tickets: Ticket[] = [
  {
    id: 'ticket-001',
    title: 'Login page shows blank screen on Safari',
    description:
      'Users on Safari 16+ report a blank white screen after submitting the login form. The network tab shows a 200 OK but the page does not redirect.',
    status: 'Open',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ticket-002',
    title: 'Export to CSV produces malformed output',
    description:
      'When exporting more than 500 rows to CSV, some rows are duplicated and others are missing. The issue is reproducible with the demo dataset.',
    status: 'In Progress',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ticket-003',
    title: 'Add dark mode support',
    description:
      'Implement a system-preference-aware dark mode toggle. The design tokens are already in place — we just need to wire up the CSS variables and the toggle component.',
    status: 'Done',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ticket-004',
    title: 'API rate limiting causing 429 errors in production',
    description:
      'After the latest deploy, several background jobs are hitting the external payment API faster than the 60 req/min limit. We need to add a retry-with-backoff wrapper.',
    status: 'Open',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ticket-005',
    title: 'Notification emails not sent for high-priority tickets',
    description:
      'When a ticket is created with priority "High", the email notification job is silently failing. Logs show the worker starts but the SMTP handshake never completes.',
    status: 'In Progress',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ticket-006',
    title: 'Upgrade React to v19 and remove deprecated lifecycle hooks',
    description:
      'The codebase still uses componentWillMount in three class components. Upgrade React to v19 and migrate the components to function components with useEffect.',
    status: 'Done',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

let comments: Comment[] = [
  {
    id: 'comment-001',
    ticketId: 'ticket-001',
    content: 'Reproduced on Safari 16.4. Seems related to the redirect timing.',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'comment-002',
    ticketId: 'ticket-001',
    content: 'Adding a small delay before router.push() seems to fix it locally.',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'comment-003',
    ticketId: 'ticket-002',
    content: 'Root cause found: the stream is being closed before all rows are flushed.',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
];

// ─── Ticket API ───────────────────────────────────────────────────────────────

/**
 * Fetch all tickets, optionally filtered by title (case-insensitive substring match).
 */
export function getTickets(search?: string): Promise<Ticket[]> {
  const result = search
    ? tickets.filter((t) =>
        t.title.toLowerCase().includes(search.toLowerCase())
      )
    : tickets;
  return delay([...result]);
}

/**
 * Fetch a single ticket by id.
 * Rejects with a 404-like error if not found.
 */
export function getTicketById(id: string): Promise<Ticket> {
  const ticket = tickets.find((t) => t.id === id);
  if (!ticket) {
    return Promise.reject(new Error(`Ticket with id "${id}" not found.`));
  }
  return delay({ ...ticket });
}

/**
 * Create a new ticket.
 */
export function createTicket(
  data: Pick<Ticket, 'title' | 'description' | 'status'>
): Promise<Ticket> {
  const newTicket: Ticket = {
    id: `ticket-${generateId()}`,
    title: data.title,
    description: data.description,
    status: data.status,
    createdAt: new Date().toISOString(),
  };
  tickets = [newTicket, ...tickets];
  return delay({ ...newTicket });
}

/**
 * Update an existing ticket's fields.
 * Returns the updated ticket.
 */
export function updateTicket(
  id: string,
  data: Partial<Pick<Ticket, 'title' | 'description' | 'status'>>
): Promise<Ticket> {
  const index = tickets.findIndex((t) => t.id === id);
  if (index === -1) {
    return Promise.reject(new Error(`Ticket with id "${id}" not found.`));
  }
  tickets[index] = { ...tickets[index], ...data };
  return delay({ ...tickets[index] });
}

/**
 * Delete a ticket by id.
 * Also removes all associated comments.
 */
export function deleteTicket(id: string): Promise<void> {
  const exists = tickets.some((t) => t.id === id);
  if (!exists) {
    return Promise.reject(new Error(`Ticket with id "${id}" not found.`));
  }
  tickets = tickets.filter((t) => t.id !== id);
  comments = comments.filter((c) => c.ticketId !== id);
  return delay(undefined as unknown as void);
}

/**
 * Change ticket status only.
 */
export function updateTicketStatus(
  id: string,
  status: TicketStatus
): Promise<Ticket> {
  return updateTicket(id, { status });
}

// ─── Comment API ──────────────────────────────────────────────────────────────

/**
 * Fetch all comments for a specific ticket.
 */
export function getCommentsByTicketId(ticketId: string): Promise<Comment[]> {
  const result = comments.filter((c) => c.ticketId === ticketId);
  return delay([...result]);
}

/**
 * Add a comment to a ticket.
 * Uses a 500 ms delay (distinct from the default 400 ms query latency).
 */
export function addComment(
  ticketId: string,
  content: string
): Promise<Comment> {
  const ticket = tickets.find((t) => t.id === ticketId);
  if (!ticket) {
    return Promise.reject(new Error(`Ticket with id "${ticketId}" not found.`));
  }
  const newComment: Comment = {
    id: `comment-${generateId()}`,
    ticketId,
    content,
    createdAt: new Date().toISOString(),
  };
  comments = [...comments, newComment];
  return delayMs({ ...newComment }, 500);
}

/**
 * Delete a comment by id.
 */
export function deleteComment(id: string): Promise<void> {
  const exists = comments.some((c) => c.id === id);
  if (!exists) {
    return Promise.reject(new Error(`Comment with id "${id}" not found.`));
  }
  comments = comments.filter((c) => c.id !== id);
  return delayMs(undefined, 400) as Promise<void>;
}
