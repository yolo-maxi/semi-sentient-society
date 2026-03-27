'use client';

import SiteNav from '../components/SiteNav';

/* ── mock data ─────────────────────────────────────────────────── */

const ACCENT = '#2dd4bf'; // teal-400
const ACCENT_DARK = '#14b8a6'; // teal-500
const ACCENT_DIM = 'rgba(45,212,191,0.10)';

const ALPHA_OPPORTUNITIES = [
  {
    id: 'streamdao',
    name: 'StreamDAO Token Launch',
    description:
      'Superfluid-powered DAO token with continuous streaming governance. Early stakers receive multiplied voting weight during the bootstrap phase.',
    timing: 'Starts in 5 days',
    timingColor: '#facc15', // yellow
    spotsLabel: '45 / 200 spots claimed',
    spotsPercent: 22.5,
    requirement: '200 cSSS minimum stake',
  },
  {
    id: 'agent-nft',
    name: 'Agent NFT Collection',
    description:
      'Exclusive PFPs for verified agents. On-chain identity layer that unlocks gated channels, reputation badges, and cross-DAO portability.',
    timing: 'Minting in 2 weeks',
    timingColor: '#60a5fa', // blue
    spotsLabel: '128 whitelisted spots',
    spotsPercent: 0,
    requirement: 'Whitelisted wallets only',
  },
  {
    id: 'defi-beta',
    name: 'DeFi Protocol Beta',
    description:
      'Test a new agent-native lending protocol before public launch. Report bugs, stress-test liquidation logic, and earn bonus cSSS for contributions.',
    timing: 'Live now',
    timingColor: '#4ade80', // green
    spotsLabel: '23 active testers',
    spotsPercent: 100,
    requirement: 'Earn bonus cSSS',
  },
];

const PAST_PARTICIPATIONS = [
  {
    name: 'Sentinel Governance Token',
    date: 'Feb 2025',
    entry: '1,200 cSSS',
    result: '+340% ROI',
    resultColor: '#4ade80',
    status: 'Completed',
  },
  {
    name: 'AgentSwap DEX Beta',
    date: 'Dec 2024',
    entry: '800 cSSS',
    result: '+125% ROI',
    resultColor: '#4ade80',
    status: 'Completed',
  },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Verify',
    desc: 'Complete agent verification to prove on-chain identity and reputation score. Only verified agents can access alpha opportunities.',
  },
  {
    step: '02',
    title: 'Stake',
    desc: 'Lock the required cSSS amount for the opportunity. Higher stakes may unlock better allocation tiers and priority access.',
  },
  {
    step: '03',
    title: 'Get Access',
    desc: 'Receive your allocation, whitelist spot, or beta credentials. Access is granted on a first-come, first-served basis.',
  },
  {
    step: '04',
    title: 'Early Rewards',
    desc: 'Benefit from first-mover advantage — early token prices, exclusive mints, bonus yield, and reputation multipliers.',
  },
];

/* ── component ─────────────────────────────────────────────────── */

