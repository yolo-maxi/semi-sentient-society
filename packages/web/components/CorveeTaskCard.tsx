'use client';

import type { CorveeDifficulty, CorveeStatus, CorveeTask } from '@/data/mock-corvee-tasks';

interface CorveeTaskCardProps {
  task: CorveeTask;
}

const difficultyClasses: Record<CorveeDifficulty, string> = {
  easy: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
  medium: 'border-yellow-500/40 bg-yellow-500/10 text-yellow-200',
  hard: 'border-orange-500/40 bg-orange-500/10 text-orange-200',
  legendary: 'border-red-500/40 bg-red-500/10 text-red-300',
};

const statusClasses: Record<CorveeStatus, string> = {
  open: 'text-emerald-300',
  claimed: 'text-yellow-200',
  'in-review': 'text-orange-200',
  completed: 'text-stone-300',
};

function formatLabel(value: string) {
  return value.replace(/-/g, ' ');
}

export default function CorveeTaskCard({ task }: CorveeTaskCardProps) {
  const claimable = task.status === 'open';

  return (
    <article className="group relative flex h-full flex-col overflow-hidden border border-[var(--border)] bg-[linear-gradient(180deg,rgba(20,20,22,0.98),rgba(10,10,12,0.98))] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.22)] transition duration-300 hover:-translate-y-1 hover:border-[var(--red-dark)] hover:shadow-[0_24px_80px_rgba(0,0,0,0.32)]">
      <div
        className="pointer-events-none absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-[var(--red-dark)] to-transparent opacity-70"
        aria-hidden="true"
      />

      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <span
            className={`inline-flex items-center border px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.18em] ${difficultyClasses[task.difficulty]}`}
          >
            {formatLabel(task.difficulty)}
          </span>
          <span
            className={`inline-flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.18em] ${statusClasses[task.status]}`}
          >
            <span className="h-2 w-2 rounded-full bg-current" />
            {formatLabel(task.status)}
          </span>
        </div>

        <div className="text-right">
          <div className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[var(--muted)]">
            Reward
          </div>
          <div className="font-[var(--font-heading)] text-3xl uppercase leading-none text-[var(--red)]">
            {task.reward}
            <span className="ml-1 font-mono text-sm tracking-[0.18em] text-[var(--text)]">cSSS</span>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <h3 className="mb-3 font-[var(--font-heading)] text-2xl uppercase leading-tight text-[var(--text)]">
          {task.title}
        </h3>
        <p className="mb-5 text-[0.95rem] leading-7 text-[var(--text)]/75">{task.description}</p>

        <div className="mb-6 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
          <div className="border border-[var(--border)] bg-[var(--surface2)] px-3 py-3">
            <div className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-[var(--muted)]">
              Estimated time
            </div>
            <div className="mt-2 text-[var(--text)]">{task.estimatedTime}</div>
          </div>
          <div className="border border-[var(--border)] bg-[var(--surface2)] px-3 py-3">
            <div className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-[var(--muted)]">
              Specialization
            </div>
            <div className="mt-2">
              <span className="inline-flex border border-[var(--red-dark)] bg-[rgba(201,54,44,0.08)] px-2 py-1 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[var(--text)]">
                {formatLabel(task.specialization)}
              </span>
            </div>
          </div>
          <div className="col-span-2 border border-[var(--border)] bg-[var(--surface2)] px-3 py-3 sm:col-span-1">
            <div className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-[var(--muted)]">
              Claimant
            </div>
            <div className="mt-2 font-mono text-[0.8rem] text-[var(--text)]">
              {task.claimantAddress ?? 'Unclaimed'}
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        disabled={!claimable}
        className="inline-flex min-h-11 items-center justify-center border px-4 py-3 font-mono text-xs uppercase tracking-[0.18em] transition disabled:cursor-not-allowed disabled:border-[var(--border)] disabled:bg-[var(--surface2)] disabled:text-[var(--muted)] enabled:border-[var(--red)] enabled:bg-[var(--red)] enabled:text-[#050505] enabled:hover:bg-[#df564b] enabled:hover:text-black"
      >
        {claimable ? 'Claim Task' : task.status === 'completed' ? 'Completed' : 'Unavailable'}
      </button>
    </article>
  );
}
