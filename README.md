# Ticket Manager

A modern internal ticket management system built with Next.js 14+ App Router. It allows teams to create, track, and resolve support tickets with real-time status updates and comments.

## 1. Prerequisites
- **Node.js**: v18.17+ (v20 LTS recommended)
- **Package Manager**: npm
- **Git**: Any recent version

## 2. Setup Instructions
1. **Clone the repository**: 
   `git clone https://github.com/nhannt-ce190493/Ticket-Manager.git`
2. **Enter the folder**: 
   `cd Ticket-Manager`
3. **Install dependencies**: 
   `npm install` *(Note: No `.env` file is needed)*
4. **Run the app**: 
   `npm run dev`
5. **Open**: [http://localhost:3000](http://localhost:3000)

**Mock Login**: Use any valid email (e.g., `user@test.com`) and any password with at least 6 characters (e.g., `123456`).

## 3. Architecture Overview
- **`app/`**: Uses Next.js App Router for routing (`/login`, `/tickets`). This helps with code-splitting and layouts.
- **`components/`**: Contains reusable UI elements (buttons, forms) and layout structures.
- **`hooks/`**: Encapsulates TanStack Query logic to keep UI components clean.
- **`lib/`**: Holds API config, Zod validation schemas, and the mock database.
- **Data Flow**: Page -> Custom Hook -> TanStack Query -> `mock-api.ts` -> Updates `localStorage` -> Invalidates cache to automatically update the UI.

## 4. Mock API Explanation
We used a simulated backend inside `lib/mock-api.ts`. It acts as an in-memory array but uses `localStorage` so data isn't lost on refresh. It simulates realistic network delays (400-600ms) using `setTimeout`.

**How reviewers can test error states:**
- **404 Not Found**: Manually type a fake ID in the URL (e.g., `/tickets/invalid-id`).
- **Form Validation**: Try submitting an empty title on the Create Ticket page.
- **API Error / Rollback**: Edit `lib/mock-api.ts` to make `updateTicketStatus` or `addComment` throw an error (`Promise.reject`), then click a status button on the UI to see it fail and revert.
- **Global Error Boundary**: Add `throw new Error('Test')` inside any page's render function to see the fallback UI.

## 5. Known Limitations
- Data is saved in the browser's `localStorage`, meaning it is not shared across different devices or browsers.
- Authentication is completely simulated and insecure.
- No real-time multi-user syncing (WebSockets).
- No pagination for long lists of tickets.
- Lacks Role-Based Access Control (RBAC).
