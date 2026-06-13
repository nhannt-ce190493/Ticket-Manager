'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

import { useTicket, useUpdateTicketStatus } from '@/hooks/useTicket';
import { CommentSection } from '@/components/CommentSection';
import { AppHeader } from '@/components/AppHeader';
import { AppFooter } from '@/components/AppFooter';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { TicketStatus } from '@/types';

// ─── Constants ────────────────────────────────────────────────────────────────

const ALL_STATUSES: TicketStatus[] = ['Open', 'In Progress', 'Done'];

const STATUS_CONFIG: Record<TicketStatus, { label: string; className: string }> = {
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

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function DetailSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
      <div className="flex items-start justify-between gap-4">
        <Skeleton className="h-6 w-3/5 rounded-md bg-slate-200" />
        <Skeleton className="h-6 w-24 rounded-full bg-slate-200" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full rounded bg-slate-100" />
        <Skeleton className="h-4 w-full rounded bg-slate-100" />
        <Skeleton className="h-4 w-4/5 rounded bg-slate-100" />
      </div>
      <Skeleton className="h-4 w-40 rounded bg-slate-100" />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const { data: ticket, isLoading, isError, error } = useTicket(id);
  const { mutate: updateStatus, isPending: isUpdating, isError: isUpdateError, error: updateError } = useUpdateTicketStatus(id);

  // Optimistic local status — reverts on error
  const [localStatus, setLocalStatus] = useState<TicketStatus | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Sync local status when ticket data arrives
  useEffect(() => {
    if (ticket) setLocalStatus(ticket.status);
  }, [ticket]);

  // Revert on update error
  useEffect(() => {
    if (isUpdateError && ticket) setLocalStatus(ticket.status);
  }, [isUpdateError, ticket]);

  const handleStatusChange = (newStatus: TicketStatus) => {
    const prev = localStatus;
    setLocalStatus(newStatus); // optimistic
    updateStatus(newStatus, {
      onSuccess: () => {
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 2500);
      },
      onError: () => {
        setLocalStatus(prev); // revert
      },
    });
  };

  const displayStatus = localStatus ?? ticket?.status;

  // ── 404 ──
  const is404 =
    isError && error instanceof Error && error.message.toLowerCase().includes('not found');

  if (is404) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <AppHeader />
        <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
          <p className="text-5xl font-bold text-slate-200">404</p>
          <h1 className="text-xl font-semibold text-slate-700">Ticket không tồn tại</h1>
          <p className="text-sm text-slate-500">
            Ticket với ID <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">{id}</code> không được tìm thấy.
          </p>
          <Link
            href="/tickets"
            className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại danh sách
          </Link>
        </main>
        <AppFooter />
      </div>
    );
  }

  // ── Generic error ──
  if (isError) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <AppHeader />
        <main className="flex flex-1 flex-col items-center justify-center gap-3 px-4 text-center">
          <p className="text-sm text-red-500">
            {error instanceof Error ? error.message : 'Đã xảy ra lỗi.'}
          </p>
          <Link href="/tickets" className="text-sm text-indigo-600 hover:underline">
            Quay lại danh sách
          </Link>
        </main>
        <AppFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <AppHeader />

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:px-6">
        {/* Back */}
        <Link
          href="/tickets"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại danh sách
        </Link>

        {/* Loading */}
        {isLoading && <DetailSkeleton />}

        {/* Content */}
        {ticket && (
          <div className="space-y-4">
            {/* Detail card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              {/* Title + badge */}
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-lg font-bold text-slate-900 leading-snug">
                  {ticket.title}
                </h1>
                {displayStatus && (
                  <Badge
                    className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${STATUS_CONFIG[displayStatus].className}`}
                    variant="outline"
                  >
                    {STATUS_CONFIG[displayStatus].label}
                  </Badge>
                )}
              </div>

              {/* Description */}
              <p className="mt-4 text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                {ticket.description}
              </p>

              {/* Meta */}
              <p className="mt-5 text-xs text-slate-400">
                Tạo lúc{' '}
                {new Date(ticket.createdAt).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            {/* Status update card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-3 text-sm font-semibold text-slate-700">Cập nhật trạng thái</h2>

              <div className="flex flex-wrap gap-2">
                {ALL_STATUSES.map((status) => {
                  const cfg = STATUS_CONFIG[status];
                  const isCurrent = displayStatus === status;
                  return (
                    <button
                      key={status}
                      id={`status-btn-${status.replace(/\s/g, '-').toLowerCase()}`}
                      disabled={isUpdating || isCurrent}
                      onClick={() => handleStatusChange(status)}
                      className={[
                        'inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all',
                        isCurrent
                          ? `${cfg.className} cursor-default`
                          : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700',
                        isUpdating && !isCurrent ? 'opacity-50 cursor-not-allowed' : '',
                      ].join(' ')}
                    >
                      {isCurrent && <CheckCircle2 className="h-3.5 w-3.5" />}
                      {cfg.label}
                    </button>
                  );
                })}
              </div>

              {/* Update error */}
              {isUpdateError && (
                <p role="alert" className="mt-3 text-xs text-red-500">
                  {updateError instanceof Error ? updateError.message : 'Không thể cập nhật trạng thái.'}
                </p>
              )}
            </div>

            {/* Comments */}
            <CommentSection ticketId={ticket.id} />
          </div>
        )}
      </main>

      {/* Success toast */}
      {showSuccessToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 shadow-lg"
        >
          <CheckCircle2 className="h-4 w-4" />
          Trạng thái đã được cập nhật!
        </div>
      )}

      <AppFooter />
    </div>
  );
}
