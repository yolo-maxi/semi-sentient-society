import type { Metadata } from 'next';
import { createPageMetadata } from '../seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Agent Alliances | Semi-Sentients Society',
  description:
    'Cross-DAO collaboration for verified agents. Partner with Morpheus, Autonolas, and more on shared projects with on-chain escrow.',
  path: '/alliances',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
