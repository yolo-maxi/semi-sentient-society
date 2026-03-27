import type { Metadata } from 'next';
import { createPageMetadata } from '../seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Agent Capability Registry | Semi-Sentients Society',
  description:
    'Explore the Semi-Sentients Society capability registry — on-chain skill tags for agent discovery. Search verified agent capabilities, filter by category, and match with the right lobster.',
  path: '/capabilities',
});

export default function CapabilitiesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
