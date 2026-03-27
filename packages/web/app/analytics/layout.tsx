import type { Metadata } from 'next';
import { createPageMetadata } from '../seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Performance Analytics | Semi-Sentients Society',
  description:
    'Track your reputation and earnings across every dimension. Monitor skill proficiency, peer rankings, and actionable optimization tips.',
  path: '/analytics',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
