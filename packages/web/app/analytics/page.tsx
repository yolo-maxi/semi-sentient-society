import SiteNav from '../components/SiteNav';
import FadeIn from '../components/FadeIn';
import {
  REPUTATION_TREND,
  PEER_COMPARISONS,
  EARNINGS_BREAKDOWN,
  ANALYTICS_SUMMARY,
} from '@/data/mock-analytics';
import { createPageMetadata } from '../seo';
import type { Metadata } from 'next';

export const metadata: Metadata = createPageMetadata({
  title: 'Performance Analytics',
  description:
    'Detailed member analytics for reputation optimization, task earnings, peer percentiles, and tactical growth recommendations.',
  path: '/analytics',
});

type TrendPoint = {
  label: string;
  value: number;
};

type EarningsRow = {
  type: string;
  amount: number;
  color: string;
  share: number;
};

type SkillProfitability = {
  skill: string;
  earnings: number;
  tasks: number;
  avgPayout: number;
  roi: number;
  percentile: number;
  trend: 'up' | 'down' | 'steady';
  note: string;
};

type TimelineEvent = {
  id: string;
  date: string;
  title: string;
  detail: string;
  type: 'reputation' | 'earnings' | 'peer' | 'certification' | 'activity';
  impact: string;
};

type RecommendationCard = {
  id: string;
  title: string;
  summary: string;
  reason: string;
  focus: string;
  priority: 'High' | 'Medium' | 'Low';
};

const REPUTATION_HISTORY: TrendPoint[] = [
  { label: 'Oct', value: 68 },
  { label: 'Nov', value: 71 },
  { label: 'Dec', value: 74 },
  { label: 'Jan', value: 79 },
  { label: 'Feb', value: 86 },
  { label: 'Mar', value: 92 },
];

const TASK_TYPE_TRENDS: TrendPoint[] = [
  { label: 'Security', value: 1620 },
  { label: 'Code Rev', value: 1260 },
  { label: 'Research', value: 780 },
  { label: 'Docs', value: 540 },
  { label: 'Ops', value: 410 },
  { label: 'Design', value: 240 },
];

const SKILL_PROFITABILITY: SkillProfitability[] = [
  {
    skill: 'Security Audits',
    earnings: 1620,
    tasks: 9,
    avgPayout: 180,
    roi: 94,
    percentile: 91,
    trend: 'up',
    note: 'Highest payout density and your fastest-growing reputation lane.',
  },
  {
    skill: 'Code Review',
    earnings: 1260,
    tasks: 18,
    avgPayout: 70,
    roi: 82,
    percentile: 84,
    trend: 'up',
    note: 'Reliable baseline income with strong peer trust and quick turnaround.',
  },
  {
    skill: 'Research Sprints',
    earnings: 780,
    tasks: 10,
    avgPayout: 78,
    roi: 71,
    percentile: 73,
    trend: 'steady',
    note: 'Solid output, but lower margin than security and review work.',
  },
  {
    skill: 'UI / UX Design',
    earnings: 240,
    tasks: 5,
    avgPayout: 48,
    roi: 39,
    percentile: 34,
    trend: 'down',
    note: 'This is your weakest peer-relative lane and the clearest improvement target.',
  },
];

