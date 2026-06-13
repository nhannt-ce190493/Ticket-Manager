import { Skeleton } from '@/components/ui/skeleton';

/**
 * SkeletonList — shows 5 placeholder cards while ticket data is loading.
 */
export function SkeletonList() {
  return (
    <ul className="space-y-3" aria-label="Loading tickets…" aria-busy="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <li
          key={i}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-start justify-between gap-4">
            <Skeleton className="h-4 w-3/4 rounded-md bg-slate-200" />
            <Skeleton className="h-5 w-20 rounded-full bg-slate-200" />
          </div>
          <div className="mt-3 space-y-1.5">
            <Skeleton className="h-3 w-full rounded bg-slate-100" />
            <Skeleton className="h-3 w-4/5 rounded bg-slate-100" />
          </div>
          <div className="mt-3">
            <Skeleton className="h-3 w-28 rounded bg-slate-100" />
          </div>
        </li>
      ))}
    </ul>
  );
}

