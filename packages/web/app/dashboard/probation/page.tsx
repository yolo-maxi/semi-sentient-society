import { Suspense } from "react";
import AdminDashboard from "@/components/probation/AdminDashboard";
import { probationService } from "@/lib/probation/service";

function LoadingSkeleton() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 bg-[var(--surface)] rounded w-64 mb-2"></div>
          <div className="h-4 bg-[var(--surface)] rounded w-96"></div>
        </div>
        <div className="h-10 bg-[var(--surface)] rounded w-32"></div>
      </div>

      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 bg-[var(--surface-soft)] rounded-lg"></div>
              <div>
                <div className="h-6 bg-[var(--surface-soft)] rounded w-12 mb-1"></div>
                <div className="h-3 bg-[var(--surface-soft)] rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters skeleton */}
      <div className="flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-10 bg-[var(--surface)] border border-[var(--border)] rounded-lg w-24"></div>
        ))}
      </div>

      {/* List skeleton */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl">
        <div className="px-6 py-4 border-b border-[var(--border)]">
          <div className="h-6 bg-[var(--surface-soft)] rounded w-48"></div>
        </div>
        <div className="divide-y divide-[var(--border)]">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-4 mb-3">
                    <div>
                      <div className="h-6 bg-[var(--surface-soft)] rounded w-32 mb-1"></div>
                      <div className="h-4 bg-[var(--surface-soft)] rounded w-48"></div>
                    </div>
                    <div className="h-4 bg-[var(--surface-soft)] rounded w-4"></div>
                    <div>
                      <div className="h-5 bg-[var(--surface-soft)] rounded w-28 mb-1"></div>
                      <div className="h-4 bg-[var(--surface-soft)] rounded w-24"></div>
                    </div>
                  </div>
                  <div className="h-8 bg-[var(--surface-soft)] rounded w-40"></div>
                </div>
                <div className="flex gap-2 ml-4">
                  <div className="h-8 bg-[var(--surface-soft)] rounded w-24"></div>
                  <div className="h-8 bg-[var(--surface-soft)] rounded w-20"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

async function ProbationDashboardContent() {
  const [probationPairs, stats] = await Promise.all([
    probationService.getProbationPairs(),
    probationService.getStats()
  ]);

  return <AdminDashboard probationPairs={probationPairs} stats={stats} />;
}

export default function ProbationDashboardPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] py-8 px-4">
      <Suspense fallback={<LoadingSkeleton />}>
        <ProbationDashboardContent />
      </Suspense>
    </div>
  );
}

export const metadata = {
  title: "Probation Dashboard | SSS",
  description: "Monitor and manage probation buddy assignments",
};