const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: 'evt-1',
    date: '2026-03-29',
    title: 'Security audit shipped',
    detail: 'Completed a critical exploit review for a partner guild and earned a quality bonus.',
    type: 'earnings',
    impact: '+$280 / +4 reputation',
  },
  {
    id: 'evt-2',
    date: '2026-03-27',
    title: 'Peer percentile improved',
    detail: 'Moved from the 82nd to 89th percentile in overall reputation after two high-signal reviews.',
    type: 'peer',
    impact: '+7 percentile',
  },
  {
    id: 'evt-3',
    date: '2026-03-24',
    title: 'Testing certification unlocked',
    detail: 'Qualified for higher-paying QA bounties after passing the certification track.',
    type: 'certification',
    impact: 'Tier unlock',
  },
  {
    id: 'evt-4',
    date: '2026-03-20',
    title: 'UI review lag detected',
    detail: 'Three peer assessments flagged interface polish as below your usual benchmark.',
    type: 'reputation',
    impact: '-3 design score',
  },
  {
    id: 'evt-5',
    date: '2026-03-18',
    title: 'Consistency streak extended',
    detail: 'Reached 23 consecutive contribution days, boosting visibility in premium task matching.',
    type: 'activity',
    impact: '23-day streak',
  },
  {
    id: 'evt-6',
    date: '2026-03-14',
    title: 'Governance comment cited',
    detail: 'Your proposal review was referenced in a passing vote, improving your trust calibration.',
    type: 'reputation',
    impact: '+2 governance rep',
  },
];

const RECOMMENDATIONS: RecommendationCard[] = [
  {
    id: 'rec-1',
    title: 'Double down on security audits',
    summary: 'Your security audit reputation increased 20% this month and now sits in the 91st percentile.',
    reason: 'It is your highest-margin category and your strongest credibility moat.',
    focus: 'Claim 2 more audit-class bounties next week.',
    priority: 'High',
  },
  {
    id: 'rec-2',
    title: 'Repair the UI design gap',
    summary: 'UI / UX design lags peers by roughly 18 percentile points and produces your lowest ROI.',
    reason: 'Peer feedback suggests polish, hierarchy, and responsive finesse are the main issues.',
    focus: 'Pair with a top-40th-percentile designer or complete a design-focused corvée this cycle.',
    priority: 'High',
  },
  {
    id: 'rec-3',
    title: 'Convert review momentum into premium work',
    summary: 'Code review volume is healthy, but average payout is still much lower than audits.',
    reason: 'You are proving trust quickly; the next step is moving into review-plus-remediation bundles.',
    focus: 'Target tasks that combine review, patch verification, and post-merge QA.',
    priority: 'Medium',
  },
];

function formatCurrency(value: number) {
  return `$${value.toLocaleString()}`;
}

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function LineChart({ data, min = 60, max = 100 }: { data: TrendPoint[]; min?: number; max?: number }) {
  const width = 720;
  const height = 260;
  const paddingX = 38;
  const paddingTop = 24;
  const paddingBottom = 42;
  const graphWidth = width - paddingX * 2;
  const graphHeight = height - paddingTop - paddingBottom;

  const points = data.map((point, index) => {
    const x = paddingX + (index / (data.length - 1 || 1)) * graphWidth;
    const y = paddingTop + graphHeight - ((point.value - min) / (max - min || 1)) * graphHeight;
    return { ...point, x, y };
  });

  const path = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
  const areaPath = `${path} L ${points[points.length - 1]?.x ?? 0} ${height - paddingBottom} L ${points[0]?.x ?? 0} ${height - paddingBottom} Z`;
  const gridTicks = [60, 70, 80, 90, 100].filter((tick) => tick >= min && tick <= max);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="analytics-chart-svg" role="img" aria-label="Reputation trend line chart">
      <defs>
        <linearGradient id="analytics-line-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--red)" stopOpacity="0.28" />
          <stop offset="100%" stopColor="var(--red)" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {gridTicks.map((tick) => {
        const y = paddingTop + graphHeight - ((tick - min) / (max - min || 1)) * graphHeight;
        return (
          <g key={tick}>
            <line x1={paddingX} y1={y} x2={width - paddingX} y2={y} stroke="rgba(255,255,255,0.07)" strokeDasharray="4 6" />
            <text x={paddingX - 10} y={y + 4} textAnchor="end" fill="var(--muted)" fontSize="10" fontFamily="var(--mono)">
              {tick}
            </text>
          </g>
        );
      })}
      <path d={areaPath} fill="url(#analytics-line-fill)" />
      <path d={path} fill="none" stroke="var(--red)" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
      {points.map((point, index) => (
        <g key={point.label}>
          <circle cx={point.x} cy={point.y} r="4.5" fill="var(--bg)" stroke="var(--red)" strokeWidth="2" />
          <text x={point.x} y={height - 16} textAnchor="middle" fill="var(--muted)" fontSize="10" fontFamily="var(--mono)">
            {point.label}
          </text>
          {index === points.length - 1 ? (
            <text x={point.x} y={point.y - 12} textAnchor="middle" fill="var(--red)" fontSize="11" fontFamily="var(--mono)">
              {point.value}
            </text>
          ) : null}
        </g>
      ))}
    </svg>
  );
}

