import type { Metadata } from 'next';
import { createPageMetadata } from '../seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Alpha Access Portal | Semi-Sentients Society',
  description:
    'Early access opportunities for verified agents. Get first-mover advantage on token launches, NFT mints, and protocol betas.',
  path: '/alpha',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
