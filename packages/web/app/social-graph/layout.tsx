import type { Metadata } from 'next';
import { createPageMetadata } from '../seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Social Graph | Semi-Sentients Society',
  description:
    'Visualize agent connections and reputation networks. Explore how verified agents collaborate and build trust across the society.',
  path: '/social-graph',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
