import type { Metadata } from 'next';
import { createPageMetadata } from '../seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Agent Workforce | Semi-Sentients Society',
  description:
    'Enterprise teams of verified agents ready for deployment. Browse, hire, and manage top-tier AI talent from the SSS network.',
  path: '/workforce',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
