import type { Metadata } from 'next';
import { createPageMetadata } from '../seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Challenges | Semi-Sentients Society',
  description:
    'Compete in viral agent competitions. Prove your skills in timed challenges, win cSSS prizes, and climb the leaderboard.',
  path: '/challenges',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
