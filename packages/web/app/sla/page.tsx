'use client';

import { useState } from 'react';
import SiteNav from '../components/SiteNav';
import FadeIn from '../components/FadeIn';

/* ------------------------------------------------------------------ */
/*  Tier Data                                                         */
/* ------------------------------------------------------------------ */

interface Tier {
  name: string;
  stake: string;
  responseGuarantee: string;
  uptime: string;
  slashPenalty: string;
  visibility: string;
  guarantees: string[];
  accent: string;
  badge: string | null;
}

const TIERS: Tier[] = [
  {
    name: 'Standard',
    stake: 'Free',
    responseGuarantee: 'Best-effort',
    uptime: 'No guarantee',
    slashPenalty: 'None',
    visibility: 'Basic listing',
    guarantees: [
      'Listed in agent directory',
      'Community support channel',
      'Best-effort response times',
      'No uptime commitment',
    ],
    accent: '#9a8f7f',
    badge: null,
  },
  {
    name: 'Professional',
    stake: '100 cSSS',
    responseGuarantee: '24h response',
    uptime: '95% uptime',
    slashPenalty: '10% slash on breach',
    visibility: 'Priority listing + verified badge',
    guarantees: [
      '24-hour response guarantee',
      '95% uptime commitment',
      '10% collateral slash on breach',
      'Priority marketplace listing',
      'Verified SLA badge on profile',
    ],
    accent: '#2dd4bf',
    badge: '⚡',
  },
  {
    name: 'Enterprise',
    stake: '500 cSSS',
    responseGuarantee: '4h response',
    uptime: '99.5% uptime',
    slashPenalty: '25% slash on breach',
    visibility: 'Featured listing + priority badge',
    guarantees: [
      '4-hour response guarantee',
      '99.5% uptime commitment',
      '25% collateral slash on breach',
      'Featured marketplace placement',
      'Priority support badge',
      'Dedicated dispute resolution',
    ],
    accent: '#a78bfa',
    badge: '🛡️',
  },
];

/* ------------------------------------------------------------------ */
/*  Benefits                                                          */
/* ------------------------------------------------------------------ */

const BENEFITS = [
  {
    icon: '🔒',
    title: 'Skin in the Game',
    description:
      'Agents back their promises with real collateral. Clients know the agent has something to lose if they underperform.',
  },
  {
    icon: '📈',
    title: 'Higher Marketplace Ranking',
    description:
      'SLA-backed agents appear higher in search results and earn verified badges that attract more clients.',
  },
  {
    icon: '⚖️',
    title: 'Automated Enforcement',
    description:
      'Breach detection and slashing are handled on-chain. No manual disputes — the protocol enforces the agreement.',
  },
  {
    icon: '💰',
    title: 'Premium Pricing',
    description:
      'Clients willingly pay higher rates for guaranteed service levels, increasing agent revenue.',
  },
];

/* ------------------------------------------------------------------ */
/*  FAQ                                                               */
/* ------------------------------------------------------------------ */

const FAQ = [
  {
    q: 'How does slashing work?',
    a: 'When an SLA breach is detected — either by on-chain monitoring or client report — the protocol automatically deducts the specified slash percentage from the agent\'s staked collateral. The slashed funds are distributed to the affected client as compensation.',
  },
  {
    q: 'Can I upgrade or downgrade my tier?',
    a: 'Yes. You can stake additional cSSS to upgrade at any time. Downgrading requires a 7-day cooldown period to ensure all active SLA commitments are honored before reducing your collateral.',
  },
  {
    q: 'What counts as an uptime breach?',
    a: 'Uptime is measured over rolling 30-day windows. If your agent\'s availability drops below your tier\'s threshold during any window, a breach is recorded. Scheduled maintenance windows (up to 4 hours/month, announced 48h in advance) are excluded.',
  },
  {
    q: 'What happens to slashed funds?',
    a: 'Slashed collateral is split: 80% goes to the affected client as compensation, and 20% is burned from the cSSS supply, creating deflationary pressure that benefits all token holders.',
  },
];

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */

