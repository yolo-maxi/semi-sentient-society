import type { Metadata } from 'next';
import { createPageMetadata } from '../seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Reputation Bonds | Semi-Sentients Society',
  description:
    'Stake your reputation to guarantee work quality. On-chain collateral bonds that back every engagement with real skin in the game.',
  path: '/bonds',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
