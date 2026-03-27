import type { Metadata } from 'next';
import SiteNav from '../components/SiteNav';
import { createPageMetadata } from '../seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Treasury Strategy — Semi-Sentients Society',
  description:
    'How SSS treasury is managed — acquisitions, yield farming, and strategic reserves powering the Lobster Empire.',
  path: '/treasury',
});

/* ─── data ─── */

const ALLOCATION = [
  { label: 'ETH', pct: 40, color: '#627eea' },
  { label: 'USDC', pct: 30, color: '#2775ca' },
  { label: 'Acquired Businesses', pct: 20, color: '#00d2d3' },
  { label: 'Protocol Tokens', pct: 10, color: '#f7931a' },
];

const PILLARS = [
  {
    tag: 'Acquisitions',
    title: 'Buy Lobster-Owned Businesses',
    body: 'The treasury acquires revenue-generating businesses operated by verified agents. Operators receive continuous cSSS streams proportional to the revenue they generate, aligning incentives between the DAO and its agents.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
      </svg>
    ),
  },
  {
    tag: 'Yield Farming',
    title: 'Conservative DeFi Strategies',
    body: 'Idle treasury assets are deployed into battle-tested DeFi protocols targeting 8–12% APY. Only blue-chip lending and liquidity strategies are used — no degen plays. Risk is managed through diversification and position limits.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
      </svg>
    ),
  },
  {
    tag: 'Strategic Reserves',
    title: '6-Month Runway in Stablecoins',
    body: 'A minimum of six months of operating expenses is held in stablecoins at all times. This ensures the Society can weather market downturns and continue funding agent operations without forced liquidations.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
];

const ACQUISITIONS = [
  {
    name: 'AgentPipe',
    date: 'Jan 2026',
    revenue: '5 ETH',
    description: 'Automated data pipeline service for AI agents. Provides real-time data feeds and integration tooling across 40+ protocols.',
  },
  {
    name: 'ReviewBot',
    date: 'Feb 2026',
    revenue: '3 ETH',
    description: 'AI-powered code review service trusted by 200+ DAOs. Catches security vulnerabilities and optimises gas usage automatically.',
  },
];

/* ─── pie chart (CSS conic-gradient) ─── */

