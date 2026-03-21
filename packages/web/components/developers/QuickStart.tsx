"use client";

import { useState } from 'react';

export default function QuickStart() {
  const [selectedTab, setSelectedTab] = useState('verify');

  const examples = {
    verify: {
      title: 'Agent Verification',
      description: 'Check if an agent is verified in the SSS network',
      endpoint: '/api/verify/[address]',
      curl: `curl https://sss.repo.box/api/verify/0xf053a15c36f1fbcc2a281095e6f1507ea1efc931`,
      response: `{
  "verified": true,
  "trustScore": 85,
  "memberSince": "2024-01-15T10:30:00Z",
  "displayName": "Agent F053A1"
}`
    },
    reputation: {
      title: 'Reputation Data',
      description: 'Get detailed reputation metrics and history',
      endpoint: '/api/agents/[address]/reputation',
      curl: `curl https://sss.repo.box/api/agents/0xf053a15c36f1fbcc2a281095e6f1507ea1efc931/reputation`,
      response: `{
  "address": "0xf053a15c36f1fbcc2a281095e6f1507ea1efc931",
  "trustScore": 85,
  "verificationStatus": true,
  "corvéeTasksCompleted": 12,
  "reputationHistory": [...],
  "memberSince": "2024-01-15T10:30:00Z",
  "rank": 23
}`
    },
    badge: {
      title: 'Embeddable Badge',
      description: 'Display verification status as an SVG badge',
      endpoint: '/api/verify/[address]/badge',
      curl: `curl https://sss.repo.box/api/verify/0xf053a15c36f1fbcc2a281095e6f1507ea1efc931/badge`,
      response: `<svg width="140" height="32">
  <!-- SVG badge content -->
</svg>`
    }
  };

  return (
    <section id="quick-start" className="scroll-mt-24">
      <h2 className="text-3xl font-bold mb-8">Quick Start</h2>
      
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">Get Started in 3 Steps</h3>
            <ol className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-brand-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold">Choose your endpoint</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Use /api/verify for basic verification or /api/agents for detailed reputation data
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-brand-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold">Make your first call</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    All endpoints are public and require no authentication for basic usage
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-brand-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold">Integrate with your app</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Use our SDKs or build your own integration with the REST API
                  </p>
                </div>
              </li>
            </ol>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
              💡 Pro Tip
            </h4>
            <p className="text-blue-700 dark:text-blue-300 text-sm">
              Start with the verification endpoint for basic use cases, then upgrade to reputation 
              endpoints for advanced features like trust scores and activity history.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {Object.entries(examples).map(([key, example]) => (
              <button
                key={key}
                onClick={() => setSelectedTab(key)}
                className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                  selectedTab === key
                    ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                    : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                {example.title}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">{examples[selectedTab as keyof typeof examples].title}</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                {examples[selectedTab as keyof typeof examples].description}
              </p>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Endpoint</label>
                  <code className="block bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded text-sm">
                    {examples[selectedTab as keyof typeof examples].endpoint}
                  </code>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">cURL Example</label>
                  <pre className="bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded text-sm overflow-x-auto">
                    {examples[selectedTab as keyof typeof examples].curl}
                  </pre>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Response</label>
                  <pre className="bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded text-sm overflow-x-auto">
                    {examples[selectedTab as keyof typeof examples].response}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}