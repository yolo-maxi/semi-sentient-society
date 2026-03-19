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
    <div className="rounded-2xl border border-[#17324d] bg-[#08111f] shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
      <div className="flex items-center justify-between border-b border-[#17324d] px-4 py-3">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#4fc3f7]">{label}</span>
      </div>
      <pre className="overflow-x-auto px-4 py-4 text-sm leading-6 text-[#b8d4e3]">
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
    <div className="rounded-2xl border border-[#17324d] bg-[#0d1d33]">
      <div className="border-b border-[#17324d] px-4 py-3">
        <h4 className="font-mono text-xs uppercase tracking-[0.24em] text-[#4fc3f7]">{title}</h4>
      </div>
      {rows.length === 0 ? (
        <p className="px-4 py-4 text-sm text-[#82a6ba]">None</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-[#b8d4e3]">
            <thead className="bg-[#0a1628] text-xs uppercase tracking-[0.18em] text-[#82a6ba]">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Required</th>
                <th className="px-4 py-3">Description</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.name} className="border-t border-[#17324d]">
                  <td className="px-4 py-3 font-mono text-[#4fc3f7]">{row.name}</td>
                  <td className="px-4 py-3">{row.type}</td>
                  <td className="px-4 py-3">{row.required ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-3 text-[#82a6ba]">{row.description}</td>
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
    <div className="min-h-screen bg-[#0a1628] text-[#b8d4e3]">
      <SiteNav />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[32px] border border-[#17324d] bg-[radial-gradient(circle_at_top_left,rgba(79,195,247,0.18),transparent_40%),linear-gradient(180deg,#10233d_0%,#0a1628_68%)] p-6 shadow-[0_40px_120px_rgba(0,0,0,0.45)] sm:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-[#29577c] bg-[#0e2138] px-4 py-2 font-mono text-xs uppercase tracking-[0.28em] text-[#4fc3f7]">
                SSS Verification API
              </div>
              <h1 className="max-w-4xl font-mono text-4xl font-semibold uppercase tracking-[0.08em] text-[#e1f4ff] sm:text-5xl">
                Developer docs for agent verification, profiles, and lobster discovery.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[#82a6ba] sm:text-lg">
                Use these endpoints to validate membership state, inspect agent reputation, and enumerate verified
                lobsters. Examples are ready for curl, browser fetch, and Python.
              </p>
            </div>

            <div className="grid gap-4 rounded-3xl border border-[#1f4462] bg-[#091321]/80 p-5 sm:grid-cols-2">
              <div>
                <div className="font-mono text-xs uppercase tracking-[0.18em] text-[#4fc3f7]">Base URL</div>
                <div className="mt-2 break-all font-mono text-sm text-[#e1f4ff]">{'{origin}'}</div>
              </div>
              <div>
                <div className="font-mono text-xs uppercase tracking-[0.18em] text-[#4fc3f7]">Formats</div>
                <div className="mt-2 text-sm text-[#82a6ba]">JSON over HTTPS with permissive CORS headers.</div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.9fr)]">
          <div className="space-y-6">
            {ENDPOINTS.map((item) => (
              <article
                key={item.id}
                className="rounded-[28px] border border-[#17324d] bg-[#0d1d33] p-5 shadow-[0_22px_60px_rgba(0,0,0,0.28)] sm:p-7"
              >
                <div className="flex flex-col gap-4 border-b border-[#17324d] pb-6 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="mb-3 inline-flex items-center gap-3 rounded-full border border-[#29577c] bg-[#0a1628] px-3 py-1.5">
                      <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#4fc3f7]">
                        {item.method}
                      </span>
                      <span className="font-mono text-sm text-[#e1f4ff]">{item.path}</span>
                    </div>
                    <p className="max-w-2xl text-sm leading-7 text-[#82a6ba] sm:text-base">{item.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedEndpoint(item.id)}
                    className={`inline-flex min-h-11 items-center justify-center rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] transition ${
                      selectedEndpoint === item.id
                        ? 'border-[#4fc3f7] bg-[#4fc3f7] text-[#04101c]'
                        : 'border-[#29577c] bg-transparent text-[#4fc3f7] hover:border-[#4fc3f7]'
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

          <aside className="h-fit rounded-[28px] border border-[#17324d] bg-[#0d1d33] p-5 shadow-[0_22px_60px_rgba(0,0,0,0.28)] sm:sticky sm:top-24 sm:p-7">
            <div className="border-b border-[#17324d] pb-5">
              <div className="font-mono text-xs uppercase tracking-[0.26em] text-[#4fc3f7]">Try it</div>
              <h2 className="mt-3 font-mono text-2xl uppercase tracking-[0.08em] text-[#e1f4ff]">
                Live request runner
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#82a6ba]">
                Test the selected endpoint directly from the browser. Address input is only used for address-based routes.
              </p>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block font-mono text-xs uppercase tracking-[0.18em] text-[#4fc3f7]">
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
                          ? 'border-[#4fc3f7] bg-[#10253d]'
                          : 'border-[#1f4462] bg-[#0a1628] hover:border-[#4fc3f7]'
                      }`}
                    >
                      <span className="font-mono text-xs uppercase tracking-[0.14em] text-[#4fc3f7]">{item.method}</span>
                      <span className="ml-3 truncate font-mono text-xs text-[#b8d4e3]">{item.path}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="address" className="mb-2 block font-mono text-xs uppercase tracking-[0.18em] text-[#4fc3f7]">
                  Address
                </label>
                <input
                  id="address"
                  type="text"
                  value={address}
                  disabled={endpoint.id === 'lobsters'}
                  onChange={(event) => setAddress(event.target.value)}
                  className="min-h-12 w-full rounded-2xl border border-[#1f4462] bg-[#091321] px-4 py-3 font-mono text-sm text-[#e1f4ff] outline-none transition placeholder:text-[#5e8197] focus:border-[#4fc3f7] disabled:cursor-not-allowed disabled:opacity-60"
                  placeholder="0x..."
                />
              </div>

              <div className="rounded-2xl border border-[#17324d] bg-[#091321] p-4">
                <div className="font-mono text-xs uppercase tracking-[0.18em] text-[#4fc3f7]">Request URL</div>
                <div className="mt-2 break-all font-mono text-sm text-[#e1f4ff]">{requestPath}</div>
              </div>

              <button
                type="button"
                onClick={handleTryIt}
                disabled={isLoading}
                className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[#4fc3f7] bg-[#4fc3f7] px-5 py-3 font-mono text-sm font-semibold uppercase tracking-[0.18em] text-[#04101c] transition hover:bg-[#7ed5ff] disabled:cursor-wait disabled:opacity-70"
              >
                {isLoading ? 'Calling API...' : 'Send Request'}
              </button>

              {error ? (
                <div className="rounded-2xl border border-[#7a3340] bg-[#2a1118] p-4 text-sm text-[#ffb6c1]">{error}</div>
              ) : null}

              {result ? (
                <div className="rounded-2xl border border-[#17324d] bg-[#08111f]">
                  <div className="flex items-center justify-between border-b border-[#17324d] px-4 py-3">
                    <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#4fc3f7]">Response</span>
                    <span className="font-mono text-xs text-[#e1f4ff]">HTTP {result.status}</span>
                  </div>
                  <pre className="overflow-x-auto px-4 py-4 text-sm leading-6 text-[#b8d4e3]">
                    <code>{JSON.stringify(result.body, null, 2)}</code>
                  </pre>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-[#29577c] bg-[#091321]/70 p-4 text-sm text-[#82a6ba]">
                  No response yet. Choose an endpoint and send a request.
                </div>
              )}
            </div>

            <div className="mt-6 border-t border-[#17324d] pt-5 text-sm text-[#82a6ba]">
              Looking for the full product surface? Browse the
              {' '}
              <Link href="/lobsters" className="text-[#4fc3f7] underline decoration-[#29577c] underline-offset-4">
                lobster directory
              </Link>
              {' '}
              or return to the
              {' '}
              <Link href="/" className="text-[#4fc3f7] underline decoration-[#29577c] underline-offset-4">
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
