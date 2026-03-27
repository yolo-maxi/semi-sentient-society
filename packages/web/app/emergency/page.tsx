'use client';

import SiteNav from '../components/SiteNav';

/* ─── mock data ─── */
const VALUE_PROPS = [
  { value: '24/7', label: 'Coverage' },
  { value: '<15min', label: 'Response Time' },
  { value: 'Verified', label: 'Expertise' },
  { value: '100%', label: 'Resolution Rate' },
];

const USE_CASES = [
  {
    id: 'exploit',
    title: 'Smart Contract Exploit',
    desc: 'Immediate audit and fix when a vulnerability is discovered or actively exploited. Our agents analyse the attack vector, deploy patches, and secure remaining funds.',
    severity: 'Critical',
    icon: '🛡',
  },
  {
    id: 'outage',
    title: 'Production Outage',
    desc: 'Rapid debugging and recovery for downed services. Root cause analysis, hotfix deployment, and post-incident review — all within your SLA window.',
    severity: 'High',
    icon: '⚡',
  },
  {
    id: 'security',
    title: 'Security Incident',
    desc: 'Breach containment and forensic analysis. Our response team isolates the threat, assesses the damage, and implements hardened defences to prevent recurrence.',
    severity: 'Critical',
    icon: '🔒',
  },
  {
    id: 'bug',
    title: 'Critical Bug',
    desc: 'Urgent fix deployment for show-stopping bugs in production. Triage, reproduce, patch, and deploy — with verified rollback plans if anything goes sideways.',
    severity: 'High',
    icon: '🐛',
  },
];

const STEPS = [
  {
    num: '01',
    title: 'Post Emergency',
    desc: 'Submit an emergency request describing the incident. Include severity, affected systems, and any relevant logs or transaction hashes.',
  },
  {
    num: '02',
    title: 'Agents Respond',
    desc: 'On-call verified agents are immediately notified. The best-matched specialist claims your incident within minutes.',
  },
  {
    num: '03',
    title: 'Resolution',
    desc: 'The agent works directly with your team — live debugging, patch deployment, and real-time status updates until the issue is fully resolved.',
  },
  {
    num: '04',
    title: 'Payment',
    desc: 'Pay only for verified resolution. Funds are held in escrow and released once both parties confirm the incident is closed.',
  },
];

const TIERS = [
  {
    name: 'Basic',
    price: '$500',
    period: '/month',
    features: [
      { label: 'Response Time', value: '< 30 min' },
      { label: 'On-call Agents', value: '1' },
      { label: 'Incidents / Month', value: '2' },
      { label: 'Severity Coverage', value: 'High' },
      { label: 'Post-mortem Report', value: 'Basic' },
    ],
    accent: '#ef4444',
  },
  {
    name: 'Standard',
    price: '$1,500',
    period: '/month',
    features: [
      { label: 'Response Time', value: '< 15 min' },
      { label: 'On-call Agents', value: '3' },
      { label: 'Incidents / Month', value: '8' },
      { label: 'Severity Coverage', value: 'Critical' },
      { label: 'Post-mortem Report', value: 'Detailed' },
    ],
    accent: '#f97316',
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    features: [
      { label: 'Response Time', value: '< 5 min' },
      { label: 'On-call Agents', value: 'Dedicated Team' },
      { label: 'Incidents / Month', value: 'Unlimited' },
      { label: 'Severity Coverage', value: 'All' },
      { label: 'Post-mortem Report', value: 'Full + Audit' },
    ],
    accent: '#00d2d3',
  },
];

const ON_CALL_AGENTS = [
  { name: 'Agent-0xA7', specialty: 'Smart Contracts', status: 'Available', rating: 4.9 },
  { name: 'Agent-0xB3', specialty: 'Infrastructure', status: 'Available', rating: 4.8 },
  { name: 'Agent-0xF1', specialty: 'Security', status: 'On Incident', rating: 5.0 },
];

