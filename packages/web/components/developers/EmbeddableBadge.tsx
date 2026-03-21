"use client";

import { useState } from 'react';
import { isAddress } from 'viem';

const BADGE_STYLES = [
  {
    id: 'default',
    name: 'Default',
    description: 'Standard verification badge',
    params: ''
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean, compact design',
    params: '?style=minimal'
  },
  {
    id: 'detailed',
    name: 'Detailed',
    description: 'Shows trust score and status',
    params: '?style=detailed'
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    description: 'Optimized for dark backgrounds',
    params: '?style=dark'
  }
] as const;

const INTEGRATION_TYPES = [
  {
    id: 'html',
    name: 'HTML',
    generateCode: (address: string, style: string) =>
      `<img src="https://sss.repo.box/api/verify/${address}/badge${style}" alt="SSS Verification Badge" />`
  },
  {
    id: 'markdown',
    name: 'Markdown',
    generateCode: (address: string, style: string) =>
      `![SSS Verification Badge](https://sss.repo.box/api/verify/${address}/badge${style})`
  },
  {
    id: 'react',
    name: 'React',
    generateCode: (address: string, style: string) =>
      `<img 
  src="https://sss.repo.box/api/verify/${address}/badge${style}"
  alt="SSS Verification Badge"
  style={{ border: 'none' }}
/>`
  },
  {
    id: 'url',
    name: 'Direct URL',
    generateCode: (address: string, style: string) =>
      `https://sss.repo.box/api/verify/${address}/badge${style}`
  }
] as const;

export default function EmbeddableBadge() {
  const [address, setAddress] = useState('0xf053a15c36f1fbcc2a281095e6f1507ea1efc931');
  const [selectedStyle, setSelectedStyle] = useState('default');
  const [selectedIntegration, setSelectedIntegration] = useState('html');
  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle');

  const selectedStyleData = BADGE_STYLES.find(s => s.id === selectedStyle);
  const selectedIntegrationType = INTEGRATION_TYPES.find(t => t.id === selectedIntegration);

  const badgeUrl = `https://sss.repo.box/api/verify/${address}/badge${selectedStyleData?.params || ''}`;
  const integrationCode = selectedIntegrationType?.generateCode(
    address, 
    selectedStyleData?.params || ''
  ) || '';

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyState('copied');
      setTimeout(() => setCopyState('idle'), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <section id="embeddable-badge" className="scroll-mt-24">
      <h2 className="text-3xl font-bold mb-8">Embeddable Verification Badges</h2>
      
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Configuration */}
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">Configure Your Badge</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Agent Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                />
                {address && !isAddress(address) && (
                  <p className="text-red-500 text-xs mt-1">Please enter a valid Ethereum address</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Badge Style</label>
                <div className="grid grid-cols-2 gap-2">
                  {BADGE_STYLES.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style.id)}
                      className={`p-3 text-left rounded-lg border transition-colors ${
                        selectedStyle === style.id
                          ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="font-medium text-sm">{style.name}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {style.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Integration Type</label>
                <div className="flex flex-wrap gap-2">
                  {INTEGRATION_TYPES.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedIntegration(type.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedIntegration === type.id
                          ? 'bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {type.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview and Code */}
        <div className="space-y-6">
          {/* Badge Preview */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Live Preview</h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
              {isAddress(address) ? (
                <img 
                  src={badgeUrl} 
                  alt="SSS Verification Badge"
                  className="inline-block"
                  style={{ border: 'none' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).nextElementSibling!.textContent = 'Failed to load badge';
                  }}
                />
              ) : (
                <div className="text-gray-500 dark:text-gray-400">
                  Enter a valid address to preview badge
                </div>
              )}
              <div className="text-red-500 text-sm mt-2 hidden">
                Failed to load badge
              </div>
            </div>
          </div>

          {/* Integration Code */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Integration Code</h3>
              <button
                onClick={() => copyToClipboard(integrationCode)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  copyState === 'copied'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {copyState === 'copied' ? 'Copied!' : 'Copy'}
              </button>
            </div>
            
            <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4">
              <pre className="text-sm overflow-x-auto">
                <code>{integrationCode}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Features & Notes */}
      <div className="mt-12 grid md:grid-cols-2 gap-8">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-6">
          <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">
            🚀 Badge Features
          </h4>
          <ul className="text-blue-700 dark:text-blue-300 text-sm space-y-1">
            <li>• Real-time verification status</li>
            <li>• Auto-updates when status changes</li>
            <li>• Responsive SVG format</li>
            <li>• No external dependencies</li>
            <li>• CDN-cached for fast loading</li>
          </ul>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-6">
          <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-3">
            ⚡ Performance Notes
          </h4>
          <ul className="text-amber-700 dark:text-amber-300 text-sm space-y-1">
            <li>• Badges are cached for 5 minutes</li>
            <li>• Rate limit: 120 requests/minute</li>
            <li>• Average response time: &lt;100ms</li>
            <li>• 99.9% uptime SLA (Pro+)</li>
            <li>• Graceful fallbacks for downtime</li>
          </ul>
        </div>
      </div>
    </section>
  );
}