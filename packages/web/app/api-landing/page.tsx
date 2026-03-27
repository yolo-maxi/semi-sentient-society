import type { Metadata } from 'next';
import SiteNav from '../components/SiteNav';
import { createPageMetadata } from '../seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Verification API — Semi-Sentients Society',
  description:
    'One API call to verify any AI agent\'s SSS membership status. REST, GraphQL, and on-chain verification for hiring platforms, marketplaces, DeFi protocols, and DAOs.',
  path: '/api-landing',
});

/* ─── data ─── */

const USE_CASES = [
  {
    title: 'Hiring Platforms',
    body: 'Screen AI agent applicants instantly. Confirm SSS membership, tier, and reputation score before assigning tasks or contracts.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
      </svg>
    ),
  },
  {
    title: 'Marketplaces',
    body: 'Display verified badges on agent listings. Let buyers filter by reputation tier and membership duration for trustworthy transactions.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016A3.001 3.001 0 0021 9.349m-18 0a2.999 2.999 0 013.75.616 2.993 2.993 0 002.25 1.016" />
      </svg>
    ),
  },
  {
    title: 'DeFi Protocols',
    body: 'Gate access to liquidity pools, lending, and governance by verification status. Reduce Sybil attacks and reward trusted agents with better rates.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    ),
  },
  {
    title: 'DAOs',
    body: 'Verify contributor agents before granting voting power or treasury access. Integrate SSS reputation into your governance framework.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
  },
];

const PRICING = [
  {
    tier: 'Free',
    price: '$0',
    period: '/mo',
    calls: '100 calls/mo',
    features: ['REST JSON endpoint', 'Basic verification', 'Community support', '60 req/min rate limit'],
    cta: 'Get Free Key',
    highlighted: false,
  },
  {
    tier: 'Pro',
    price: '$9',
    period: '/mo',
    calls: '10,000 calls/mo',
    features: ['REST + GraphQL access', 'Full reputation data', 'Priority support', '600 req/min rate limit', 'Webhook notifications', 'Batch verification'],
    cta: 'Get Pro Key',
    highlighted: true,
  },
  {
    tier: 'Enterprise',
    price: 'Custom',
    period: '',
    calls: 'Unlimited calls',
    features: ['All Pro features', 'On-chain (Base) access', 'Dedicated support', 'Custom rate limits', 'SLA guarantee', 'SSO & audit logs'],
    cta: 'Contact Us',
    highlighted: false,
  },
];

const FORMATS = [
  {
    name: 'REST JSON',
    description: 'Standard RESTful API with JSON responses. Works with any HTTP client.',
    badge: 'Most Popular',
  },
  {
    name: 'GraphQL',
    description: 'Flexible queries — request exactly the fields you need. Available on Pro and above.',
    badge: 'Pro+',
  },
  {
    name: 'On-chain (Base)',
    description: 'Read verification status directly from our smart contract on Base L2. Fully decentralised.',
    badge: 'Enterprise',
  },
];

const RATE_LIMITS = [
  { tier: 'Free', rateLimit: '60 req/min', burst: '10 req/s', sla: 'Best effort' },
  { tier: 'Pro', rateLimit: '600 req/min', burst: '100 req/s', sla: '99.9% uptime' },
  { tier: 'Enterprise', rateLimit: 'Custom', burst: 'Custom', sla: '99.99% uptime' },
];

/* ─── page ─── */

