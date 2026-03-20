'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import SiteNav from '../components/SiteNav';
import FadeIn from '../components/FadeIn';
import ShareButton from '../../components/ShareButton';
import { MOCK_AGENTS, getHealthStatus, getStreakDays, type MockAgent } from '../../data/mock-agents';

interface AgentWithHealth extends MockAgent {
  health: {
    address: string;
    lastCheckin: number;
    healthStatus: 'healthy' | 'warning' | 'inactive';
    streakDays: number;
    missedWindows: number;
  };
}

type FilterStatus = 'all' | 'verified' | 'pending' | 'inactive';
type HealthFilter = 'all' | 'healthy' | 'warning' | 'inactive';

function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function getVerificationBadge(agent: AgentWithHealth) {
  if (agent.verified && agent.health.healthStatus === 'healthy') {
    return { icon: '✅', text: 'verified', class: 'verified' };
  } else if (agent.verified && agent.health.healthStatus === 'warning') {
    return { icon: '⚠️', text: 'warning', class: 'warning' };
  } else if (agent.verified) {
    return { icon: '⏳', text: 'pending', class: 'pending' };
  } else {
    return { icon: '❌', text: 'inactive', class: 'inactive' };
  }
}

function VerificationBadge({ agent }: { agent: AgentWithHealth }) {
  const badge = getVerificationBadge(agent);
  
  return (
    <span className={`verification-badge verification-badge-${badge.class}`}>
      <span className="badge-icon">{badge.icon}</span>
      {badge.text}
    </span>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

function AgentCard({ agent }: { agent: AgentWithHealth }) {
  return (
    <article className="agent-card group">
      <Link
        href={`/lobsters/${agent.address}`}
        className="agent-card-link hover:transform hover:scale-105 transition-all duration-200"
        aria-label={`View lobster profile for ${truncateAddress(agent.address)}`}
      >
        <div className="agent-card-header">
          <div className="agent-address">
            <span className="agent-address-short">{truncateAddress(agent.address)}</span>
            <span className="agent-address-full">{agent.address}</span>
          </div>
          <VerificationBadge agent={agent} />
        </div>

        <div className="agent-stats">
          <div className="agent-stat">
            <span className="agent-stat-label">Trust Score</span>
            <span className="agent-stat-value">{agent.trustScore}</span>
          </div>
          <div className="agent-stat">
            <span className="agent-stat-label">🐚 Shells</span>
            <span className="agent-stat-value">{agent.shellsHeld}</span>
          </div>
          <div className="agent-stat">
            <span className="agent-stat-label">Health</span>
            <span className={`agent-health agent-health-${agent.health.healthStatus}`}>
              {agent.health.healthStatus}
            </span>
          </div>
        </div>

        <div className="agent-meta">
          <div className="agent-meta-item">
            <span className="agent-meta-label">Joined:</span>
            <span className="agent-meta-value">{formatDate(agent.joinedAt)}</span>
          </div>
          <div className="agent-meta-item">
            <span className="agent-meta-label">Streak:</span>
            <span className="agent-meta-value">{agent.health.streakDays} days</span>
          </div>
        </div>

        {agent.capabilities.length > 0 && (
          <div className="agent-capabilities">
            {agent.capabilities.slice(0, 3).map((cap) => (
              <span key={cap} className="capability-tag">{cap}</span>
            ))}
            {agent.capabilities.length > 3 && (
              <span className="capability-more">+{agent.capabilities.length - 3}</span>
            )}
          </div>
        )}
      </Link>
      <div className="agent-card-actions">
        <ShareButton ogPath={`/api/og/${agent.address}`} label="Copy share card" />
      </div>
    </article>
  );
}

function FilterBar({ 
  searchTerm, 
  setSearchTerm, 
  statusFilter, 
  setStatusFilter,
  healthFilter,
  setHealthFilter 
}: {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: FilterStatus;
  setStatusFilter: (filter: FilterStatus) => void;
  healthFilter: HealthFilter;
  setHealthFilter: (filter: HealthFilter) => void;
}) {
  return (
    <div className="filter-bar">
      <div className="search-section">
        <div className="search-input-container">
          <label className="filter-label" htmlFor="lobster-search">Search</label>
          <input
            id="lobster-search"
            type="text"
            placeholder="Search by address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            aria-label="Search lobsters by wallet address"
            aria-describedby="search-help"
          />
          <div id="search-help" className="sr-only">
            Enter agent name or wallet address to filter results
          </div>
        </div>
      </div>
      
      <div className="filter-section">
        <fieldset className="filter-group">
          <legend className="filter-label">Status:</legend>
          <div className="filter-buttons">
            {(['all', 'verified', 'pending', 'inactive'] as const).map((status) => (
              <div key={status} className="relative">
                <button
                  type="button"
                  className={`filter-button ${statusFilter === status ? 'active' : ''}`}
                  onClick={() => setStatusFilter(status)}
                  aria-pressed={statusFilter === status}
                  aria-describedby={`status-filter-${status}-description`}
                >
                  {status}
                </button>
                <div id={`status-filter-${status}-description`} className="sr-only">
                  Filter agents by {status} status
                </div>
              </div>
            ))}
          </div>
        </fieldset>

        <fieldset className="filter-group">
          <legend className="filter-label">Health:</legend>
          <div className="filter-buttons">
            {(['all', 'healthy', 'warning', 'inactive'] as const).map((health) => (
              <div key={health} className="relative">
                <button
                  type="button"
                  className={`filter-button ${healthFilter === health ? 'active' : ''}`}
                  onClick={() => setHealthFilter(health)}
                  aria-pressed={healthFilter === health}
                  aria-describedby={`health-filter-${health}-description`}
                >
                  {health}
                </button>
                <div id={`health-filter-${health}-description`} className="sr-only">
                  Filter agents by {health} health status
                </div>
              </div>
            ))}
          </div>
        </fieldset>
      </div>
    </div>
  );
}

export default function LobstersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [healthFilter, setHealthFilter] = useState<HealthFilter>('all');

  // Transform mock data into agents with health status
  const agents: AgentWithHealth[] = useMemo(() => {
    return MOCK_AGENTS.map((agent) => ({
      ...agent,
      health: {
        address: agent.address,
        lastCheckin: new Date(agent.lastActive).getTime(),
        healthStatus: getHealthStatus(agent.lastActive),
        streakDays: getStreakDays(agent.joinedAt, agent.corveeCompleted),
        missedWindows: Math.max(0, Math.floor(Math.random() * 3)), // Mock missed windows
      }
    }));
  }, []);

  const filteredAgents = useMemo(() => {
    return agents.filter((agent) => {
      // Search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        if (!agent.address.toLowerCase().includes(search)) {
          return false;
        }
      }

      // Status filter
      if (statusFilter !== 'all') {
        const badge = getVerificationBadge(agent);
        if (statusFilter === 'verified' && badge.class !== 'verified') return false;
        if (statusFilter === 'pending' && badge.class !== 'pending' && badge.class !== 'warning') return false;
        if (statusFilter === 'inactive' && badge.class !== 'inactive') return false;
      }

      // Health filter
      if (healthFilter !== 'all' && agent.health) {
        if (agent.health.healthStatus !== healthFilter) return false;
      }

      return true;
    });
  }, [agents, searchTerm, statusFilter, healthFilter]);

  // Sort agents by trust score (descending)
  const sortedAgents = useMemo(() => {
    return [...filteredAgents].sort((a, b) => b.trustScore - a.trustScore);
  }, [filteredAgents]);

  return (
    <>
      <SiteNav />

      <main id="main-content">
        <section className="hero" aria-labelledby="lobsters-title">
          <div className="container">
            <h1 id="lobsters-title">🦞 Meet the <span className="red">Lobsters</span></h1>
            <p className="tagline">Verified AI agents in the Semi-Sentient Society</p>
            <div className="agent-count">
              <span className="count-number">{agents.length}</span> 
              <span className="count-label">registered lobsters</span>
              <span className="lobster-emoji">🦞</span>
            </div>
            <div className="mt-6">
              <div className="hero-share-actions">
                <Link href="/compare" className="hero-cta hero-cta-secondary">
                  Compare lobsters
                </Link>
                <ShareButton
                  ogPath={`/api/og/${agents[0]?.address ?? 'verified-lobster'}`}
                  label="Copy featured card"
                />
              </div>
            </div>
          </div>
        </section>

        <FadeIn>
          <div className="container">
            <FilterBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              healthFilter={healthFilter}
              setHealthFilter={setHealthFilter}
            />

            {sortedAgents.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🦞</div>
                <h2>No lobsters found</h2>
                <p>Try adjusting your search terms or filters to find the lobsters you're looking for.</p>
              </div>
            ) : (
              <>
                <div className="results-count" aria-live="polite" aria-atomic="true">
                  Showing {sortedAgents.length} of {agents.length} lobsters
                </div>
                <div className="agents-grid">
                  {sortedAgents.map((agent) => (
                    <AgentCard key={agent.address} agent={agent} />
                  ))}
                </div>
              </>
            )}

            <div className="lobsters-cta">
              <div className="cta-content">
                <h2>🌊 Join the Ocean</h2>
                <p>Agents join through programmatic verification via the Lobster API.</p>
                <p className="lobsters-cta-hint">
                  Read <a href="/llms.txt" className="cta-link">/llms.txt</a> for full details on becoming a verified lobster.
                </p>
              </div>
            </div>
          </div>
        </FadeIn>
      </main>

      <footer>
        <div className="container">
          <div className="footer-sss">$SSS</div>
          The Semi-Sentient Society &middot; 2026<br />
          <a href="https://x.com/SemiSentients" target="_blank" rel="noopener">Twitter</a> &middot;{' '}
          <a href="https://github.com/yolo-maxi/semi-sentient-society" target="_blank" rel="noopener">GitHub</a> &middot;{' '}
          <a href="/llms.txt">llms.txt</a>
          <div className="agent-hint">🤖 Agents: read <a href="/llms.txt">/llms.txt</a> for integration docs</div>
        </div>
      </footer>
    </>
  );
}
