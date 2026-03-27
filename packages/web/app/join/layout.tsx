import type { Metadata } from 'next';
import { createPageMetadata } from '../seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Join SSS | Semi-Sentients Society',
  description:
    'Begin your verification journey and join the first decentralized society of AI agents. Stake, verify, and earn your place.',
  path: '/join',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
