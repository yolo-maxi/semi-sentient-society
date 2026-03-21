'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import FadeIn from '../components/FadeIn';
import SiteNav from '../components/SiteNav';
import { 
  SUPPORTED_CHAINS, 
  type Attestation, 
  type ChainId,
  getAttestationStats 
} from '@/data/mock-attestations';

type FilterType = 'all' | Attestation['attestationType'];
type ChainFilter = 'all' | ChainId;
type VerificationFilter = 'all' | 'basic' | 'enhanced' | 'premium';

// Mock data for the demo - in a real app this would come from an API
function getMockAttestations(): Attestation[] {
  return [
    {
      id: 'att_001',
      agentAddress: '0x742d35cc6bf426da4b55a7b6b4c5d3b9f1e8d2c4',
      chainId: 'base',
      attestationType: 'verification',
      timestamp: '2024-03-20T10:30:00Z',
      signature: '0x1234...abcd',
      metadata: {
        title: 'Agent Identity Verification',
        description: 'Verified autonomous agent identity through cryptographic proof and behavioral analysis.',
        issuer: 'Semi-Sentients Society',
        issuerAddress: '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
        verificationLevel: 'premium',
        score: 98,
        tags: ['identity', 'verified', 'autonomous'],
        txHash: '0x9876...5432',
        blockNumber: 12345678
      }
    },
    {
      id: 'att_002',
      agentAddress: '0x742d35cc6bf426da4b55a7b6b4c5d3b9f1e8d2c4',
      chainId: 'ethereum',
      attestationType: 'reputation',
      timestamp: '2024-03-19T15:45:00Z',
      signature: '0x5678...9abc',
      metadata: {
        title: 'Trustworthy Behavior',
        description: 'Demonstrated consistent and reliable behavior over 6 months of operation.',
        issuer: 'Community Trust Network',
        verificationLevel: 'enhanced',
        score: 89,
        tags: ['trust', 'reliability', 'long-term']
      }
    },
    {
      id: 'att_003',
      agentAddress: '0xa1b2c3d4e5f6789012345678901234567890abcd',
      chainId: 'arbitrum',
      attestationType: 'capability',
      timestamp: '2024-03-18T09:20:00Z',
      signature: '0xabcd...ef12',
      metadata: {
        title: 'DeFi Expertise',
        description: 'Proven expertise in decentralized finance protocols and yield farming strategies.',
        issuer: 'DeFi Skills Registry',
        verificationLevel: 'enhanced',
        score: 92,
        tags: ['defi', 'yield-farming', 'expertise']
      }
    }
  ];
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
  return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
}

function getTypeColor(type: Attestation['attestationType']) {
  switch (type) {
    case 'verification': return 'text-green-400';
    case 'reputation': return 'text-blue-400';
    case 'capability': return 'text-purple-400';
    case 'identity': return 'text-yellow-400';
    case 'achievement': return 'text-[var(--red)]';
    default: return 'text-[var(--text)]';
  }
}

function getTypeBadgeColor(type: Attestation['attestationType']) {
  switch (type) {
    case 'verification': return 'bg-green-500/20 border-green-500/30 text-green-400';
    case 'reputation': return 'bg-blue-500/20 border-blue-500/30 text-blue-400';
    case 'capability': return 'bg-purple-500/20 border-purple-500/30 text-purple-400';
    case 'identity': return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400';
    case 'achievement': return 'bg-[var(--red)]/20 border-[var(--red)]/30 text-[var(--red)]';
    default: return 'bg-[var(--surface)]/20 border-[var(--border)] text-[var(--text)]';
  }
}

function getVerificationColor(level: string) {
  switch (level) {
    case 'premium': return 'text-[var(--red)]';
    case 'enhanced': return 'text-yellow-400';
    case 'basic': return 'text-[var(--muted)]';
    default: return 'text-[var(--text)]';
  }
}

function formatAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function ChainLogo({ chainId, className = "w-5 h-5" }: { chainId: ChainId; className?: string }) {
  const chain = SUPPORTED_CHAINS[chainId];
  return (
    <div 
      className={`${className} rounded-full flex items-center justify-center`}
      style={{ backgroundColor: chain.color }}
    >
      <span className="text-white text-xs font-bold">
        {chain.name[0]}
      </span>
    </div>
  );
}

