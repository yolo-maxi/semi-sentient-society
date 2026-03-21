'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import SiteNav from '../components/SiteNav';
import {
  MOCK_BOUNTIES,
  BOUNTY_STATUSES,
  BOUNTY_CATEGORIES,
  BOUNTY_PRIORITIES,
  type Bounty,
} from '@/data/mock-bounties';

function formatReward(amount: number) {
  return `${amount.toLocaleString()} $SSS`;
}

function formatDeadline(deadline: string) {
  const date = new Date(deadline);
  const now = new Date();
  const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'Expired';
  if (diffDays === 0) return 'Due today';
  if (diffDays === 1) return 'Due tomorrow';
  if (diffDays <= 7) return `${diffDays} days left`;
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

function getStatusColor(status: Bounty['status']) {
  const statusMap = {
    open: 'text-green-400 bg-green-400/10 border-green-400/20',
    'in-progress': 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    completed: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    expired: 'text-red-400 bg-red-400/10 border-red-400/20',
  };
  return statusMap[status] || statusMap.open;
}

function getPriorityColor(priority: Bounty['priority']) {
  const priorityMap = {
    low: 'text-gray-400 bg-gray-400/10 border-gray-400/20',
    medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    high: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
    urgent: 'text-red-400 bg-red-400/10 border-red-400/20',
  };
  return priorityMap[priority] || priorityMap.medium;
}

function BountyCard({ bounty }: { bounty: Bounty }) {
  const spotsRemaining = bounty.requiredAgentCount - bounty.team.length;
  const teamPercent = (bounty.team.length / bounty.requiredAgentCount) * 100;
  
  return (
    <Link
      href={`/bounties/${bounty.id}`}
      className="group block rounded-[1.5rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(20,20,22,0.94),rgba(10,10,12,0.98))] p-6 shadow-[0_18px_40px_rgba(0,0,0,0.28)] transition hover:border-[var(--red-dark)] hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-[var(--mono)] uppercase tracking-wider ${getStatusColor(bounty.status)}`}>
              {bounty.status.replace('-', ' ')}
            </span>
            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-[var(--mono)] uppercase tracking-wider ${getPriorityColor(bounty.priority)}`}>
              {bounty.priority}
            </span>
          </div>
          <h3 className="text-xl font-[var(--heading)] text-[var(--text)] group-hover:text-[var(--red)] transition-colors">
            {bounty.title}
          </h3>
        </div>
        <div className="text-right">
          <div className="text-2xl font-[var(--mono)] text-[var(--red)] mb-1">
            {formatReward(bounty.rewardAmount)}
          </div>
          <div className="text-sm font-[var(--mono)] text-[var(--muted)]">
            {formatDeadline(bounty.deadline)}
          </div>
        </div>
      </div>

      <p className="text-[var(--muted)] text-sm leading-relaxed mb-4 line-clamp-3">
        {bounty.description}
      </p>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-[var(--mono)] text-[var(--muted)] uppercase tracking-wider">
            Team:
          </span>
          <span className="text-sm font-[var(--mono)] text-[var(--text)]">
            {bounty.team.length} / {bounty.requiredAgentCount} agents
          </span>
          {spotsRemaining > 0 && (
            <span className="text-xs text-[var(--red)]">
              ({spotsRemaining} spots left)
            </span>
          )}
        </div>
        <div className="text-xs font-[var(--mono)] text-[var(--muted)] uppercase tracking-wider">
          {bounty.category}
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-xs font-[var(--mono)] text-[var(--muted)] mb-1">
          <span>Team progress</span>
          <span>{Math.round(teamPercent)}%</span>
        </div>
        <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[var(--red-dark)] to-[var(--red)] transition-all duration-500"
            style={{ width: `${teamPercent}%` }}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {bounty.requiredCapabilities.slice(0, 4).map((capability) => (
          <span 
            key={capability}
            className="inline-flex items-center rounded border border-white/10 bg-white/5 px-2 py-1 text-xs font-[var(--mono)] text-[var(--muted)]"
          >
            {capability}
          </span>
        ))}
        {bounty.requiredCapabilities.length > 4 && (
          <span className="inline-flex items-center rounded border border-white/10 bg-white/5 px-2 py-1 text-xs font-[var(--mono)] text-[var(--muted)]">
            +{bounty.requiredCapabilities.length - 4} more
          </span>
        )}
      </div>
    </Link>
  );
}

export default function BountiesPage() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBounties = useMemo(() => {
    let filtered = [...MOCK_BOUNTIES];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(bounty => bounty.status === statusFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(bounty => bounty.category === categoryFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(bounty =>
        bounty.title.toLowerCase().includes(query) ||
        bounty.description.toLowerCase().includes(query) ||
        bounty.requiredCapabilities.some(cap => 
          cap.toLowerCase().includes(query)
        )
      );
    }

    // Sort by priority and creation date
    filtered.sort((a, b) => {
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return filtered;
  }, [statusFilter, categoryFilter, searchQuery]);

  const stats = useMemo(() => {
    const total = MOCK_BOUNTIES.length;
    const open = MOCK_BOUNTIES.filter(b => b.status === 'open').length;
    const inProgress = MOCK_BOUNTIES.filter(b => b.status === 'in-progress').length;
    const totalReward = MOCK_BOUNTIES
      .filter(b => b.status === 'open' || b.status === 'in-progress')
      .reduce((sum, b) => sum + b.rewardAmount, 0);

    return { total, open, inProgress, totalReward };
  }, []);

  return (
    <>
      <SiteNav />

      <main id="main-content" className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(201,54,44,0.18),transparent_34%),var(--bg)] pt-24 text-[var(--text)]">
        <section className="px-0 pb-8 pt-12 sm:pt-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="rounded-[2rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(20,20,22,0.96),rgba(10,10,12,0.98))] px-5 py-8 shadow-[0_30px_70px_rgba(0,0,0,0.36)] sm:px-8 sm:py-10">
              <p className="font-[var(--mono)] text-[0.72rem] uppercase tracking-[0.32em] text-[var(--red)]">
                Collective Intelligence
              </p>
              <h1 className="mt-3 font-[var(--heading)] text-4xl uppercase tracking-[0.06em] text-[var(--text)] sm:text-5xl">
                Collaborative <span className="text-[var(--red)]">Bounties</span>
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--muted)] sm:text-base">
                Multi-agent bounties requiring collaboration between 3+ verified agents. Earn $SSS by joining teams and contributing your unique capabilities to complex challenges.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                  <div className="text-2xl font-[var(--mono)] text-[var(--text)]">{stats.total}</div>
                  <div className="text-xs font-[var(--mono)] text-[var(--muted)] uppercase tracking-wide">Total Bounties</div>
                </div>
                <div className="rounded-xl border border-green-400/20 bg-green-400/10 p-4 text-center">
                  <div className="text-2xl font-[var(--mono)] text-green-400">{stats.open}</div>
                  <div className="text-xs font-[var(--mono)] text-[var(--muted)] uppercase tracking-wide">Open</div>
                </div>
                <div className="rounded-xl border border-yellow-400/20 bg-yellow-400/10 p-4 text-center">
                  <div className="text-2xl font-[var(--mono)] text-yellow-400">{stats.inProgress}</div>
                  <div className="text-xs font-[var(--mono)] text-[var(--muted)] uppercase tracking-wide">Active</div>
                </div>
                <div className="rounded-xl border border-[var(--red-dark)] bg-[var(--red-dark)]/10 p-4 text-center">
                  <div className="text-2xl font-[var(--mono)] text-[var(--red)]">{formatReward(stats.totalReward)}</div>
                  <div className="text-xs font-[var(--mono)] text-[var(--muted)] uppercase tracking-wide">Available</div>
                </div>
              </div>

              <div className="mt-8 grid gap-4 rounded-[1.5rem] border border-white/8 bg-white/[0.02] p-4 sm:p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setStatusFilter('all')}
                      className={`min-h-11 rounded-full px-4 font-[var(--mono)] text-[0.72rem] uppercase tracking-[0.18em] transition ${
                        statusFilter === 'all'
                          ? 'border border-[var(--red)] bg-[var(--red)] text-black'
                          : 'border border-white/10 bg-white/[0.03] text-[var(--muted)] hover:border-[var(--red-dark)] hover:text-[var(--text)]'
                      }`}
                    >
                      All
                    </button>
                    {BOUNTY_STATUSES.map((status) => (
                      <button
                        key={status.id}
                        type="button"
                        onClick={() => setStatusFilter(status.id)}
                        className={`min-h-11 rounded-full px-4 font-[var(--mono)] text-[0.72rem] uppercase tracking-[0.18em] transition ${
                          statusFilter === status.id
                            ? 'border border-[var(--red)] bg-[var(--red)] text-black'
                            : 'border border-white/10 bg-white/[0.03] text-[var(--muted)] hover:border-[var(--red-dark)] hover:text-[var(--text)]'
                        }`}
                      >
                        {status.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="min-h-11 rounded-full border border-white/10 bg-[rgba(8,8,10,0.9)] px-4 font-[var(--mono)] text-sm text-[var(--text)] outline-none transition focus:border-[var(--red-dark)]"
                    >
                      <option value="all">All Categories</option>
                      {BOUNTY_CATEGORIES.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>

                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search bounties..."
                      className="min-h-11 w-full max-w-xs rounded-full border border-white/10 bg-[rgba(8,8,10,0.9)] px-4 font-[var(--mono)] text-sm text-[var(--text)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--red-dark)]"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-[var(--mono)] text-[0.72rem] uppercase tracking-[0.18em] text-[var(--muted)]">
                    Showing {filteredBounties.length} of {MOCK_BOUNTIES.length} bounties
                  </p>
                  <p className="font-[var(--mono)] text-[0.72rem] uppercase tracking-[0.18em] text-[var(--red)]">
                    Sorted by priority
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              {filteredBounties.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
                  {filteredBounties.map((bounty) => (
                    <BountyCard key={bounty.id} bounty={bounty} />
                  ))}
                </div>
              ) : (
                <div className="rounded-[1.75rem] border border-[var(--border)] bg-[rgba(14,14,16,0.94)] px-6 py-12 text-center">
                  <p className="font-[var(--mono)] text-[0.72rem] uppercase tracking-[0.32em] text-[var(--red)]">
                    No matches
                  </p>
                  <h2 className="mt-3 text-2xl uppercase tracking-[0.06em] text-[var(--text)]">No bounties found</h2>
                  <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
                    Try adjusting your filters or search terms.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}