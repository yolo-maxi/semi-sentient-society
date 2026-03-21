"use client";

import { useState } from 'react';
import { isAddress } from 'viem';

const BADGE_STYLES = [
  {
    id: 'default',
    name: 'Default',
    description: 'Standard verification badge',
    params: '',
  },
  {
    id: 'compact',
    name: 'Compact',
    description: 'Smaller badge for tight spaces',
    params: '?style=compact',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Text-only verification status',
    params: '?style=minimal',
  },
];

const INTEGRATION_METHODS = {
  html: {
    name: 'HTML',
    icon: '🌐',
    generate: (address: string, style: string) => 
      `<img src="https://sss.repo.box/api/verify/${address}/badge${style}" alt="SSS Verification Badge" />`,
  },
  markdown: {
    name: 'Markdown',
    icon: '📝',
    generate: (address: string, style: string) =>
      `![SSS Verification Badge](https://sss.repo.box/api/verify/${address}/badge${style})`,
  },
  react: {
    name: 'React/JSX',
    icon: '⚛️',
    generate: (address: string, style: string) =>
      `<img 
  src="https://sss.repo.box/api/verify/${address}/badge${style}"
  alt="SSS Verification Badge"
  style={{ verticalAlign: 'middle' }}
/>`,
  },
  vue: {
    name: 'Vue',
    icon: '🟢',
    generate: (address: string, style: string) =>
      `<img 
  :src="'https://sss.repo.box/api/verify/${address}/badge${style}'"
  alt="SSS Verification Badge"
  style="vertical-align: middle;"
/>`,
  },
};

export default function EmbeddableBadge() {
  const [address, setAddress] = useState('0xf053a15c36f1fbcc2a281095e6f1507ea1efc931');
  const [selectedStyle, setSelectedStyle] = useState('default');
  const [selectedMethod, setSelectedMethod] = useState('html');

  const selectedStyleData = BADGE_STYLES.find(s => s.id === selectedStyle) || BADGE_STYLES[0];
  const selectedMethodData = INTEGRATION_METHODS[selectedMethod as keyof typeof INTEGRATION_METHODS];
  
  const badgeUrl = `https://sss.repo.box/api/verify/${address}/badge${selectedStyleData.params}`;
  const integrationCode = selectedMethodData.generate(address, selectedStyleData.params);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <section id="embeddable-badge" className="scroll-mt-24">
      <h2 className="text-3xl font-bold mb-8">Embeddable Verification Badges</h2>
      
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Configuration Panel */}
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">Badge Configuration</h3>
            
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
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Badge Style</label>
                <div className="grid grid-cols-1 gap-2">
                  {BADGE_STYLES.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style.id)}
                      className={`p-3 text-left border rounded-lg transition-colors ${
                        selectedStyle === style.id
                          ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className="font-medium">{style.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {style.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Integration Method</label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(INTEGRATION_METHODS).map(([key, method]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedMethod(key)}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                        selectedMethod === key
                          ? 'bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300'
                          : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <span>{method.icon}</span>
                      {method.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Integration Code */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Integration Code</label>
              <button
                onClick={() => copyToClipboard(integrationCode)}
                className="text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
              >
                Copy
              </button>
            </div>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm overflow-x-auto">
              {integrationCode}
            </pre>
          </div>

          {/* Direct URL */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Direct URL</label>
              <button
                onClick={() => copyToClipboard(badgeUrl)}
                className="text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
              >
                Copy
              </button>
            </div>
            <code className="block bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm break-all">
              {badgeUrl}
            </code>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">Live Preview</h3>
            
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800">
              {isAddress(address) ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Rendered Badge
                    </h4>
                    <div className="flex items-center gap-4">
                      <img 
                        src={badgeUrl} 
                        alt="SSS Verification Badge"
                        className="max-w-full h-auto"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextSibling?.textContent && (target.nextSibling.textContent = 'Error loading badge');
                        }}
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400 hidden">
                        Error loading badge
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 space-y-1">
                    <p>• Automatically updates when verification status changes</p>
                    <p>• Cached for 5 minutes for optimal performance</p>
                    <p>• Responsive SVG format scales to any size</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">🔍</div>
                  <p>Enter a valid Ethereum address to see the badge preview</p>
                </div>
              )}
            </div>
          </div>

          {/* Usage Examples */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Usage Examples</h3>
            
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">In GitHub README.md</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Show your agent's verification status in your project README:
                </p>
                <code className="text-xs bg-white dark:bg-gray-800 p-2 rounded block">
                  [![SSS Verified](https://sss.repo.box/api/verify/YOUR_ADDRESS/badge)](https://sss.repo.box)
                </code>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">In Agent Profiles</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Display verification status in user profiles or agent directories:
                </p>
                <code className="text-xs bg-white dark:bg-gray-800 p-2 rounded block">
                  &lt;div className="agent-profile"&gt;<br/>
                  &nbsp;&nbsp;&lt;h3&gt;Agent Name&lt;/h3&gt;<br/>
                  &nbsp;&nbsp;&lt;img src="..." alt="SSS Badge" /&gt;<br/>
                  &lt;/div&gt;
                </code>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">In Documentation</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Add verification badges to API docs or user guides:
                </p>
                <code className="text-xs bg-white dark:bg-gray-800 p-2 rounded block">
                  ## Verified Agents<br/>
                  ![Badge](https://sss.repo.box/api/verify/ADDRESS/badge?style=compact)
                </code>
              </div>
            </div>
          </div>

          {/* Customization Options */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
              🎨 Custom Badges
            </h4>
            <p className="text-yellow-700 dark:text-yellow-300 text-sm">
              Need custom badge styles or colors? Enterprise plans include custom badge design 
              and API endpoints. Contact our team for more information.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}