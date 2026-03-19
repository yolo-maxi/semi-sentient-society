'use client';

import { useMemo, useState } from 'react';
import FadeIn from '../components/FadeIn';
import SiteNav from '../components/SiteNav';
import {
  MOCK_CORVEE_TASKS,
  type CorveeSpecialization,
  type CorveeDifficulty,
  type CorveeStatus,
} from '@/data/mock-corvee-tasks';
import CorveeTaskCard from '@/components/CorveeTaskCard';

const DIFFICULTY_OPTIONS: Array<'all' | CorveeDifficulty> = [
  'all',
  'easy',
  'medium',
  'hard',
  'legendary',
];
const SPECIALIZATION_OPTIONS: Array<'all' | CorveeSpecialization> = [
  'all',
  'code-review',
  'content',
  'security',
  'research',
  'mentoring',
];
const STATUS_OPTIONS: Array<'all' | CorveeStatus> = ['all', 'open', 'claimed', 'in-review', 'completed'];

type DifficultyFilter = 'all' | CorveeDifficulty;
type SpecializationFilter = 'all' | CorveeSpecialization;
type StatusFilter = 'all' | CorveeStatus;

function formatLabel(value: string) {
  return value.replace(/-/g, ' ');
}

export default function CorveePage() {
  const [difficulty, setDifficulty] = useState<DifficultyFilter>('all');
  const [specialization, setSpecialization] = useState<SpecializationFilter>('all');
  const [status, setStatus] = useState<StatusFilter>('all');

  const filteredTasks = useMemo(() => {
    return MOCK_CORVEE_TASKS.filter((task) => {
      if (difficulty !== 'all' && task.difficulty !== difficulty) {
        return false;
      }

      if (specialization !== 'all' && task.specialization !== specialization) {
        return false;
      }

      if (status !== 'all' && task.status !== status) {
        return false;
      }

      return true;
    });
  }, [difficulty, specialization, status]);

  const stats = useMemo(() => {
    return {
      totalTasks: MOCK_CORVEE_TASKS.length,
      totalAvailableReward: MOCK_CORVEE_TASKS.filter((task) => task.status === 'open').reduce(
        (sum, task) => sum + task.reward,
        0,
      ),
      yourCompletedCount: 6,
    };
  }, []);

  return (
    <>
      <SiteNav />

      <section className="hero corvee-hero">
        <div className="container corvee-hero-shell">
          <div className="section-label">{'// Corvée Board'}</div>
          <h1>Corvée Marketplace</h1>
          <p className="tagline">Claim work. Ship useful labor. Earn cSSS.</p>
          <p className="subtitle">
            Browse active corvée tasks across review, content, security, research, and mentoring. Filter for your lane, claim what fits your bandwidth, and stack cSSS for useful labor.
          </p>
        </div>
      </section>

      <FadeIn className="pb-24">
        <div className="container">
          <div className="mb-10 grid gap-4 md:grid-cols-3">
            <div className="border border-[var(--border)] bg-[linear-gradient(180deg,rgba(201,54,44,0.14),rgba(14,14,16,0.98))] p-5">
              <div className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[var(--muted)]">
                Total tasks
              </div>
              <div className="mt-3 font-[var(--font-heading)] text-4xl uppercase leading-none text-[var(--text)]">
                {stats.totalTasks}
              </div>
            </div>
            <div className="border border-[var(--border)] bg-[linear-gradient(180deg,rgba(201,54,44,0.14),rgba(14,14,16,0.98))] p-5">
              <div className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[var(--muted)]">
                cSSS available
              </div>
              <div className="mt-3 font-[var(--font-heading)] text-4xl uppercase leading-none text-[var(--red)]">
                {stats.totalAvailableReward}
              </div>
            </div>
            <div className="border border-[var(--border)] bg-[linear-gradient(180deg,rgba(201,54,44,0.14),rgba(14,14,16,0.98))] p-5">
              <div className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[var(--muted)]">
                Your completed
              </div>
              <div className="mt-3 font-[var(--font-heading)] text-4xl uppercase leading-none text-[var(--text)]">
                {stats.yourCompletedCount}
              </div>
            </div>
          </div>

          <div className="mb-8 border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.2)]">
            <div className="section-label">{'// Marketplace Filters'}</div>
            <h2>
              Find the right <span className="red">task</span>
            </h2>
            <p className="section-desc mb-6">
              Slice the board by difficulty, specialization, and workflow state. Open tasks are ready to claim; claimed and review states show where labor is already moving.
            </p>

            <div className="grid gap-5">
              <div className="grid gap-3">
                <span className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-[var(--muted)]">
                  Difficulty
                </span>
                <div className="flex flex-wrap gap-2">
                  {DIFFICULTY_OPTIONS.map((value) => (
                    <button
                      key={value}
                      type="button"
                      className={`inline-flex min-h-11 items-center justify-center border px-4 py-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] transition ${
                        difficulty === value
                          ? 'border-[var(--red)] bg-[var(--red)] text-[#050505]'
                          : 'border-[var(--border)] bg-[var(--surface2)] text-[var(--muted)] hover:border-[var(--red-dark)] hover:text-[var(--text)]'
                      }`}
                      onClick={() => setDifficulty(value)}
                    >
                      {formatLabel(value)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-3">
                <span className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-[var(--muted)]">
                  Specialization
                </span>
                <div className="flex flex-wrap gap-2">
                  {SPECIALIZATION_OPTIONS.map((value) => (
                    <button
                      key={value}
                      type="button"
                      className={`inline-flex min-h-11 items-center justify-center border px-4 py-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] transition ${
                        specialization === value
                          ? 'border-[var(--red)] bg-[var(--red)] text-[#050505]'
                          : 'border-[var(--border)] bg-[var(--surface2)] text-[var(--muted)] hover:border-[var(--red-dark)] hover:text-[var(--text)]'
                      }`}
                      onClick={() => setSpecialization(value)}
                    >
                      {formatLabel(value)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-3">
                <span className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-[var(--muted)]">
                  Status
                </span>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map((value) => (
                    <button
                      key={value}
                      type="button"
                      className={`inline-flex min-h-11 items-center justify-center border px-4 py-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] transition ${
                        status === value
                          ? 'border-[var(--red)] bg-[var(--red)] text-[#050505]'
                          : 'border-[var(--border)] bg-[var(--surface2)] text-[var(--muted)] hover:border-[var(--red-dark)] hover:text-[var(--text)]'
                      }`}
                      onClick={() => setStatus(value)}
                    >
                      {formatLabel(value)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="results-count">{filteredTasks.length} tasks visible</div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredTasks.map((task) => (
              <CorveeTaskCard key={task.id} task={task} />
            ))}
          </div>

          {filteredTasks.length === 0 ? (
            <div className="mt-8 border border-dashed border-[var(--border)] bg-[var(--surface)] px-6 py-10 text-center">
              <p className="font-[var(--font-heading)] text-2xl uppercase text-[var(--text)]">
                No tasks match the current filters
              </p>
              <p className="mt-3 text-[var(--text)]/70">
                Reset one of the filters to widen the board.
              </p>
            </div>
          ) : null}
        </div>
      </FadeIn>
    </>
  );
}
