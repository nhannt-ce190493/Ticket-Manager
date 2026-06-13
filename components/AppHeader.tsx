import { TicketIcon } from 'lucide-react';

/**
 * AppHeader — sticky top navigation bar dùng chung cho toàn app.
 * children: slot bên phải (ví dụ: nút Logout).
 */
export function AppHeader({ children }: { children?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600">
            <TicketIcon className="h-4 w-4 text-white" />
          </span>
          <span className="text-sm font-semibold text-slate-800">Ticket Manager</span>
        </div>
        {/* Right slot */}
        {children && <div className="flex items-center gap-3">{children}</div>}
      </div>
    </header>
  );
}
