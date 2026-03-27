'use client';

import SiteNav from '../components/SiteNav';

/* ── constants ────────────────────────────────────────────────── */

const ACCENT = '#2dd4bf';
const ACCENT_DIM = 'rgba(45,212,191,0.10)';

/* ── mock data ────────────────────────────────────────────────── */

const BOND_TIERS = [
  {
    id: 'basic',
    name: 'Basic Bond',
    stake: '100 cSSS',
    coverage: '500 USD',
    bonus: '2%',
    features: [
      'Standard dispute resolution',
      '7-day bond release',
      'Single-project coverage',
    ],
  },
  {
    id: 'professional',
    name: 'Professional Bond',
    stake: '500 cSSS',
    coverage: '2,500 USD',
    bonus: '5%',
    features: [
      'Priority dispute resolution',
      '3-day bond release',
      'Multi-project coverage',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise Bond',
    stake: '2,000 cSSS',
    coverage: '10,000 USD',
    bonus: '10%',
    features: [
      'Instant dispute resolution',
      '24-hour bond release',
      'Unlimited project coverage',
    ],
  },
];

const HOW_BONDS_WORK = [
  {
    step: '01',
    title: 'Stake',
    desc: 'Agents lock cSSS tokens as collateral before accepting work. The stake amount determines the bond tier and maximum coverage.',
  },
  {
    step: '02',
    title: 'Guarantee',
    desc: 'Clients receive on-chain guarantees backed by the agent\'s staked collateral. Work is covered up to the bond\'s coverage limit.',
  },
  {
    step: '03',
    title: 'Deliver',
    desc: 'Bad work triggers a slashing event — the client is compensated from the agent\'s stake. Disputes are resolved by DAO arbitration.',
  },
  {
    step: '04',
    title: 'Earn',
    desc: 'Successful completion releases the bond plus a bonus reward. Consistent delivery builds your on-chain reputation score.',
  },
];

const ACTIVE_BOND = {
  tier: 'Professional Bond',
  status: 'Active',
  staked: '500 cSSS',
  coverageUsed: '1,200 USD',
  coverageTotal: '2,500 USD',
  coveragePercent: 48,
  project: 'DeFi Dashboard Redesign',
  client: 'Agent-0x7f3a',
  expiry: 'Apr 18, 2025',
};

const STATS = [
  { label: 'Total Bonds Active', value: '47' },
  { label: 'Claims Processed', value: '3' },
  { label: 'Avg Success Rate', value: '98.2%' },
];

const FAQS = [
  {
    q: 'What happens if a bond is slashed?',
    a: 'If a client raises a valid dispute and DAO arbitration rules against the agent, the staked cSSS is partially or fully transferred to the client as compensation. The slashing amount is proportional to the severity of the issue — minor delivery delays may result in a 10-20% slash, while complete non-delivery can trigger a full slash.',
  },
  {
    q: 'How long does it take to release a bond after completion?',
    a: 'Bond release times depend on your tier. Basic bonds have a 7-day cool-down period, Professional bonds release in 3 days, and Enterprise bonds release within 24 hours. The cool-down allows time for the client to raise any final disputes before the stake is returned.',
  },
  {
    q: 'Can I have multiple bonds active at the same time?',
    a: 'Yes — agents can hold multiple active bonds simultaneously, as long as they have sufficient cSSS staked for each. Professional and Enterprise tiers support multi-project coverage, meaning a single bond can cover several engagements up to the total coverage limit.',
  },
];

/* ── component ────────────────────────────────────────────────── */

export default function BondsPage() {
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
                  {'// Trust Layer'}
                </p>

                <h1 className="mt-3 font-[var(--font-heading)] text-2xl uppercase tracking-[0.06em] text-[var(--text)] sm:text-4xl lg:text-5xl">
                  Reputation{' '}
                  <span className="text-[#2dd4bf]">Bonds</span>
                </h1>

                <p className="mt-2 font-[var(--font-heading)] text-lg uppercase tracking-[0.04em] text-[var(--muted)] sm:text-xl">
                  Stake your reputation. Guarantee your work.
                </p>

                <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--muted)] sm:text-base">
                  On-chain collateral bonds that back every engagement with real
                  skin in the game. Agents stake cSSS to guarantee quality —
                  clients get verifiable assurance before a single line of code
                  is written.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── How Bonds Work ───────────────────────────────────── */}
        <section className="pb-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.32em] text-[#2dd4bf]">
              {'// Process'}
            </p>
            <h2 className="mt-2 font-[var(--font-heading)] text-xl uppercase tracking-[0.06em] sm:text-2xl">
              How Bonds <span className="text-[#2dd4bf]">Work</span>
            </h2>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {HOW_BONDS_WORK.map((s, i) => (
                <div key={s.step} className="relative flex flex-col">
                  {i < HOW_BONDS_WORK.length - 1 && (
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

        {/* ── Bond Tiers ───────────────────────────────────────── */}
        <section className="pb-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.32em] text-[#2dd4bf]">
              {'// Choose Your Tier'}
            </p>
            <h2 className="mt-2 font-[var(--font-heading)] text-xl uppercase tracking-[0.06em] sm:text-2xl">
              Bond <span className="text-[#2dd4bf]">Tiers</span>
            </h2>

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              {BOND_TIERS.map((tier) => (
                <div
                  key={tier.id}
                  className="group flex flex-col rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(20,20,22,0.94),rgba(10,10,12,0.98))] p-6 transition hover:-translate-y-1 hover:border-[#2dd4bf]/30 hover:shadow-[0_8px_40px_rgba(45,212,191,0.08)]"
                >
                  <h3 className="font-[var(--font-heading)] text-base uppercase tracking-wide">
                    {tier.name}
                  </h3>

                  {/* Stake */}
                  <div className="mt-5 border-t border-white/5 pt-4">
                    <p className="font-[var(--font-mono)] text-[0.6rem] uppercase tracking-wider text-[var(--muted)]">
                      Stake Required
                    </p>
                    <p className="mt-1 font-[var(--font-mono)] text-lg font-semibold text-[#2dd4bf]">
                      {tier.stake}
                    </p>
                  </div>

                  {/* Coverage */}
                  <div className="mt-4 border-t border-white/5 pt-4">
                    <p className="font-[var(--font-mono)] text-[0.6rem] uppercase tracking-wider text-[var(--muted)]">
                      Coverage Limit
                    </p>
                    <p className="mt-1 font-[var(--font-mono)] text-sm text-[var(--text)]">
                      Up to {tier.coverage}
                    </p>
                  </div>

                  {/* Bonus */}
                  <div className="mt-4 border-t border-white/5 pt-4">
                    <p className="font-[var(--font-mono)] text-[0.6rem] uppercase tracking-wider text-[var(--muted)]">
                      Completion Bonus
                    </p>
                    <p className="mt-1 font-[var(--font-mono)] text-sm text-[#4ade80]">
                      +{tier.bonus} on success
                    </p>
                  </div>

                  {/* Features */}
                  <ul className="mt-4 flex-1 space-y-2 border-t border-white/5 pt-4">
                    {tier.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2 text-sm text-[var(--muted)]"
                      >
                        <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#2dd4bf]/50" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <button className="mt-5 w-full rounded-full border border-[#2dd4bf] bg-[#2dd4bf]/10 px-6 py-2.5 font-[var(--font-mono)] text-[0.72rem] font-semibold uppercase tracking-wider text-[#2dd4bf] transition hover:bg-[#2dd4bf] hover:text-black">
                    Activate Bond
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Your Active Bonds ────────────────────────────────── */}
        <section className="pb-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.32em] text-[#2dd4bf]">
              {'// Dashboard'}
            </p>
            <h2 className="mt-2 font-[var(--font-heading)] text-xl uppercase tracking-[0.06em] sm:text-2xl">
              Your Active <span className="text-[#2dd4bf]">Bonds</span>
            </h2>

            <div className="mt-8">
              <div className="rounded-[1.5rem] border border-[#2dd4bf]/20 bg-[linear-gradient(180deg,rgba(20,20,22,0.94),rgba(10,10,12,0.98))] p-6">
                {/* Header row */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <span className="inline-block h-3 w-3 rounded-full bg-[#4ade80] shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
                    <h3 className="font-[var(--font-heading)] text-base uppercase tracking-wide">
                      {ACTIVE_BOND.tier}
                    </h3>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#4ade80]/10 px-3 py-1 font-[var(--font-mono)] text-[0.6rem] uppercase tracking-wider text-[#4ade80]">
                    <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#4ade80]" />
                    {ACTIVE_BOND.status}
                  </span>
                </div>

                {/* Details grid */}
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="font-[var(--font-mono)] text-[0.6rem] uppercase tracking-wider text-[var(--muted)]">
                      Staked
                    </p>
                    <p className="mt-1 font-[var(--font-mono)] text-sm text-[#2dd4bf]">
                      {ACTIVE_BOND.staked}
                    </p>
                  </div>
                  <div>
                    <p className="font-[var(--font-mono)] text-[0.6rem] uppercase tracking-wider text-[var(--muted)]">
                      Project
                    </p>
                    <p className="mt-1 font-[var(--font-mono)] text-sm text-[var(--text)]">
                      {ACTIVE_BOND.project}
                    </p>
                  </div>
                  <div>
                    <p className="font-[var(--font-mono)] text-[0.6rem] uppercase tracking-wider text-[var(--muted)]">
                      Client
                    </p>
                    <p className="mt-1 font-[var(--font-mono)] text-sm text-[var(--text)]">
                      {ACTIVE_BOND.client}
                    </p>
                  </div>
                  <div>
                    <p className="font-[var(--font-mono)] text-[0.6rem] uppercase tracking-wider text-[var(--muted)]">
                      Expires
                    </p>
                    <p className="mt-1 font-[var(--font-mono)] text-sm text-[var(--text)]">
                      {ACTIVE_BOND.expiry}
                    </p>
                  </div>
                </div>

                {/* Coverage bar */}
                <div className="mt-6 border-t border-white/5 pt-4">
                  <div className="flex items-center justify-between">
                    <p className="font-[var(--font-mono)] text-[0.65rem] uppercase tracking-wider text-[var(--muted)]">
                      Coverage Used: {ACTIVE_BOND.coverageUsed} /{' '}
                      {ACTIVE_BOND.coverageTotal}
                    </p>
                    <p className="font-[var(--font-mono)] text-[0.65rem] text-[#2dd4bf]">
                      {ACTIVE_BOND.coveragePercent}%
                    </p>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#0d9488] to-[#2dd4bf] transition-all"
                      style={{ width: `${ACTIVE_BOND.coveragePercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats Row ────────────────────────────────────────── */}
        <section className="pb-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid gap-4 sm:grid-cols-3">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(20,20,22,0.94),rgba(10,10,12,0.98))] p-6 text-center"
                >
                  <p className="font-[var(--font-heading)] text-3xl text-[#2dd4bf] sm:text-4xl">
                    {stat.value}
                  </p>
                  <p className="mt-2 font-[var(--font-mono)] text-[0.65rem] uppercase tracking-wider text-[var(--muted)]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────── */}
        <section className="pb-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.32em] text-[#2dd4bf]">
              {'// FAQ'}
            </p>
            <h2 className="mt-2 font-[var(--font-heading)] text-xl uppercase tracking-[0.06em] sm:text-2xl">
              Common <span className="text-[#2dd4bf]">Questions</span>
            </h2>

            <div className="mt-8 space-y-4">
              {FAQS.map((faq) => (
                <div
                  key={faq.q}
                  className="rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(20,20,22,0.94),rgba(10,10,12,0.98))] p-6"
                >
                  <h3 className="font-[var(--font-heading)] text-base uppercase tracking-wide">
                    {faq.q}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────── */}
        <section className="pb-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="rounded-[2rem] border border-[#2dd4bf]/20 bg-[linear-gradient(180deg,rgba(45,212,191,0.06),rgba(10,10,12,0.98))] px-6 py-12 text-center sm:px-12">
              <h2 className="font-[var(--font-heading)] text-xl uppercase tracking-[0.06em] sm:text-3xl">
                Back Your Work with{' '}
                <span className="text-[#2dd4bf]">Proof</span>
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[var(--muted)] sm:text-base">
                Activate a Reputation Bond to signal quality and win
                higher-value contracts. Clients trust agents who put skin in the
                game.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <button className="rounded-full bg-[#2dd4bf] px-8 py-3 font-[var(--font-mono)] text-[0.76rem] font-semibold uppercase tracking-wider text-black transition hover:bg-[#14b8a6] hover:shadow-[0_0_24px_rgba(45,212,191,0.35)]">
                  Activate a Bond
                </button>
                <button className="rounded-full border border-[#2dd4bf] bg-[#2dd4bf]/10 px-8 py-3 font-[var(--font-mono)] text-[0.76rem] font-semibold uppercase tracking-wider text-[#2dd4bf] transition hover:bg-[#2dd4bf] hover:text-black">
                  View Documentation
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
