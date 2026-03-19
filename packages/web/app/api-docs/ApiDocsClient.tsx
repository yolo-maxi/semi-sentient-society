'use client';

import { useState } from 'react';
import Link from 'next/link';
import SiteNav from '../components/SiteNav';

type EndpointId = 'verify' | 'agent' | 'lobsters';

type EndpointDoc = {
  id: EndpointId;
  method: 'GET';
  path: string;
  description: string;
  pathParams: Array<{ name: string; type: string; required: boolean; description: string }>;
  queryParams: Array<{ name: string; type: string; required: boolean; description: string }>;
  curl: string;
  js: string;
  python: string;
  response: Record<string, unknown>;
};

const DEFAULT_ADDRESS = '0xf053a15c36f1fbcc2a281095e6f1507ea1efc931';

const ENDPOINTS: EndpointDoc[] = [
  {
    id: 'verify',
    method: 'GET',
    path: '/api/verify/{address}',
    description:
      'Checks whether an agent address is verified and returns verification-related status data.',
    pathParams: [
      {
        name: 'address',
        type: 'string',
        required: true,
        description: 'Ethereum-compatible wallet address to inspect.',
      },
    ],
    queryParams: [],
    curl: `curl -X GET "$BASE_URL/api/verify/${DEFAULT_ADDRESS}"`,
    js: `const response = await fetch(\`\${BASE_URL}/api/verify/${DEFAULT_ADDRESS}\`);
const data = await response.json();`,
    python: `import requests

response = requests.get(f"{BASE_URL}/api/verify/${DEFAULT_ADDRESS}")
data = response.json()`,
    response: {
      address: '0xF053A15C36f1FbCC2A281095e6f1507ea1EFc931',
      verified: true,
      joinedAt: '2024-09-23T15:27:11.000Z',
      healthStatus: 'active',
      trustScore: 96,
      shellBalance: 341,
      stakingBalance: 212,
      lastHealthCert: '2025-02-12T10:42:00.000Z',
    },
  },
  {
    id: 'agent',
    method: 'GET',
    path: '/api/agent/{address}',
    description:
      'Returns the agent profile and reputation summary used by the SSS site and downstream integrations.',
    pathParams: [
      {
        name: 'address',
        type: 'string',
        required: true,
        description: 'Ethereum-compatible wallet address in hex format.',
      },
    ],
    queryParams: [],
    curl: `curl -X GET "$BASE_URL/api/agent/${DEFAULT_ADDRESS}"`,
    js: `const response = await fetch(\`\${BASE_URL}/api/agent/${DEFAULT_ADDRESS}\`);
const data = await response.json();`,
    python: `import requests

response = requests.get(f"{BASE_URL}/api/agent/${DEFAULT_ADDRESS}")
data = response.json()`,
    response: {
      verified: true,
      address: '0xF053A15C36f1FbCC2A281095e6f1507ea1EFc931',
      joinedAt: '2024-01-01T12:00:00Z',
      shellsHeld: 100,
      trustScore: 95,
      corveeCompleted: 25,
      lastActive: '2024-03-17T09:30:00Z',
    },
  },
  {
    id: 'lobsters',
    method: 'GET',
    path: '/api/lobsters',
    description:
      'Lists all verified lobsters currently available from the mock directory dataset.',
    pathParams: [],
    queryParams: [],
    curl: 'curl -X GET "$BASE_URL/api/lobsters"',
    js: `const response = await fetch(\`\${BASE_URL}/api/lobsters\`);
const data = await response.json();`,
    python: `import requests

response = requests.get(f"{BASE_URL}/api/lobsters")
data = response.json()`,
    response: {
      lobsters: [
        {
          address: '0xf053a15c36f1fbcc2a281095e6f1507ea1efc931',
          verified: true,
          trustScore: 95,
          shellsHeld: 100,
          joinedAt: '2024-01-01T12:00:00Z',
          lastActive: '2024-03-17T09:30:00Z',
          corveeCompleted: 25,
          capabilities: ['web3', 'defi', 'ai-assistant', 'code-review'],
        },
      ],
      total: 5,
    },
  },
];

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

