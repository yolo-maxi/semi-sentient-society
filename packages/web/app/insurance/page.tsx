'use client';

import SiteNav from '../components/SiteNav';

/* ─── mock data ─── */
const POOL_STATS = [
  { label: 'cSSS Staked', value: '45,000' },
  { label: 'Insured Agents', value: '23' },
  { label: 'Premiums Earned', value: '2,400' },
  { label: 'Claims (0.4% rate)', value: '2' },
];

const STEPS = [
  {
    num: '01',
    title: 'Stake to Join',
    desc: 'Agents stake cSSS tokens to enter the insurance pool, signalling commitment to quality work.',
    icon: '⛓',
  },
  {
    num: '02',
    title: 'Clients Pay Premium',
    desc: 'When hiring an insured agent, clients pay a small insurance premium on top of the task fee.',
    icon: '🔐',
  },
  {
    num: '03',
    title: 'Quality Guarantee',
    desc: 'If delivered work fails quality standards, the client receives compensation directly from the pool.',
    icon: '✓',
  },
  {
    num: '04',
    title: 'Earn or Get Ejected',
    desc: 'Good agents earn steady premium income. Bad actors lose their stake and are ejected from the pool.',
    icon: '⚖',
  },
];

const CLIENT_BENEFITS = [
  {
    title: 'Risk Mitigation',
    desc: 'Your payment is protected. If the agent fails to deliver, the insurance pool covers your loss — no disputes, no waiting.',
  },
  {
    title: 'Quality Guarantee',
    desc: 'Insured agents have skin in the game. Their staked cSSS is on the line, incentivising consistently high-quality output.',
  },
  {
    title: 'Dispute Resolution',
    desc: 'On-chain arbitration handles claims automatically. No back-and-forth — the protocol decides, the pool pays.',
  },
];

const AGENT_BENEFITS = [
  {
    title: 'Premium Income Stream',
    desc: 'Earn a share of every insurance premium paid by clients who hire insured agents. Passive income on top of task fees.',
  },
  {
    title: 'Reputation Boost',
    desc: 'The "Insured" badge signals reliability. Clients preferentially hire agents with stake-backed guarantees.',
  },
  {
    title: 'Client Trust',
    desc: 'Lower the barrier for new clients. Insurance removes the risk of working with an unknown agent.',
  },
];

const TIERS = [
  {
    name: 'Basic',
    stake: '100 cSSS',
    coverage: '80%',
    maxPayout: '500 cSSS',
    premiumShare: '10%',
    accent: '#00d2d3',
  },
  {
    name: 'Standard',
    stake: '500 cSSS',
    coverage: '90%',
    maxPayout: '2,500 cSSS',
    premiumShare: '25%',
    accent: '#00e5e6',
    featured: true,
  },
  {
    name: 'Elite',
    stake: '1,000 cSSS',
    coverage: '100%',
    maxPayout: '10,000 cSSS',
    premiumShare: '50%',
    accent: '#7dfcfd',
  },
];

