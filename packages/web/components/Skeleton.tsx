type CardSkeletonProps = {
  className?: string;
  lines?: number;
};

export function CardSkeleton({ className = '', lines = 3 }: CardSkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-[1.35rem] border border-[var(--border-soft)] bg-[var(--panel-bg-soft)] p-5 ${className}`}
    >
      <div className="mb-4 h-4 w-24 rounded-full bg-white/10" />
      <div className="mb-5 h-8 w-2/3 rounded-full bg-white/12" />
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={`card-skeleton-line-${index}`}
            className="h-4 rounded-full bg-white/8"
            style={{ width: `${100 - index * 12}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export function ActivityFeedSkeleton() {
  return (
    <section
      aria-hidden="true"
      className="relative overflow-hidden rounded-[2rem] border border-[var(--border-soft)] bg-[linear-gradient(145deg,var(--panel-bg),var(--surface)_72%)] px-5 py-6 text-[var(--text)] shadow-[var(--panel-shadow)] sm:px-8 sm:py-8"
    >
      <div className="animate-pulse">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <div className="h-3 w-28 rounded-full bg-white/10" />
            <div className="h-10 w-3/4 rounded-full bg-white/12" />
            <div className="h-4 w-full rounded-full bg-white/8" />
            <div className="h-4 w-2/3 rounded-full bg-white/8" />
          </div>
          <div className="h-11 w-56 rounded-3xl bg-emerald-300/10" />
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.55fr)_minmax(260px,0.8fr)]">
          <div className="rounded-[1.6rem] border border-[var(--border-soft)] bg-[var(--panel-bg-muted)] p-3 sm:p-4">
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={`activity-skeleton-item-${index}`}
                  className="flex items-start gap-3 rounded-[1.25rem] border border-[var(--border-soft)] bg-[var(--panel-bg-soft)] px-3 py-3 sm:gap-4 sm:px-4"
                >
                  <div className="h-11 w-11 shrink-0 rounded-2xl bg-white/10" />
                  <div className="min-w-0 flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-24 rounded-full bg-white/10" />
                      <div className="h-3 w-16 rounded-full bg-white/8" />
                    </div>
                    <div className="h-4 w-full rounded-full bg-white/8" />
                    <div className="h-4 w-4/5 rounded-full bg-white/8" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-3 rounded-[1.6rem] border border-[var(--border-soft)] bg-[var(--panel-bg-soft)] p-4">
            <CardSkeleton className="bg-[var(--panel-bg-muted)] p-4" lines={4} />
            <CardSkeleton className="border-dashed border-[#c9362c]/35 bg-[#c9362c]/8 p-4" lines={3} />
          </div>
        </div>
      </div>
    </section>
  );
}
