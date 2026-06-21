// Skeleton loader components untuk loading states

export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-xl border border-surface-200 bg-surface/60 p-4 ${className}`}>
      <div className="h-3 w-24 bg-surface-200 rounded animate-pulse mb-3" />
      <div className="h-6 w-32 bg-surface-200 rounded animate-pulse mb-2" />
      <div className="h-3 w-full bg-surface-200 rounded animate-pulse" />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-2">
          <div className="h-4 w-12 bg-surface-200 rounded animate-pulse" />
          <div className="h-4 w-20 bg-surface-200 rounded animate-pulse" />
          <div className="h-4 w-16 bg-surface-200 rounded animate-pulse ml-auto" />
          <div className="h-4 w-14 bg-surface-200 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonChart({ height = 400 }: { height?: number }) {
  return (
    <div className="rounded-xl border border-surface-200 bg-surface/60 overflow-hidden" style={{ height }}>
      <div className="p-4 space-y-3">
        <div className="flex gap-2">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-6 w-12 bg-surface-200 rounded animate-pulse" />)}
        </div>
        <div className="h-[300px] bg-surface-200 rounded animate-pulse mt-2" />
      </div>
    </div>
  );
}

export function SkeletonNews({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-3 rounded-xl border border-surface-200 bg-surface/60">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-4 w-14 bg-surface-200 rounded animate-pulse" />
            <div className="h-4 w-10 bg-surface-200 rounded animate-pulse" />
          </div>
          <div className="h-4 w-full bg-surface-200 rounded animate-pulse mb-1" />
          <div className="h-3 w-3/4 bg-surface-200 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-surface p-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="h-8 w-32 bg-surface-200 rounded animate-pulse" />
        <div className="h-8 w-48 bg-surface-200 rounded animate-pulse ml-auto" />
      </div>
      {/* Grid */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 lg:col-span-8 space-y-3">
          <div className="h-[100px] bg-surface-200 rounded-xl animate-pulse" />
          <div className="h-[400px] bg-surface-200 rounded-xl animate-pulse" />
          <div className="h-[300px] bg-surface-200 rounded-xl animate-pulse" />
        </div>
        <div className="col-span-12 lg:col-span-4 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-[200px] bg-surface-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