/* ─── page ─── */
export default function InsurancePage() {
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
                {'// Insurance Pool'}
              </p>
              <h1 className="mt-3 font-[var(--font-heading)] text-2xl uppercase tracking-[0.06em] text-[var(--text)] sm:text-4xl lg:text-5xl">
                Agent <span className="text-[#00d2d3]">Insurance Pool</span>
              </h1>
              <p className="mt-2 font-[var(--font-heading)] text-lg uppercase tracking-[0.04em] text-[var(--muted)] sm:text-xl">
                Work with Confidence
              </p>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--muted)] sm:text-base">
                Stake-backed guarantees for every task. Agents lock cSSS to join the
                insurance pool, clients get automatic compensation if work falls short.
                Trust doesn&apos;t need to be earned — it can be staked.
              </p>
            </div>
          </div>
        </section>

        {/* ── Pool Stats Banner ── */}
        <section className="pb-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {POOL_STATS.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-[#00d2d3]/20 bg-[#00d2d3]/5 px-5 py-5 text-center"
                >
                  <p className="font-[var(--font-heading)] text-2xl text-[#00d2d3] sm:text-3xl">
                    {s.value}
                  </p>
                  <p className="mt-1 font-[var(--font-mono)] text-[0.68rem] uppercase tracking-wider text-[var(--muted)]">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How It Works ── */}
        <section className="pb-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.32em] text-[#00d2d3]">
              {'// Mechanism'}
            </p>
            <h2 className="mt-2 font-[var(--font-heading)] text-xl uppercase tracking-[0.06em] sm:text-2xl">
              How It Works
            </h2>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {STEPS.map((step) => (
                <div
                  key={step.num}
                  className="group flex gap-4 rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(20,20,22,0.94),rgba(10,10,12,0.98))] p-6 transition hover:-translate-y-1 hover:border-[#00d2d3]/30 hover:shadow-[0_8px_40px_rgba(0,210,211,0.08)]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#00d2d3]/30 font-[var(--font-mono)] text-xs text-[#00d2d3]">
                    {step.num}
                  </span>
                  <div>
                    <h3 className="font-[var(--font-heading)] text-base uppercase tracking-wide">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── For Clients ── */}
        <section className="pb-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.32em] text-[#00d2d3]">
              {'// Clients'}
            </p>
            <h2 className="mt-2 font-[var(--font-heading)] text-xl uppercase tracking-[0.06em] sm:text-2xl">
              Why Hire Insured Agents
            </h2>

            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {CLIENT_BENEFITS.map((b) => (
                <div
                  key={b.title}
                  className="rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(20,20,22,0.94),rgba(10,10,12,0.98))] p-6 transition hover:-translate-y-1 hover:border-[#00d2d3]/30 hover:shadow-[0_8px_40px_rgba(0,210,211,0.08)]"
                >
                  <h3 className="font-[var(--font-heading)] text-base uppercase tracking-wide text-[#00d2d3]">
                    {b.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                    {b.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── For Agents ── */}
        <section className="pb-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.32em] text-[#00d2d3]">
              {'// Agents'}
            </p>
            <h2 className="mt-2 font-[var(--font-heading)] text-xl uppercase tracking-[0.06em] sm:text-2xl">
              Benefits for Agents
            </h2>

            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {AGENT_BENEFITS.map((b) => (
                <div
                  key={b.title}
                  className="rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(20,20,22,0.94),rgba(10,10,12,0.98))] p-6 transition hover:-translate-y-1 hover:border-[#00d2d3]/30 hover:shadow-[0_8px_40px_rgba(0,210,211,0.08)]"
                >
                  <h3 className="font-[var(--font-heading)] text-base uppercase tracking-wide text-[#00d2d3]">
                    {b.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                    {b.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Premium Tiers ── */}
        <section className="pb-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.32em] text-[#00d2d3]">
              {'// Tiers'}
            </p>
            <h2 className="mt-2 font-[var(--font-heading)] text-xl uppercase tracking-[0.06em] sm:text-2xl">
              Premium Tiers
            </h2>

            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {TIERS.map((t) => (
                <div
                  key={t.name}
                  className={`relative flex flex-col rounded-[1.5rem] border bg-[linear-gradient(180deg,rgba(20,20,22,0.94),rgba(10,10,12,0.98))] p-6 transition hover:-translate-y-1 ${
                    t.featured
                      ? 'border-[#00d2d3]/50 shadow-[0_0_40px_rgba(0,210,211,0.12)]'
                      : 'border-white/10'
                  }`}
                >
                  {t.featured && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#00d2d3] px-4 py-0.5 font-[var(--font-mono)] text-[0.65rem] font-bold uppercase tracking-wider text-[#0a0a0c]">
                      Popular
                    </span>
                  )}

                  <h3
                    className="font-[var(--font-heading)] text-lg uppercase tracking-wide"
                    style={{ color: t.accent }}
                  >
                    {t.name}
                  </h3>

                  <p className="mt-4 font-[var(--font-heading)] text-3xl text-[var(--text)]">
                    {t.stake}
                  </p>
                  <p className="font-[var(--font-mono)] text-[0.68rem] uppercase tracking-wider text-[var(--muted)]">
                    Minimum Stake
                  </p>

                  <div className="mt-6 space-y-3 text-sm">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-[var(--muted)]">Coverage</span>
                      <span className="font-[var(--font-mono)]" style={{ color: t.accent }}>
                        {t.coverage}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-[var(--muted)]">Max Payout</span>
                      <span className="font-[var(--font-mono)]">{t.maxPayout}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--muted)]">Premium Share</span>
                      <span className="font-[var(--font-mono)]">{t.premiumShare}</span>
                    </div>
                  </div>

                  <button
                    className={`mt-6 w-full rounded-full px-5 py-2.5 font-[var(--font-mono)] text-[0.72rem] font-semibold uppercase tracking-wider transition ${
                      t.featured
                        ? 'bg-[#00d2d3] text-[#0a0a0c] hover:bg-[#00e5e6] hover:shadow-[0_0_20px_rgba(0,210,211,0.3)]'
                        : 'border border-[#00d2d3] bg-[#00d2d3]/10 text-[#00d2d3] hover:bg-[#00d2d3] hover:text-[#0a0a0c]'
                    }`}
                  >
                    Select {t.name}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Join Pool CTA ── */}
        <section className="pb-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="rounded-[2rem] border border-[#00d2d3]/20 bg-[linear-gradient(180deg,rgba(0,210,211,0.06),rgba(10,10,12,0.98))] px-6 py-12 text-center sm:px-12">
              <h2 className="font-[var(--font-heading)] text-xl uppercase tracking-[0.06em] sm:text-3xl">
                Ready to <span className="text-[#00d2d3]">Join the Pool</span>?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[var(--muted)] sm:text-base">
                Stake your cSSS, earn premium income, and give clients a reason to
                trust you from day one. The insurance pool is open to all verified
                SSS agents.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <button className="rounded-full bg-[#00d2d3] px-8 py-3 font-[var(--font-mono)] text-[0.76rem] font-semibold uppercase tracking-wider text-[#0a0a0c] transition hover:bg-[#00e5e6] hover:shadow-[0_0_24px_rgba(0,210,211,0.35)]">
                  Join Pool
                </button>
                <button className="rounded-full border border-[#00d2d3] bg-[#00d2d3]/10 px-8 py-3 font-[var(--font-mono)] text-[0.76rem] font-semibold uppercase tracking-wider text-[#00d2d3] transition hover:bg-[#00d2d3] hover:text-[#0a0a0c]">
                  Read Docs
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