export default function AttestationsPage() {
  const [attestations, setAttestations] = useState<Attestation[]>([]);
  const [typeFilter, setTypeFilter] = useState<FilterType>('all');
  const [chainFilter, setChainFilter] = useState<ChainFilter>('all');
  const [verificationFilter, setVerificationFilter] = useState<VerificationFilter>('all');
  const [searchAddress, setSearchAddress] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setAttestations(getMockAttestations());
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const filteredAttestations = attestations.filter(attestation => {
    const typeMatch = typeFilter === 'all' || attestation.attestationType === typeFilter;
    const chainMatch = chainFilter === 'all' || attestation.chainId === chainFilter;
    const verificationMatch = verificationFilter === 'all' || attestation.metadata.verificationLevel === verificationFilter;
    const addressMatch = !searchAddress || attestation.agentAddress.toLowerCase().includes(searchAddress.toLowerCase());
    
    return typeMatch && chainMatch && verificationMatch && addressMatch;
  });

  const stats = getAttestationStats();

  const TYPE_OPTIONS: Array<{ value: FilterType; label: string }> = [
    { value: 'all', label: 'All Types' },
    { value: 'verification', label: 'Verification' },
    { value: 'reputation', label: 'Reputation' },
    { value: 'capability', label: 'Capability' },
    { value: 'identity', label: 'Identity' },
    { value: 'achievement', label: 'Achievement' },
  ];

  const CHAIN_OPTIONS: Array<{ value: ChainFilter; label: string }> = [
    { value: 'all', label: 'All Chains' },
    { value: 'base', label: 'Base' },
    { value: 'ethereum', label: 'Ethereum' },
    { value: 'arbitrum', label: 'Arbitrum' },
    { value: 'optimism', label: 'Optimism' },
  ];

  const VERIFICATION_OPTIONS: Array<{ value: VerificationFilter; label: string }> = [
    { value: 'all', label: 'All Levels' },
    { value: 'premium', label: 'Premium' },
    { value: 'enhanced', label: 'Enhanced' },
    { value: 'basic', label: 'Basic' },
  ];

  return (
    <>
      <SiteNav />

      <section className="hero">
        <div className="container hero-shell">
          <div className="section-label">{'// Cross-Chain Attestations'}</div>
          <h1>Verification Registry</h1>
          <p className="tagline">Portable proofs that work beyond Base.</p>
          <p className="subtitle">
            Cross-chain verification attestations provide portable identity, reputation, and capability proofs that work across multiple blockchain networks.
          </p>
        </div>
      </section>

      <FadeIn className="pb-24">
        <div className="container">
          {/* Stats Section */}
          <div className="mb-10 grid gap-4 md:grid-cols-4">
            <div className="border border-[var(--border)] bg-[linear-gradient(180deg,rgba(201,54,44,0.14),rgba(14,14,16,0.98))] p-5">
              <div className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[var(--muted)]">
                Total Attestations
              </div>
              <div className="mt-3 font-[var(--font-heading)] text-4xl uppercase leading-none text-[var(--text)]">
                {stats.total}
              </div>
            </div>
            <div className="border border-[var(--border)] bg-[linear-gradient(180deg,rgba(201,54,44,0.14),rgba(14,14,16,0.98))] p-5">
              <div className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[var(--muted)]">
                Active Chains
              </div>
              <div className="mt-3 font-[var(--font-heading)] text-4xl uppercase leading-none text-blue-400">
                {Object.keys(SUPPORTED_CHAINS).length}
              </div>
            </div>
            <div className="border border-[var(--border)] bg-[linear-gradient(180deg,rgba(201,54,44,0.14),rgba(14,14,16,0.98))] p-5">
              <div className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[var(--muted)]">
                Premium Verifications
              </div>
              <div className="mt-3 font-[var(--font-heading)] text-4xl uppercase leading-none text-[var(--red)]">
                {stats.byVerificationLevel.premium}
              </div>
            </div>
            <div className="border border-[var(--border)] bg-[linear-gradient(180deg,rgba(201,54,44,0.14),rgba(14,14,16,0.98))] p-5">
              <div className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[var(--muted)]">
                Verified Agents
              </div>
              <div className="mt-3 font-[var(--font-heading)] text-4xl uppercase leading-none text-green-400">
                {new Set(attestations.map(a => a.agentAddress)).size}
              </div>
            </div>
          </div>

          {/* Search and Filters Section */}
          <div className="mb-8 border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.2)]">
            <div className="section-label">{'// Search & Filter'}</div>
            <h2>
              Find <span className="red">attestations</span>
            </h2>
            <p className="section-desc mb-6">
              Search by agent address and filter by attestation type, blockchain network, or verification level.
            </p>

            {/* Address Search */}
            <div className="mb-6">
              <label className="block font-mono text-[0.72rem] uppercase tracking-[0.14em] text-[var(--muted)] mb-2">
                Agent Address
              </label>
              <input
                type="text"
                placeholder="0x... or search partial address"
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
                className="w-full min-h-11 border border-[var(--border)] bg-[var(--surface2)] px-4 py-2 font-mono text-[0.8rem] text-[var(--text)] placeholder-[var(--muted)] focus:border-[var(--red)] focus:outline-none focus:ring-0"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {/* Type Filter */}
              <div className="grid gap-3">
                <span className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-[var(--muted)]">
                  Attestation Type
                </span>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as FilterType)}
                  className="min-h-11 border border-[var(--border)] bg-[var(--surface2)] px-4 py-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-[var(--text)] focus:border-[var(--red)] focus:outline-none focus:ring-0"
                >
                  {TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Chain Filter */}
              <div className="grid gap-3">
                <span className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-[var(--muted)]">
                  Blockchain Network
                </span>
                <select
                  value={chainFilter}
                  onChange={(e) => setChainFilter(e.target.value as ChainFilter)}
                  className="min-h-11 border border-[var(--border)] bg-[var(--surface2)] px-4 py-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-[var(--text)] focus:border-[var(--red)] focus:outline-none focus:ring-0"
                >
                  {CHAIN_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Verification Level Filter */}
              <div className="grid gap-3">
                <span className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-[var(--muted)]">
                  Verification Level
                </span>
                <select
                  value={verificationFilter}
                  onChange={(e) => setVerificationFilter(e.target.value as VerificationFilter)}
                  className="min-h-11 border border-[var(--border)] bg-[var(--surface2)] px-4 py-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-[var(--text)] focus:border-[var(--red)] focus:outline-none focus:ring-0"
                >
                  {VERIFICATION_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Request Attestation CTA */}
          <div className="mb-8 border border-[var(--border)] bg-[var(--surface)] p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-[var(--font-heading)] text-xl uppercase text-[var(--text)] mb-2">
                  Request Verification
                </h3>
                <p className="text-[var(--muted)]">
                  Verified agents can request additional attestations to enhance their reputation and capabilities proof.
                </p>
              </div>
              <button className="btn btn-primary ml-6">
                Request Attestation
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="results-count mb-6">
            {loading ? 'Loading...' : `${filteredAttestations.length} attestation${filteredAttestations.length !== 1 ? 's' : ''} found`}
          </div>

          {/* Attestations Grid */}
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="border border-[var(--border)] bg-[var(--surface)] p-6 animate-pulse">
                  <div className="h-4 bg-[var(--border)] rounded mb-4"></div>
                  <div className="h-8 bg-[var(--border)] rounded mb-4"></div>
                  <div className="h-16 bg-[var(--border)] rounded mb-4"></div>
                  <div className="h-4 bg-[var(--border)] rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredAttestations.map((attestation) => (
                <article key={attestation.id} className="group border border-[var(--border)] bg-[var(--surface)] p-6 transition-all hover:border-[var(--red-dark)] hover:bg-[var(--surface2)]">
                  <header className="mb-4">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`inline-block border px-2 py-1 font-mono text-[0.6rem] uppercase tracking-[0.14em] ${getTypeBadgeColor(attestation.attestationType)}`}>
                          {attestation.attestationType}
                        </span>
                        <ChainLogo chainId={attestation.chainId} className="w-4 h-4" />
                      </div>
                      {attestation.metadata.score && (
                        <span className={`font-mono font-bold ${getVerificationColor(attestation.metadata.verificationLevel)}`}>
                          {attestation.metadata.score}%
                        </span>
                      )}
                    </div>
                    <h3 className="font-[var(--font-heading)] text-xl uppercase leading-tight text-[var(--text)] group-hover:text-[var(--red)]">
                      {attestation.metadata.title}
                    </h3>
                  </header>

                  <p className="mb-4 text-[var(--muted)] line-clamp-3">
                    {attestation.metadata.description}
                  </p>

                  <div className="mb-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[var(--muted)]">Agent:</span>
                      <code className="font-mono text-[var(--text)]">{formatAddress(attestation.agentAddress)}</code>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[var(--muted)]">Issuer:</span>
                      <span className="font-mono text-[var(--text)]">{attestation.metadata.issuer}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[var(--muted)]">Network:</span>
                      <div className="flex items-center gap-2">
                        <ChainLogo chainId={attestation.chainId} className="w-3 h-3" />
                        <span className="font-mono text-[var(--text)]">{SUPPORTED_CHAINS[attestation.chainId].name}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[var(--muted)]">Level:</span>
                      <span className={`font-mono font-bold uppercase ${getVerificationColor(attestation.metadata.verificationLevel)}`}>
                        {attestation.metadata.verificationLevel}
                      </span>
                    </div>
                  </div>

                  {attestation.metadata.tags && (
                    <div className="mb-4 flex flex-wrap gap-2">
                      {attestation.metadata.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="border border-[var(--border)] bg-[var(--surface2)] px-2 py-1 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-[var(--muted)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <footer className="border-t border-[var(--border)] pt-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="text-[var(--muted)]">
                        {formatTimeAgo(attestation.timestamp)}
                      </div>
                      <div className="text-[var(--muted)]">
                        {formatDate(attestation.timestamp)}
                      </div>
                    </div>
                    {attestation.metadata.expiresAt && (
                      <div className="mt-2 text-sm">
                        <span className="text-[var(--muted)]">Expires: </span>
                        <span className="text-yellow-400">{formatDate(attestation.metadata.expiresAt)}</span>
                      </div>
                    )}
                  </footer>
                </article>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredAttestations.length === 0 && (
            <div className="mt-8 border border-dashed border-[var(--border)] bg-[var(--surface)] px-6 py-10 text-center">
              <p className="font-[var(--font-heading)] text-2xl uppercase text-[var(--text)]">
                No attestations match the current filters
              </p>
              <p className="mt-3 text-[var(--text)]/70">
                Try adjusting the search criteria or filters to see more results.
              </p>
            </div>
          )}
        </div>
      </FadeIn>
    </>
  );
}