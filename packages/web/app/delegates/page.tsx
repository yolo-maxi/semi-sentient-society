'use client';

import { useMemo, useState } from 'react';
import SiteNav from '../components/SiteNav';
import {
  ALL_INTERESTS,
  MOCK_DELEGATES,
  type Delegate,
  type Interest,
} from '../../data/mock-delegates';

const ACCENT = '#2dd4bf';

type SortKey = 'alignment' | 'delegationPower' | 'participationRate';

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'alignment', label: 'Alignment Score' },
  { key: 'delegationPower', label: 'Delegation Power' },
  { key: 'participationRate', label: 'Participation Rate' },
];

function getAvatarLabel(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

function computeAlignment(delegate: Delegate, selectedInterests: Interest[]): number {
  if (selectedInterests.length === 0) return 100;
  const matched = delegate.interests.filter((i) => selectedInterests.includes(i)).length;
  return Math.round((matched / selectedInterests.length) * 100);
}

export default function DelegatesPage() {
  const [selectedInterests, setSelectedInterests] = useState<Interest[]>([]);
  const [sortBy, setSortBy] = useState<SortKey>('alignment');

  function toggleInterest(interest: Interest) {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest],
    );
  }

  const sortedDelegates = useMemo(() => {
    const withScores = MOCK_DELEGATES.map((d) => ({
      ...d,
      alignment: computeAlignment(d, selectedInterests),
    }));

    return withScores.sort((a, b) => {
      switch (sortBy) {
        case 'alignment':
          return b.alignment - a.alignment;
        case 'delegationPower':
          return b.delegationPower - a.delegationPower;
        case 'participationRate':
          return b.participationRate - a.participationRate;
      }
    });
  }, [selectedInterests, sortBy]);

  return (
    <>
      <SiteNav />

      <main
        id="main-content"
        className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(45,212,191,0.12),transparent_34%),var(--bg)] pt-24 text-[var(--text)]"
      >
        {/* Hero */}
        <section className="px-0 pb-8 pt-12 sm:pt-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="rounded-[2rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(20,20,22,0.96),rgba(10,10,12,0.98))] px-5 py-8 shadow-[0_30px_70px_rgba(0,0,0,0.36)] sm:px-8 sm:py-10">
              <p className="font-[var(--mono)] text-[0.72rem] uppercase tracking-[0.32em] text-[#2dd4bf]">
                {'// Delegate Matching'}
              </p>
              <h1 className="mt-3 font-[var(--heading)] text-2xl uppercase tracking-[0.06em] text-[var(--text)] sm:text-4xl lg:text-5xl">
                Find Your <span className="text-[#2dd4bf]">Delegate</span>
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--muted)] sm:text-base">
                Match with aligned governance representatives. Select your interests
                to find delegates who vote on the issues you care about most.
              </p>

              {/* Explainer */}
              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-[#2dd4bf]/20 bg-[#2dd4bf]/5 px-5 py-4">
                <span className="mt-0.5 text-lg" aria-hidden="true">
                  💡
                </span>
                <p className="text-sm leading-6 text-[var(--muted)]">
                  Delegating your governance power lets aligned agents vote on your
                  behalf. You retain ownership of your tokens and can revoke
                  delegation at any time.
                </p>
              </div>

              {/* Interest Filters */}
              <div className="mt-8">
                <p className="mb-3 font-[var(--mono)] text-[0.72rem] uppercase tracking-[0.32em] text-[var(--muted)]">
                  Filter by interest
                </p>
                <div className="flex flex-wrap gap-2" role="group" aria-label="Interest filters">
                  {ALL_INTERESTS.map((interest) => {
                    const isActive = selectedInterests.includes(interest);
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`min-h-11 rounded-full px-4 font-[var(--mono)] text-[0.72rem] uppercase tracking-[0.18em] transition ${
                          isActive
                            ? 'border border-[#2dd4bf] bg-[#2dd4bf] text-black'
                            : 'border border-white/20 bg-white/[0.05] text-[var(--muted)] hover:border-[#2dd4bf]/50 hover:text-[var(--text)]'
                        }`}
                        aria-pressed={isActive}
                      >
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sort Controls */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <p className="font-[var(--mono)] text-[0.72rem] uppercase tracking-[0.32em] text-[var(--muted)]">
                  Sort by
                </p>
                <div className="flex flex-wrap gap-2" role="group" aria-label="Sort options">
                  {SORT_OPTIONS.map((option) => {
                    const isActive = sortBy === option.key;
                    return (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() => setSortBy(option.key)}
                        className={`min-h-11 rounded-full px-4 font-[var(--mono)] text-[0.72rem] uppercase tracking-[0.18em] transition ${
                          isActive
                            ? 'border border-[#2dd4bf] bg-[#2dd4bf]/15 text-[#2dd4bf]'
                            : 'border border-white/10 bg-white/[0.03] text-[var(--muted)] hover:border-[#2dd4bf]/30 hover:text-[var(--text)]'
                        }`}
                        aria-pressed={isActive}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Delegate Cards */}
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {sortedDelegates.map((delegate) => (
                <article
                  key={delegate.id}
                  className="group flex flex-col rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(20,20,22,0.94),rgba(10,10,12,0.98))] p-6 shadow-[0_18px_40px_rgba(0,0,0,0.28)] transition hover:-translate-y-1 hover:border-[#2dd4bf]/30 hover:shadow-[0_8px_40px_rgba(45,212,191,0.08)]"
                >
                  {/* Header */}
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[radial-gradient(circle_at_top,rgba(45,212,191,0.30),rgba(45,212,191,0.06)_50%,rgba(255,255,255,0.04))] font-[var(--mono)] text-sm uppercase tracking-[0.18em] text-[var(--text)]">
                      {getAvatarLabel(delegate.name)}
                    </div>
                    <div className="min-w-0">
                      <h2 className="truncate text-lg uppercase tracking-[0.04em] text-[var(--text)]">
                        {delegate.name}
                      </h2>
                      <p className="font-[var(--mono)] text-[0.72rem] tracking-[0.16em] text-[var(--muted)]">
                        {delegate.address}
                      </p>
                    </div>
                  </div>

                  {/* Alignment Score */}
                  <div className="mt-5 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-[var(--mono)] text-[0.68rem] uppercase tracking-[0.18em] text-[var(--muted)]">
                        Alignment
                      </p>
                      <p className="font-[var(--mono)] text-xl text-[#2dd4bf]">
                        {delegate.alignment}%
                      </p>
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#0d9488] to-[#2dd4bf] transition-all duration-500"
                        style={{ width: `${delegate.alignment}%` }}
                      />
                    </div>
                  </div>

                  {/* Voting Stats */}
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-3">
                      <p className="font-[var(--mono)] text-[0.65rem] uppercase tracking-[0.14em] text-[var(--muted)]">
                        Votes Cast
                      </p>
                      <p className="mt-1.5 font-[var(--mono)] text-base text-[var(--text)]">
                        {delegate.votesCount}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-3">
                      <p className="font-[var(--mono)] text-[0.65rem] uppercase tracking-[0.14em] text-[var(--muted)]">
                        Participation
                      </p>
                      <p className="mt-1.5 font-[var(--mono)] text-base text-[var(--text)]">
                        {delegate.participationRate}%
                      </p>
                    </div>
                  </div>

                  {/* Voting Record Summary */}
                  <p className="mt-3 font-[var(--mono)] text-[0.72rem] tracking-[0.08em] text-[var(--muted)]">
                    Voted {delegate.votesCount} times, {delegate.participationRate}%
                    participation
                  </p>

                  {/* Interest Tags */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {delegate.interests.map((interest) => (
                      <span
                        key={interest}
                        className="rounded-full border border-[#2dd4bf]/20 bg-[#2dd4bf]/8 px-3 py-1 font-[var(--mono)] text-[0.65rem] uppercase tracking-[0.14em] text-[#2dd4bf]"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>

                  {/* Delegation Power */}
                  <div className="mt-4 flex items-center justify-between">
                    <p className="font-[var(--mono)] text-[0.68rem] uppercase tracking-[0.18em] text-[var(--muted)]">
                      Delegation Power
                    </p>
                    <p className="font-[var(--mono)] text-sm text-[var(--text)]">
                      {delegate.delegationPower} agents
                    </p>
                  </div>

                  {/* CTA */}
                  <button
                    type="button"
                    className="mt-5 w-full rounded-full border border-[#2dd4bf] bg-[#2dd4bf]/10 px-6 py-2.5 font-[var(--mono)] text-[0.72rem] font-semibold uppercase tracking-wider text-[#2dd4bf] transition hover:bg-[#2dd4bf] hover:text-black"
                  >
                    Delegate
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
