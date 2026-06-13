'use client';

import { useRef, FormEvent } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useComments, useAddComment } from '@/hooks/useComments';
import type { Comment } from '@/types';

// ─── Sub-components ────────────────────────────────────────────────────────────

function CommentSkeleton() {
  return (
    <ul className="space-y-4" aria-label="Đang tải bình luận…" aria-busy="true">
      {[0, 1].map((i) => (
        <li key={i} className="space-y-1.5">
          <Skeleton className="h-3 w-28 rounded bg-slate-100" />
          <Skeleton className="h-4 w-full rounded bg-slate-200" />
          <Skeleton className="h-4 w-4/5 rounded bg-slate-100" />
        </li>
      ))}
    </ul>
  );
}

function CommentItem({ comment }: { comment: Comment }) {
  const formatted = new Date(comment.createdAt).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  return (
    <li className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
      <p className="text-[11px] text-slate-400 mb-1">{formatted}</p>
      <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
        {comment.content}
      </p>
    </li>
  );
}

// ─── CommentSection ───────────────────────────────────────────────────────────

interface CommentSectionProps {
  ticketId: string;
}

export function CommentSection({ ticketId }: CommentSectionProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const {
    data: comments,
    isLoading,
    isError,
    error: fetchError,
  } = useComments(ticketId);

  const {
    mutate: addComment,
    isPending,
    isError: isAddError,
    error: addError,
    reset: resetMutation,
  } = useAddComment();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const content = inputRef.current?.value.trim() ?? '';
    if (!content) return;

    resetMutation(); // clear previous error before new attempt
    addComment(
      { ticketId, content },
      {
        onSuccess: () => {
          // Clear input only on success
          if (inputRef.current) inputRef.current.value = '';
        },
        // onError: do NOT clear the input — user keeps their text
      }
    );
  };

  return (
    <section
      aria-labelledby="comments-heading"
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2
        id="comments-heading"
        className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700"
      >
        <MessageSquare className="h-4 w-4 text-slate-400" />
        Bình luận
        {comments && (
          <span className="ml-auto text-xs font-normal text-slate-400">
            {comments.length}
          </span>
        )}
      </h2>

      {/* Comment list */}
      {isLoading && <CommentSkeleton />}

      {isError && (
        <p className="text-xs text-red-500">
          {fetchError instanceof Error ? fetchError.message : 'Không thể tải bình luận.'}
        </p>
      )}

      {!isLoading && !isError && (
        <ul className="mb-5 space-y-4" aria-label="Danh sách bình luận">
          {comments && comments.length > 0 ? (
            comments.map((c) => <CommentItem key={c.id} comment={c} />)
          ) : (
            <li className="text-xs text-slate-400">Chưa có bình luận nào.</li>
          )}
        </ul>
      )}

      {/* Add comment form */}
      <form onSubmit={handleSubmit} className="space-y-2">
        <textarea
          ref={inputRef}
          id={`comment-input-${ticketId}`}
          rows={3}
          placeholder="Thêm bình luận…"
          disabled={isPending}
          aria-label="Nội dung bình luận"
          className={[
            'w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900',
            'bg-white outline-none transition-all placeholder:text-slate-400 resize-y',
            'focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100',
            'disabled:opacity-60 disabled:cursor-not-allowed',
            isAddError ? 'border-red-400' : 'border-slate-300 hover:border-slate-400',
          ].join(' ')}
        />

        {/* Mutation error — input is NOT cleared */}
        {isAddError && (
          <p role="alert" className="text-xs text-red-500">
            {addError instanceof Error ? addError.message : 'Không thể gửi bình luận.'}
          </p>
        )}

        <div className="flex justify-end">
          <button
            id={`comment-submit-${ticketId}`}
            type="submit"
            disabled={isPending}
            className={[
              'inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-medium',
              'bg-indigo-600 text-white hover:bg-indigo-500 transition-colors',
              'disabled:opacity-60 disabled:cursor-not-allowed',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400',
            ].join(' ')}
          >
            <Send className="h-3.5 w-3.5" />
            {isPending ? 'Đang gửi…' : 'Gửi'}
          </button>
        </div>
      </form>
    </section>
  );
}
