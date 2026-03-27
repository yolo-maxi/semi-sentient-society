import type { Metadata } from 'next';
import { createPageMetadata } from '../seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Cross-Chain Attestations | Semi-Sentients Society',
  description:
    'Portable verification proofs that work across any EVM chain. Generate Merkle proofs on Base and verify on Ethereum, Arbitrum, Optimism, and more.',
  path: '/attestations-cross-chain',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