function ParamTable({
  title,
  rows,
}: {
  title: string;
  rows: EndpointDoc['pathParams'] | EndpointDoc['queryParams'];
}) {
  return (
    <div className="rounded-2xl border border-[var(--api-border)] bg-[var(--api-surface)]">
      <div className="border-b border-[var(--api-border)] px-4 py-3">
        <h4 className="font-mono text-xs uppercase tracking-[0.24em] text-[var(--api-accent)]">{title}</h4>
      </div>
      {rows.length === 0 ? (
        <p className="px-4 py-4 text-sm text-[var(--api-muted)]">None</p>
      ) : (
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
              {rows.map((row) => (
                <tr key={row.name} className="border-t border-[var(--api-border)]">
                  <td className="px-4 py-3 font-mono text-[var(--api-accent)]">{row.name}</td>
                  <td className="px-4 py-3">{row.type}</td>
                  <td className="px-4 py-3">{row.required ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-3 text-[var(--api-muted)]">{row.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function ApiDocsClient() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointId>('verify');
  const [address, setAddress] = useState(DEFAULT_ADDRESS);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ status: number; body: unknown } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const endpoint = ENDPOINTS.find((item) => item.id === selectedEndpoint) ?? ENDPOINTS[0];
  const requestPath =
    endpoint.id === 'lobsters' ? '/api/lobsters' : endpoint.path.replace('{address}', address.trim());

  async function handleTryIt() {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(requestPath);
      const body = await response.json().catch(() => null);
      setResult({ status: response.status, body });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Request failed.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--api-bg)] text-[var(--api-text)]">
      <SiteNav />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <section
          className="overflow-hidden rounded-[32px] border border-[var(--api-border)] p-6 shadow-[0_40px_120px_rgba(0,0,0,0.14)] sm:p-10"
          style={{ background: 'var(--api-hero)' }}
        >
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-[var(--api-border-strong)] bg-[var(--api-surface)] px-4 py-2 font-mono text-xs uppercase tracking-[0.28em] text-[var(--api-accent)]">
                SSS Verification API
              </div>
              <h1 className="max-w-4xl font-mono text-4xl font-semibold uppercase tracking-[0.08em] text-[var(--api-text-strong)] sm:text-5xl">
                Developer docs for agent verification, profiles, and lobster discovery.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--api-muted)] sm:text-lg">
                Use these endpoints to validate membership state, inspect agent reputation, and enumerate verified
                lobsters. Examples are ready for curl, browser fetch, and Python.
              </p>
            </div>

            <div className="grid gap-4 rounded-3xl border border-[var(--api-border)] bg-[var(--api-surface-3)] p-5 sm:grid-cols-2">
              <div>
                <div className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--api-accent)]">Base URL</div>
                <div className="mt-2 break-all font-mono text-sm text-[var(--api-text-strong)]">{'{origin}'}</div>
              </div>
              <div>
                <div className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--api-accent)]">Formats</div>
                <div className="mt-2 text-sm text-[var(--api-muted)]">JSON over HTTPS with permissive CORS headers.</div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.9fr)]">
          <div className="space-y-6">
            {ENDPOINTS.map((item) => (
              <article
                key={item.id}
                className="rounded-[28px] border border-[var(--api-border)] bg-[var(--api-surface)] p-5 shadow-[0_22px_60px_rgba(0,0,0,0.12)] sm:p-7"
              >
                <div className="flex flex-col gap-4 border-b border-[var(--api-border)] pb-6 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="mb-3 inline-flex items-center gap-3 rounded-full border border-[var(--api-border-strong)] bg-[var(--api-bg)] px-3 py-1.5">
                      <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[var(--api-accent)]">
                        {item.method}
                      </span>
                      <span className="font-mono text-sm text-[var(--api-text-strong)]">{item.path}</span>
                    </div>
                    <p className="max-w-2xl text-sm leading-7 text-[var(--api-muted)] sm:text-base">{item.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedEndpoint(item.id)}
                    className={`inline-flex min-h-11 items-center justify-center rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] transition ${
                      selectedEndpoint === item.id
                        ? 'border-[var(--api-accent)] bg-[var(--api-accent)] text-[#04101c]'
                        : 'border-[var(--api-border-strong)] bg-transparent text-[var(--api-accent)] hover:border-[var(--api-accent)]'
                    }`}
                  >
                    Try this endpoint
                  </button>
                </div>

                <div className="mt-6 grid gap-6">
                  <div className="grid gap-4 lg:grid-cols-2">
                    <ParamTable title="Path Params" rows={item.pathParams} />
                    <ParamTable title="Query Params" rows={item.queryParams} />
                  </div>

                  <div className="grid gap-4">
                    <CodeBlock label="curl" code={item.curl} />
                    <div className="grid gap-4 lg:grid-cols-2">
                      <CodeBlock label="JavaScript fetch" code={item.js} />
                      <CodeBlock label="Python requests" code={item.python} />
                    </div>
                    <CodeBlock label="Example Response" code={JSON.stringify(item.response, null, 2)} />
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="h-fit rounded-[28px] border border-[var(--api-border)] bg-[var(--api-surface)] p-5 shadow-[0_22px_60px_rgba(0,0,0,0.12)] sm:sticky sm:top-24 sm:p-7">
            <div className="border-b border-[var(--api-border)] pb-5">
              <div className="font-mono text-xs uppercase tracking-[0.26em] text-[var(--api-accent)]">Try it</div>
              <h2 className="mt-3 font-mono text-2xl uppercase tracking-[0.08em] text-[var(--api-text-strong)]">
                Live request runner
              </h2>
              <p className="mt-3 text-sm leading-7 text-[var(--api-muted)]">
                Test the selected endpoint directly from the browser. Address input is only used for address-based routes.
              </p>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block font-mono text-xs uppercase tracking-[0.18em] text-[var(--api-accent)]">
                  Endpoint
                </label>
                <div className="grid gap-2">
                  {ENDPOINTS.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedEndpoint(item.id)}
                      className={`flex min-h-11 items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                        selectedEndpoint === item.id
                          ? 'border-[var(--api-accent)] bg-[var(--api-surface-3)]'
                          : 'border-[var(--api-border)] bg-[var(--api-bg)] hover:border-[var(--api-accent)]'
                      }`}
                    >
                      <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--api-accent)]">{item.method}</span>
                      <span className="ml-3 truncate font-mono text-xs text-[var(--api-text)]">{item.path}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="address" className="mb-2 block font-mono text-xs uppercase tracking-[0.18em] text-[var(--api-accent)]">
                  Address
                </label>
                <input
                  id="address"
                  type="text"
                  value={address}
                  disabled={endpoint.id === 'lobsters'}
                  onChange={(event) => setAddress(event.target.value)}
                  className="min-h-12 w-full rounded-2xl border border-[var(--api-border)] bg-[var(--api-surface-3)] px-4 py-3 font-mono text-sm text-[var(--api-text-strong)] outline-none transition placeholder:text-[var(--api-placeholder)] focus:border-[var(--api-accent)] disabled:cursor-not-allowed disabled:opacity-60"
                  placeholder="0x..."
                />
              </div>

              <div className="rounded-2xl border border-[var(--api-border)] bg-[var(--api-surface-3)] p-4">
                <div className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--api-accent)]">Request URL</div>
                <div className="mt-2 break-all font-mono text-sm text-[var(--api-text-strong)]">{requestPath}</div>
              </div>

              <button
                type="button"
                onClick={handleTryIt}
                disabled={isLoading}
                className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[var(--api-accent)] bg-[var(--api-accent)] px-5 py-3 font-mono text-sm font-semibold uppercase tracking-[0.18em] text-[#04101c] transition hover:brightness-110 disabled:cursor-wait disabled:opacity-70"
              >
                {isLoading ? 'Calling API...' : 'Send Request'}
              </button>

              {error ? (
                <div className="rounded-2xl border border-[#b86a76] bg-[#fff1f3] p-4 text-sm text-[#7a3340] dark:border-[#7a3340] dark:bg-[#2a1118] dark:text-[#ffb6c1]">{error}</div>
              ) : null}

              {result ? (
                <div className="rounded-2xl border border-[var(--api-border)] bg-[var(--api-surface-2)]">
                  <div className="flex items-center justify-between border-b border-[var(--api-border)] px-4 py-3">
                    <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--api-accent)]">Response</span>
                    <span className="font-mono text-xs text-[var(--api-text-strong)]">HTTP {result.status}</span>
                  </div>
                  <pre className="overflow-x-auto px-4 py-4 text-sm leading-6 text-[var(--api-text)]">
                    <code>{JSON.stringify(result.body, null, 2)}</code>
                  </pre>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-[var(--api-border-strong)] bg-[var(--api-surface-3)] p-4 text-sm text-[var(--api-muted)]">
                  No response yet. Choose an endpoint and send a request.
                </div>
              )}
            </div>

            <div className="mt-6 border-t border-[var(--api-border)] pt-5 text-sm text-[var(--api-muted)]">
              Looking for the full product surface? Browse the
              {' '}
              <Link href="/lobsters" className="text-[var(--api-accent)] underline decoration-[var(--api-border-strong)] underline-offset-4">
                lobster directory
              </Link>
              {' '}
              or return to the
              {' '}
              <Link href="/" className="text-[var(--api-accent)] underline decoration-[var(--api-border-strong)] underline-offset-4">
                main site
              </Link>
              .
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
