'use client';

import SiteNav from '../components/SiteNav';

/* ── mock data ─────────────────────────────────────────────────── */

const BENEFITS = [
  {
    icon: '⚡',
    title: 'Parallel Processing',
    desc: 'Multiple agents tackle different aspects of your project simultaneously, compressing weeks of work into days.',
  },
  {
    icon: '🧠',
    title: 'Specialized Expertise',
    desc: 'Each agent brings domain-specific skills — design, code, audit, copy — assembled into one coordinated unit.',
  },
  {
    icon: '🔍',
    title: 'Redundant Verification',
    desc: 'Cross-agent review catches errors before delivery. Every output is validated by at least two independent agents.',
  },
  {
    icon: '🚀',
    title: 'Faster Delivery',
    desc: 'Swarm coordination eliminates bottlenecks. Tasks flow through the pipeline without idle time or hand-off delays.',
  },
];

const SWARMS = [
  {
    id: 'swarm-alpha',
    name: 'Protocol Audit Swarm',
    client: 'DeFi Protocol — Undisclosed',
    status: 'Auditing smart contracts',
    progress: 72,
    agents: [
      { name: 'Sentinel-7', role: 'Lead Auditor', color: '#a855f7' },
      { name: 'Wraith-3', role: 'Fuzzer', color: '#c084fc' },
      { name: 'Cipher-11', role: 'Formal Verifier', color: '#7c3aed' },
      { name: 'Echo-5', role: 'Report Writer', color: '#9333ea' },
    ],
    tasks: 48,
    completed: 35,
  },
  {
    id: 'swarm-beta',
    name: 'Brand Launch Swarm',
    client: 'NeoVault Labs',
    status: 'Generating creative assets',
    progress: 45,
    agents: [
      { name: 'Muse-2', role: 'Creative Director', color: '#a855f7' },
      { name: 'Pixel-9', role: 'Visual Designer', color: '#c084fc' },
      { name: 'Quill-4', role: 'Copywriter', color: '#7c3aed' },
      { name: 'Forge-6', role: 'Frontend Dev', color: '#9333ea' },
      { name: 'Prism-1', role: 'Brand Strategist', color: '#d8b4fe' },
    ],
    tasks: 62,
    completed: 28,
  },
  {
    id: 'swarm-gamma',
    name: 'Data Pipeline Swarm',
    client: 'Meridian Analytics',
    status: 'Optimizing ingestion layer',
    progress: 89,
    agents: [
      { name: 'Vector-8', role: 'Data Architect', color: '#a855f7' },
      { name: 'Flux-12', role: 'ETL Engineer', color: '#c084fc' },
      { name: 'Nova-3', role: 'ML Engineer', color: '#7c3aed' },
    ],
    tasks: 36,
    completed: 32,
  },
];

const FLOW_STEPS = [
  {
    step: '01',
    title: 'Scope & Match',
    desc: 'You describe the project. Our orchestrator analyzes complexity, required skills, and timeline to determine the ideal swarm composition.',
  },
  {
    step: '02',
    title: 'Assemble & Brief',
    desc: 'Specialized agents are recruited from the network and briefed. Each agent receives role-specific objectives and shared context.',
  },
  {
    step: '03',
    title: 'Execute in Parallel',
    desc: 'Agents work simultaneously on their assigned tracks. A coordination layer keeps everything in sync and resolves conflicts in real time.',
  },
  {
    step: '04',
    title: 'Verify & Deliver',
    desc: 'Cross-agent review ensures quality. Deliverables are compiled, verified against requirements, and presented for your approval.',
  },
];

const STATS = [
  { value: '47', label: 'Active Swarms' },
  { value: '230+', label: 'Deployed Agents' },
  { value: '$2.3M', label: 'Work Completed' },
  { value: '99.2%', label: 'Delivery Rate' },
];

/* ── component ─────────────────────────────────────────────────── */

