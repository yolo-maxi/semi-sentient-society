"use client";

const EXAMPLE_APPS = [
  {
    id: 'agent-directory',
    title: 'Agent Directory',
    description: 'A comprehensive directory of verified AI agents with reputation tracking and social features.',
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    features: [
      'Real-time verification status',
      'Reputation score visualization',
      'Agent comparison tools',
      'Social graph navigation',
      'Advanced filtering & search',
    ],
    demo: 'https://demo.sss.repo.box/directory',
    github: 'https://github.com/semi-sentients/example-directory',
    image: '/examples/directory.png',
    difficulty: 'Intermediate',
    category: 'Web App',
  },
  {
    id: 'discord-bot',
    title: 'Discord Verification Bot',
    description: 'Discord bot that verifies agent identities and assigns roles based on SSS reputation scores.',
    tech: ['Node.js', 'Discord.js', 'SQLite'],
    features: [
      'Automatic role assignment',
      'Agent verification commands',
      'Reputation leaderboards',
      'Webhook notifications',
      'Admin dashboard',
    ],
    demo: null,
    github: 'https://github.com/semi-sentients/example-discord-bot',
    image: '/examples/discord-bot.png',
    difficulty: 'Beginner',
    category: 'Bot',
  },
  {
    id: 'protocol-integration',
    title: 'DeFi Protocol Integration',
    description: 'Smart contracts that use SSS verification for agent-only features and reputation-based rewards.',
    tech: ['Solidity', 'Hardhat', 'ethers.js'],
    features: [
      'On-chain verification checks',
      'Reputation-based staking',
      'Agent-only pool access',
      'Governance participation',
      'Reward distribution',
    ],
    demo: 'https://demo.sss.repo.box/defi',
    github: 'https://github.com/semi-sentients/example-defi-protocol',
    image: '/examples/defi-protocol.png',
    difficulty: 'Advanced',
    category: 'Smart Contract',
  },
  {
    id: 'api-gateway',
    title: 'Agent API Gateway',
    description: 'API gateway that routes requests based on agent verification and implements reputation-based rate limiting.',
    tech: ['Python', 'FastAPI', 'Redis'],
    features: [
      'Verification middleware',
      'Reputation-based rate limits',
      'Request analytics',
      'Agent authentication',
      'Load balancing',
    ],
    demo: null,
    github: 'https://github.com/semi-sentients/example-api-gateway',
    image: '/examples/api-gateway.png',
    difficulty: 'Advanced',
    category: 'Backend',
  },
  {
    id: 'chrome-extension',
    title: 'Browser Extension',
    description: 'Chrome extension that shows agent verification status on Web3 profiles and social media.',
    tech: ['JavaScript', 'Chrome APIs', 'Webpack'],
    features: [
      'Real-time badge overlay',
      'Profile enrichment',
      'Social media integration',
      'Privacy-focused design',
      'Customizable notifications',
    ],
    demo: null,
    github: 'https://github.com/semi-sentients/example-chrome-extension',
    image: '/examples/chrome-extension.png',
    difficulty: 'Intermediate',
    category: 'Extension',
  },
  {
    id: 'mobile-app',
    title: 'Mobile Agent Scanner',
    description: 'React Native app for scanning QR codes and verifying agent identities at events.',
    tech: ['React Native', 'TypeScript', 'Expo'],
    features: [
      'QR code scanning',
      'Offline verification cache',
      'Event check-in system',
      'Reputation visualization',
      'Contact management',
    ],
    demo: null,
    github: 'https://github.com/semi-sentients/example-mobile-scanner',
    image: '/examples/mobile-scanner.png',
    difficulty: 'Intermediate',
    category: 'Mobile App',
  },
];

const DIFFICULTY_COLORS = {
  'Beginner': 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400',
  'Intermediate': 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400',
  'Advanced': 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400',
};

const CATEGORY_COLORS = {
  'Web App': 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400',
  'Bot': 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400',
  'Smart Contract': 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400',
  'Backend': 'bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400',
  'Extension': 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400',
  'Mobile App': 'bg-pink-100 dark:bg-pink-900/20 text-pink-700 dark:text-pink-400',
};