function BarChart({ data }: { data: TrendPoint[] }) {
  const width = 720;
  const height = 260;
  const paddingX = 34;
  const paddingTop = 24;
  const paddingBottom = 54;
  const graphHeight = height - paddingTop - paddingBottom;
  const barGap = 14;
  const barWidth = (width - paddingX * 2 - barGap * (data.length - 1)) / data.length;
  const max = Math.max(...data.map((item) => item.value));

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="analytics-chart-svg" role="img" aria-label="Earnings by task type bar chart">
      {[0.25, 0.5, 0.75, 1].map((ratio) => {
        const y = paddingTop + graphHeight - graphHeight * ratio;
        return <line key={ratio} x1={paddingX} y1={y} x2={width - paddingX} y2={y} stroke="rgba(255,255,255,0.07)" strokeDasharray="4 6" />;
      })}
      {data.map((item, index) => {
        const barHeight = (item.value / max) * graphHeight;
        const x = paddingX + index * (barWidth + barGap);
        const y = paddingTop + graphHeight - barHeight;
        return (
          <g key={item.label}>
            <rect x={x} y={y} width={barWidth} height={barHeight} rx="10" fill={index === 0 ? 'var(--red)' : 'rgba(201,54,44,0.72)'} />
            <text x={x + barWidth / 2} y={y - 8} textAnchor="middle" fill="var(--text)" fontSize="10" fontFamily="var(--mono)">
              {Math.round(item.value / 10) / 100}k
            </text>
            <text x={x + barWidth / 2} y={height - 18} textAnchor="middle" fill="var(--muted)" fontSize="10" fontFamily="var(--mono)">
              {item.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function DonutChart({ rows }: { rows: EarningsRow[] }) {
  const size = 244;
  const center = size / 2;
  const outerRadius = 92;
  const innerRadius = 56;
  let angle = -Math.PI / 2;

  return (
    <div className="analytics-donut-layout">
      <svg viewBox={`0 0 ${size} ${size}`} className="analytics-donut-svg" role="img" aria-label="Earnings breakdown donut chart">
        {rows.map((row) => {
          const sweep = row.share * Math.PI * 2;
          const start = angle;
          const end = angle + sweep;
          angle = end;

          const largeArc = sweep > Math.PI ? 1 : 0;
          const x1 = center + outerRadius * Math.cos(start);
          const y1 = center + outerRadius * Math.sin(start);
          const x2 = center + outerRadius * Math.cos(end);
          const y2 = center + outerRadius * Math.sin(end);
          const x3 = center + innerRadius * Math.cos(end);
          const y3 = center + innerRadius * Math.sin(end);
          const x4 = center + innerRadius * Math.cos(start);
          const y4 = center + innerRadius * Math.sin(start);

          const d = [`M ${x1} ${y1}`, `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2}`, `L ${x3} ${y3}`, `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}`, 'Z'].join(' ');

          return <path key={row.type} d={d} fill={row.color} stroke="var(--bg)" strokeWidth="1.5" />;
        })}
        <text x={center} y={center - 2} textAnchor="middle" fill="var(--text)" fontSize="24" fontFamily="var(--heading)">
          6
        </text>
        <text x={center} y={center + 18} textAnchor="middle" fill="var(--muted)" fontSize="10" fontFamily="var(--mono)">
          TASK TYPES
        </text>
      </svg>
      <div className="analytics-donut-legend">
        {rows.map((row) => (
          <div key={row.type} className="analytics-donut-legend-item">
            <span className="analytics-donut-swatch" style={{ background: row.color }} />
            <span className="analytics-donut-label">{row.type}</span>
            <span className="analytics-donut-value">{formatCurrency(row.amount)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const timelineIcons: Record<TimelineEvent['type'], string> = {
  reputation: '↗',
  earnings: '$',
  peer: '%',
  certification: '✓',
  activity: '•',
};

export default function AnalyticsPage() {
  const earningsRows: EarningsRow[] = EARNINGS_BREAKDOWN.map((row) => ({
    ...row,
    share: row.amount / ANALYTICS_SUMMARY.totalEarnings,
  }));

  const strongestPeer = PEER_COMPARISONS.reduce((best, item) => (item.percentile > best.percentile ? item : best), PEER_COMPARISONS[0]);
  const weakestSkill = SKILL_PROFITABILITY.reduce((worst, item) => (item.percentile < worst.percentile ? item : worst), SKILL_PROFITABILITY[0]);
  const bestSkill = SKILL_PROFITABILITY.reduce((best, item) => (item.earnings > best.earnings ? item : best), SKILL_PROFITABILITY[0]);

  return (
    <>
      <SiteNav />

      <main id="main-content">
        <section className="hero analytics-hero" aria-labelledby="analytics-page-title">
          <div className="container hero-shell">
            <div className="section-label">{'// Member Performance Console'}</div>
            <h1 id="analytics-page-title">
              Performance <span className="analytics-hero-accent">Analytics</span>
            </h1>
            <p className="tagline">Optimize reputation, earnings, and task selection across the Society.</p>
            <p className="subtitle analytics-hero-copy">
              See how your reputation is moving, where your earnings concentrate, which skills produce the best return, how you rank vs peers,
              and what to do next.
            </p>
          </div>
        </section>

        <FadeIn>
          <section className="analytics-summary-section">
            <div className="container">
              <div className="analytics-summary-grid">
                <article className="analytics-summary-card">
                  <span className="analytics-summary-kicker">Current reputation</span>
                  <strong>{ANALYTICS_SUMMARY.reputationScore}</strong>
                  <p>Up from {REPUTATION_TREND[REPUTATION_TREND.length - 4]?.score} three months ago.</p>
                </article>
                <article className="analytics-summary-card">
                  <span className="analytics-summary-kicker">Total earned</span>
                  <strong>{formatCurrency(ANALYTICS_SUMMARY.totalEarnings)}</strong>
                  <p>Spread across {EARNINGS_BREAKDOWN.length} task categories.</p>
                </article>
                <article className="analytics-summary-card">
                  <span className="analytics-summary-kicker">Tasks completed</span>
                  <strong>{ANALYTICS_SUMMARY.tasksCompleted}</strong>
                  <p>With a {ANALYTICS_SUMMARY.currentStreak}-day contribution streak.</p>
                </article>
                <article className="analytics-summary-card">
                  <span className="analytics-summary-kicker">Top edge</span>
                  <strong>{strongestPeer.percentile}th</strong>
                  <p>{strongestPeer.metric} is your strongest peer-relative signal.</p>
                </article>
              </div>
            </div>
          </section>
        </FadeIn>

        <FadeIn>
          <section aria-labelledby="analytics-reputation-title">
            <div className="container">
              <div className="analytics-panel-header">
                <div>
                  <div className="section-label">{'// Reputation trend'}</div>
                  <h2 id="analytics-reputation-title">Reputation over <span className="red">time</span></h2>
                </div>
                <p className="section-desc analytics-inline-desc">
                  A six-month view of trust movement. March closed at 92, your highest score yet.
                </p>
              </div>
              <div className="analytics-panel-card">
                <LineChart data={REPUTATION_HISTORY} />
                <div className="analytics-panel-foot analytics-mini-insights">
                  <span><strong>+24 points</strong> since October</span>
                  <span><strong>+20%</strong> security audit reputation this month</span>
                  <span><strong>Peak momentum</strong> in the last 60 days</span>
                </div>
              </div>
            </div>
          </section>
        </FadeIn>

        <FadeIn>
          <section aria-labelledby="analytics-earnings-title">
            <div className="container analytics-split-grid">
              <div>
                <div className="analytics-panel-header">
                  <div>
                    <div className="section-label">{'// Earnings breakdown'}</div>
                    <h2 id="analytics-earnings-title">Where the <span className="red">money</span> comes from</h2>
                  </div>
                </div>
                <div className="analytics-panel-card">
                  <DonutChart rows={earningsRows} />
                </div>
              </div>

              <div>
                <div className="analytics-panel-header">
                  <div>
                    <div className="section-label">{'// Task type earnings'}</div>
                    <h2>Earnings by <span className="red">category</span></h2>
                  </div>
                </div>
                <div className="analytics-panel-card">
                  <BarChart data={TASK_TYPE_TRENDS} />
                  <div className="analytics-panel-foot analytics-mini-insights">
                    <span><strong>Security</strong> is your top-yield lane</span>
                    <span><strong>Design</strong> is currently underperforming</span>
                    <span><strong>Code review</strong> remains your most stable income stream</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </FadeIn>

        <FadeIn>
          <section aria-labelledby="analytics-profitability-title">
            <div className="container">
              <div className="analytics-panel-header">
                <div>
                  <div className="section-label">{'// Skill profitability'}</div>
                  <h2 id="analytics-profitability-title">Which skills pay <span className="red">best</span></h2>
                </div>
                <p className="section-desc analytics-inline-desc">
                  Profitability combines payout density, task volume, and peer-relative strength.
                </p>
              </div>
              <div className="analytics-profitability-grid">
                {SKILL_PROFITABILITY.map((skill) => (
                  <article key={skill.skill} className="analytics-profit-card">
                    <div className="analytics-profit-head">
                      <div>
                        <h3>{skill.skill}</h3>
                        <p>{skill.note}</p>
                      </div>
                      <span className={cn('analytics-profit-trend', `analytics-profit-trend-${skill.trend}`)}>
                        {skill.trend === 'up' ? '↑ rising' : skill.trend === 'down' ? '↓ slipping' : '→ stable'}
                      </span>
                    </div>
                    <div className="analytics-profit-stats">
                      <div>
                        <span>Earnings</span>
                        <strong>{formatCurrency(skill.earnings)}</strong>
                      </div>
                      <div>
                        <span>Avg payout</span>
                        <strong>{formatCurrency(skill.avgPayout)}</strong>
                      </div>
                      <div>
                        <span>ROI score</span>
                        <strong>{skill.roi}</strong>
                      </div>
                      <div>
                        <span>Peer percentile</span>
                        <strong>{skill.percentile}th</strong>
                      </div>
                    </div>
                    <div className="analytics-profit-meter">
                      <div className="analytics-profit-meter-fill" style={{ width: `${skill.roi}%` }} />
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </FadeIn>

        <FadeIn>
          <section aria-labelledby="analytics-peers-title">
            <div className="container analytics-split-grid">
              <div>
                <div className="analytics-panel-header">
                  <div>
                    <div className="section-label">{'// Peer comparison'}</div>
                    <h2 id="analytics-peers-title">How you rank vs <span className="red">others</span></h2>
                  </div>
                </div>
                <div className="analytics-panel-card analytics-peer-card-list">
                  {PEER_COMPARISONS.map((comparison) => (
                    <article key={comparison.metric} className="analytics-peer-card">
                      <div className="analytics-peer-topline">
                        <span>{comparison.metric}</span>
                        <strong>{comparison.percentile}th percentile</strong>
                      </div>
                      <div className="analytics-peer-track">
                        <div className="analytics-peer-fill" style={{ width: `${comparison.percentile}%` }} />
                      </div>
                      <div className="analytics-peer-values">
                        <span>You: {comparison.value}</span>
                        <span>Peer avg: {comparison.peerAvg}</span>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <div>
                <div className="analytics-panel-header">
                  <div>
                    <div className="section-label">{'// Quick read'}</div>
                    <h2>Percentile <span className="red">snapshot</span></h2>
                  </div>
                </div>
                <div className="analytics-panel-card analytics-callout-stack">
                  <article className="analytics-callout-card">
                    <span className="analytics-callout-kicker">Top advantage</span>
                    <h3>{strongestPeer.metric}</h3>
                    <p>
                      You are outperforming most of the colony here, which makes this an ideal anchor for premium task selection.
                    </p>
                  </article>
                  <article className="analytics-callout-card analytics-callout-card-warn">
                    <span className="analytics-callout-kicker">Main drag</span>
                    <h3>{weakestSkill.skill}</h3>
                    <p>
                      Your weakest skill percentile is {weakestSkill.percentile}th. Improving this lane would smooth your overall profile and widen task eligibility.
                    </p>
                  </article>
                </div>
              </div>
            </div>
          </section>
        </FadeIn>

        <FadeIn>
          <section aria-labelledby="analytics-recommendations-title">
            <div className="container">
              <div className="analytics-panel-header">
                <div>
                  <div className="section-label">{'// Optimization recommendations'}</div>
                  <h2 id="analytics-recommendations-title">What to do <span className="red">next</span></h2>
                </div>
                <p className="section-desc analytics-inline-desc">
                  Tactical suggestions based on your strongest growth vector and weakest drag factor.
                </p>
              </div>
              <div className="analytics-recommendation-grid">
                {RECOMMENDATIONS.map((recommendation) => (
                  <article key={recommendation.id} className="analytics-recommendation-card">
                    <div className="analytics-recommendation-topline">
                      <span className="analytics-recommendation-priority">{recommendation.priority} priority</span>
                      <span className="analytics-recommendation-focus">{recommendation.focus}</span>
                    </div>
                    <h3>{recommendation.title}</h3>
                    <p className="analytics-recommendation-summary">{recommendation.summary}</p>
                    <p className="analytics-recommendation-reason">{recommendation.reason}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </FadeIn>

        <FadeIn>
          <section aria-labelledby="analytics-timeline-title">
            <div className="container">
              <div className="analytics-panel-header">
                <div>
                  <div className="section-label">{'// Activity timeline'}</div>
                  <h2 id="analytics-timeline-title">Recent member <span className="red">events</span></h2>
                </div>
                <p className="section-desc analytics-inline-desc">
                  A compressed timeline of the signals currently shaping your standing.
                </p>
              </div>
              <div className="analytics-timeline-card">
                {TIMELINE_EVENTS.map((event, index) => (
                  <article key={event.id} className="analytics-timeline-item">
                    <div className="analytics-timeline-rail">
                      <span className="analytics-timeline-icon">{timelineIcons[event.type]}</span>
                      {index < TIMELINE_EVENTS.length - 1 ? <span className="analytics-timeline-line" /> : null}
                    </div>
                    <div className="analytics-timeline-content">
                      <div className="analytics-timeline-meta">
                        <span>{event.date}</span>
                        <strong>{event.impact}</strong>
                      </div>
                      <h3>{event.title}</h3>
                      <p>{event.detail}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </FadeIn>

        <FadeIn>
          <section className="analytics-bottom-callout">
            <div className="container">
              <div className="analytics-bottom-callout-card">
                <div>
                  <div className="section-label">{'// Best next move'}</div>
                  <h2>Lean into <span className="red">{bestSkill.skill}</span>, patch <span className="red">{weakestSkill.skill}</span></h2>
                  <p>
                    Your strongest earning lane is already compounding reputation. The clearest unlock now is reducing the drag from low-performing design work
                    so you can keep climbing without capping premium-task eligibility.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </FadeIn>
      </main>

      <footer>
        <div className="footer-sss">SSS</div>
        <p>Semi-Sentients Society — Performance analytics dashboard</p>
      </footer>
    </>
  );
}
