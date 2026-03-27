"use client";

import { useState } from 'react';
import { isAddress } from 'viem';

const SAMPLE_ADDRESSES = [
  '0xf053a15c36f1fbcc2a281095e6f1507ea1efc931',
  '0x1234567890abcdef1234567890abcdef12345678',
  '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
];

const ENDPOINTS = [
  {
    id: 'verify',
    name: 'Agent Verification',
    path: '/api/verify/[address]',
    description: 'Check if an agent is verified and get basic trust metrics',
  },
  {
    id: 'reputation',
    name: 'Reputation Details',
    path: '/api/agents/[address]/reputation',
    description: 'Get detailed reputation data including history and ranking',
  },
  {
    id: 'badge',
    name: 'Verification Badge',
    path: '/api/verify/[address]/badge',
    description: 'Get an embeddable SVG badge showing verification status',
    responseType: 'svg',
  },
] as const;

export default function APIExplorer() {
  const [selectedEndpoint, setSelectedEndpoint] = useState('verify');
  const [address, setAddress] = useState(SAMPLE_ADDRESSES[0]);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTryAPI = async () => {
    if (!isAddress(address)) {
      setError('Please enter a valid Ethereum address');
      return;
    }

    setLoading(true);
    setError('');
    setResponse('');

    try {
      const endpoint = ENDPOINTS.find(e => e.id === selectedEndpoint);
      if (!endpoint) throw new Error('Invalid endpoint');

      const url = `https://sss.repo.box${endpoint.path.replace('[address]', address)}`;
      
      const res = await fetch(url);
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      if (endpoint.responseType === 'svg') {
        const svgText = await res.text();
        setResponse(svgText);
      } else {
        const data = await res.json();
        setResponse(JSON.stringify(data, null, 2));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const selectedEndpointData = ENDPOINTS.find(e => e.id === selectedEndpoint);

  return (
    <section id="api-explorer" className="scroll-mt-24">
      <h2 className="text-3xl font-bold mb-8">Interactive API Explorer</h2>
      
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="bg-gray-50 dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4">Test our API in real-time</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Select Endpoint</label>
              <select
                value={selectedEndpoint}
                onChange={(e) => setSelectedEndpoint(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {ENDPOINTS.map((endpoint) => (
                  <option key={endpoint.id} value={endpoint.id}>
                    {endpoint.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Agent Address</label>
              <div className="relative">
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-3 py-2 pr-20 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                />
                <div className="absolute right-1 top-1">
                  <select
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="px-2 py-1 text-xs border-0 bg-transparent text-gray-600 dark:text-gray-400"
                  >
                    <option value="">Sample...</option>
                    {SAMPLE_ADDRESSES.map((addr) => (
                      <option key={addr} value={addr}>
                        {addr.slice(0, 6)}...{addr.slice(-4)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {selectedEndpointData && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {selectedEndpointData.description}
              </p>
              <code className="text-sm bg-white dark:bg-gray-900 px-2 py-1 rounded border">
                GET {selectedEndpointData.path.replace('[address]', address || '[address]')}
              </code>
            </div>
          )}

          <div className="mt-4 flex gap-2">
            <button
              onClick={handleTryAPI}
              disabled={loading || !address}
              className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Try API'}
            </button>
            
            {error && (
              <div className="px-3 py-2 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded text-sm">
                {error}
              </div>
            )}
          </div>
        </div>

        <div className="p-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-semibold">Response</h4>
            {response && (
              <button
                onClick={() => navigator.clipboard.writeText(response)}
                className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Copy
              </button>
            )}
          </div>
          
          {loading && (
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center">
              <div className="animate-spin inline-block w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full"></div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
          )}

          {response && !loading && (
            <div className="space-y-3">
              {selectedEndpointData?.responseType === 'svg' ? (
                <div className="space-y-3">
                  <div className="bg-white dark:bg-gray-900 p-4 rounded border">
                    <h5 className="text-sm font-medium mb-2">Rendered Badge</h5>
                    <div dangerouslySetInnerHTML={{ __html: response }} />
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium mb-2">SVG Source</h5>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm overflow-x-auto">
                      {response}
                    </pre>
                  </div>
                </div>
              ) : (
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm overflow-x-auto">
                  {response}
                </pre>
              )}
            </div>
          )}

          {!response && !loading && !error && (
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Enter an address and click &quot;Try API&quot; to see the response
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}