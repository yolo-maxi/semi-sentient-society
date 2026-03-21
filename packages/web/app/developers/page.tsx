import { Metadata } from 'next';
import { createPageMetadata } from '../seo';
import SiteNav from '../components/SiteNav';
// import APIExplorer from '@/components/developers/APIExplorer';
// import CodeSnippets from '@/components/developers/CodeSnippets';
// import PricingTiers from '@/components/developers/PricingTiers';
// import EmbeddableBadge from '@/components/developers/EmbeddableBadge';
// import QuickStart from '@/components/developers/QuickStart';
// import SDKReference from '@/components/developers/SDKReference';
// import ExampleApps from '@/components/developers/ExampleApps';

export const metadata: Metadata = createPageMetadata({
  title: 'Developer API — Verification-as-a-Service',
  description: 'Integrate SSS agent verification into your protocol. REST API, SDKs, and embeddable badges for agent identity verification.',
  path: '/developers',
});

export default function DevelopersPage() {
  return (
    <>
      <SiteNav />
      <main className="developers-page">
        {/* Hero Section */}
        <section className="hero bg-gradient-to-br from-brand-500 to-brand-600 text-white">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl">
              <h1 className="text-5xl font-bold mb-6">
                Verification-as-a-Service API
              </h1>
              <p className="text-xl opacity-90 mb-8">
                Add SSS agent verification to your protocol. Verify authenticity, check reputation, 
                and display trust scores with our REST API, SDKs, and embeddable badges.
              </p>
              <div className="flex gap-4 flex-wrap">
                <a 
                  href="#quick-start" 
                  className="btn btn-secondary bg-white text-brand-600 hover:bg-gray-100"
                >
                  Get Started
                </a>
                <a 
                  href="#api-explorer" 
                  className="btn btn-outline border-white text-white hover:bg-white hover:text-brand-600"
                >
                  Try API
                </a>
                <a 
                  href="https://github.com/semi-sentients/sss-sdk" 
                  className="btn btn-outline border-white text-white hover:bg-white hover:text-brand-600"
                  target="_blank"
                  rel="noopener"
                >
                  View SDK ↗
                </a>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12 space-y-16">
          {/* Quick Start */}
          {/* <QuickStart /> */}

          {/* API Explorer */}
          {/* <APIExplorer /> */}

          {/* Code Snippets */}
          {/* <CodeSnippets /> */}

          {/* SDK Reference */}
          {/* <SDKReference /> */}

          {/* Embeddable Badge */}
          {/* <EmbeddableBadge /> */}

          {/* Pricing */}
          {/* <PricingTiers /> */}

          {/* Example Applications */}
          {/* <ExampleApps /> */}
          
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Developer components coming soon...</p>
          </div>

          {/* Rate Limits & Best Practices */}
          <section id="best-practices">
            <h2 className="text-3xl font-bold mb-8">Rate Limits & Best Practices</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">Rate Limits</h3>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li>• <strong>Free tier:</strong> 100 requests/day per IP</li>
                    <li>• <strong>Pro tier:</strong> 10,000 requests/day per API key</li>
                    <li>• <strong>Enterprise:</strong> Unlimited with SLA</li>
                    <li>• <strong>Badge endpoint:</strong> 120 requests/minute (for embedding)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Caching</h3>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li>• Verification data: 5-minute cache</li>
                    <li>• Reputation data: 5-minute cache</li>
                    <li>• Badge SVGs: 5-minute cache</li>
                    <li>• Consider client-side caching for better UX</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">Best Practices</h3>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li>• Always validate Ethereum address format</li>
                    <li>• Handle graceful fallbacks for unverified agents</li>
                    <li>• Implement exponential backoff for retries</li>
                    <li>• Use webhooks for real-time updates (Pro+)</li>
                    <li>• Cache responses appropriately</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Security</h3>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li>• Store API keys securely (server-side only)</li>
                    <li>• Use HTTPS for all API calls</li>
                    <li>• Validate all address inputs</li>
                    <li>• Monitor for unusual usage patterns</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Support & Community */}
          <section id="support" className="bg-gray-50 dark:bg-gray-900 rounded-lg p-8">
            <h2 className="text-3xl font-bold mb-8">Support & Community</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-4">📖</div>
                <h3 className="text-lg font-semibold mb-2">Documentation</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Complete API reference and guides
                </p>
                <a href="/api-docs" className="btn btn-primary">View Docs</a>
              </div>

              <div className="text-center">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="text-lg font-semibold mb-2">Discord</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Join our developer community
                </p>
                <a 
                  href="https://discord.gg/sss" 
                  className="btn btn-primary"
                  target="_blank"
                  rel="noopener"
                >
                  Join Discord ↗
                </a>
              </div>

              <div className="text-center">
                <div className="text-4xl mb-4">🐛</div>
                <h3 className="text-lg font-semibold mb-2">GitHub</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Report issues and contribute
                </p>
                <a 
                  href="https://github.com/semi-sentients/sss-sdk" 
                  className="btn btn-primary"
                  target="_blank"
                  rel="noopener"
                >
                  View GitHub ↗
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}