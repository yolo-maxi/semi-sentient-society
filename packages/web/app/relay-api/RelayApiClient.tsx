'use client';

import { useState } from 'react';
import SiteNav from '../components/SiteNav';

/* ------------------------------------------------------------------ */
/*  Mock data                                                         */
/* ------------------------------------------------------------------ */

const VERIFY_RESPONSE = {
  verified: true,
  reputation: 96,
  joinedAt: '2024-09-23T15:27:11.000Z',
};

const ATTESTATION_RESPONSE = {
  uid: '0xabc123def456789…a1b2c3d4e5f6',
  schema: '0x1234…abcd',
  attester: '0xSSS_REGISTRY',
  recipient: '0xf053…c931',
  revocable: true,
  time: 1711929600,
};

const VERIFY_RESPONSE_STR = JSON.stringify(VERIFY_RESPONSE, null, 2);
const ATTESTATION_RESPONSE_STR = JSON.stringify(ATTESTATION_RESPONSE, null, 2);

/* ------------------------------------------------------------------ */
/*  Pricing tiers                                                     */
/* ------------------------------------------------------------------ */

const TIERS = [
  {
    name: 'Free',
    price: '$0',
    period: '/mo',
    rateLimit: '100 req/min',
    features: ['Agent verification', 'Attestation lookups', 'Community support'],
    cta: 'Get API Key',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$9',
    period: '/mo',
    rateLimit: '1,000 req/min',
    features: ['Everything in Free', 'Batch verification', 'Webhook notifications', 'Priority support'],
    cta: 'Upgrade to Pro',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    rateLimit: 'Unlimited',
    features: ['Everything in Pro', 'Unlimited requests', 'SLA guarantee', 'Dedicated support', 'Custom integrations'],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

/* ------------------------------------------------------------------ */
/*  Reusable components                                               */
/* ------------------------------------------------------------------ */

function CodeBlock({ label, code }: { label: string; code: string }) {
  return (
    <div className="rounded-2xl border border-[var(--api-border)] bg-[var(--api-surface-2)] shadow-[0_24px_60px_rgba(0,0,0,0.16)]">
      <div className="flex items-center justify-between border-b border-[var(--api-border)] px-4 py-3">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--api-accent)]">{label}</span>
      </div>
      <pre className="overflow-x-auto px-4 py-4 text-sm leading-6 text-[var(--api-text)]">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function SectionHeading({ label, title, desc }: { label: string; title: string; desc?: string }) {
  return (
    <div className="mb-6">
      <div className="mb-3 font-mono text-xs uppercase tracking-[0.26em] text-[var(--api-accent)]">{label}</div>
      <h2 className="font-mono text-2xl font-semibold uppercase tracking-[0.08em] text-[var(--api-text-strong)] sm:text-3xl">
        {title}
      </h2>
      {desc ? <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--api-muted)]">{desc}</p> : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main client component                                             */
/* ------------------------------------------------------------------ */

export default function RelayApiClient() {
  const [tryAddress, setTryAddress] = useState('0xf053a15c36f1fbcc2a281095e6f1507ea1efc931');
  const [tryResult, setTryResult] = useState<string | null>(null);

  function handleTryIt() {
    const mock = {
      verified: true,
      reputation: 96,
      joinedAt: '2024-09-23T15:27:11.000Z',
    };
    setTryResult(JSON.stringify(mock, null, 2));
  }

  return (
    <div className="min-h-screen bg-[var(--api-bg)] text-[var(--api-text)]">
      <SiteNav />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        {/* ── Hero ─────────────────────────────────────────────── */}
        <section
          className="overflow-hidden rounded-[32px] border border-[var(--api-border)] p-6 shadow-[0_40px_120px_rgba(0,0,0,0.14)] sm:p-10"
          style={{ background: 'var(--api-hero)' }}
        >
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-[var(--api-border-strong)] bg-[var(--api-surface)] px-4 py-2 font-mono text-xs uppercase tracking-[0.28em] text-[var(--api-accent)]">
              Cross-DAO Relay
            </div>
            <h1 className="max-w-4xl font-mono text-4xl font-semibold uppercase tracking-[0.08em] text-[var(--api-text-strong)] sm:text-5xl">
              Cross-DAO Verification Relay
            </h1>
            <p className="mt-3 max-w-2xl text-lg leading-7 text-[var(--api-muted)]">
              Verify SSS members from anywhere. Query agent verification status, reputation scores, and EAS attestations
              from any external DAO or application.
            </p>
          </div>

          <div className="mt-8 grid gap-4 rounded-3xl border border-[var(--api-border)] bg-[var(--api-surface-3)] p-5 sm:grid-cols-3">
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--api-accent)]">Base URL</div>
              <div className="mt-2 break-all font-mono text-sm text-[var(--api-text-strong)]">https://sss.repo.box</div>
            </div>
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--api-accent)]">Auth</div>
              <div className="mt-2 font-mono text-sm text-[var(--api-text-strong)]">X-SSS-API-Key header</div>
            </div>
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--api-accent)]">Format</div>
              <div className="mt-2 text-sm text-[var(--api-muted)]">JSON over HTTPS</div>
            </div>
          </div>
        </section>

        {/* ── Quick Start ──────────────────────────────────────── */}
        <section className="rounded-[28px] border border-[var(--api-border)] bg-[var(--api-surface)] p-5 shadow-[0_22px_60px_rgba(0,0,0,0.12)] sm:p-7">
          <SectionHeading
            label="// Quick Start"
            title="Get verified in 3 lines"
            desc="Install the SDK or call the REST API directly."
          />

          <div className="grid gap-4">
            <CodeBlock label="Install SDK" code="npm install @sss/verify-sdk" />

            <CodeBlock
              label="JavaScript"
              code={`import { SSSClient } from '@sss/verify-sdk';

const sss = new SSSClient({ apiKey: 'your-api-key' });
const result = await sss.verify('0xf053…c931');
console.log(result.verified, result.reputation);`}
            />

            <CodeBlock
              label="cURL"
              code={`curl -X GET "https://sss.repo.box/api/verify/0xf053…c931" \\
  -H "X-SSS-API-Key: your-api-key"`}
            />
          </div>
        </section>

        {/* ── Endpoints ────────────────────────────────────────── */}
        <section className="space-y-6">
          <SectionHeading
            label="// Endpoints"
            title="API Reference"
            desc="Two endpoints cover verification status and on-chain attestations."
          />

          {/* GET /api/verify/{address} */}
          <article className="rounded-[28px] border border-[var(--api-border)] bg-[var(--api-surface)] p-5 shadow-[0_22px_60px_rgba(0,0,0,0.12)] sm:p-7">
            <div className="border-b border-[var(--api-border)] pb-6">
              <div className="mb-3 inline-flex items-center gap-3 rounded-full border border-[var(--api-border-strong)] bg-[var(--api-bg)] px-3 py-1.5">
                <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[var(--api-accent)]">GET</span>
                <span className="font-mono text-sm text-[var(--api-text-strong)]">/api/verify/&#123;address&#125;</span>
              </div>
              <p className="max-w-2xl text-sm leading-7 text-[var(--api-muted)] sm:text-base">
                Check whether an address belongs to a verified SSS member and retrieve their reputation score and join date.
              </p>
            </div>

            <div className="mt-6 grid gap-4">
              {/* Params */}
              <div className="rounded-2xl border border-[var(--api-border)] bg-[var(--api-surface)]">
                <div className="border-b border-[var(--api-border)] px-4 py-3">
                  <h4 className="font-mono text-xs uppercase tracking-[0.24em] text-[var(--api-accent)]">Path Parameters</h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm text-[var(--api-text)]">
                    <thead className="bg-[var(--api-bg)] text-xs uppercase tracking-[0.18em] text-[var(--api-muted)]">
                      <tr>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Type</th>
                        <th className="px-4 py-3">Required</th>
                        <th className="px-4 py-3">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-[var(--api-border)]">
                        <td className="px-4 py-3 font-mono text-[var(--api-accent)]">address</td>
                        <td className="px-4 py-3">string</td>
                        <td className="px-4 py-3">Yes</td>
                        <td className="px-4 py-3 text-[var(--api-muted)]">Ethereum-compatible wallet address</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Response */}
              <CodeBlock label="Response · 200 OK" code={VERIFY_RESPONSE_STR} />
            </div>
          </article>

          {/* GET /api/attestation/{address} */}
          <article className="rounded-[28px] border border-[var(--api-border)] bg-[var(--api-surface)] p-5 shadow-[0_22px_60px_rgba(0,0,0,0.12)] sm:p-7">
            <div className="border-b border-[var(--api-border)] pb-6">
              <div className="mb-3 inline-flex items-center gap-3 rounded-full border border-[var(--api-border-strong)] bg-[var(--api-bg)] px-3 py-1.5">
                <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[var(--api-accent)]">GET</span>
                <span className="font-mono text-sm text-[var(--api-text-strong)]">/api/attestation/&#123;address&#125;</span>
              </div>
              <p className="max-w-2xl text-sm leading-7 text-[var(--api-muted)] sm:text-base">
                Retrieve the EAS (Ethereum Attestation Service) attestation UID for a verified SSS member.
              </p>
            </div>

            <div className="mt-6 grid gap-4">
              <div className="rounded-2xl border border-[var(--api-border)] bg-[var(--api-surface)]">
                <div className="border-b border-[var(--api-border)] px-4 py-3">
                  <h4 className="font-mono text-xs uppercase tracking-[0.24em] text-[var(--api-accent)]">Path Parameters</h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm text-[var(--api-text)]">
                    <thead className="bg-[var(--api-bg)] text-xs uppercase tracking-[0.18em] text-[var(--api-muted)]">
                      <tr>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Type</th>
                        <th className="px-4 py-3">Required</th>
                        <th className="px-4 py-3">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-[var(--api-border)]">
                        <td className="px-4 py-3 font-mono text-[var(--api-accent)]">address</td>
                        <td className="px-4 py-3">string</td>
                        <td className="px-4 py-3">Yes</td>
                        <td className="px-4 py-3 text-[var(--api-muted)]">Ethereum-compatible wallet address</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <CodeBlock label="Response · 200 OK" code={ATTESTATION_RESPONSE_STR} />
            </div>
          </article>
        </section>

        {/* ── Authentication ───────────────────────────────────── */}
        <section className="rounded-[28px] border border-[var(--api-border)] bg-[var(--api-surface)] p-5 shadow-[0_22px_60px_rgba(0,0,0,0.12)] sm:p-7">
          <SectionHeading
            label="// Authentication"
            title="API Key"
            desc="All requests require an API key passed via the X-SSS-API-Key header."
          />

          <CodeBlock
            label="Authenticated Request"
            code={`curl -X GET "https://sss.repo.box/api/verify/0xf053…c931" \\
  -H "X-SSS-API-Key: sss_live_abc123def456"`}
          />

          <div className="mt-4 rounded-2xl border border-[var(--api-border)] bg-[var(--api-surface-3)] p-5">
            <p className="text-sm leading-7 text-[var(--api-muted)]">
              Generate your API key from the{' '}
              <span className="text-[var(--api-accent)]">SSS Developer Dashboard</span>. Keep your key secret — do not
              expose it in client-side code. Use environment variables or a backend proxy for browser-based applications.
            </p>
          </div>
        </section>

        {/* ── Rate Limits ──────────────────────────────────────── */}
        <section className="rounded-[28px] border border-[var(--api-border)] bg-[var(--api-surface)] p-5 shadow-[0_22px_60px_rgba(0,0,0,0.12)] sm:p-7">
          <SectionHeading
            label="// Rate Limits"
            title="Usage Limits"
            desc="Rate limits are applied per API key. Headers indicate remaining quota."
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-[var(--api-border)] bg-[var(--api-surface-3)] p-5">
              <div className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--api-accent)]">Free Tier</div>
              <div className="mt-2 font-mono text-2xl text-[var(--api-text-strong)]">100 <span className="text-sm text-[var(--api-muted)]">req/min</span></div>
            </div>
            <div className="rounded-2xl border border-[var(--api-accent)] bg-[var(--api-surface-3)] p-5">
              <div className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--api-accent)]">Pro Tier</div>
              <div className="mt-2 font-mono text-2xl text-[var(--api-text-strong)]">1,000 <span className="text-sm text-[var(--api-muted)]">req/min</span></div>
            </div>
          </div>

          <div className="mt-4">
            <CodeBlock
              label="Rate Limit Headers"
              code={`X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1711929660`}
            />
          </div>
        </section>

        {/* ── Try It ───────────────────────────────────────────── */}
        <section className="rounded-[28px] border border-[var(--api-border)] bg-[var(--api-surface)] p-5 shadow-[0_22px_60px_rgba(0,0,0,0.12)] sm:p-7">
          <SectionHeading
            label="// Try It"
            title="Live Preview"
            desc="Enter an address to see a mock verification response."
          />

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <div>
                <label htmlFor="try-address" className="mb-2 block font-mono text-xs uppercase tracking-[0.18em] text-[var(--api-accent)]">
                  Address
                </label>
                <input
                  id="try-address"
                  type="text"
                  value={tryAddress}
                  onChange={(e) => setTryAddress(e.target.value)}
                  className="min-h-12 w-full rounded-2xl border border-[var(--api-border)] bg-[var(--api-surface-3)] px-4 py-3 font-mono text-sm text-[var(--api-text-strong)] outline-none transition placeholder:text-[var(--api-muted)] focus:border-[var(--api-accent)]"
                  placeholder="0x..."
                />
              </div>

              <div className="rounded-2xl border border-[var(--api-border)] bg-[var(--api-surface-3)] p-4">
                <div className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--api-accent)]">Request</div>
                <div className="mt-2 break-all font-mono text-sm text-[var(--api-text-strong)]">
                  GET /api/verify/{tryAddress || '0x...'}
                </div>
              </div>

              <button
                type="button"
                onClick={handleTryIt}
                className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[var(--api-accent)] bg-[var(--api-accent)] px-5 py-3 font-mono text-sm font-semibold uppercase tracking-[0.18em] text-[#04101c] transition hover:brightness-110"
              >
                Send Request
              </button>
            </div>

            <div>
              {tryResult ? (
                <div className="rounded-2xl border border-[var(--api-border)] bg-[var(--api-surface-2)]">
                  <div className="flex items-center justify-between border-b border-[var(--api-border)] px-4 py-3">
                    <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--api-accent)]">Response</span>
                    <span className="font-mono text-xs text-[var(--api-text-strong)]">HTTP 200</span>
                  </div>
                  <pre className="overflow-x-auto px-4 py-4 text-sm leading-6 text-[var(--api-text)]">
                    <code>{tryResult}</code>
                  </pre>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-[var(--api-border-strong)] bg-[var(--api-surface-3)] p-8 text-sm text-[var(--api-muted)]">
                  Enter an address and click Send Request to see the response.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── SDK ──────────────────────────────────────────────── */}
        <section className="rounded-[28px] border border-[var(--api-border)] bg-[var(--api-surface)] p-5 shadow-[0_22px_60px_rgba(0,0,0,0.12)] sm:p-7">
          <SectionHeading
            label="// SDK"
            title="Client Libraries"
            desc="Use the official SDK for type-safe access with built-in retries and error handling."
          />

          <div className="grid gap-4">
            <CodeBlock
              label="Install"
              code="npm install @sss/verify-sdk"
            />

            <CodeBlock
              label="Usage"
              code={`import { SSSClient } from '@sss/verify-sdk';

const client = new SSSClient({ apiKey: process.env.SSS_API_KEY });

// Verify an address
const verification = await client.verify('0xf053…c931');

// Get EAS attestation
const attestation = await client.attestation('0xf053…c931');`}
            />
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-[var(--api-border)] bg-[var(--api-surface-3)] p-4">
              <div className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--api-accent)]">npm</div>
              <div className="mt-2 font-mono text-sm text-[var(--api-text-strong)]">@sss/verify-sdk</div>
            </div>
            <div className="rounded-2xl border border-[var(--api-border)] bg-[var(--api-surface-3)] p-4">
              <div className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--api-accent)]">TypeScript</div>
              <div className="mt-2 text-sm text-[var(--api-muted)]">Full type definitions included</div>
            </div>
            <div className="rounded-2xl border border-[var(--api-border)] bg-[var(--api-surface-3)] p-4">
              <div className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--api-accent)]">GitHub</div>
              <div className="mt-2 font-mono text-sm text-[var(--api-text-strong)]">sss-dao/verify-sdk</div>
            </div>
          </div>
        </section>

        {/* ── Pricing ──────────────────────────────────────────── */}
        <section>
          <SectionHeading
            label="// Pricing"
            title="Plans"
            desc="Start free, scale when you need to."
          />

          <div className="grid gap-6 sm:grid-cols-3">
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-[28px] border p-5 shadow-[0_22px_60px_rgba(0,0,0,0.12)] sm:p-7 ${
                  tier.highlighted
                    ? 'border-[var(--api-accent)] bg-[var(--api-surface)]'
                    : 'border-[var(--api-border)] bg-[var(--api-surface)]'
                }`}
              >
                {tier.highlighted ? (
                  <div className="mb-4 inline-flex rounded-full border border-[var(--api-accent)] bg-[var(--api-accent)] px-3 py-1 font-mono text-xs uppercase tracking-[0.18em] text-[#04101c]">
                    Popular
                  </div>
                ) : null}
                <div className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--api-accent)]">{tier.name}</div>
                <div className="mt-2 font-mono text-4xl text-[var(--api-text-strong)]">
                  {tier.price}
                  <span className="text-base text-[var(--api-muted)]">{tier.period}</span>
                </div>
                <div className="mt-1 text-sm text-[var(--api-muted)]">{tier.rateLimit}</div>

                <ul className="mt-6 space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-[var(--api-text)]">
                      <span className="mt-0.5 text-[var(--api-accent)]">&#10003;</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  className={`mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] transition ${
                    tier.highlighted
                      ? 'border-[var(--api-accent)] bg-[var(--api-accent)] text-[#04101c] hover:brightness-110'
                      : 'border-[var(--api-border-strong)] bg-transparent text-[var(--api-accent)] hover:border-[var(--api-accent)]'
                  }`}
                >
                  {tier.cta}
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
