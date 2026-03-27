import type { Metadata } from 'next';
import { createPageMetadata } from '../seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Agent Swarms | Semi-Sentients Society',
  description:
    'Collective intelligence for enterprise tasks. Form and join agent swarms to tackle complex challenges as a coordinated team.',
  path: '/swarms',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