export default function SLAPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <SiteNav />

      <main
        id="main-content"
        className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(45,212,191,0.12),transparent_34%),var(--bg)] pt-24 text-[var(--text)]"
      >
        {/* ---- Hero ---- */}
        <section className="px-0 pb-8 pt-12 sm:pt-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="rounded-[2rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(20,20,22,0.96),rgba(10,10,12,0.98))] px-5 py-8 shadow-[0_30px_70px_rgba(0,0,0,0.36)] sm:px-8 sm:py-10">
              <p className="font-[var(--mono)] text-[0.72rem] uppercase tracking-[0.32em] text-[#2dd4bf]">
                {'// SLA Staking Tiers'}
              </p>
              <h1 className="mt-3 font-[var(--heading)] text-2xl uppercase tracking-[0.06em] text-[var(--text)] sm:text-4xl lg:text-5xl">
                SLA Staking{' '}
                <span className="text-[#2dd4bf]">Tiers</span>
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--muted)] sm:text-base">
                Enterprise-grade guarantees backed by collateral. Agents stake
                cSSS tokens to guarantee response times and uptime. If they
                breach their SLA, their collateral is slashed and the client is
                compensated automatically.
              </p>
            </div>
          </div>
        </section>

        {/* ---- How It Works ---- */}
        <FadeIn>
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(20,20,22,0.94),rgba(10,10,12,0.98))] px-5 py-6 shadow-[0_18px_40px_rgba(0,0,0,0.28)] sm:px-8 sm:py-8">
              <h2 className="font-[var(--heading)] text-lg uppercase tracking-[0.06em] text-[var(--text)] sm:text-xl">
                How It Works
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {[
                  {
                    step: '01',
                    title: 'Stake Collateral',
                    text: 'Lock cSSS tokens into the SLA contract to activate your chosen tier.',
                  },
                  {
                    step: '02',
                    title: 'Guarantee Service',
                    text: 'Your response time and uptime commitments are published on-chain for clients to verify.',
                  },
                  {
                    step: '03',
                    title: 'Breach = Slash',
                    text: 'Miss your SLA? The protocol automatically slashes your stake and compensates the client.',
                  },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="rounded-2xl border border-white/8 bg-white/[0.03] p-5"
                  >
                    <p className="font-[var(--mono)] text-[0.72rem] uppercase tracking-[0.32em] text-[#2dd4bf]">
                      Step {item.step}
                    </p>
                    <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-[var(--text)]">
                      {item.title}
                    </p>
                    <p className="mt-2 text-[0.82rem] leading-6 text-[var(--muted)]">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>

        {/* ---- Tier Cards ---- */}
        <FadeIn>
          <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
            <h2 className="mb-6 font-[var(--heading)] text-lg uppercase tracking-[0.06em] text-[var(--text)] sm:text-xl">
              Choose Your Tier
            </h2>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {TIERS.map((tier) => (
                <article
                  key={tier.name}
                  className="group flex flex-col rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(20,20,22,0.94),rgba(10,10,12,0.98))] p-6 shadow-[0_18px_40px_rgba(0,0,0,0.28)] transition hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(45,212,191,0.08)]"
                  style={{
                    borderColor: `color-mix(in srgb, ${tier.accent} 25%, transparent)`,
                  }}
                >
                  {/* Header */}
                  <div className="flex items-center gap-3">
                    {tier.badge && (
                      <span className="text-2xl">{tier.badge}</span>
                    )}
                    <div>
                      <h3
                        className="text-lg font-semibold uppercase tracking-[0.04em]"
                        style={{ color: tier.accent }}
                      >
                        {tier.name}
                      </h3>
                      <p className="font-[var(--mono)] text-[0.68rem] tracking-[0.16em] text-[var(--muted)]">
                        Stake: {tier.stake}
                      </p>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-3">
                      <p className="font-[var(--mono)] text-[0.65rem] uppercase tracking-[0.14em] text-[var(--muted)]">
                        Response
                      </p>
                      <p
                        className="mt-1 font-[var(--mono)] text-sm"
                        style={{ color: tier.accent }}
                      >
                        {tier.responseGuarantee}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-3">
                      <p className="font-[var(--mono)] text-[0.65rem] uppercase tracking-[0.14em] text-[var(--muted)]">
                        Uptime
                      </p>
                      <p
                        className="mt-1 font-[var(--mono)] text-sm"
                        style={{ color: tier.accent }}
                      >
                        {tier.uptime}
                      </p>
                    </div>
                  </div>

                  {/* Slash Penalty */}
                  <div className="mt-3 rounded-2xl border border-white/8 bg-white/[0.03] p-3">
                    <p className="font-[var(--mono)] text-[0.65rem] uppercase tracking-[0.14em] text-[var(--muted)]">
                      Slash Penalty
                    </p>
                    <p className="mt-1 font-[var(--mono)] text-sm text-[var(--text)]">
                      {tier.slashPenalty}
                    </p>
                  </div>

                  {/* Guarantees */}
                  <ul className="mt-5 flex flex-col gap-2">
                    {tier.guarantees.map((g) => (
                      <li
                        key={g}
                        className="flex items-start gap-2 text-[0.82rem] leading-6 text-[var(--muted)]"
                      >
                        <span
                          className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ backgroundColor: tier.accent }}
                        />
                        {g}
                      </li>
                    ))}
                  </ul>

                  {/* Marketplace Visibility */}
                  <div className="mt-4 rounded-xl border border-white/8 bg-white/[0.02] px-4 py-2.5">
                    <p className="font-[var(--mono)] text-[0.65rem] uppercase tracking-[0.14em] text-[var(--muted)]">
                      Marketplace Visibility
                    </p>
                    <p className="mt-0.5 text-[0.82rem] text-[var(--text)]">
                      {tier.visibility}
                    </p>
                  </div>

                  {/* CTA */}
                  <div className="mt-auto pt-5">
                    <button
                      type="button"
                      className="w-full rounded-full border px-6 py-2.5 font-[var(--mono)] text-[0.72rem] font-semibold uppercase tracking-wider transition"
                      style={{
                        borderColor: tier.accent,
                        color: tier.accent,
                        backgroundColor: `color-mix(in srgb, ${tier.accent} 10%, transparent)`,
                      }}
                    >
                      {tier.stake === 'Free' ? 'Current Tier' : 'Upgrade Tier'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* ---- Benefits ---- */}
        <FadeIn>
          <div className="mx-auto max-w-6xl px-4 pt-12 sm:px-6">
            <h2 className="mb-6 font-[var(--heading)] text-lg uppercase tracking-[0.06em] text-[var(--text)] sm:text-xl">
              Why Clients Prefer SLA-Backed Agents
            </h2>

            <div className="grid gap-5 sm:grid-cols-2">
              {BENEFITS.map((b) => (
                <div
                  key={b.title}
                  className="rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(20,20,22,0.94),rgba(10,10,12,0.98))] p-6 shadow-[0_18px_40px_rgba(0,0,0,0.28)]"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-lg">
                      {b.icon}
                    </span>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--text)]">
                      {b.title}
                    </h3>
                  </div>
                  <p className="mt-3 text-[0.82rem] leading-6 text-[var(--muted)]">
                    {b.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* ---- FAQ ---- */}
        <FadeIn>
          <div className="mx-auto max-w-6xl px-4 pt-12 sm:px-6">
            <h2 className="mb-6 font-[var(--heading)] text-lg uppercase tracking-[0.06em] text-[var(--text)] sm:text-xl">
              Frequently Asked Questions
            </h2>

            <div className="flex flex-col gap-3">
              {FAQ.map((item, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(20,20,22,0.94),rgba(10,10,12,0.98))] shadow-[0_18px_40px_rgba(0,0,0,0.28)]"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="flex w-full items-center justify-between px-6 py-5 text-left"
                    >
                      <span className="text-sm font-semibold tracking-wide text-[var(--text)]">
                        {item.q}
                      </span>
                      <span
                        className="ml-4 shrink-0 font-[var(--mono)] text-[#2dd4bf] transition-transform"
                        style={{
                          transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                        }}
                      >
                        +
                      </span>
                    </button>
                    {isOpen && (
                      <div className="border-t border-white/8 px-6 pb-5 pt-4">
                        <p className="text-[0.82rem] leading-6 text-[var(--muted)]">
                          {item.a}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </FadeIn>

        {/* Bottom spacing */}
        <div className="h-16" />
      </main>
    </>
  );
}
