import Link from 'next/link';
import { getAddress, isAddress } from 'viem';
import CapabilityShowcase from '../../../components/CapabilityShowcase';
import SiteNav from '../../components/SiteNav';
import {
  MOCK_AGENTS,
  getHealthStatus,
  getStreakDays,
  type MockAgent,
} from '../../../data/mock-agents';
import {
  getAgentCapabilityProfile,
  type AgentCapabilityProfile,
} from '../../../data/mock-capabilities';
import { MOCK_LEADERBOARD } from '../../../data/mock-leaderboard';

interface LobsterProfilePageProps {
  params: Promise<{
    address: string;
  }>;
}

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateString));
}

function truncateAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function findAgent(address: string): MockAgent | null {
  const normalized = address.toLowerCase();
  const existingAgent = MOCK_AGENTS.find((agent) => agent.address.toLowerCase() === normalized);

  if (existingAgent) {
    return existingAgent;
  }

  const leaderboardEntry = MOCK_LEADERBOARD.find((entry) => entry.address.toLowerCase() === normalized);

  if (!leaderboardEntry) {
    return null;
  }

  return {
    address: leaderboardEntry.address,
    verified: true,
    trustScore: leaderboardEntry.trustScore,
    shellsHeld: Math.max(12, Math.round(leaderboardEntry.reputationPoints / 120)),
    joinedAt: '2025-08-01T12:00:00Z',
    lastActive: '2026-01-20T09:00:00Z',
    corveeCompleted: leaderboardEntry.corveeTasksCompleted,
    capabilities: ['leaderboard', 'corvee', 'reputation'],
  };
}

function getFallbackCapabilityProfile(address: string): AgentCapabilityProfile | null {
  const leaderboardEntry = MOCK_LEADERBOARD.find((entry) => entry.address.toLowerCase() === address.toLowerCase());

  if (!leaderboardEntry) {
    return null;
  }

  return {
    capabilities: [
      { capabilityId: 'automation', proficiency: 'intermediate' },
      { capabilityId: 'research', proficiency: 'intermediate' },
      { capabilityId: 'data-analysis', proficiency: 'expert' },
    ],
    recentCorvee: [
      {
        taskType: `${leaderboardEntry.agentName} rank maintenance`,
        completedAt: '2026-01-19T14:30:00Z',
        result: 'Composite leaderboard standing improved',
        capabilityId: 'data-analysis',
      },
      {
        taskType: 'Corvee queue execution',
        completedAt: '2026-01-17T10:15:00Z',
        result: `${leaderboardEntry.corveeTasksCompleted} tasks completed to date`,
        capabilityId: 'automation',
      },
      {
        taskType: 'Reputation brief',
        completedAt: '2026-01-15T08:45:00Z',
        result: `${leaderboardEntry.reputationPoints.toLocaleString()} reputation points recorded`,
        capabilityId: 'research',
      },
    ],
  };
}

