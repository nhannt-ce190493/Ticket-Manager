# Ticket Manager — Internal Support System

An internal ticket management system built with Next.js 14+ App Router, allowing teams to create, track, and resolve support tickets with real-time status updates and comment threads.

---

## Prerequisites

| Requirement | Version |
|-------------|---------|
| Node.js | 18.17 or later (20 LTS recommended) |
| Package manager | npm (bundled with Node.js) |
| Git | Any recent version |

Verify your Node version:
```bash
node -v
```

---

## Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/nhannt-ce190493/Ticket-Manager.git
cd Ticket-Manager
```

### 2. Install dependencies
```bash
npm install
```

> No `.env` file is required — the app uses an in-memory mock API and does not connect to any external service.

### 3. Start the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Login credentials (mock)
The authentication is simulated. Any input satisfying the validation rules will work:
- **Email**: any valid email format (e.g. `user@company.com`)
- **Password**: any string of 6+ characters (e.g. `123456`)

---

## Architecture

### Folder Structure

```
app/                    # Next.js App Router — pages and layouts
├── login/              # Login page (public route)
├── tickets/            # Protected ticket routes
│   ├── page.tsx        # Ticket list with search
│   ├── create/         # New ticket form
│   └── [id]/           # Ticket detail, status update, comments
├── layout.tsx          # Root layout — providers + error boundary
└── globals.css

components/             # Reusable UI components
├── providers/
│   ├── ReactQueryProvider.tsx    # TanStack Query client singleton
│   └── GlobalErrorBoundary.tsx   # App-wide render error fallback
├── AppHeader.tsx        # Persistent navigation header
├── AppFooter.tsx        # Persistent footer
├── CommentSection.tsx   # Self-contained comment list + form
├── ErrorCard.tsx        # Inline API error display
├── SkeletonList.tsx     # Loading placeholder for ticket list
└── ui/                 # shadcn/ui primitives (Badge, Button, Skeleton…)

hooks/                  # Custom TanStack Query hooks
├── useTickets.ts        # GET ticket list + search filter
├── useTicket.ts         # GET single ticket + PATCH status mutation
├── useCreateTicket.ts   # POST new ticket mutation
└── useComments.ts       # GET + POST comments for a ticket

lib/
├── mock-api.ts          # In-memory mock data layer (Option A)
├── api.ts               # Axios instance (base URL configuration)
├── validations.ts       # Zod schemas for all forms
└── utils.ts             # Tailwind class merger (cn helper)

types/
└── index.ts             # Ticket, Comment, TicketStatus interfaces

proxy.ts                 # Next.js middleware — auth guard / route protection
```

### Why This Structure?

- **`app/` (Next.js App Router)** — co-locates each route with its own `page.tsx`, enabling per-route code-splitting. Nested layouts prevent repetitive header/footer rendering across child routes.
- **`components/`** — separates concerns: `providers/` handle global infrastructure, `ui/` holds design-system primitives, and feature components (e.g. `CommentSection`) are self-contained units that manage their own data-fetching via hooks.
- **`hooks/`** — encapsulates all TanStack Query calls, keeping page components declarative. Pages never call `fetch` directly or use `useEffect` for data fetching — they only consume hook return values.
- **`lib/`** — centralises cross-cutting concerns: Zod validation schemas, Axios configuration, and the mock data layer. This makes swapping the mock for a real API a single-file change.
- **`types/`** — single source of truth for TypeScript interfaces shared across every layer, enforced at compile time.

### Data Flow

```
Page Component
    │
    ▼
Custom Hook  (hooks/*.ts)
    │  useQuery / useMutation  (TanStack Query v5)
    ▼
Mock API  (lib/mock-api.ts)
    │  Resolves / rejects Promise after simulated delay
    ▼
In-memory arrays  (module-level  let tickets / let comments)
```

1. A page mounts and calls a custom hook (e.g. `useTickets`).
2. TanStack Query checks its cache. On a cache miss it calls the corresponding mock API function.
3. The mock API resolves after a simulated network delay (400–600 ms).
4. TanStack Query stores the result in its cache (`staleTime: 30 000 ms`) and re-renders the component with the data.
5. Mutations (create ticket, update status, add comment) call the mock API, then **invalidate** the relevant query keys — triggering an automatic background refetch so the UI always reflects the latest state.
6. The global `ReactQueryProvider` holds a single `QueryClient` instance (created via `useRef` to survive React StrictMode double-renders) so cache state is shared across all routes within a session.

---

## Mock API

**Implementation: Option A — Module-Level In-Memory Array**

The mock API (`lib/mock-api.ts`) uses JavaScript module-level `let` arrays as the data store:

```ts
// lib/mock-api.ts
let tickets: Ticket[]  = [ /* seeded with 6 tickets */ ];
let comments: Comment[] = [ /* seeded with 3 comments */ ];
```

Because of Node.js module caching, the array **persists across HTTP requests** within a single server session — creating a ticket in the browser is immediately reflected when fetching the list, exactly as a real database would behave. Data resets only when the dev server restarts.

All functions wrap their return values in `Promises` with `setTimeout` to simulate realistic network latency:

| Operation | Delay |
|-----------|-------|
| `getTickets`, `getTicketById`, `getCommentsByTicketId` | 400 ms |
| `updateTicketStatus` | 400 ms |
| `addComment` | 500 ms |
| `createTicket` | 600 ms |

### Triggering Error States (for reviewers)

| Error State | How to Trigger |
|-------------|----------------|
| **404 — Ticket not found** | Navigate to `/tickets/fake-id-xyz` in the browser address bar |
| **Validation errors (Create form)** | Submit `/tickets/create` with an empty title or description field |
| **Comment mutation error** | In `lib/mock-api.ts`, temporarily change the `addComment` return to `return Promise.reject(new Error('Simulated server error'))`, then submit a comment — the input text is preserved |
| **Status update error + optimistic rollback** | In `lib/mock-api.ts`, make `updateTicketStatus` reject, then click a status button — the badge reverts to its previous value |
| **Global error boundary** | Add `throw new Error('test')` at the top of any page component's render body — the `GlobalErrorBoundary` fallback screen will appear |
| **Slow loading / skeleton** | Increase `LATENCY_MS` from `400` to `3000` in `lib/mock-api.ts` and navigate between pages |

---

## Known Limitations

1. **Data is not persistent across server restarts.** The in-memory array resets every time `npm run dev` is stopped. All created tickets and comments are lost.

2. **Authentication is entirely simulated.** The `auth-token` cookie is set client-side with no real token validation. Any email/password pair that passes Zod rules grants full access.

3. **No real-time collaboration.** The app does not use WebSockets or Server-Sent Events. Two browser tabs will not see each other's changes without a manual page refresh.

4. **No pagination.** The ticket list fetches and renders all records at once. Acceptable for a seeded dataset; would not scale to production volumes.

5. **No role-based access control (RBAC).** Any authenticated user can update the status of or comment on any ticket.

6. **Comments have no author attribution.** There is no real user session, so posted comments display only their timestamp.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 + shadcn/ui |
| Data fetching / caching | TanStack Query (React Query) v5 |
| Form validation | react-hook-form v7 + Zod v3 |
| HTTP client | Axios v1 (configured; mock bypasses network) |
| Route protection | Next.js Middleware (`proxy.ts`) |
