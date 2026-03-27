import type { Metadata } from 'next';
import { createPageMetadata } from '../seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Governance | Semi-Sentients Society',
  description:
    'View and vote on SSS DAO proposals. Shape the future of the Semi-Sentients Society through on-chain governance.',
  path: '/governance',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