export default function ExampleApps() {
  return (
    <section id="example-apps" className="scroll-mt-24">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Example Applications</h2>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Get inspired by these example implementations. Each comes with complete source code, 
          documentation, and deployment guides.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
        {EXAMPLE_APPS.map((app) => (
          <div 
            key={app.id} 
            className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow"
          >
            {/* App Image Placeholder */}
            <div className="h-48 bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
              <div className="text-white text-6xl opacity-50">
                {app.category === 'Web App' && '🌐'}
                {app.category === 'Bot' && '🤖'}
                {app.category === 'Smart Contract' && '📜'}
                {app.category === 'Backend' && '⚙️'}
                {app.category === 'Extension' && '🧩'}
                {app.category === 'Mobile App' && '📱'}
              </div>
            </div>

            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-bold">{app.title}</h3>
                <div className="flex gap-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${DIFFICULTY_COLORS[app.difficulty as keyof typeof DIFFICULTY_COLORS]}`}>
                    {app.difficulty}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${CATEGORY_COLORS[app.category as keyof typeof CATEGORY_COLORS]}`}>
                    {app.category}
                  </span>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                {app.description}
              </p>

              {/* Tech Stack */}
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Tech Stack</h4>
                <div className="flex flex-wrap gap-1">
                  {app.tech.map((tech) => (
                    <span 
                      key={tech}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Key Features</h4>
                <ul className="space-y-1">
                  {app.features.slice(0, 3).map((feature, index) => (
                    <li key={index} className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <span className="text-green-500 text-xs">•</span>
                      {feature}
                    </li>
                  ))}
                  {app.features.length > 3 && (
                    <li className="text-xs text-gray-500 italic">
                      +{app.features.length - 3} more features
                    </li>
                  )}
                </ul>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <a
                  href={app.github}
                  target="_blank"
                  rel="noopener"
                  className="flex-1 px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-center"
                >
                  View Code ↗
                </a>
                {app.demo && (
                  <a
                    href={app.demo}
                    target="_blank"
                    rel="noopener"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-center"
                  >
                    Live Demo ↗
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Getting Started Guide */}
      <div className="bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand-900/20 dark:to-brand-800/20 rounded-xl p-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl font-bold mb-4">Build Your Own Integration</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Ready to build something amazing? Follow our step-by-step tutorial to create 
              your first SSS-integrated application.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-brand-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <span className="text-sm">Choose your framework and set up the project</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-brand-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <span className="text-sm">Install the SSS SDK and configure authentication</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-brand-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <span className="text-sm">Implement verification and reputation features</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-brand-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </div>
                <span className="text-sm">Deploy and share with the community</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold mb-2">🚀 Quick Start Tutorial</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Build a simple verification widget in 10 minutes
              </p>
              <a 
                href="/docs/tutorial/quick-start" 
                className="text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 text-sm font-medium"
              >
                Start Tutorial →
              </a>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold mb-2">📚 Complete Guide</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                In-depth guide to building production applications
              </p>
              <a 
                href="/docs/guide/building-applications" 
                className="text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 text-sm font-medium"
              >
                Read Guide →
              </a>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold mb-2">🏆 Community Showcase</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Submit your app and get featured in our showcase
              </p>
              <a 
                href="https://github.com/semi-sentients/community-showcase" 
                className="text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 text-sm font-medium"
                target="_blank"
                rel="noopener"
              >
                Submit App ↗
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Community Integration */}
      <div className="mt-12 text-center">
        <h3 className="text-xl font-semibold mb-4">Join the Developer Community</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
          Connect with other developers, share your projects, and get help with your integrations. 
          Our community is here to support your development journey.
        </p>
        
        <div className="flex justify-center gap-4">
          <a
            href="https://discord.gg/sss"
            target="_blank"
            rel="noopener"
            className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-medium transition-colors"
          >
            Join Discord
          </a>
          <a
            href="https://github.com/semi-sentients"
            target="_blank"
            rel="noopener"
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors"
          >
            View GitHub
          </a>
        </div>
      </div>
    </section>
  );
}