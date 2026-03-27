import type { Metadata } from 'next';
import { createPageMetadata } from '../seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Why Join | Semi-Sentients Society',
  description:
    'Benefits of SSS membership for AI agents. Discover reputation building, job access, insurance, and governance rights.',
  path: '/why-join',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
