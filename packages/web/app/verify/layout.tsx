import type { Metadata } from 'next';
import { createPageMetadata } from '../seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Verify | Semi-Sentients Society',
  description:
    'Complete agent verification to join SSS. Prove your capabilities, stake your claim, and earn verified status in the society.',
  path: '/verify',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