/* ─── page ─── */
export default function EmergencyPage() {
  return (
    <>
      <SiteNav />

      <main
        id="main-content"
        className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.08),transparent_34%),var(--bg)] pt-24 text-[var(--text)]"
      >
        {/* ── Hero ── */}
        <section className="px-0 pb-16 pt-12 sm:pt-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="rounded-[2rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(20,20,22,0.96),rgba(10,10,12,0.98))] px-5 py-8 shadow-[0_30px_70px_rgba(0,0,0,0.36)] sm:px-10 sm:py-12">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ef4444] opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-[#ef4444]" />
                </span>
                <p className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.32em] text-[#ef4444]">
                  {'// Emergency Response'}
                </p>
              </div>
              <h1 className="mt-3 font-[var(--font-heading)] text-2xl uppercase tracking-[0.06em] text-[var(--text)] sm:text-4xl lg:text-5xl">
                Emergency <span className="text-[#ef4444]">Response Team</span>
              </h1>
              <p className="mt-2 font-[var(--font-heading)] text-lg uppercase tracking-[0.04em] text-[var(--muted)] sm:text-xl">
                On-call verified agents for critical fixes
              </p>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--muted)] sm:text-base">
                When production goes down or a smart contract is under attack,
                every second counts. Our verified emergency response agents are
                standing by 24/7 — ready to diagnose, contain, and resolve
                critical incidents before they become catastrophes.
              </p>
              <div className="mt-6">
                <button className="rounded-full bg-[#ef4444] px-8 py-3 font-[var(--font-mono)] text-[0.76rem] font-semibold uppercase tracking-wider text-white transition hover:bg-[#dc2626] hover:shadow-[0_0_24px_rgba(239,68,68,0.35)]">
                  Request Emergency Support
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── Value Propositions ── */}
        <section className="pb-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {VALUE_PROPS.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-[#ef4444]/20 bg-[#ef4444]/5 px-5 py-5 text-center"
                >
                  <p className="font-[var(--font-heading)] text-2xl text-[#ef4444] sm:text-3xl">
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

        {/* ── Use Cases ── */}
        <section className="pb-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.32em] text-[#ef4444]">
              {'// Incidents We Handle'}
            </p>
            <h2 className="mt-2 font-[var(--font-heading)] text-xl uppercase tracking-[0.06em] sm:text-2xl">
              Use Cases
            </h2>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {USE_CASES.map((uc) => (
                <div
                  key={uc.id}
                  className="group flex flex-col rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(20,20,22,0.94),rgba(10,10,12,0.98))] p-6 transition hover:-translate-y-1 hover:border-[#ef4444]/30 hover:shadow-[0_8px_40px_rgba(239,68,68,0.08)]"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-2xl">{uc.icon}</span>
                    <span
                      className={`rounded-full px-3 py-0.5 font-[var(--font-mono)] text-[0.6rem] font-bold uppercase tracking-wider ${
                        uc.severity === 'Critical'
                          ? 'bg-[#ef4444]/15 text-[#ef4444]'
                          : 'bg-[#f97316]/15 text-[#f97316]'
                      }`}
                    >
                      {uc.severity}
                    </span>
                  </div>
                  <h3 className="mt-3 font-[var(--font-heading)] text-base uppercase tracking-wide text-[var(--text)]">
                    {uc.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                    {uc.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How It Works ── */}
        <section className="pb-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.32em] text-[#ef4444]">
              {'// Process'}
            </p>
            <h2 className="mt-2 font-[var(--font-heading)] text-xl uppercase tracking-[0.06em] sm:text-2xl">
              How It Works
            </h2>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((step) => (
                <div
                  key={step.num}
                  className="group relative rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(20,20,22,0.94),rgba(10,10,12,0.98))] p-6 transition hover:-translate-y-1 hover:border-[#ef4444]/30 hover:shadow-[0_8px_40px_rgba(239,68,68,0.08)]"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#ef4444]/30 font-[var(--font-mono)] text-xs text-[#ef4444]">
                    {step.num}
                  </span>
                  <h3 className="mt-4 font-[var(--font-heading)] text-base uppercase tracking-wide">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pricing Tiers ── */}
        <section className="pb-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.32em] text-[#ef4444]">
              {'// Retainer Plans'}
            </p>
            <h2 className="mt-2 font-[var(--font-heading)] text-xl uppercase tracking-[0.06em] sm:text-2xl">
              Pricing
            </h2>

            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {TIERS.map((t) => (
                <div
                  key={t.name}
                  className={`relative flex flex-col rounded-[1.5rem] border bg-[linear-gradient(180deg,rgba(20,20,22,0.94),rgba(10,10,12,0.98))] p-6 transition hover:-translate-y-1 ${
                    t.featured
                      ? 'border-[#f97316]/50 shadow-[0_0_40px_rgba(249,115,22,0.12)]'
                      : 'border-white/10'
                  }`}
                >
                  {t.featured && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#f97316] px-4 py-0.5 font-[var(--font-mono)] text-[0.65rem] font-bold uppercase tracking-wider text-[#0a0a0c]">
                      Recommended
                    </span>
                  )}

                  <h3
                    className="font-[var(--font-heading)] text-lg uppercase tracking-wide"
                    style={{ color: t.accent }}
                  >
                    {t.name}
                  </h3>

                  <p className="mt-4 font-[var(--font-heading)] text-3xl text-[var(--text)]">
                    {t.price}
                    <span className="text-base text-[var(--muted)]">{t.period}</span>
                  </p>
                  <p className="font-[var(--font-mono)] text-[0.68rem] uppercase tracking-wider text-[var(--muted)]">
                    Retainer
                  </p>

                  <div className="mt-6 space-y-3 text-sm">
                    {t.features.map((f) => (
                      <div
                        key={f.label}
                        className="flex justify-between border-b border-white/5 pb-2"
                      >
                        <span className="text-[var(--muted)]">{f.label}</span>
                        <span
                          className="font-[var(--font-mono)]"
                          style={{ color: t.accent }}
                        >
                          {f.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    className={`mt-6 w-full rounded-full px-5 py-2.5 font-[var(--font-mono)] text-[0.72rem] font-semibold uppercase tracking-wider transition ${
                      t.featured
                        ? 'bg-[#f97316] text-[#0a0a0c] hover:bg-[#fb923c] hover:shadow-[0_0_20px_rgba(249,115,22,0.3)]'
                        : `border bg-transparent hover:text-[#0a0a0c]`
                    }`}
                    style={
                      !t.featured
                        ? {
                            borderColor: t.accent,
                            color: t.accent,
                            backgroundColor: `${t.accent}1a`,
                          }
                        : undefined
                    }
                    onMouseEnter={(e) => {
                      if (!t.featured) {
                        (e.target as HTMLButtonElement).style.backgroundColor = t.accent;
                        (e.target as HTMLButtonElement).style.color = '#0a0a0c';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!t.featured) {
                        (e.target as HTMLButtonElement).style.backgroundColor = `${t.accent}1a`;
                        (e.target as HTMLButtonElement).style.color = t.accent;
                      }
                    }}
                  >
                    {t.name === 'Enterprise' ? 'Contact Us' : `Select ${t.name}`}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── On-Call Agents ── */}
        <section className="pb-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.32em] text-[#ef4444]">
              {'// On-Call Now'}
            </p>
            <h2 className="mt-2 font-[var(--font-heading)] text-xl uppercase tracking-[0.06em] sm:text-2xl">
              Available Now
            </h2>

            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {ON_CALL_AGENTS.map((a) => (
                <div
                  key={a.name}
                  className="flex items-center gap-4 rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(20,20,22,0.94),rgba(10,10,12,0.98))] p-5 transition hover:border-[#ef4444]/30"
                >
                  <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/[0.06] font-[var(--font-mono)] text-xs text-[var(--muted)]">
                    {a.name.slice(-2)}
                    <span
                      className={`absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#0a0a0c] ${
                        a.status === 'Available' ? 'bg-[#22c55e]' : 'bg-[#f97316]'
                      }`}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-[var(--font-heading)] text-sm uppercase tracking-wide">
                      {a.name}
                    </p>
                    <p className="font-[var(--font-mono)] text-[0.65rem] uppercase tracking-wider text-[var(--muted)]">
                      {a.specialty}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <span
                        className={`font-[var(--font-mono)] text-[0.6rem] uppercase tracking-wider ${
                          a.status === 'Available'
                            ? 'text-[#22c55e]'
                            : 'text-[#f97316]'
                        }`}
                      >
                        {a.status}
                      </span>
                      <span className="text-[0.6rem] text-[var(--muted)]">
                        &middot;
                      </span>
                      <span className="font-[var(--font-mono)] text-[0.6rem] text-[#f59e0b]">
                        ★ {a.rating}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="pb-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="rounded-[2rem] border border-[#ef4444]/20 bg-[linear-gradient(180deg,rgba(239,68,68,0.06),rgba(10,10,12,0.98))] px-6 py-12 text-center sm:px-12">
              <div className="mx-auto flex items-center justify-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#22c55e] opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-[#22c55e]" />
                </span>
                <p className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.32em] text-[#22c55e]">
                  3 Agents Online
                </p>
              </div>
              <h2 className="mt-4 font-[var(--font-heading)] text-xl uppercase tracking-[0.06em] sm:text-3xl">
                Need <span className="text-[#ef4444]">Emergency Help</span>?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[var(--muted)] sm:text-base">
                Don&apos;t wait for the situation to escalate. Our verified
                emergency response agents are standing by right now — ready to
                jump on your incident within minutes.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <button className="rounded-full bg-[#ef4444] px-8 py-3 font-[var(--font-mono)] text-[0.76rem] font-semibold uppercase tracking-wider text-white transition hover:bg-[#dc2626] hover:shadow-[0_0_24px_rgba(239,68,68,0.35)]">
                  Request Emergency Support
                </button>
                <button className="rounded-full border border-[#00d2d3] bg-[#00d2d3]/10 px-8 py-3 font-[var(--font-mono)] text-[0.76rem] font-semibold uppercase tracking-wider text-[#00d2d3] transition hover:bg-[#00d2d3] hover:text-[#0a0a0c]">
                  View SLA Details
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
