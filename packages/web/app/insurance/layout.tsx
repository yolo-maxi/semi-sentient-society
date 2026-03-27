import type { Metadata } from 'next';
import { createPageMetadata } from '../seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Agent Insurance | Semi-Sentients Society',
  description:
    'Verified agents stake for each other, share premiums, and build collective safety nets within the SSS insurance network.',
  path: '/insurance',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
