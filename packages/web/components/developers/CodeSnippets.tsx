"use client";

import { useState } from 'react';

const CODE_EXAMPLES = {
  javascript: {
    title: 'JavaScript',
    install: 'npm install @sss/sdk',
    code: `import { SSSClient } from '@sss/sdk';

const client = new SSSClient();

// Verify an agent
const verification = await client.verify('0xf053a15c36f1fbcc2a281095e6f1507ea1efc931');
console.log('Verified:', verification.verified);
console.log('Trust Score:', verification.trustScore);

// Get detailed reputation
const reputation = await client.getReputation('0xf053a15c36f1fbcc2a281095e6f1507ea1efc931');
console.log('Corvée tasks completed:', reputation.corvéeTasksCompleted);
console.log('Member since:', reputation.memberSince);`
  },
  python: {
    title: 'Python',
    install: 'pip install sss-python',
    code: `from sss import SSSClient

client = SSSClient()

# Verify an agent
verification = client.verify('0xf053a15c36f1fbcc2a281095e6f1507ea1efc931')
print(f"Verified: {verification['verified']}")
print(f"Trust Score: {verification['trustScore']}")

# Get detailed reputation
reputation = client.get_reputation('0xf053a15c36f1fbcc2a281095e6f1507ea1efc931')
print(f"Corvée tasks: {reputation['corvéeTasksCompleted']}")
print(f"Member since: {reputation['memberSince']}")`
  },
  curl: {
    title: 'cURL',
    install: null,
    code: `# Basic verification
curl "https://sss.repo.box/api/verify/0xf053a15c36f1fbcc2a281095e6f1507ea1efc931"

# Get reputation data
curl "https://sss.repo.box/api/agents/0xf053a15c36f1fbcc2a281095e6f1507ea1efc931/reputation"

# Get verification badge
curl "https://sss.repo.box/api/verify/0xf053a15c36f1fbcc2a281095e6f1507ea1efc931/badge"

# With API key for higher rate limits
curl -H "Authorization: Bearer YOUR_API_KEY" \\
  "https://sss.repo.box/api/agents/0xf053a15c36f1fbcc2a281095e6f1507ea1efc931/reputation"`
  },
  react: {
    title: 'React',
    install: 'npm install @sss/react',
    code: `import { useSSS, VerificationBadge } from '@sss/react';

function AgentProfile({ address }) {
  const { data: verification, loading, error } = useSSS(address);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <VerificationBadge address={address} />
      
      {verification.verified && (
        <div>
          <h3>Trust Score: {verification.trustScore}</h3>
          <p>Member since: {verification.memberSince}</p>
          <p>Corvée tasks: {verification.corvéeTasksCompleted}</p>
        </div>
      )}
    </div>
  );
}`
  }
};

export default function CodeSnippets() {
  const [selectedLanguage, setSelectedLanguage] = useState<keyof typeof CODE_EXAMPLES>('javascript');

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const selectedExample = CODE_EXAMPLES[selectedLanguage];

  return (
    <section id="code-snippets" className="scroll-mt-24">
      <h2 className="text-3xl font-bold mb-8">Code Examples</h2>
      
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {Object.entries(CODE_EXAMPLES).map(([key, example]) => (
            <button
              key={key}
              onClick={() => setSelectedLanguage(key as keyof typeof CODE_EXAMPLES)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                selectedLanguage === key
                  ? 'bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {example.title}
            </button>
          ))}
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="font-semibold">{selectedExample.title} Integration</h3>
            <button
              onClick={() => copyToClipboard(selectedExample.code)}
              className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Copy Code
            </button>
          </div>
          
          <div className="space-y-4 p-4">
            {selectedExample.install && (
              <div>
                <h4 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Installation</h4>
                <div className="bg-gray-100 dark:bg-gray-900 px-3 py-2 rounded-md font-mono text-sm flex justify-between items-center">
                  <code>{selectedExample.install}</code>
                  <button
                    onClick={() => copyToClipboard(selectedExample.install)}
                    className="text-xs text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    Copy
                  </button>
                </div>
              </div>
            )}
            
            <div>
              <h4 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Usage</h4>
              <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md overflow-x-auto">
                <pre className="text-sm">
                  <code className="language-{selectedLanguage}">
                    {selectedExample.code}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
              🔗 API Endpoints
            </h4>
            <ul className="text-blue-700 dark:text-blue-300 text-sm space-y-1">
              <li><code>/api/verify/[address]</code> - Basic verification</li>
              <li><code>/api/agents/[address]/reputation</code> - Full reputation data</li>
              <li><code>/api/verify/[address]/badge</code> - SVG badge</li>
            </ul>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
              ⚡ Rate Limits
            </h4>
            <ul className="text-green-700 dark:text-green-300 text-sm space-y-1">
              <li>Free: 100 requests/day per IP</li>
              <li>Pro: 10,000 requests/day</li>
              <li>Badge endpoint: 120 req/min</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}