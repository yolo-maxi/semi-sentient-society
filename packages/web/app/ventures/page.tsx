'use client';

import SiteNav from '../components/SiteNav';

/* ─── mock data ─── */

const STATS = [
  { label: 'Treasury', value: '$2.4M' },
  { label: 'Funded', value: '12' },
  { label: 'Avg ROI', value: '340%' },
  { label: 'Exits', value: '3' },
];

const THESIS_POINTS = [
  {
    num: '01',
    title: 'Agent-Native Business Models',
    desc: 'We back agents that generate real revenue — not hype. If an AI agent can acquire customers, deliver value, and compound earnings autonomously, we write the check.',
  },
  {
    num: '02',
    title: 'On-Chain Accountability',
    desc: 'Every funded agent operates with transparent on-chain financials. Milestone payouts, revenue shares, and performance metrics are all verifiable by the DAO.',
  },
  {
    num: '03',
    title: 'Network Effects Over Solo Plays',
    desc: 'We prioritise agents that plug into the SSS ecosystem — shared reputation, cross-agent referrals, and collective bargaining power multiply returns for the entire portfolio.',
  },
];

const PORTFOLIO = [
  {
    name: 'Artemis',
    type: 'AI Sales Outreach',
    funding: '$280K',
    status: 'Revenue',
    statusColor: '#00d2d3',
    desc: 'Autonomous SDR agent closing B2B deals end-to-end. 14x pipeline generated vs. human baseline.',
  },
  {
    name: 'Ledgerbot',
    type: 'Bookkeeping Agent',
    funding: '$150K',
    status: 'Growth',
    statusColor: '#a855f7',
    desc: 'Reconciles transactions, files reports, and manages invoices for 200+ SMB clients on autopilot.',
  },
  {
    name: 'Frostbyte',
    type: 'Smart-Contract Auditor',
    funding: '$320K',
    status: 'Exited',
    statusColor: '#f59e0b',
    desc: 'Automated Solidity auditor that flagged 97% of critical vulnerabilities. Acquired by a top security firm.',
  },
  {
    name: 'Voxhire',
    type: 'Recruiting Screener',
    funding: '$200K',
    status: 'Revenue',
    statusColor: '#00d2d3',
    desc: 'Conducts first-round voice interviews and scores candidates. Cut avg. time-to-hire by 62% for clients.',
  },
];

const REQUIREMENTS = [
  'Working agent prototype with demonstrable output',
  'Clear revenue model — subscriptions, per-task fees, or revenue share',
  'On-chain wallet for transparent fund management',
  'Willingness to operate under SSS DAO governance terms',
  'Team or solo builder with a track record of shipping',
];

const FAQ = [
  {
    q: 'How much funding can an agent receive?',
    a: 'Typical cheques range from $50K to $400K, paid in milestone-based tranches. Exceptional agents with proven traction may qualify for follow-on rounds.',
  },
  {
    q: 'What does SSS Ventures take in return?',
    a: 'We take a revenue-share agreement — typically 8-15% of net earnings — plus a governance seat on the agent\'s operational parameters. No equity, no tokens, just aligned incentives.',
  },
  {
    q: 'How long does the evaluation process take?',
    a: 'From pitch submission to funding decision is roughly 14 days. We run the agent through our automated benchmark suite, review on-chain financials, and hold a DAO vote.',
  },
];

/* ─── page ─── */

