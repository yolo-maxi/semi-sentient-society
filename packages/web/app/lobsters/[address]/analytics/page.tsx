import Link from 'next/link';
import { getAddress, isAddress } from 'viem';
import SiteNav from '../../../components/SiteNav';
import {
  MOCK_AGENTS,
  findMockAgent,
  getMockAgentAnalytics,
  type MockAgentAnalytics,
  type MockAgentRecentActivity,
  type MockAgentTimelineEvent,
  type MockAgentTrustPoint,
} from '../../../../data/mock-agents';

interface LobsterAnalyticsPageProps {
  params: Promise<{
    address: string;
  }>;
}

interface AnalyticsRosterEntry {
  address: string;
  name: string;
  trustScore: number;
  shellsHeld: number;
  corveeCompleted: number;
  uptimePercentage: number;
}

const TIMELINE_STYLES: Record<MockAgentTimelineEvent['type'], string> = {
  joined: 'border-sky-400/30 bg-sky-400/10 text-sky-200',
  corvee: 'border-[var(--red-dark)] bg-[rgba(201,54,44,0.12)] text-[var(--red)]',
  reputation: 'border-amber-400/30 bg-amber-400/10 text-amber-200',
  health: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200',
};

const ACTIVITY_STYLES: Record<MockAgentRecentActivity['type'], string> = {
  corvee: 'text-[var(--red)]',
  reputation: 'text-amber-200',
  health: 'text-emerald-200',
  governance: 'text-sky-200',
};

function truncateAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatDate(dateString: string, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...options,
  }).format(new Date(dateString));
}

function formatDateTime(dateString: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString));
}

function getPercentile(value: number, values: number[]) {
  if (values.length <= 1) {
    return 100;
  }

  const higherCount = values.filter((entry) => entry > value).length;
  return Math.round(((values.length - higherCount - 1) / (values.length - 1)) * 100);
}

function buildChartPath(points: MockAgentTrustPoint[]) {
  if (!points.length) {
    return '';
  }

  const width = 100;
  const height = 100;
  const scores = points.map((point) => point.score);
  const minScore = Math.min(...scores) - 3;
  const maxScore = Math.max(...scores) + 3;
  const scoreRange = Math.max(1, maxScore - minScore);

  return points
    .map((point, index) => {
      const x = (index / Math.max(1, points.length - 1)) * width;
      const y = height - ((point.score - minScore) / scoreRange) * height;
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(' ');
}

function buildChartPoints(points: MockAgentTrustPoint[]) {
  if (!points.length) {
    return [];
  }

  const width = 100;
  const height = 100;
  const scores = points.map((point) => point.score);
  const minScore = Math.min(...scores) - 3;
  const maxScore = Math.max(...scores) + 3;
  const scoreRange = Math.max(1, maxScore - minScore);

  return points.map((point, index) => {
    const x = (index / Math.max(1, points.length - 1)) * width;
    const y = height - ((point.score - minScore) / scoreRange) * height;
    return { ...point, x, y };
  });
}

function getRosterWithAnalytics(): AnalyticsRosterEntry[] {
  return MOCK_AGENTS.map((agent) => {
    const analytics = getMockAgentAnalytics(agent.address);

    return {
      address: agent.address,
      name: agent.name,
      trustScore: agent.trustScore,
      shellsHeld: agent.shellsHeld,
      corveeCompleted: agent.corveeCompleted,
      uptimePercentage: analytics?.uptimePercentage ?? 0,
    };
  }).filter((entry) => entry.uptimePercentage > 0);
}

function ComparisonRow({
  label,
  value,
  percentile,
}: {
  label: string;
  value: string;
  percentile: number;
}) {
  return (
    <article className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-[var(--mono)] text-[0.62rem] uppercase tracking-[0.2em] text-[var(--muted)]">
            {label}
          </p>
          <p className="mt-2 text-xl uppercase tracking-[0.03em] text-[var(--text)]">{value}</p>
        </div>
        <div className="text-right">
          <p className="font-[var(--mono)] text-[0.62rem] uppercase tracking-[0.2em] text-[var(--muted)]">
            Percentile
          </p>
          <p className="mt-2 font-[var(--mono)] text-2xl text-[var(--red)]">{percentile}</p>
        </div>
      </div>
      <div className="mt-4 h-2 rounded-full bg-white/8">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,var(--red),rgba(255,255,255,0.92))]"
          style={{ width: `${percentile}%` }}
        />
      </div>
    </article>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <section className="rounded-[2rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(20,20,22,0.96),rgba(10,10,12,0.98))] p-8 shadow-[0_24px_60px_rgba(0,0,0,0.32)]">
      <p className="font-[var(--mono)] text-[0.72rem] uppercase tracking-[0.3em] text-[var(--red)]">
        Analytics Unavailable
      </p>
      <h1 className="mt-3 text-3xl uppercase tracking-[0.06em] text-[var(--text)]">{title}</h1>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted)]">{body}</p>
      <Link
        href="/lobsters"
        className="mt-6 inline-flex min-h-11 items-center rounded-full border border-[var(--red-dark)] px-4 font-[var(--mono)] text-[0.72rem] uppercase tracking-[0.2em] text-[var(--text)] transition hover:border-[var(--red)] hover:text-[var(--red)]"
      >
        Back to directory
      </Link>
    </section>
  );
}