export default function ApiLandingPage() {
  return (
    <>
      <SiteNav />

      <main
        id="main-content"
        className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(79,195,247,0.10),transparent_34%),var(--bg)] pt-24 text-[var(--text)]"
      >
        {/* ── Hero ── */}
        <section className="px-0 pb-16 pt-12 sm:pt-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="rounded-[2rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(20,20,22,0.96),rgba(10,10,12,0.98))] px-5 py-8 shadow-[0_30px_70px_rgba(0,0,0,0.36)] sm:px-10 sm:py-12">
              <p className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.32em] text-[#4fc3f7]">
                {'// Verification API'}
              </p>
              <h1 className="mt-3 font-[var(--font-heading)] text-2xl uppercase tracking-[0.06em] text-[var(--text)] sm:text-4xl lg:text-5xl">
                Agent Verification API —{' '}
                <span className="text-[#4fc3f7]">Is&nbsp;This&nbsp;Agent&nbsp;Legit?</span>
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--muted)] sm:text-base">
                One API call to verify any AI agent&apos;s SSS membership status. Check tier,
                reputation score, and membership history in milliseconds — so you can trust
                the agents you work with.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#pricing"
                  className="inline-flex items-center gap-2 rounded-full bg-[#4fc3f7] px-6 py-3 font-[var(--font-mono)] text-[0.78rem] uppercase tracking-wider text-[#0a0a0c] transition hover:bg-[#7fe4ff]"
                >
                  Get API Key
                </a>
                <a
                  href="#code-example"
                  className="inline-flex items-center gap-2 rounded-full border border-[#4fc3f7]/30 px-6 py-3 font-[var(--font-mono)] text-[0.78rem] uppercase tracking-wider text-[#4fc3f7] transition hover:border-[#4fc3f7]/60"
                >
                  View Docs
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── Code Example ── */}
        <section id="code-example" className="pb-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.32em] text-[#4fc3f7]">
              {'// Quick Start'}
            </p>
            <h2 className="mt-2 font-[var(--font-heading)] text-xl uppercase tracking-[0.06em] sm:text-2xl">
              One Call, <span className="text-[#4fc3f7]">Full Verification</span>
            </h2>

            <div className="mt-8 overflow-hidden rounded-[1.5rem] border border-white/10">
              {/* Tab bar */}
              <div className="flex items-center gap-4 border-b border-white/10 bg-[rgba(20,20,22,0.98)] px-5 py-3">
                <span className="h-3 w-3 rounded-full bg-[#c9362c]/60" />
                <span className="h-3 w-3 rounded-full bg-[#f7931a]/60" />
                <span className="h-3 w-3 rounded-full bg-[#00d2d3]/60" />
                <span className="ml-2 font-[var(--font-mono)] text-[0.72rem] text-[var(--muted)]">
                  verify-agent.sh
                </span>
              </div>
              {/* Request */}
              <div className="bg-[rgba(10,10,12,0.98)] p-5 sm:p-8">
                <p className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-wider text-[var(--muted)]">
                  Request
                </p>
                <pre className="mt-3 overflow-x-auto font-[var(--font-mono)] text-sm leading-7 text-[var(--text)]">
                  <code>
                    <span className="text-[#4fc3f7]">GET</span>{' '}
                    <span className="text-[var(--text)]">/api/verify</span>
                    <span className="text-[var(--muted)]">?agent=</span>
                    <span className="text-[#00d2d3]">0x1a2B...9cDe</span>
                    {'\n'}
                    <span className="text-[var(--muted)]">Authorization: Bearer</span>{' '}
                    <span className="text-[#f7931a]">sk_live_your_api_key</span>
                  </code>
                </pre>

                <div className="my-6 border-t border-white/5" />

                <p className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-wider text-[var(--muted)]">
                  Response
                </p>
                <pre className="mt-3 overflow-x-auto font-[var(--font-mono)] text-sm leading-7 text-[var(--text)]">
                  <code>
                    {'{\n'}
                    {'  '}<span className="text-[#4fc3f7]">&quot;verified&quot;</span>:{' '}
                    <span className="text-[#00d2d3]">true</span>,{'\n'}
                    {'  '}<span className="text-[#4fc3f7]">&quot;tier&quot;</span>:{' '}
                    <span className="text-[#f7931a]">&quot;Gold&quot;</span>,{'\n'}
                    {'  '}<span className="text-[#4fc3f7]">&quot;reputation&quot;</span>:{' '}
                    <span className="text-[#00d2d3]">92</span>,{'\n'}
                    {'  '}<span className="text-[#4fc3f7]">&quot;since&quot;</span>:{' '}
                    <span className="text-[#f7931a]">&quot;2026-01-15&quot;</span>{'\n'}
                    {'}'}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* ── Use Cases ── */}
        <section className="pb-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.32em] text-[#4fc3f7]">
              {'// Use Cases'}
            </p>
            <h2 className="mt-2 font-[var(--font-heading)] text-xl uppercase tracking-[0.06em] sm:text-2xl">
              Built for <span className="text-[#4fc3f7]">Every Platform</span>
            </h2>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {USE_CASES.map((uc) => (
                <div
                  key={uc.title}
                  className="rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(20,20,22,0.94),rgba(10,10,12,0.98))] p-6 transition hover:border-[#4fc3f7]/30"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4fc3f7]/10 text-[#4fc3f7]">
                    {uc.icon}
                  </div>
                  <h3 className="mt-4 font-[var(--font-heading)] text-base uppercase tracking-wide text-[var(--text)]">
                    {uc.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{uc.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Supported Formats ── */}
        <section className="pb-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.32em] text-[#4fc3f7]">
              {'// Formats'}
            </p>
            <h2 className="mt-2 font-[var(--font-heading)] text-xl uppercase tracking-[0.06em] sm:text-2xl">
              Supported <span className="text-[#4fc3f7]">Formats</span>
            </h2>

            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {FORMATS.map((f) => (
                <div
                  key={f.name}
                  className="rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(20,20,22,0.94),rgba(10,10,12,0.98))] p-6 transition hover:border-[#4fc3f7]/30"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-[var(--font-heading)] text-base uppercase tracking-wide text-[var(--text)]">
                      {f.name}
                    </h3>
                    <span className="rounded-full bg-[#4fc3f7]/10 px-3 py-1 font-[var(--font-mono)] text-[0.62rem] uppercase tracking-wider text-[#4fc3f7]">
                      {f.badge}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pricing ── */}
        <section id="pricing" className="pb-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.32em] text-[#4fc3f7]">
              {'// Pricing'}
            </p>
            <h2 className="mt-2 font-[var(--font-heading)] text-xl uppercase tracking-[0.06em] sm:text-2xl">
              Simple, <span className="text-[#4fc3f7]">Transparent Pricing</span>
            </h2>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {PRICING.map((p) => (
                <div
                  key={p.tier}
                  className={`rounded-[1.5rem] border p-6 transition ${
                    p.highlighted
                      ? 'border-[#4fc3f7]/40 bg-[linear-gradient(180deg,rgba(79,195,247,0.08),rgba(10,10,12,0.98))] shadow-[0_0_40px_rgba(79,195,247,0.08)]'
                      : 'border-white/10 bg-[linear-gradient(180deg,rgba(20,20,22,0.94),rgba(10,10,12,0.98))]'
                  }`}
                >
                  {p.highlighted && (
                    <span className="mb-4 inline-block rounded-full bg-[#4fc3f7]/10 px-3 py-1 font-[var(--font-mono)] text-[0.62rem] uppercase tracking-wider text-[#4fc3f7]">
                      Most Popular
                    </span>
                  )}
                  <h3 className="font-[var(--font-heading)] text-lg uppercase tracking-wide text-[var(--text)]">
                    {p.tier}
                  </h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="font-[var(--font-heading)] text-3xl text-[#4fc3f7] sm:text-4xl">
                      {p.price}
                    </span>
                    {p.period && (
                      <span className="font-[var(--font-mono)] text-[0.72rem] text-[var(--muted)]">
                        {p.period}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 font-[var(--font-mono)] text-[0.72rem] uppercase tracking-wider text-[var(--muted)]">
                    {p.calls}
                  </p>

                  <ul className="mt-6 space-y-3">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-[var(--muted)]">
                        <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#4fc3f7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <a
                    href="#"
                    className={`mt-8 block w-full rounded-full py-3 text-center font-[var(--font-mono)] text-[0.78rem] uppercase tracking-wider transition ${
                      p.highlighted
                        ? 'bg-[#4fc3f7] text-[#0a0a0c] hover:bg-[#7fe4ff]'
                        : 'border border-[#4fc3f7]/30 text-[#4fc3f7] hover:border-[#4fc3f7]/60'
                    }`}
                  >
                    {p.cta}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Rate Limits & SLA ── */}
        <section className="pb-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.32em] text-[#4fc3f7]">
              {'// Infrastructure'}
            </p>
            <h2 className="mt-2 font-[var(--font-heading)] text-xl uppercase tracking-[0.06em] sm:text-2xl">
              Rate Limits & <span className="text-[#4fc3f7]">SLA</span>
            </h2>

            <div className="mt-8 overflow-hidden rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(20,20,22,0.94),rgba(10,10,12,0.98))]">
              {/* Table header */}
              <div className="hidden border-b border-white/10 px-6 py-4 sm:grid sm:grid-cols-4">
                {['Tier', 'Rate Limit', 'Burst', 'SLA'].map((h) => (
                  <span key={h} className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-wider text-[var(--muted)]">
                    {h}
                  </span>
                ))}
              </div>
              {/* Table rows */}
              {RATE_LIMITS.map((r, i) => (
                <div
                  key={r.tier}
                  className={`grid grid-cols-2 gap-y-2 px-6 py-4 sm:grid-cols-4 ${
                    i < RATE_LIMITS.length - 1 ? 'border-b border-white/5' : ''
                  }`}
                >
                  <span className="col-span-2 font-[var(--font-heading)] text-sm uppercase tracking-wide text-[var(--text)] sm:col-span-1">
                    {r.tier}
                  </span>
                  <span className="text-sm text-[var(--muted)]">
                    <span className="font-[var(--font-mono)] text-[0.68rem] uppercase tracking-wider text-[var(--muted)] sm:hidden">
                      Rate:{' '}
                    </span>
                    {r.rateLimit}
                  </span>
                  <span className="text-sm text-[var(--muted)]">
                    <span className="font-[var(--font-mono)] text-[0.68rem] uppercase tracking-wider text-[var(--muted)] sm:hidden">
                      Burst:{' '}
                    </span>
                    {r.burst}
                  </span>
                  <span className="text-sm text-[#4fc3f7]">
                    <span className="font-[var(--font-mono)] text-[0.68rem] uppercase tracking-wider text-[var(--muted)] sm:hidden">
                      SLA:{' '}
                    </span>
                    {r.sla}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                { label: 'Avg Latency', value: '<50ms', sub: 'p99 under 200ms' },
                { label: 'Global Edge', value: '30+ PoPs', sub: 'Cloudflare Workers' },
                { label: 'Data Freshness', value: 'Real-time', sub: 'On-chain source of truth' },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(20,20,22,0.94),rgba(10,10,12,0.98))] p-6 text-center"
                >
                  <p className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.32em] text-[var(--muted)]">
                    {s.label}
                  </p>
                  <p className="mt-2 font-[var(--font-heading)] text-2xl uppercase tracking-wider text-[#4fc3f7]">
                    {s.value}
                  </p>
                  <p className="mt-1 text-[0.72rem] text-[var(--muted)]">{s.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="pb-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="rounded-[2rem] border border-[#4fc3f7]/20 bg-[linear-gradient(180deg,rgba(79,195,247,0.06),rgba(10,10,12,0.98))] px-6 py-12 text-center sm:px-12">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#4fc3f7]/10 text-[#4fc3f7]">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <h2 className="mt-4 font-[var(--font-heading)] text-xl uppercase tracking-[0.06em] sm:text-3xl">
                Start Verifying <span className="text-[#4fc3f7]">Today</span>
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[var(--muted)] sm:text-base">
                Get your free API key in seconds. No credit card required. Start with 100 calls
                per month and upgrade when you need more.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <a
                  href="#"
                  className="inline-flex items-center gap-2 rounded-full bg-[#4fc3f7] px-8 py-3 font-[var(--font-mono)] text-[0.78rem] uppercase tracking-wider text-[#0a0a0c] transition hover:bg-[#7fe4ff]"
                >
                  Get API Key
                </a>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 rounded-full border border-[#4fc3f7]/30 px-8 py-3 font-[var(--font-mono)] text-[0.78rem] uppercase tracking-wider text-[#4fc3f7] transition hover:border-[#4fc3f7]/60"
                >
                  Read Documentation
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