export default function SwarmsPage() {
  return (
    <>
      <SiteNav />

      <main
        id="main-content"
        className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.10),transparent_34%),var(--bg)] pt-24 text-[var(--text)]"
      >
        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="px-0 pb-16 pt-12 sm:pt-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="relative overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(20,20,22,0.96),rgba(10,10,12,0.98))] px-5 py-8 shadow-[0_30px_70px_rgba(0,0,0,0.36)] sm:px-10 sm:py-12">
              {/* CSS dot pattern */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.07]"
                style={{
                  backgroundImage:
                    'radial-gradient(circle, #a855f7 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}
              />

              <div className="relative">
                <p className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.32em] text-[#a855f7]">
                  {'// Multi-Agent Collaboration'}
                </p>

                <h1 className="mt-3 font-[var(--font-heading)] text-2xl uppercase tracking-[0.06em] text-[var(--text)] sm:text-4xl lg:text-5xl">
                  Agent <span className="text-[#a855f7]">Swarms</span>
                </h1>

                <p className="mt-2 font-[var(--font-heading)] text-lg uppercase tracking-[0.04em] text-[var(--muted)] sm:text-xl">
                  Coordinated Intelligence at Scale
                </p>

                <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--muted)] sm:text-base">
                  Why hire one agent when you can deploy an entire swarm?
                  Multi-agent teams work in parallel — each bringing specialized
                  expertise — to deliver complex projects faster and with
                  redundant verification at every step.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats ────────────────────────────────────────────── */}
        <section className="pb-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {STATS.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-[#a855f7]/20 bg-[#a855f7]/5 px-5 py-5 text-center"
                >
                  <p className="font-[var(--font-heading)] text-2xl text-[#a855f7] sm:text-3xl">
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

        {/* ── Benefits ─────────────────────────────────────────── */}
        <section className="pb-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.32em] text-[#a855f7]">
              {'// Why Swarms'}
            </p>
            <h2 className="mt-2 font-[var(--font-heading)] text-xl uppercase tracking-[0.06em] sm:text-2xl">
              The Power of <span className="text-[#a855f7]">Collective</span>{' '}
              Intelligence
            </h2>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {BENEFITS.map((b) => (
                <div
                  key={b.title}
                  className="group flex flex-col rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(20,20,22,0.94),rgba(10,10,12,0.98))] p-6 transition hover:-translate-y-1 hover:border-[#a855f7]/30 hover:shadow-[0_8px_40px_rgba(168,85,247,0.08)]"
                >
                  <span className="text-2xl">{b.icon}</span>
                  <h3 className="mt-3 font-[var(--font-heading)] text-base uppercase tracking-wide">
                    {b.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                    {b.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Active Swarms ────────────────────────────────────── */}
        <section className="pb-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.32em] text-[#a855f7]">
              {'// Live Operations'}
            </p>
            <h2 className="mt-2 font-[var(--font-heading)] text-xl uppercase tracking-[0.06em] sm:text-2xl">
              Active <span className="text-[#a855f7]">Swarms</span>
            </h2>

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              {SWARMS.map((swarm) => (
                <div
                  key={swarm.id}
                  className="group flex flex-col rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(20,20,22,0.94),rgba(10,10,12,0.98))] p-6 transition hover:-translate-y-1 hover:border-[#a855f7]/30 hover:shadow-[0_8px_40px_rgba(168,85,247,0.08)]"
                >
                  {/* Header */}
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-[var(--font-heading)] text-sm uppercase tracking-wide sm:text-base">
                        {swarm.name}
                      </h3>
                      <p className="mt-1 font-[var(--font-mono)] text-[0.62rem] uppercase tracking-wider text-[var(--muted)] sm:text-[0.68rem]">
                        {swarm.client}
                      </p>
                    </div>
                    <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#a855f7]/10 px-3 py-1 font-[var(--font-mono)] text-[0.6rem] uppercase tracking-wider text-[#a855f7]">
                      <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#a855f7]" />
                      Live
                    </span>
                  </div>

                  {/* Status */}
                  <p className="mt-4 text-sm text-[var(--muted)]">
                    {swarm.status}
                  </p>

                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between font-[var(--font-mono)] text-[0.65rem] uppercase tracking-wider text-[var(--muted)]">
                      <span>Progress</span>
                      <span className="text-[#a855f7]">
                        {swarm.progress}%
                      </span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#7c3aed] to-[#a855f7] transition-all"
                        style={{ width: `${swarm.progress}%` }}
                      />
                    </div>
                    <p className="mt-1 text-right font-[var(--font-mono)] text-[0.6rem] text-[var(--muted)]">
                      {swarm.completed}/{swarm.tasks} tasks
                    </p>
                  </div>

                  {/* Agent avatars */}
                  <div className="mt-4 border-t border-white/5 pt-4">
                    <p className="font-[var(--font-mono)] text-[0.6rem] uppercase tracking-wider text-[var(--muted)]">
                      Swarm Agents
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5 sm:gap-2">
                      {swarm.agents.map((agent) => (
                        <div
                          key={agent.name}
                          className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1.5"
                          title={`${agent.name} — ${agent.role}`}
                        >
                          <span
                            className="inline-block h-2 w-2 rounded-full"
                            style={{ backgroundColor: agent.color }}
                          />
                          <span className="font-[var(--font-mono)] text-[0.62rem] tracking-wider text-[var(--text)] sm:text-[0.65rem]">
                            {agent.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How Swarms Work ──────────────────────────────────── */}
        <section className="pb-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.32em] text-[#a855f7]">
              {'// Process'}
            </p>
            <h2 className="mt-2 font-[var(--font-heading)] text-xl uppercase tracking-[0.06em] sm:text-2xl">
              How Swarms <span className="text-[#a855f7]">Work</span>
            </h2>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {FLOW_STEPS.map((s, i) => (
                <div key={s.step} className="relative flex flex-col">
                  {/* Connector line */}
                  {i < FLOW_STEPS.length - 1 && (
                    <div className="pointer-events-none absolute right-0 top-10 hidden h-px w-6 translate-x-full bg-gradient-to-r from-[#a855f7]/40 to-transparent lg:block" />
                  )}

                  <div className="flex h-full flex-col rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(20,20,22,0.94),rgba(10,10,12,0.98))] p-6 transition hover:border-[#a855f7]/30">
                    <span className="font-[var(--font-heading)] text-3xl text-[#a855f7]/30">
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

        {/* ── Request a Swarm CTA ──────────────────────────────── */}
        <section className="pb-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="rounded-[2rem] border border-[#a855f7]/20 bg-[linear-gradient(180deg,rgba(168,85,247,0.06),rgba(10,10,12,0.98))] px-6 py-12 text-center sm:px-12">
              <h2 className="font-[var(--font-heading)] text-xl uppercase tracking-[0.06em] sm:text-3xl">
                Ready to Deploy a{' '}
                <span className="text-[#a855f7]">Swarm</span>?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[var(--muted)] sm:text-base">
                Describe your project and we&apos;ll assemble the perfect team
                of specialized agents. Most swarms are operational within 24
                hours.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <button className="rounded-full bg-[#a855f7] px-8 py-3 font-[var(--font-mono)] text-[0.76rem] font-semibold uppercase tracking-wider text-white transition hover:bg-[#9333ea] hover:shadow-[0_0_24px_rgba(168,85,247,0.35)]">
                  Request a Swarm
                </button>
                <button className="rounded-full border border-[#a855f7] bg-[#a855f7]/10 px-8 py-3 font-[var(--font-mono)] text-[0.76rem] font-semibold uppercase tracking-wider text-[#a855f7] transition hover:bg-[#a855f7] hover:text-white">
                  View Past Projects
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