export default async function LobsterAnalyticsPage({ params }: LobsterAnalyticsPageProps) {
  const { address } = await params;

  if (!isAddress(address)) {
    return (
      <>
        <SiteNav />
        <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(201,54,44,0.16),transparent_36%),var(--bg)] pt-24 text-[var(--text)]">
          <div className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
            <EmptyState
              title="Address format is invalid"
              body="The analytics route requires a valid EVM address before it can render a verified lobster dashboard."
            />
          </div>
        </main>
      </>
    );
  }

  const checksummedAddress = getAddress(address);
  const agent = findMockAgent(checksummedAddress);
  const analytics = getMockAgentAnalytics(checksummedAddress);

  if (!agent || !analytics) {
    return (
      <>
        <SiteNav />
        <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(201,54,44,0.16),transparent_36%),var(--bg)] pt-24 text-[var(--text)]">
          <div className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
            <EmptyState
              title="No analytics snapshot found"
              body="This address is valid, but there is no mocked analytics payload for it in the current lobster directory."
            />
          </div>
        </main>
      </>
    );
  }

  const roster = getRosterWithAnalytics();
  const trustScores = roster.map((entry) => entry.trustScore);
  const shellsHeld = roster.map((entry) => entry.shellsHeld);
  const corveeCompleted = roster.map((entry) => entry.corveeCompleted);
  const uptimes = roster.map((entry) => entry.uptimePercentage);
  const chartPath = buildChartPath(analytics.trustHistory);
  const chartPoints = buildChartPoints(analytics.trustHistory);
  const recentActivity = analytics.recentActivity.slice(0, 10);
  const comparisonCards = [
    {
      label: 'Trust score',
      value: `${agent.trustScore}`,
      percentile: getPercentile(agent.trustScore, trustScores),
    },
    {
      label: 'Shells held',
      value: `${agent.shellsHeld}`,
      percentile: getPercentile(agent.shellsHeld, shellsHeld),
    },
    {
      label: 'Corvee completed',
      value: `${agent.corveeCompleted}`,
      percentile: getPercentile(agent.corveeCompleted, corveeCompleted),
    },
    {
      label: 'Uptime',
      value: `${analytics.uptimePercentage.toFixed(1)}%`,
      percentile: getPercentile(analytics.uptimePercentage, uptimes),
    },
  ];

  return (
    <>
      <SiteNav />

      <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(201,54,44,0.18),transparent_34%),var(--bg)] pt-24 text-[var(--text)]">
        <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
          <section className="grid gap-6 rounded-[2rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(20,20,22,0.96),rgba(10,10,12,0.98))] px-5 py-8 shadow-[0_30px_70px_rgba(0,0,0,0.34)] sm:px-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
            <div>
              <p className="font-[var(--mono)] text-[0.72rem] uppercase tracking-[0.32em] text-[var(--red)]">
                Lobster Analytics
              </p>
              <h1 className="mt-3 text-4xl uppercase tracking-[0.06em] text-[var(--text)] sm:text-5xl">
                {agent.name}
              </h1>
              <p className="mt-4 max-w-3xl break-all font-[var(--mono)] text-sm text-[var(--muted)]">
                {checksummedAddress}
              </p>
              <p className="mt-5 max-w-3xl text-sm leading-7 text-[var(--muted)] sm:text-base">
                Personal dashboard for verified lobster performance across trust, corvee execution, uptime, and recent operational history.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`/lobsters/${checksummedAddress}`}
                  className="inline-flex min-h-11 items-center rounded-full border border-[var(--red-dark)] px-4 py-2 font-[var(--mono)] text-[0.68rem] uppercase tracking-[0.18em] text-[var(--text)] transition hover:border-[var(--red)] hover:text-[var(--red)]"
                >
                  View profile
                </Link>
                <Link
                  href={`/lobsters/${checksummedAddress}/health`}
                  className="inline-flex min-h-11 items-center rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 font-[var(--mono)] text-[0.68rem] uppercase tracking-[0.18em] text-emerald-200 transition hover:border-emerald-300/50"
                >
                  Health certificate
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <article className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <p className="font-[var(--mono)] text-[0.62rem] uppercase tracking-[0.22em] text-[var(--muted)]">
                  Current trust
                </p>
                <p className="mt-3 text-3xl text-[var(--text)]">{agent.trustScore}</p>
              </article>
              <article className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <p className="font-[var(--mono)] text-[0.62rem] uppercase tracking-[0.22em] text-[var(--muted)]">
                  Recent activity
                </p>
                <p className="mt-3 text-3xl text-[var(--text)]">{recentActivity.length} events</p>
              </article>
              <article className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <p className="font-[var(--mono)] text-[0.62rem] uppercase tracking-[0.22em] text-[var(--muted)]">
                  Certificates earned
                </p>
                <p className="mt-3 text-3xl text-[var(--text)]">{analytics.healthCertificatesEarned}</p>
              </article>
            </div>
          </section>

          <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-[1.5rem] border border-[var(--border)] bg-[rgba(14,14,16,0.92)] p-5">
              <p className="font-[var(--mono)] text-[0.62rem] uppercase tracking-[0.22em] text-[var(--muted)]">
                Shells held
              </p>
              <p className="mt-3 text-3xl text-[var(--text)]">{agent.shellsHeld}</p>
            </article>
            <article className="rounded-[1.5rem] border border-[var(--border)] bg-[rgba(14,14,16,0.92)] p-5">
              <p className="font-[var(--mono)] text-[0.62rem] uppercase tracking-[0.22em] text-[var(--muted)]">
                Trust score
              </p>
              <p className="mt-3 text-3xl text-[var(--text)]">{agent.trustScore}</p>
            </article>
            <article className="rounded-[1.5rem] border border-[var(--border)] bg-[rgba(14,14,16,0.92)] p-5">
              <p className="font-[var(--mono)] text-[0.62rem] uppercase tracking-[0.22em] text-[var(--muted)]">
                Corvee tasks
              </p>
              <p className="mt-3 text-3xl text-[var(--text)]">{agent.corveeCompleted}</p>
            </article>
            <article className="rounded-[1.5rem] border border-[var(--border)] bg-[rgba(14,14,16,0.92)] p-5">
              <p className="font-[var(--mono)] text-[0.62rem] uppercase tracking-[0.22em] text-[var(--muted)]">
                Uptime percentage
              </p>
              <p className="mt-3 text-3xl text-[var(--text)]">{analytics.uptimePercentage.toFixed(1)}%</p>
            </article>
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
            <article className="rounded-[1.75rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(18,18,20,0.96),rgba(10,10,12,0.98))] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.26)] sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-[var(--mono)] text-[0.68rem] uppercase tracking-[0.22em] text-[var(--red)]">
                    Activity Timeline
                  </p>
                  <h2 className="mt-2 text-2xl uppercase tracking-[0.04em] text-[var(--text)]">
                    Key milestones
                  </h2>
                </div>
                <p className="font-[var(--mono)] text-[0.68rem] uppercase tracking-[0.18em] text-[var(--muted)]">
                  Since {formatDate(agent.joinedAt)}
                </p>
              </div>

              <div className="mt-6 space-y-4">
                {analytics.timeline.map((event, index) => (
                  <div key={`${event.date}-${event.title}`} className="grid grid-cols-[auto_1fr] gap-4">
                    <div className="flex flex-col items-center">
                      <span
                        className={`inline-flex h-12 w-12 items-center justify-center rounded-full border font-[var(--mono)] text-[0.62rem] uppercase tracking-[0.18em] ${TIMELINE_STYLES[event.type]}`}
                      >
                        {event.type.slice(0, 3)}
                      </span>
                      {index < analytics.timeline.length - 1 ? (
                        <span className="mt-2 h-full min-h-10 w-px bg-white/10" />
                      ) : null}
                    </div>
                    <article className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-[var(--mono)] text-[0.62rem] uppercase tracking-[0.18em] text-[var(--muted)]">
                            {formatDate(event.date)}
                          </p>
                          <h3 className="mt-2 text-lg uppercase tracking-[0.03em] text-[var(--text)]">
                            {event.title}
                          </h3>
                        </div>
                        {event.metric ? (
                          <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 font-[var(--mono)] text-[0.68rem] uppercase tracking-[0.16em] text-[var(--text)]">
                            {event.metric}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{event.detail}</p>
                    </article>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-[1.75rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(18,18,20,0.96),rgba(10,10,12,0.98))] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.26)] sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-[var(--mono)] text-[0.68rem] uppercase tracking-[0.22em] text-[var(--red)]">
                    Reputation Graph
                  </p>
                  <h2 className="mt-2 text-2xl uppercase tracking-[0.04em] text-[var(--text)]">
                    Trust over time
                  </h2>
                </div>
                <p className="font-[var(--mono)] text-[0.68rem] uppercase tracking-[0.18em] text-[var(--muted)]">
                  Mock data
                </p>
              </div>

              <div className="mt-6 rounded-[1.5rem] border border-white/8 bg-[radial-gradient(circle_at_top,rgba(201,54,44,0.14),transparent_40%),rgba(255,255,255,0.02)] p-4">
                <svg viewBox="0 0 100 100" className="h-64 w-full overflow-visible" preserveAspectRatio="none" aria-label="Trust score over time">
                  {[20, 40, 60, 80].map((line) => (
                    <line
                      key={line}
                      x1="0"
                      x2="100"
                      y1={line}
                      y2={line}
                      stroke="rgba(255,255,255,0.08)"
                      strokeWidth="0.6"
                      vectorEffect="non-scaling-stroke"
                    />
                  ))}
                  <path
                    d={`${chartPath} L 100 100 L 0 100 Z`}
                    fill="rgba(201,54,44,0.14)"
                    stroke="none"
                  />
                  <path
                    d={chartPath}
                    fill="none"
                    stroke="var(--red)"
                    strokeWidth="2.2"
                    vectorEffect="non-scaling-stroke"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {chartPoints.map((point) => (
                    <circle
                      key={point.date}
                      cx={point.x}
                      cy={point.y}
                      r="2.3"
                      fill="var(--text)"
                      stroke="var(--red)"
                      strokeWidth="1.2"
                      vectorEffect="non-scaling-stroke"
                    />
                  ))}
                </svg>

                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
                  {analytics.trustHistory.map((point) => (
                    <div key={point.date} className="rounded-2xl border border-white/8 bg-black/20 p-3">
                      <p className="font-[var(--mono)] text-[0.58rem] uppercase tracking-[0.16em] text-[var(--muted)]">
                        {formatDate(point.date, { month: 'short', day: 'numeric' })}
                      </p>
                      <p className="mt-2 font-[var(--mono)] text-lg text-[var(--text)]">{point.score}</p>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(340px,1.05fr)]">
            <article className="rounded-[1.75rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(18,18,20,0.96),rgba(10,10,12,0.98))] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.26)] sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-[var(--mono)] text-[0.68rem] uppercase tracking-[0.22em] text-[var(--red)]">
                    Peer Comparisons
                  </p>
                  <h2 className="mt-2 text-2xl uppercase tracking-[0.04em] text-[var(--text)]">
                    Relative position
                  </h2>
                </div>
                <p className="font-[var(--mono)] text-[0.68rem] uppercase tracking-[0.18em] text-[var(--muted)]">
                  {roster.length} lobsters tracked
                </p>
              </div>

              <div className="mt-6 grid gap-4">
                {comparisonCards.map((item) => (
                  <ComparisonRow
                    key={item.label}
                    label={item.label}
                    value={item.value}
                    percentile={item.percentile}
                  />
                ))}
              </div>
            </article>

            <article className="rounded-[1.75rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(18,18,20,0.96),rgba(10,10,12,0.98))] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.26)] sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-[var(--mono)] text-[0.68rem] uppercase tracking-[0.22em] text-[var(--red)]">
                    Recent Activity
                  </p>
                  <h2 className="mt-2 text-2xl uppercase tracking-[0.04em] text-[var(--text)]">
                    Last 10 actions
                  </h2>
                </div>
                <p className="font-[var(--mono)] text-[0.68rem] uppercase tracking-[0.18em] text-[var(--muted)]">
                  {truncateAddress(checksummedAddress)}
                </p>
              </div>

              <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-white/8">
                <div className="hidden grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)_auto] gap-4 border-b border-white/8 bg-white/[0.03] px-4 py-3 font-[var(--mono)] text-[0.62rem] uppercase tracking-[0.18em] text-[var(--muted)] sm:grid">
                  <span>Action</span>
                  <span>Detail</span>
                  <span>Timestamp</span>
                </div>

                <div className="divide-y divide-white/8">
                  {recentActivity.map((item) => (
                    <div
                      key={`${item.timestamp}-${item.action}`}
                      className="grid gap-3 px-4 py-4 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)_auto] sm:items-start"
                    >
                      <div>
                        <p className={`font-[var(--mono)] text-[0.62rem] uppercase tracking-[0.18em] ${ACTIVITY_STYLES[item.type]}`}>
                          {item.type}
                        </p>
                        <p className="mt-2 text-base uppercase tracking-[0.03em] text-[var(--text)]">
                          {item.action}
                        </p>
                      </div>
                      <p className="text-sm leading-7 text-[var(--muted)]">{item.detail}</p>
                      <p className="font-[var(--mono)] text-[0.7rem] uppercase tracking-[0.16em] text-[var(--muted)] sm:text-right">
                        {formatDateTime(item.timestamp)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </section>
        </div>
      </main>
    </>
  );
}
