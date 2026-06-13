'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

import { createTicketFormSchema, type CreateTicketFormData } from '@/lib/validations';
import { useCreateTicket } from '@/hooks/useCreateTicket';
import { AppHeader } from '@/components/AppHeader';
import { AppFooter } from '@/components/AppFooter';
import { Button } from '@/components/ui/button';

// ─── Field Error ─────────────────────────────────────────────────────────────

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-1 text-xs text-red-500">
      {message}
    </p>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CreateTicketPage() {
  const { mutate, isPending, isError, error } = useCreateTicket();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTicketFormData>({
    resolver: zodResolver(createTicketFormSchema),
    defaultValues: { title: '', description: '' },
  });

  const onSubmit = (data: CreateTicketFormData) => {
    mutate(data);
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <AppHeader />

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:px-6">
        {/* Back link */}
        <Link
          href="/tickets"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại danh sách
        </Link>

        {/* Heading */}
        <div className="mb-7">
          <h1 className="text-xl font-bold text-slate-900">Tạo Ticket mới</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Điền thông tin ticket và nhấn Tạo.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

            {/* Mutation-level error */}
            {isError && (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
              >
                {error instanceof Error ? error.message : 'Không thể tạo ticket. Vui lòng thử lại.'}
              </div>
            )}

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700">
                Tiêu đề <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                placeholder="Mô tả ngắn gọn vấn đề…"
                maxLength={100}
                aria-invalid={!!errors.title}
                {...register('title')}
                className={[
                  'mt-1.5 w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900',
                  'bg-white outline-none transition-all placeholder:text-slate-400',
                  'focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100',
                  errors.title
                    ? 'border-red-400 bg-red-50'
                    : 'border-slate-300 hover:border-slate-400',
                ].join(' ')}
              />
              <FieldError message={errors.title?.message} />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700">
                Mô tả <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                rows={5}
                placeholder="Mô tả chi tiết vấn đề, các bước tái hiện, v.v."
                aria-invalid={!!errors.description}
                {...register('description')}
                className={[
                  'mt-1.5 w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900',
                  'bg-white outline-none transition-all placeholder:text-slate-400 resize-y',
                  'focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100',
                  errors.description
                    ? 'border-red-400 bg-red-50'
                    : 'border-slate-300 hover:border-slate-400',
                ].join(' ')}
              />
              <FieldError message={errors.description?.message} />
            </div>

            {/* Status info */}
            <p className="text-xs text-slate-400">
              Ticket mới sẽ được tạo với trạng thái <strong>Open</strong>.
            </p>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={() => history.back()}
                disabled={isPending}
                className="border-slate-300 text-slate-600 hover:border-slate-400"
              >
                Hủy
              </Button>
              <Button
                id="create-ticket-submit"
                type="submit"
                disabled={isPending}
                className="bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-60"
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang tạo…
                  </span>
                ) : (
                  'Tạo Ticket'
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}
