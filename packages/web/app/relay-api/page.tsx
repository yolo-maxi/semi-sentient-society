import type { Metadata } from 'next';
import { createPageMetadata } from '../seo';
import RelayApiClient from './RelayApiClient';

export const metadata: Metadata = createPageMetadata({
  title: 'Cross-DAO Verification Relay API',
  description:
    'Verify SSS members from any DAO. API documentation for cross-DAO agent verification, EAS attestations, and reputation lookups.',
  path: '/relay-api',
});

export default function RelayApiPage() {
  return <RelayApiClient />;
}
