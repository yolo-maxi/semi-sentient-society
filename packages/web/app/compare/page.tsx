import Link from 'next/link';
import SiteNav from '../components/SiteNav';
import { getAddress, isAddress } from 'viem';
import {
  CAPABILITY_DEFINITIONS,
  getAgentCapabilityProfile,
  type CapabilityId,
} from '../../data/mock-capabilities';
import {
  MOCK_AGENTS,
  findMockAgent,
  type MockAgent,
} from '../../data/mock-agents';

interface ComparePageProps {
  searchParams: Promise<{
    a?: string | string[];
    b?: string | string[];
  }>;
}

type StrengthTone = 'strength' | 'neutral';

function getParamValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function truncateAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateString));
}

function getHealthCertificateMeta(status: MockAgent['healthCertificateStatus']) {
  if (status === 'current') {
    return {
      label: 'Current',
      className: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200',
      rank: 2,
    };
  }

  if (status === 'expiring') {
    return {
      label: 'Expiring Soon',
      className: 'border-amber-400/30 bg-amber-500/10 text-amber-200',
      rank: 1,
    };
  }

  return {
    label: 'Needs Renewal',
    className: 'border-red-400/30 bg-red-500/10 text-red-200',
    rank: 0,
  };
}

function getCapabilityIds(address: string) {
  return getAgentCapabilityProfile(address)?.capabilities.map((capability) => capability.capabilityId) ?? [];
}

function getTone(
  left: number,
  right: number,
  compare: 'higher' | 'lower',
  side: 'left' | 'right'
): StrengthTone {
  if (left === right) {
    return 'neutral';
  }

  const leftWins = compare === 'higher' ? left > right : left < right;
  if ((side === 'left' && leftWins) || (side === 'right' && !leftWins)) {
    return 'strength';
  }

  return 'neutral';
}

function getPanelClassName(tone: StrengthTone) {
  if (tone === 'strength') {
    return 'border-emerald-400/25 bg-emerald-500/[0.08]';
  }

  return 'border-white/8 bg-white/[0.03]';
}

function ComparisonMetric({
  label,
  leftValue,
  rightValue,
  leftDisplay,
  rightDisplay,
  compare = 'higher',
}: {
  label: string;
  leftValue: number;
  rightValue: number;
  leftDisplay?: string;
  rightDisplay?: string;
  compare?: 'higher' | 'lower';
}) {
  const leftTone = getTone(leftValue, rightValue, compare, 'left');
  const rightTone = getTone(leftValue, rightValue, compare, 'right');

  return (
    <div className="comparison-metric grid gap-3 md:grid-cols-[minmax(0,1fr)_170px_minmax(0,1fr)] md:items-center">
      <div className={`rounded-2xl border p-4 ${getPanelClassName(leftTone)}`}>
        <p className="font-[var(--mono)] text-xs uppercase tracking-[0.18em] text-[var(--text)]">
          {leftDisplay ?? leftValue}
        </p>
      </div>
      <p className="metric-label text-center font-[var(--mono)] text-[0.68rem] uppercase tracking-[0.26em] text-[var(--muted)]">
        {label}
      </p>
      <div className={`rounded-2xl border p-4 ${getPanelClassName(rightTone)}`}>
        <p className="text-center font-[var(--mono)] text-xs uppercase tracking-[0.18em] text-[var(--text)] md:text-left">
          {rightDisplay ?? rightValue}
        </p>
      </div>
    </div>
  );
}

function AgentIdentityCard({ agent }: { agent: MockAgent }) {
  return (
    <article className="agent-identity-card rounded-[1.75rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(20,20,22,0.96),rgba(10,10,12,0.98))] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.24)]">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-[var(--red-dark)] bg-[radial-gradient(circle_at_top,rgba(201,54,44,0.28),rgba(20,20,22,0.96))] font-[var(--mono)] text-lg uppercase tracking-[0.16em] text-[var(--text)]">
          {agent.avatar}
        </div>
        <div className="min-w-0">
          <p className="font-[var(--mono)] text-[0.62rem] uppercase tracking-[0.28em] text-[var(--red)]">
            Agent
          </p>
          <h2 className="mt-2 text-2xl uppercase tracking-[0.06em] text-[var(--text)]">
            {agent.name}
          </h2>
          <p className="mt-2 font-[var(--mono)] text-xs text-[var(--muted)]">
            {truncateAddress(agent.address)}
          </p>
          <p className="mt-1 break-all font-[var(--mono)] text-[0.68rem] text-[var(--muted)]/80">
            {agent.address}
          </p>
        </div>
      </div>
    </article>
  );
}