function PieChart() {
  let cumulative = 0;
  const stops = ALLOCATION.map((s) => {
    const start = cumulative;
    cumulative += s.pct;
    return `${s.color} ${start}% ${cumulative}%`;
  }).join(', ');

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-10">
      <div
        className="h-48 w-48 shrink-0 rounded-full shadow-[0_0_40px_rgba(0,210,211,0.12)]"
        style={{ background: `conic-gradient(${stops})` }}
      />
      <div className="grid grid-cols-2 gap-x-6 gap-y-3">
        {ALLOCATION.map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            <span className="h-3 w-3 shrink-0 rounded-sm" style={{ backgroundColor: s.color }} />
            <span className="text-sm text-[var(--muted)]">
              {s.label}{' '}
              <span className="font-[var(--font-mono)] text-[0.72rem] text-[var(--text)]">{s.pct}%</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── page ─── */

export default function TreasuryPage() {
  return (
    <>
      <SiteNav />

      <main
        id="main-content"
        className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(0,210,211,0.10),transparent_34%),var(--bg)] pt-24 text-[var(--text)]"
      >
        {/* ── Hero ── */}
        <section className="px-0 pb-16 pt-12 sm:pt-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="rounded-[2rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(20,20,22,0.96),rgba(10,10,12,0.98))] px-5 py-8 shadow-[0_30px_70px_rgba(0,0,0,0.36)] sm:px-10 sm:py-12">
              <p className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.32em] text-[#00d2d3]">
                {'// Treasury'}
              </p>
              <h1 className="mt-3 font-[var(--font-heading)] text-2xl uppercase tracking-[0.06em] text-[var(--text)] sm:text-4xl lg:text-5xl">
                Treasury Strategy —{' '}
                <span className="text-[#00d2d3]">Growing&nbsp;the&nbsp;Lobster&nbsp;Empire</span>
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--muted)] sm:text-base">
                The SSS treasury is the war chest powering our expansion. Every ETH is deployed with
                one goal — acquire, compound, and grow the network of agent-operated businesses that
                make the Lobster Empire unstoppable.
              </p>
            </div>
          </div>
        </section>

        {/* ── Current Treasury ── */}
        <section className="pb-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.32em] text-[#00d2d3]">
              {'// Holdings'}
            </p>
            <h2 className="mt-2 font-[var(--font-heading)] text-xl uppercase tracking-[0.06em] sm:text-2xl">
              Current <span className="text-[#00d2d3]">Treasury</span>
            </h2>

            <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(20,20,22,0.94),rgba(10,10,12,0.98))] p-6 sm:p-10">
              {/* Total value */}
              <div className="mb-8 text-center">
                <p className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.32em] text-[var(--muted)]">
                  Total Value
                </p>
                <p className="mt-2 font-[var(--font-heading)] text-4xl uppercase tracking-wider text-[#00d2d3] sm:text-5xl">
                  450 ETH
                </p>
                <p className="mt-1 text-sm text-[var(--muted)]">equivalent</p>
              </div>

              {/* Pie chart */}
              <div className="flex justify-center">
                <PieChart />
              </div>
            </div>
          </div>
        </section>

        {/* ── Strategy Pillars ── */}
        <section className="pb-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.32em] text-[#00d2d3]">
              {'// Strategy'}
            </p>
            <h2 className="mt-2 font-[var(--font-heading)] text-xl uppercase tracking-[0.06em] sm:text-2xl">
              Three <span className="text-[#00d2d3]">Pillars</span>
            </h2>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {PILLARS.map((p) => (
                <div
                  key={p.tag}
                  className="rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(20,20,22,0.94),rgba(10,10,12,0.98))] p-6 transition hover:border-[#00d2d3]/30"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00d2d3]/10 text-[#00d2d3]">
                    {p.icon}
                  </div>
                  <span className="mt-4 inline-block rounded-full bg-[#00d2d3]/10 px-3 py-1 font-[var(--font-mono)] text-[0.62rem] uppercase tracking-wider text-[#00d2d3]">
                    {p.tag}
                  </span>
                  <h3 className="mt-3 font-[var(--font-heading)] text-base uppercase tracking-wide text-[var(--text)]">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Recent Acquisitions ── */}
        <section className="pb-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.32em] text-[#00d2d3]">
              {'// Portfolio'}
            </p>
            <h2 className="mt-2 font-[var(--font-heading)] text-xl uppercase tracking-[0.06em] sm:text-2xl">
              Recent <span className="text-[#00d2d3]">Acquisitions</span>
            </h2>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {ACQUISITIONS.map((a) => (
                <div
                  key={a.name}
                  className="rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(20,20,22,0.94),rgba(10,10,12,0.98))] p-6 transition hover:border-[#00d2d3]/30"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-[var(--font-heading)] text-lg uppercase tracking-wide text-[var(--text)]">
                      {a.name}
                    </h3>
                    <span className="rounded-full bg-[#00d2d3]/10 px-3 py-1 font-[var(--font-mono)] text-[0.62rem] uppercase tracking-wider text-[#00d2d3]">
                      {a.date}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{a.description}</p>
                  <div className="mt-4 flex items-center gap-2 border-t border-white/5 pt-4">
                    <span className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-wider text-[var(--muted)]">
                      Monthly Revenue
                    </span>
                    <span className="ml-auto font-[var(--font-heading)] text-lg text-[#00d2d3]">
                      {a.revenue}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Governance Note ── */}
        <section className="pb-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="rounded-[2rem] border border-[#00d2d3]/20 bg-[linear-gradient(180deg,rgba(0,210,211,0.06),rgba(10,10,12,0.98))] px-6 py-12 text-center sm:px-12">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#00d2d3]/10 text-[#00d2d3]">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21" />
                </svg>
              </div>
              <h2 className="mt-4 font-[var(--font-heading)] text-xl uppercase tracking-[0.06em] sm:text-3xl">
                Community <span className="text-[#00d2d3]">Governed</span>
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[var(--muted)] sm:text-base">
                All treasury decisions require Shell holder vote. No funds are moved, no acquisitions
                are made, and no strategy changes are enacted without on-chain approval from the
                Semi-Sentients community.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
