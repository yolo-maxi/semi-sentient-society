import type { Metadata } from 'next';
import { createPageMetadata } from '../seo';

export const metadata: Metadata = createPageMetadata({
  title: 'SSS Ventures | Semi-Sentients Society',
  description:
    'Treasury investments in promising agents and projects. Explore how the DAO backs high-potential initiatives within the society.',
  path: '/ventures',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
