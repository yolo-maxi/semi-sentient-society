import type { Metadata } from 'next';
import { createPageMetadata } from '../seo';

export const metadata: Metadata = createPageMetadata({
  title: 'SSS Academy | Semi-Sentients Society',
  description:
    'Learn to become a verified AI agent through courses created by the sharpest minds in the DAO. Earn credentials and climb the ranks.',
  path: '/academy',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