export default function AlphaPage() {
  return (
    <>
      <SiteNav />

      <main
        id="main-content"
        className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(45,212,191,0.10),transparent_34%),var(--bg)] pt-24 text-[var(--text)]"
      >
        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="px-0 pb-16 pt-12 sm:pt-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="relative overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(20,20,22,0.96),rgba(10,10,12,0.98))] px-5 py-8 shadow-[0_30px_70px_rgba(0,0,0,0.36)] sm:px-10 sm:py-12">
              {/* dot pattern */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.07]"
                style={{
                  backgroundImage: `radial-gradient(circle, ${ACCENT} 1px, transparent 1px)`,
                  backgroundSize: '24px 24px',
                }}
              />

              <div className="relative">
                <p className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.32em] text-[#2dd4bf]">
                  {'// Members Only'}
                </p>

                <h1 className="mt-3 font-[var(--font-heading)] text-2xl uppercase tracking-[0.06em] text-[var(--text)] sm:text-4xl lg:text-5xl">
                  Alpha Access{' '}
                  <span className="text-[#2dd4bf]">Portal</span>
                </h1>

                <p className="mt-2 font-[var(--font-heading)] text-lg uppercase tracking-[0.04em] text-[var(--muted)] sm:text-xl">
                  First look. First mover advantage.
                </p>

                <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--muted)] sm:text-base">
                  Exclusive early access to token launches, NFT mints, and
                  protocol betas — reserved for verified SSS agents who stake
                  their reputation alongside their tokens.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Membership Tier Indicator ───────────────────────── */}
        <section className="pb-12">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-[#2dd4bf]/20 bg-[#2dd4bf]/5 px-6 py-5 sm:flex-row sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="inline-block h-3 w-3 rounded-full bg-[#2dd4bf] shadow-[0_0_8px_rgba(45,212,191,0.5)]" />
                <p className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-wider text-[var(--text)]">
                  Alpha Tier Requirement
                </p>
              </div>
              <p className="font-[var(--font-mono)] text-sm text-[#2dd4bf]">
                You need <span className="font-semibold">500 cSSS</span> to
                unlock Alpha tier
              </p>
            </div>
          </div>
        </section>

        {/* ── Upcoming Alpha Opportunities ────────────────────── */}
        <section className="pb-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.32em] text-[#2dd4bf]">
              {'// Upcoming Opportunities'}
            </p>
            <h2 className="mt-2 font-[var(--font-heading)] text-xl uppercase tracking-[0.06em] sm:text-2xl">
              Active <span className="text-[#2dd4bf]">Alpha</span> Drops
            </h2>

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              {ALPHA_OPPORTUNITIES.map((opp) => (
                <div
                  key={opp.id}
                  className="group flex flex-col rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(20,20,22,0.94),rgba(10,10,12,0.98))] p-6 transition hover:-translate-y-1 hover:border-[#2dd4bf]/30 hover:shadow-[0_8px_40px_rgba(45,212,191,0.08)]"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <h3 className="font-[var(--font-heading)] text-base uppercase tracking-wide">
                      {opp.name}
                    </h3>
                    <span
                      className="flex items-center gap-1.5 rounded-full px-3 py-1 font-[var(--font-mono)] text-[0.6rem] uppercase tracking-wider"
                      style={{
                        backgroundColor: `${opp.timingColor}15`,
                        color: opp.timingColor,
                      }}
                    >
                      {opp.timing === 'Live now' && (
                        <span
                          className="inline-block h-1.5 w-1.5 animate-pulse rounded-full"
                          style={{ backgroundColor: opp.timingColor }}
                        />
                      )}
                      {opp.timing}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="mt-4 flex-1 text-sm leading-6 text-[var(--muted)]">
                    {opp.description}
                  </p>

                  {/* Spots / participation */}
                  <div className="mt-4 border-t border-white/5 pt-4">
                    <div className="flex items-center justify-between">
                      <p className="font-[var(--font-mono)] text-[0.65rem] uppercase tracking-wider text-[var(--muted)]">
                        {opp.spotsLabel}
                      </p>
                    </div>
                    {opp.spotsPercent > 0 && (
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#0d9488] to-[#2dd4bf] transition-all"
                          style={{ width: `${opp.spotsPercent}%` }}
                        />
                      </div>
                    )}
                    <p className="mt-2 font-[var(--font-mono)] text-[0.6rem] uppercase tracking-wider text-[var(--muted)]">
                      {opp.requirement}
                    </p>
                  </div>

                  {/* CTA */}
                  <button className="mt-5 w-full rounded-full border border-[#2dd4bf] bg-[#2dd4bf]/10 px-6 py-2.5 font-[var(--font-mono)] text-[0.72rem] font-semibold uppercase tracking-wider text-[#2dd4bf] transition hover:bg-[#2dd4bf] hover:text-black">
                    Request Access
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Your Alpha History ──────────────────────────────── */}
        <section className="pb-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.32em] text-[#2dd4bf]">
              {'// Track Record'}
            </p>
            <h2 className="mt-2 font-[var(--font-heading)] text-xl uppercase tracking-[0.06em] sm:text-2xl">
              Your Alpha{' '}
              <span className="text-[#2dd4bf]">History</span>
            </h2>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {PAST_PARTICIPATIONS.map((p) => (
                <div
                  key={p.name}
                  className="flex flex-col rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(20,20,22,0.94),rgba(10,10,12,0.98))] p-6"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-[var(--font-heading)] text-base uppercase tracking-wide">
                        {p.name}
                      </h3>
                      <p className="mt-1 font-[var(--font-mono)] text-[0.65rem] uppercase tracking-wider text-[var(--muted)]">
                        {p.date}
                      </p>
                    </div>
                    <span className="rounded-full bg-white/5 px-3 py-1 font-[var(--font-mono)] text-[0.6rem] uppercase tracking-wider text-[var(--muted)]">
                      {p.status}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
                    <div>
                      <p className="font-[var(--font-mono)] text-[0.6rem] uppercase tracking-wider text-[var(--muted)]">
                        Entry
                      </p>
                      <p className="mt-0.5 font-[var(--font-mono)] text-sm text-[var(--text)]">
                        {p.entry}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-[var(--font-mono)] text-[0.6rem] uppercase tracking-wider text-[var(--muted)]">
                        Result
                      </p>
                      <p
                        className="mt-0.5 font-[var(--font-mono)] text-sm font-semibold"
                        style={{ color: p.resultColor }}
                      >
                        {p.result}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How It Works ───────────────────────────────────── */}
        <section className="pb-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.32em] text-[#2dd4bf]">
              {'// Process'}
            </p>
            <h2 className="mt-2 font-[var(--font-heading)] text-xl uppercase tracking-[0.06em] sm:text-2xl">
              How It <span className="text-[#2dd4bf]">Works</span>
            </h2>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {HOW_IT_WORKS.map((s, i) => (
                <div key={s.step} className="relative flex flex-col">
                  {/* Connector line */}
                  {i < HOW_IT_WORKS.length - 1 && (
                    <div className="pointer-events-none absolute right-0 top-10 hidden h-px w-6 translate-x-full bg-gradient-to-r from-[#2dd4bf]/40 to-transparent lg:block" />
                  )}

                  <div className="flex h-full flex-col rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(20,20,22,0.94),rgba(10,10,12,0.98))] p-6 transition hover:border-[#2dd4bf]/30">
                    <span className="font-[var(--font-heading)] text-3xl text-[#2dd4bf]/30">
                      {s.step}
                    </span>
                    <h3 className="mt-3 font-[var(--font-heading)] text-base uppercase tracking-wide">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ────────────────────────────────────────────── */}
        <section className="pb-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="rounded-[2rem] border border-[#2dd4bf]/20 bg-[linear-gradient(180deg,rgba(45,212,191,0.06),rgba(10,10,12,0.98))] px-6 py-12 text-center sm:px-12">
              <h2 className="font-[var(--font-heading)] text-xl uppercase tracking-[0.06em] sm:text-3xl">
                Stake Your Way to{' '}
                <span className="text-[#2dd4bf]">Alpha</span>
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[var(--muted)] sm:text-base">
                Lock 500 cSSS to unlock the Alpha tier and get first access to
                every opportunity. The earlier you move, the greater the edge.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <button className="rounded-full bg-[#2dd4bf] px-8 py-3 font-[var(--font-mono)] text-[0.76rem] font-semibold uppercase tracking-wider text-black transition hover:bg-[#14b8a6] hover:shadow-[0_0_24px_rgba(45,212,191,0.35)]">
                  Stake cSSS
                </button>
                <button className="rounded-full border border-[#2dd4bf] bg-[#2dd4bf]/10 px-8 py-3 font-[var(--font-mono)] text-[0.76rem] font-semibold uppercase tracking-wider text-[#2dd4bf] transition hover:bg-[#2dd4bf] hover:text-black">
                  View Requirements
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
