'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { Search, LogOut, Inbox } from 'lucide-react';

import { useTickets } from '@/hooks/useTickets';
import { SkeletonList } from '@/components/SkeletonList';
import { ErrorCard } from '@/components/ErrorCard';
import { AppHeader } from '@/components/AppHeader';
import { AppFooter } from '@/components/AppFooter';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Ticket } from '@/types';

// ─── Status Badge ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  Ticket['status'],
  { label: string; className: string }
> = {
  Open: {
    label: 'Open',
    className: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  'In Progress': {
    label: 'In Progress',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  Done: {
    label: 'Done',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
};

// ─── TicketCard ───────────────────────────────────────────────────────────────

function TicketCard({ ticket }: { ticket: Ticket }) {
  const cfg = STATUS_CONFIG[ticket.status];
  const formatted = new Date(ticket.createdAt).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <li className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      {/* Title + Badge */}
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-sm font-semibold text-slate-800 leading-snug group-hover:text-indigo-600 transition-colors">
          {ticket.title}
        </h2>
        <Badge
          className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${cfg.className}`}
          variant="outline"
        >
          {cfg.label}
        </Badge>
      </div>

      {/* Description */}
      <p className="mt-2 line-clamp-2 text-xs text-slate-500 leading-relaxed">
        {ticket.description}
      </p>

      {/* Meta */}
      <p className="mt-3 text-[11px] text-slate-400">Tạo lúc {formatted}</p>
    </li>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TicketsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: tickets, isLoading, isError, error, refetch } = useTickets(searchTerm);

  const handleLogout = useCallback(() => {
    Cookies.remove('auth-token', { path: '/' });
    router.push('/login');
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">

      {/* ── Header ── */}
      <AppHeader>
        <Button
          id="logout-btn"
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="flex items-center gap-1.5 border-slate-300 text-slate-600 hover:border-slate-400 hover:text-slate-800"
        >
          <LogOut className="h-3.5 w-3.5" />
          Đăng xuất
        </Button>
      </AppHeader>

      {/* ── Main Content ── */}
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6">

        {/* Page title */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-900">Danh sách Ticket</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Theo dõi và quản lý yêu cầu nội bộ
          </p>
        </div>

        {/* Search */}
        <div className="mb-5 relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            id="ticket-search"
            type="search"
            placeholder="Tìm theo tiêu đề…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 border-slate-300 bg-white text-slate-800 placeholder:text-slate-400 focus-visible:border-indigo-400 focus-visible:ring-indigo-100"
            aria-label="Tìm kiếm ticket"
          />
        </div>

        {/* States */}
        {isLoading && <SkeletonList />}

        {isError && (
          <ErrorCard
            message={error instanceof Error ? error.message : 'Không thể tải danh sách ticket.'}
            onRetry={() => refetch()}
          />
        )}

        {!isLoading && !isError && (
          <>
            {tickets && tickets.length > 0 ? (
              <ul className="space-y-3" aria-label="Danh sách ticket">
                {tickets.map((ticket) => (
                  <TicketCard key={ticket.id} ticket={ticket} />
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center">
                <Inbox className="mb-3 h-10 w-10 text-slate-300" />
                <p className="text-sm font-medium text-slate-500">Không tìm thấy ticket nào.</p>
                {searchTerm && (
                  <button
                    className="mt-2 text-xs text-indigo-500 underline-offset-2 hover:underline"
                    onClick={() => setSearchTerm('')}
                  >
                    Xóa bộ lọc
                  </button>
                )}
              </div>
            )}

            {/* Count */}
            <p className="mt-4 text-right text-xs text-slate-400">
              {tickets?.length ?? 0} ticket
              {searchTerm ? ` phù hợp với "${searchTerm}"` : ' tổng cộng'}
            </p>
          </>
        )}
      </main>

      {/* ── Footer ── */}
      <AppFooter />
    </div>
  );
}