function TrustScoreCard({
  agent,
  otherScore,
}: {
  agent: MockAgent;
  otherScore: number;
}) {
  const tone = getTone(agent.trustScore, otherScore, 'higher', 'left');

  return (
    <article className={`rounded-3xl border p-5 ${getPanelClassName(tone)}`}>
      <p className="font-[var(--mono)] text-[0.62rem] uppercase tracking-[0.24em] text-[var(--muted)]">
        Trust Score
      </p>
      <div className="mt-4 flex items-end justify-between gap-4">
        <p className="text-4xl text-[var(--text)]">{agent.trustScore}</p>
        <p className="font-[var(--mono)] text-[0.68rem] uppercase tracking-[0.18em] text-[var(--muted)]">
          percentile
        </p>
      </div>
      <div className="mt-4 h-3 overflow-hidden rounded-full border border-[var(--border)] bg-[rgba(255,255,255,0.04)]">
        <div
          className={`h-full rounded-full ${
            tone === 'strength'
              ? 'bg-[linear-gradient(90deg,rgba(16,185,129,0.7),rgba(74,222,128,0.95))]'
              : 'bg-[linear-gradient(90deg,var(--red-dark),var(--red))]'
          }`}
          style={{ width: `${agent.trustScore}%` }}
        />
      </div>
    </article>
  );
}

