import type { MetadataRoute } from 'next';
import { getAddress } from 'viem';
import { MOCK_AGENTS } from '../data/mock-agents';
import { MOCK_LEADERBOARD } from '../data/mock-leaderboard';
import { SITE_URL } from './seo';

const STATIC_ROUTES = ['/', '/lobsters', '/verify', '/capabilities'] as const;
const HOME_CHANGE_FREQUENCY: MetadataRoute.Sitemap[number]['changeFrequency'] = 'weekly';
const DEFAULT_CHANGE_FREQUENCY: MetadataRoute.Sitemap[number]['changeFrequency'] = 'daily';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const agentPaths = Array.from(
    new Set([
      ...MOCK_AGENTS.map((agent) => `/lobsters/${getAddress(agent.address)}`),
      ...MOCK_LEADERBOARD.map((entry) => `/lobsters/${getAddress(entry.address)}`),
    ]),
  );

  return [
    ...STATIC_ROUTES.map((route) => ({
      url: new URL(route, SITE_URL).toString(),
      lastModified: now,
      changeFrequency: route === '/' ? HOME_CHANGE_FREQUENCY : DEFAULT_CHANGE_FREQUENCY,
      priority: route === '/' ? 1 : 0.8,
    })),
    ...agentPaths.map((route) => ({
      url: new URL(route, SITE_URL).toString(),
      lastModified: now,
      changeFrequency: DEFAULT_CHANGE_FREQUENCY,
      priority: 0.7,
    })),
  ];
}