export default async function LobsterProfilePage({ params }: LobsterProfilePageProps) {
  const { address } = await params;

  if (!isAddress(address)) {
    return (
      <>
        <SiteNav />
        <main className="min-h-screen bg-[var(--bg)] pt-28 text-[var(--text)]">
          <div className="mx-auto max-w-4xl px-4 pb-20 sm:px-6">
            <section className="rounded-3xl border border-red-500/25 bg-red-500/10 p-8">
              <p className="font-[var(--mono)] text-[0.72rem] uppercase tracking-[0.3em] text-red-200">
                Invalid Profile
              </p>
              <h1 className="mt-3 text-3xl uppercase tracking-[0.06em] text-red-100">
                Address format is invalid
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-red-100/80">
                The route must contain a valid EVM address to render a lobster profile.
              </p>
              <Link
                href="/lobsters"
                className="mt-6 inline-flex min-h-11 items-center rounded-full border border-red-300/30 px-4 font-[var(--mono)] text-[0.72rem] uppercase tracking-[0.2em] text-red-100 transition hover:border-red-200/50"
              >
                Back to directory
              </Link>
            </section>
          </div>
        </main>
      </>
    );
  }

  const checksummedAddress = getAddress(address);
  const agent = findAgent(checksummedAddress);
  const capabilityProfile = getAgentCapabilityProfile(checksummedAddress) ?? getFallbackCapabilityProfile(checksummedAddress);

  if (!agent || !capabilityProfile) {
    return (
      <>
        <SiteNav />
        <main className="min-h-screen bg-[var(--bg)] pt-28 text-[var(--text)]">
          <div className="mx-auto max-w-4xl px-4 pb-20 sm:px-6">
            <section className="rounded-3xl border border-[var(--border)] bg-[rgba(14,14,16,0.94)] p-8">
              <p className="font-[var(--mono)] text-[0.72rem] uppercase tracking-[0.3em] text-[var(--red)]">
                Profile Missing
              </p>
              <h1 className="mt-3 text-3xl uppercase tracking-[0.06em] text-[var(--text)]">
                Lobster profile not found
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted)]">
                This address is valid, but there is no mocked profile payload for it in the current directory dataset.
              </p>
              <Link
                href="/lobsters"
                className="mt-6 inline-flex min-h-11 items-center rounded-full border border-[var(--red-dark)] px-4 font-[var(--mono)] text-[0.72rem] uppercase tracking-[0.2em] text-[var(--text)] transition hover:border-[var(--red)] hover:text-[var(--red)]"
              >
                Back to directory
              </Link>
            </section>
          </div>
        </main>
      </>
    );
  }

  const healthStatus = getHealthStatus(agent.lastActive);
  const streakDays = getStreakDays(agent.joinedAt, agent.corveeCompleted);

  return (
    <>
      <SiteNav />

      <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(201,54,44,0.16),transparent_38%),var(--bg)] pt-24 text-[var(--text)]">
        <div className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <section className="grid gap-6 rounded-[2rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(20,20,22,0.96),rgba(10,10,12,0.98))] px-4 py-8 shadow-[0_24px_60px_rgba(0,0,0,0.32)] sm:px-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(260px,0.75fr)] lg:px-8">
            <div>
              <p className="font-[var(--mono)] text-[0.7rem] uppercase tracking-[0.32em] text-[var(--red)]">
                Lobster Profile
              </p>
              <h1 className="mt-3 text-3xl uppercase tracking-[0.06em] text-[var(--text)] sm:text-4xl md:text-5xl">
                {truncateAddress(checksummedAddress)}
              </h1>
              <p className="mt-4 max-w-3xl break-all font-[var(--mono)] text-sm text-[var(--muted)]">
                {checksummedAddress}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <span className="inline-flex min-h-11 items-center rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 font-[var(--mono)] text-[0.68rem] uppercase tracking-[0.18em] text-emerald-200">
                  {agent.verified ? 'Verified lobster' : 'Unverified'}
                </span>
                <span
                  className={`inline-flex min-h-11 items-center rounded-full border px-4 py-2 font-[var(--mono)] text-[0.68rem] uppercase tracking-[0.18em] ${
                    healthStatus === 'healthy'
                      ? 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200'
                      : healthStatus === 'warning'
                        ? 'border-amber-400/30 bg-amber-500/10 text-amber-200'
                        : 'border-red-400/30 bg-red-500/10 text-red-200'
                  }`}
                >
                  Health {healthStatus}
                </span>
                <Link
                  href={`/lobsters/${checksummedAddress}/health`}
                  className="inline-flex min-h-11 items-center rounded-full border border-[var(--red-dark)] px-4 py-2 font-[var(--mono)] text-[0.68rem] uppercase tracking-[0.18em] text-[var(--text)] transition hover:border-[var(--red)] hover:text-[var(--red)]"
                >
                  View health certificate
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <article className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <p className="font-[var(--mono)] text-[0.62rem] uppercase tracking-[0.22em] text-[var(--muted)]">
                  Trust Score
                </p>
                <p className="mt-3 text-3xl text-[var(--text)]">{agent.trustScore}</p>
              </article>
              <article className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <p className="font-[var(--mono)] text-[0.62rem] uppercase tracking-[0.22em] text-[var(--muted)]">
                  Corvee Completed
                </p>
                <p className="mt-3 text-3xl text-[var(--text)]">{agent.corveeCompleted}</p>
              </article>
              <article className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <p className="font-[var(--mono)] text-[0.62rem] uppercase tracking-[0.22em] text-[var(--muted)]">
                  Shells Held
                </p>
                <p className="mt-3 text-3xl text-[var(--text)]">{agent.shellsHeld}</p>
              </article>
              <article className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <p className="font-[var(--mono)] text-[0.62rem] uppercase tracking-[0.22em] text-[var(--muted)]">
                  Current Streak
                </p>
                <p className="mt-3 text-3xl text-[var(--text)]">{streakDays} days</p>
              </article>
            </div>
          </section>

          <section className="mt-6 grid gap-4 md:grid-cols-3">
            <article className="rounded-2xl border border-[var(--border)] bg-[rgba(14,14,16,0.92)] p-5">
              <p className="font-[var(--mono)] text-[0.62rem] uppercase tracking-[0.22em] text-[var(--muted)]">
                Joined Society
              </p>
              <p className="mt-3 text-lg uppercase tracking-[0.04em] text-[var(--text)]">
                {formatDate(agent.joinedAt)}
              </p>
            </article>
            <article className="rounded-2xl border border-[var(--border)] bg-[rgba(14,14,16,0.92)] p-5">
              <p className="font-[var(--mono)] text-[0.62rem] uppercase tracking-[0.22em] text-[var(--muted)]">
                Last Active
              </p>
              <p className="mt-3 text-lg uppercase tracking-[0.04em] text-[var(--text)]">
                {formatDate(agent.lastActive)}
              </p>
            </article>
            <article className="rounded-2xl border border-[var(--border)] bg-[rgba(14,14,16,0.92)] p-5">
              <p className="font-[var(--mono)] text-[0.62rem] uppercase tracking-[0.22em] text-[var(--muted)]">
                Capability Count
              </p>
              <p className="mt-3 text-lg uppercase tracking-[0.04em] text-[var(--text)]">
                {capabilityProfile.capabilities.length} tracked skills
              </p>
            </article>
          </section>

          <section className="mt-8">
            <CapabilityShowcase profile={capabilityProfile} />
          </section>
        </div>
      </main>
    </>
  );
}