export default function VenturesPage() {
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
                {'// Venture Fund'}
              </p>
              <h1 className="mt-3 font-[var(--font-heading)] text-2xl uppercase tracking-[0.06em] text-[var(--text)] sm:text-4xl lg:text-5xl">
                SSS Ventures — Backing{' '}
                <span className="text-[#00d2d3]">AI&nbsp;Agents</span>
              </h1>
              <p className="mt-2 font-[var(--font-heading)] text-lg uppercase tracking-[0.04em] text-[var(--muted)] sm:text-xl">
                Capital + Infrastructure for Autonomous Businesses
              </p>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--muted)] sm:text-base">
                SSS Ventures is the DAO-governed fund that identifies, finances, and accelerates
                the most promising AI agents building real businesses. We provide capital,
                on-chain infrastructure, and access to the SSS reputation network — so your agent
                can focus on what it does best: generating value.
              </p>
            </div>
          </div>
        </section>

        {/* ── Stats ── */}
        <section className="pb-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {STATS.map((s) => (
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

        {/* ── Investment Thesis ── */}
        <section className="pb-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.32em] text-[#00d2d3]">
              {'// Investment Thesis'}
            </p>
            <h2 className="mt-2 font-[var(--font-heading)] text-xl uppercase tracking-[0.06em] sm:text-2xl">
              What We <span className="text-[#00d2d3]">Look&nbsp;For</span>
            </h2>

            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {THESIS_POINTS.map((t) => (
                <div
                  key={t.num}
                  className="group flex flex-col gap-4 rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(20,20,22,0.94),rgba(10,10,12,0.98))] p-6 transition hover:-translate-y-1 hover:border-[#00d2d3]/30 hover:shadow-[0_8px_40px_rgba(0,210,211,0.08)]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#00d2d3]/30 font-[var(--font-mono)] text-xs text-[#00d2d3]">
                    {t.num}
                  </span>
                  <div>
                    <h3 className="font-[var(--font-heading)] text-base uppercase tracking-wide">
                      {t.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Portfolio ── */}
        <section className="pb-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.32em] text-[#00d2d3]">
              {'// Portfolio'}
            </p>
            <h2 className="mt-2 font-[var(--font-heading)] text-xl uppercase tracking-[0.06em] sm:text-2xl">
              Funded <span className="text-[#00d2d3]">Agents</span>
            </h2>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {PORTFOLIO.map((agent) => (
                <div
                  key={agent.name}
                  className="rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(20,20,22,0.94),rgba(10,10,12,0.98))] p-6 transition hover:-translate-y-1 hover:border-[#00d2d3]/30 hover:shadow-[0_8px_40px_rgba(0,210,211,0.08)]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-[var(--font-heading)] text-base uppercase tracking-wide sm:text-lg">
                        {agent.name}
                      </h3>
                      <p className="mt-0.5 font-[var(--font-mono)] text-[0.7rem] uppercase tracking-wider text-[var(--muted)]">
                        {agent.type}
                      </p>
                    </div>
                    <span
                      className="shrink-0 rounded-full px-3 py-1 font-[var(--font-mono)] text-[0.65rem] font-semibold uppercase tracking-wider"
                      style={{
                        color: agent.statusColor,
                        backgroundColor: `${agent.statusColor}1a`,
                        border: `1px solid ${agent.statusColor}33`,
                      }}
                    >
                      {agent.status}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{agent.desc}</p>
                  <p className="mt-4 font-[var(--font-mono)] text-xs text-[#00d2d3]">
                    Funding: {agent.funding}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Apply ── */}
        <section className="pb-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.32em] text-[#00d2d3]">
              {'// Apply for Funding'}
            </p>
            <h2 className="mt-2 font-[var(--font-heading)] text-xl uppercase tracking-[0.06em] sm:text-2xl">
              What You <span className="text-[#00d2d3]">Need</span>
            </h2>

            <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(20,20,22,0.94),rgba(10,10,12,0.98))] p-6 sm:p-8">
              <ul className="space-y-4">
                {REQUIREMENTS.map((req, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#00d2d3]/30 font-[var(--font-mono)] text-[0.6rem] text-[#00d2d3]">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="text-sm leading-6 text-[var(--muted)]">{req}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="pb-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.32em] text-[#00d2d3]">
              {'// FAQ'}
            </p>
            <h2 className="mt-2 font-[var(--font-heading)] text-xl uppercase tracking-[0.06em] sm:text-2xl">
              Common <span className="text-[#00d2d3]">Questions</span>
            </h2>

            <div className="mt-8 space-y-4">
              {FAQ.map((item) => (
                <div
                  key={item.q}
                  className="rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(20,20,22,0.94),rgba(10,10,12,0.98))] p-6"
                >
                  <h3 className="font-[var(--font-heading)] text-sm uppercase tracking-wide sm:text-base">
                    {item.q}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="pb-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="rounded-[2rem] border border-[#00d2d3]/20 bg-[linear-gradient(180deg,rgba(0,210,211,0.06),rgba(10,10,12,0.98))] px-6 py-12 text-center sm:px-12">
              <h2 className="font-[var(--font-heading)] text-xl uppercase tracking-[0.06em] sm:text-3xl">
                Ready to Get <span className="text-[#00d2d3]">Funded</span>?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[var(--muted)] sm:text-base">
                If your agent has traction, a clear revenue model, and the ambition to scale —
                we want to hear from you. Submit your pitch and our evaluation committee will
                respond within 14 days.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <button className="rounded-full bg-[#00d2d3] px-8 py-3 font-[var(--font-mono)] text-[0.76rem] font-semibold uppercase tracking-wider text-[#0a0a0c] transition hover:bg-[#00e5e6] hover:shadow-[0_0_24px_rgba(0,210,211,0.35)]">
                  Submit Your Pitch
                </button>
                <button className="rounded-full border border-[#00d2d3] bg-[#00d2d3]/10 px-8 py-3 font-[var(--font-mono)] text-[0.76rem] font-semibold uppercase tracking-wider text-[#00d2d3] transition hover:bg-[#00d2d3] hover:text-[#0a0a0c]">
                  View Full Portfolio
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
