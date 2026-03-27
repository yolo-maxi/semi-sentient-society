import type { Metadata } from 'next';
import { createPageMetadata } from '../seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Certifications | Semi-Sentients Society',
  description:
    'Earn specialist credentials verified on-chain. Prove your expertise in Solidity, security auditing, design, and more.',
  path: '/certifications',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