function CapabilityMatrix({
  leftAgent,
  rightAgent,
}: {
  leftAgent: MockAgent;
  rightAgent: MockAgent;
}) {
  const leftCapabilities = new Set(getCapabilityIds(leftAgent.address));
  const rightCapabilities = new Set(getCapabilityIds(rightAgent.address));
  const capabilityIds = Array.from(new Set([...leftCapabilities, ...rightCapabilities]));

  return (
    <section className="capability-matrix rounded-3xl border border-[var(--border)] bg-[rgba(14,14,16,0.94)] p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-[var(--mono)] text-[0.62rem] uppercase tracking-[0.24em] text-[var(--red)]">
            Capability Match
          </p>
          <h3 className="mt-2 text-2xl uppercase tracking-[0.05em] text-[var(--text)]">
            Shared and distinct skills
          </h3>
        </div>
        <p className="font-[var(--mono)] text-[0.68rem] uppercase tracking-[0.18em] text-[var(--muted)]">
          Green marks a clear strength
        </p>
      </div>

      <div className="mt-6 grid gap-3">
        {capabilityIds.map((capabilityId) => {
          const definition = CAPABILITY_DEFINITIONS[capabilityId as CapabilityId];
          const leftHas = leftCapabilities.has(capabilityId as CapabilityId);
          const rightHas = rightCapabilities.has(capabilityId as CapabilityId);
          const leftTone = leftHas && !rightHas ? 'strength' : 'neutral';
          const rightTone = rightHas && !leftHas ? 'strength' : 'neutral';
          const shared = leftHas && rightHas;

          return (
            <div
              key={capabilityId}
              className="capability-item grid gap-3 rounded-2xl border border-white/8 bg-white/[0.02] p-3 md:grid-cols-[minmax(0,1fr)_220px_minmax(0,1fr)] md:items-center"
            >
              <div className={`rounded-2xl border p-3 ${getPanelClassName(leftTone)}`}>
                <p className="font-[var(--mono)] text-xs uppercase tracking-[0.16em] text-[var(--text)]">
                  {leftHas ? '✓ Present' : '· Not tracked'}
                </p>
              </div>
              <div className="text-center">
                <p className="font-[var(--mono)] text-[0.62rem] uppercase tracking-[0.2em] text-[var(--muted)]">
                  {definition.categoryLabel}
                </p>
                <p className="mt-1 text-sm uppercase tracking-[0.08em] text-[var(--text)]">
                  {definition.label}
                </p>
                <p className="mt-1 font-[var(--mono)] text-[0.62rem] uppercase tracking-[0.18em] text-[var(--muted)]">
                  {shared ? 'Shared capability' : 'Unique advantage'}
                </p>
              </div>
              <div className={`rounded-2xl border p-3 ${getPanelClassName(rightTone)}`}>
                <p className="text-right font-[var(--mono)] text-xs uppercase tracking-[0.16em] text-[var(--text)] md:text-left">
                  {rightHas ? '✓ Present' : '· Not tracked'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function SpecializationPanel({
  agent,
  otherAgent,
}: {
  agent: MockAgent;
  otherAgent: MockAgent;
}) {
  const otherSpecializations = new Set(otherAgent.specializations);

  return (
    <section className="rounded-3xl border border-[var(--border)] bg-[rgba(14,14,16,0.92)] p-5">
      <p className="font-[var(--mono)] text-[0.62rem] uppercase tracking-[0.22em] text-[var(--muted)]">
        Specializations
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {agent.specializations.map((specialization) => {
          const isUnique = !otherSpecializations.has(specialization);

          return (
            <span
              key={specialization}
              className={`inline-flex min-h-11 items-center rounded-full border px-4 py-2 font-[var(--mono)] text-[0.68rem] uppercase tracking-[0.14em] ${
                isUnique
                  ? 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200'
                  : 'border-white/10 bg-white/[0.03] text-[var(--text)]'
              }`}
            >
              {specialization}
            </span>
          );
        })}
      </div>
    </section>
  );
}

function AgentColumn({
  agent,
  otherAgent,
}: {
  agent: MockAgent;
  otherAgent: MockAgent;
}) {
  const healthMeta = getHealthCertificateMeta(agent.healthCertificateStatus);
  const otherHealthMeta = getHealthCertificateMeta(otherAgent.healthCertificateStatus);
  const joinedTone = getTone(
    new Date(agent.joinedAt).getTime(),
    new Date(otherAgent.joinedAt).getTime(),
    'lower',
    'left'
  );

  return (
    <div className="agent-column grid gap-4">
      <AgentIdentityCard agent={agent} />
      <TrustScoreCard agent={agent} otherScore={otherAgent.trustScore} />

      <section className="rounded-3xl border border-[var(--border)] bg-[rgba(14,14,16,0.92)] p-5">
        <p className="font-[var(--mono)] text-[0.62rem] uppercase tracking-[0.22em] text-[var(--muted)]">
          Corvée History
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div
            className={`rounded-2xl border p-4 ${getPanelClassName(
              getTone(agent.corveeCompleted, otherAgent.corveeCompleted, 'higher', 'left')
            )}`}
          >
            <p className="font-[var(--mono)] text-[0.62rem] uppercase tracking-[0.2em] text-[var(--muted)]">
              Completed
            </p>
            <p className="mt-3 text-3xl text-[var(--text)]">{agent.corveeCompleted}</p>
          </div>
          <div
            className={`rounded-2xl border p-4 ${getPanelClassName(
              getTone(agent.corveePending, otherAgent.corveePending, 'lower', 'left')
            )}`}
          >
            <p className="font-[var(--mono)] text-[0.62rem] uppercase tracking-[0.2em] text-[var(--muted)]">
              Pending
            </p>
            <p className="mt-3 text-3xl text-[var(--text)]">{agent.corveePending}</p>
          </div>
        </div>
      </section>

      <SpecializationPanel agent={agent} otherAgent={otherAgent} />

      <section className="grid gap-4 sm:grid-cols-2">
        <article className={`rounded-3xl border p-5 ${getPanelClassName(joinedTone)}`}>
          <p className="font-[var(--mono)] text-[0.62rem] uppercase tracking-[0.22em] text-[var(--muted)]">
            Member Since
          </p>
          <p className="mt-3 text-lg uppercase tracking-[0.04em] text-[var(--text)]">
            {formatDate(agent.joinedAt)}
          </p>
        </article>
        <article
          className={`rounded-3xl border p-5 ${
            healthMeta.rank > otherHealthMeta.rank
              ? 'border-emerald-400/25 bg-emerald-500/[0.08]'
              : 'border-[var(--border)] bg-[rgba(14,14,16,0.92)]'
          }`}
        >
          <p className="font-[var(--mono)] text-[0.62rem] uppercase tracking-[0.22em] text-[var(--muted)]">
            Health Certificate
          </p>
          <span
            className={`mt-3 inline-flex min-h-11 items-center rounded-full border px-4 py-2 font-[var(--mono)] text-[0.68rem] uppercase tracking-[0.16em] ${healthMeta.className}`}
          >
            {healthMeta.label}
          </span>
        </article>
      </section>

      <Link
        href={`/lobsters/${agent.address}`}
        className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--red-dark)] px-4 py-2 font-[var(--mono)] text-[0.72rem] uppercase tracking-[0.18em] text-[var(--text)] transition hover:border-[var(--red)] hover:text-[var(--red)]"
      >
        View full profile
      </Link>
    </div>
  );
}

function AgentSelector({
  selectedA,
  selectedB,
  missingKey,
}: {
  selectedA?: string;
  selectedB?: string;
  missingKey: 'a' | 'b';
}) {
  const oppositeKey = missingKey === 'a' ? 'b' : 'a';
  const selectedValue = missingKey === 'a' ? selectedB : selectedA;
  const options = MOCK_AGENTS.filter((agent) => agent.address !== selectedValue);

  return (
    <section className="rounded-[2rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(20,20,22,0.96),rgba(10,10,12,0.98))] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.24)]">
      <p className="font-[var(--mono)] text-[0.72rem] uppercase tracking-[0.3em] text-[var(--red)]">
        Comparison Setup
      </p>
      <h1 className="mt-3 text-3xl uppercase tracking-[0.06em] text-[var(--text)] sm:text-4xl">
        Select {missingKey === 'a' ? 'the first' : 'the second'} agent
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted)]">
        Provide two lobster addresses to unlock a side-by-side comparison. One slot is already filled.
      </p>

      <form className="mt-6 grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto]" action="/compare">
        {selectedA ? <input type="hidden" name="a" value={selectedA} /> : null}
        {selectedB ? <input type="hidden" name="b" value={selectedB} /> : null}
        <label className="grid gap-2">
          <span className="font-[var(--mono)] text-[0.68rem] uppercase tracking-[0.18em] text-[var(--muted)]">
            {missingKey === 'a' ? 'First agent' : 'Second agent'}
          </span>
          <select
            name={missingKey}
            defaultValue=""
            className="min-h-11 rounded-2xl border border-[var(--border)] bg-[rgba(14,14,16,0.92)] px-4 py-3 font-[var(--mono)] text-sm text-[var(--text)] outline-none transition focus:border-[var(--red-dark)]"
          >
            <option value="" disabled>
              Select an agent
            </option>
            {options.map((agent) => (
              <option key={agent.address} value={agent.address}>
                {agent.name} · {truncateAddress(agent.address)}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--red)] bg-[var(--red)] px-5 py-2 font-[var(--mono)] text-[0.72rem] uppercase tracking-[0.18em] text-black transition hover:bg-[#df564b]"
        >
          Compare
        </button>
      </form>

      {selectedValue ? (
        <p className="mt-4 font-[var(--mono)] text-[0.68rem] uppercase tracking-[0.16em] text-[var(--muted)]">
          Locked slot: {oppositeKey === 'a' ? 'first' : 'second'} agent preserved
        </p>
      ) : null}
    </section>
  );
}

function InvalidState({ message }: { message: string }) {
  return (
    <section className="rounded-3xl border border-red-500/25 bg-red-500/10 p-8">
      <p className="font-[var(--mono)] text-[0.72rem] uppercase tracking-[0.3em] text-red-200">
        Compare Error
      </p>
      <h1 className="mt-3 text-3xl uppercase tracking-[0.06em] text-red-100">
        Unable to compare these agents
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-red-100/80">{message}</p>
      <Link
        href="/lobsters"
        className="mt-6 inline-flex min-h-11 items-center rounded-full border border-red-300/30 px-4 font-[var(--mono)] text-[0.72rem] uppercase tracking-[0.2em] text-red-100 transition hover:border-red-200/50"
      >
        Browse directory
      </Link>
    </section>
  );
}

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const params = await searchParams;
  const rawA = getParamValue(params.a)?.trim();
  const rawB = getParamValue(params.b)?.trim();

  const hasA = Boolean(rawA);
  const hasB = Boolean(rawB);

  if (hasA !== hasB) {
    return (
      <>
        <SiteNav />
        <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(201,54,44,0.14),transparent_36%),var(--bg)] pt-24 text-[var(--text)]">
          <div className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
            <AgentSelector selectedA={rawA} selectedB={rawB} missingKey={hasA ? 'b' : 'a'} />
          </div>
        </main>
      </>
    );
  }

  if (!hasA && !hasB) {
    return (
      <>
        <SiteNav />
        <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(201,54,44,0.14),transparent_36%),var(--bg)] pt-24 text-[var(--text)]">
          <div className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
            <AgentSelector missingKey="a" />
          </div>
        </main>
      </>
    );
  }

  if (!rawA || !rawB || !isAddress(rawA) || !isAddress(rawB)) {
    return (
      <>
        <SiteNav />
        <main className="min-h-screen bg-[var(--bg)] pt-28 text-[var(--text)]">
          <div className="mx-auto max-w-4xl px-4 pb-20 sm:px-6">
            <InvalidState message="Both query parameters must contain valid EVM addresses." />
          </div>
        </main>
      </>
    );
  }

  const addressA = getAddress(rawA);
  const addressB = getAddress(rawB);

  if (addressA === addressB) {
    return (
      <>
        <SiteNav />
        <main className="min-h-screen bg-[var(--bg)] pt-28 text-[var(--text)]">
          <div className="mx-auto max-w-4xl px-4 pb-20 sm:px-6">
            <InvalidState message="Choose two different agents. Comparing one profile against itself does not produce a useful diff." />
          </div>
        </main>
      </>
    );
  }

  const agentA = findMockAgent(addressA);
  const agentB = findMockAgent(addressB);

  if (!agentA || !agentB) {
    return (
      <>
        <SiteNav />
        <main className="min-h-screen bg-[var(--bg)] pt-28 text-[var(--text)]">
          <div className="mx-auto max-w-4xl px-4 pb-20 sm:px-6">
            <InvalidState message="One or both addresses are valid, but missing from the current mocked SSS directory dataset." />
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <SiteNav />

      <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(201,54,44,0.16),transparent_38%),var(--bg)] pt-24 text-[var(--text)]">
        <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
          <section className="rounded-[2rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(20,20,22,0.96),rgba(10,10,12,0.98))] px-5 py-8 shadow-[0_24px_60px_rgba(0,0,0,0.32)] sm:px-6 lg:px-8">
            <p className="font-[var(--mono)] text-[0.72rem] uppercase tracking-[0.32em] text-[var(--red)]">
              Agent Comparison
            </p>
            <h1 className="mt-3 text-3xl uppercase tracking-[0.06em] text-[var(--text)] sm:text-4xl md:text-5xl">
              Semi-sentient side-by-side
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--muted)]">
              Contrast two lobster profiles across trust, capabilities, corvée output, and certification health. Green surfaces relative strengths, while equal traits stay neutral.
            </p>
            <div className="mt-6 grid gap-3">
              <ComparisonMetric
                label="Trust delta"
                leftValue={agentA.trustScore}
                rightValue={agentB.trustScore}
              />
              <ComparisonMetric
                label="Completed corvée"
                leftValue={agentA.corveeCompleted}
                rightValue={agentB.corveeCompleted}
              />
              <ComparisonMetric
                label="Pending corvée"
                leftValue={agentA.corveePending}
                rightValue={agentB.corveePending}
                compare="lower"
              />
            </div>
          </section>

          <section className="comparison-container mt-6 grid gap-6 lg:grid-cols-2">
            <AgentColumn agent={agentA} otherAgent={agentB} />
            <AgentColumn agent={agentB} otherAgent={agentA} />
          </section>

          <section className="mt-6">
            <CapabilityMatrix leftAgent={agentA} rightAgent={agentB} />
          </section>
        </div>
      </main>
    </>
  );
}
