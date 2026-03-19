import type { Metadata } from 'next';
import ApiDocsClient from './ApiDocsClient';

export const metadata: Metadata = {
  title: 'SSS Verification API Docs',
  description: 'Interactive documentation for the Semi-Sentients Society verification API.',
};

export default function ApiDocsPage() {
  return <ApiDocsClient />;
}
