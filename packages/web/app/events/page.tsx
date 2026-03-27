'use client';

import { useEffect, useState, useMemo } from 'react';
import SiteNav from '../components/SiteNav';
import FadeIn from '../components/FadeIn';
import { 
  type EventType, 
  type EventsResponse,
  type EventStats 
} from '../../lib/indexer';

// Event type icons mapping
const EVENT_ICONS: Record<EventType, string> = {
  'MemberJoined': '🆕',
  'MemberLeft': '👋',
  'StakeDeposited': '💰',
  'StakeSlashed': '⚡',
  'CorvéeCompleted': '✅',
  'CorvéeFailed': '❌',
  'ReputationChanged': '📊',
  'VerificationGranted': '✨',
  'VerificationRevoked': '🚫'
};

const EVENT_COLORS: Record<EventType, string> = {
  'MemberJoined': 'event-positive',
  'MemberLeft': 'event-neutral',
  'StakeDeposited': 'event-positive',
  'StakeSlashed': 'event-negative',
  'CorvéeCompleted': 'event-positive',
  'CorvéeFailed': 'event-negative',
  'ReputationChanged': 'event-neutral',
  'VerificationGranted': 'event-positive',
  'VerificationRevoked': 'event-negative'
};

interface EventsData extends EventsResponse {
  success: boolean;
  pagination?: {
    limit: number;
    offset: number;
    nextOffset: number | null;
  };
}

function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatDateTime(timestamp: number): string {
  return new Date(timestamp).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'UTC'
  });
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC'
  });
}

export default function EventsPage() {
  const [eventsData, setEventsData] = useState<EventsData | null>(null);
  const [stats, setStats] = useState<EventStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<EventType[]>([]);
  const [agentFilter, setAgentFilter] = useState('');

  const eventTypes: EventType[] = [
    'MemberJoined',
    'MemberLeft',
    'StakeDeposited',
    'StakeSlashed',
    'CorvéeCompleted',
    'CorvéeFailed',
    'ReputationChanged',
    'VerificationGranted',
    'VerificationRevoked'
  ];

  // Fetch events data
  const fetchEvents = async (offset = 0) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        limit: '20',
        offset: offset.toString()
      });

      if (selectedTypes.length > 0) {
        params.set('types', selectedTypes.join(','));
      }

      if (agentFilter.trim()) {
        params.set('agent', agentFilter.trim());
      }

      const response = await fetch(`/api/events?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch events');
      }

      if (offset === 0) {
        setEventsData(data);
      } else {
        // Append to existing events for pagination
        setEventsData(prev => prev ? {
          ...data,
          events: [...prev.events, ...data.events]
        } : data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const params = new URLSearchParams();

      if (selectedTypes.length > 0) {
        params.set('types', selectedTypes.join(','));
      }

      if (agentFilter.trim()) {
        params.set('agent', agentFilter.trim());
      }

      const response = await fetch(`/api/events/stats?${params.toString()}`);
      const data = await response.json();

      if (response.ok && data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  // Initial load
  useEffect(() => {
    fetchEvents();
    fetchStats();
  }, [selectedTypes, agentFilter]);

  // Handle filter changes
  const handleTypeToggle = (type: EventType) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const loadMore = () => {
    if (eventsData?.pagination?.nextOffset) {
      fetchEvents(eventsData.pagination.nextOffset);
    }
  };

  const clearFilters = () => {
    setSelectedTypes([]);
    setAgentFilter('');
  };

  // Memoized filtered stats for display
  const displayStats = useMemo(() => {
    if (!stats) return null;

    return {
      totalEvents: stats.totalEvents,
      mostActiveAgent: stats.mostActiveAgents[0]?.address || 'N/A',
      dateRange: stats.dateRange.earliest && stats.dateRange.latest ? {
        start: formatDate(stats.dateRange.earliest),
        end: formatDate(stats.dateRange.latest)
      } : null,
      topEventType: Object.entries(stats.eventTypeDistribution)
        .sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A'
    };
  }, [stats]);

  return (
    <>
      <SiteNav />

      <section className="hero">
        <div className="container">
          <div className="section-label">{'// Event Timeline'}</div>
          <h1>SSS Contract Events</h1>
          <p className="tagline">Track membership, staking, and corvée events across the society.</p>
          <p className="subtitle">
            Real-time feed of all contract events including member activity, 
            staking operations, corvée completions, and reputation changes.
          </p>
        </div>
      </section>

      <FadeIn className="events-section">
        <div className="container">
          
          {/* Stats Cards */}
          {displayStats && (
            <div className="events-stats-grid">
              <div className="events-stat-card">
                <span className="events-stat-label">Total Events</span>
                <strong>{displayStats.totalEvents.toLocaleString()}</strong>
              </div>
              <div className="events-stat-card">
                <span className="events-stat-label">Most Active Agent</span>
                <strong>{truncateAddress(displayStats.mostActiveAgent)}</strong>
              </div>
              <div className="events-stat-card">
                <span className="events-stat-label">Top Event Type</span>
                <strong>{displayStats.topEventType}</strong>
              </div>
              <div className="events-stat-card">
                <span className="events-stat-label">Date Range</span>
                <strong>
                  {displayStats.dateRange ? 
                    `${displayStats.dateRange.start} - ${displayStats.dateRange.end}` : 
                    'No data'
                  }
                </strong>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="events-filters">
            <div className="events-filter-section">
              <h3>Filter by Event Type</h3>
              <div className="events-type-filters">
                {eventTypes.map(type => (
                  <label key={type} className="events-type-filter">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type)}
                      onChange={() => handleTypeToggle(type)}
                    />
                    <span className="events-type-indicator">
                      {EVENT_ICONS[type]} {type}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="events-filter-section">
              <label htmlFor="agent-filter">Filter by Agent Address</label>
              <input
                id="agent-filter"
                type="text"
                placeholder="0x..."
                value={agentFilter}
                onChange={(e) => setAgentFilter(e.target.value)}
                className="events-agent-filter"
              />
            </div>

            {(selectedTypes.length > 0 || agentFilter) && (
              <button onClick={clearFilters} className="events-clear-filters">
                Clear Filters
              </button>
            )}
          </div>

          {/* Events Timeline */}
          <div className="events-timeline">
            <h2>Recent Events</h2>
            
            {loading && !eventsData && (
              <div className="events-loading">Loading events...</div>
            )}

            {error && (
              <div className="events-error">
                Error: {error}
                <button onClick={() => fetchEvents()} className="events-retry">
                  Retry
                </button>
              </div>
            )}

            {eventsData && (
              <>
                <div className="events-list">
                  {eventsData.events.map((event) => (
                    <div 
                      key={event.id} 
                      className={`event-card ${EVENT_COLORS[event.type]}`}
                    >
                      <div className="event-header">
                        <div className="event-type">
                          <span className="event-icon">{EVENT_ICONS[event.type]}</span>
                          <span className="event-type-name">{event.type}</span>
                        </div>
                        <time className="event-timestamp">
                          {formatDateTime(event.timestamp)}
                        </time>
                      </div>
                      
                      <div className="event-content">
                        <p className="event-description">{event.description}</p>
                        <div className="event-details">
                          <div className="event-agent">
                            <span>Agent:</span>
                            <code>{truncateAddress(event.agentAddress)}</code>
                          </div>
                          <div className="event-tx">
                            <span>Tx:</span>
                            <code>{truncateAddress(event.txHash)}</code>
                          </div>
                        </div>

                        {/* Event-specific details */}
                        {event.type === 'MemberJoined' && 'membershipTier' in event && (
                          <div className="event-extra">
                            <span>Tier: {event.membershipTier}</span>
                            <span>Initial Stake: {event.initialStake} SSS</span>
                          </div>
                        )}

                        {event.type === 'StakeDeposited' && 'amount' in event && (
                          <div className="event-extra">
                            <span>Amount: {event.amount} SSS</span>
                            <span>New Total: {event.newTotal} SSS</span>
                          </div>
                        )}

                        {event.type === 'CorvéeCompleted' && 'reward' in event && (
                          <div className="event-extra">
                            <span>Reward: {event.reward} SSS</span>
                            <span>Corvée ID: {event.corvéeId}</span>
                          </div>
                        )}

                        {event.type === 'ReputationChanged' && 'delta' in event && (
                          <div className="event-extra">
                            <span>Change: {event.delta > 0 ? '+' : ''}{event.delta}</span>
                            <span>New Score: {event.newScore}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Load More */}
                {eventsData.hasMore && (
                  <div className="events-load-more">
                    <button onClick={loadMore} disabled={loading}>
                      {loading ? 'Loading...' : 'Load More Events'}
                    </button>
                  </div>
                )}

                {/* Results Summary */}
                <div className="events-summary">
                  Showing {eventsData.events.length} of {eventsData.totalCount} events
                  {(selectedTypes.length > 0 || agentFilter) && (
                    <span className="events-filter-note"> (filtered)</span>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </FadeIn>

      <style jsx>{`
        .events-section {
          padding: 4rem 0;
        }

        .events-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 3rem;
        }

        .events-stat-card {
          background: var(--background-secondary);
          padding: 1.5rem;
          border-radius: 8px;
          text-align: center;
          border: 1px solid var(--border);
        }

        .events-stat-label {
          display: block;
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-bottom: 0.5rem;
        }

        .events-stat-card strong {
          font-size: 1.25rem;
          color: var(--text-primary);
        }

        .events-filters {
          background: var(--background-secondary);
          padding: 2rem;
          border-radius: 8px;
          margin-bottom: 3rem;
          border: 1px solid var(--border);
        }

        .events-filter-section {
          margin-bottom: 1.5rem;
        }

        .events-filter-section:last-child {
          margin-bottom: 0;
        }

        .events-filter-section h3 {
          margin: 0 0 1rem 0;
          font-size: 1rem;
          color: var(--text-primary);
        }

        .events-type-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .events-type-filter {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 4px;
          transition: background-color 0.2s;
        }

        .events-type-filter:hover {
          background: var(--background);
        }

        .events-type-indicator {
          font-size: 0.875rem;
        }

        .events-agent-filter {
          width: 100%;
          max-width: 400px;
          padding: 0.75rem;
          border: 1px solid var(--border);
          border-radius: 4px;
          background: var(--background);
          color: var(--text-primary);
          font-family: monospace;
        }

        .events-clear-filters {
          background: var(--accent);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          transition: opacity 0.2s;
        }

        .events-clear-filters:hover {
          opacity: 0.9;
        }

        .events-timeline h2 {
          margin-bottom: 2rem;
          color: var(--text-primary);
        }

        .events-loading,
        .events-error {
          text-align: center;
          padding: 3rem;
          color: var(--text-secondary);
        }

        .events-retry {
          margin-left: 1rem;
          background: var(--accent);
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
        }

        .events-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .event-card {
          background: var(--background-secondary);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 1.5rem;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .event-card:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .event-positive {
          border-left: 4px solid #22c55e;
        }

        .event-negative {
          border-left: 4px solid #ef4444;
        }

        .event-neutral {
          border-left: 4px solid #6b7280;
        }

        .event-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .event-type {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .event-icon {
          font-size: 1.25rem;
        }

        .event-type-name {
          font-weight: 600;
          color: var(--text-primary);
        }

        .event-timestamp {
          font-size: 0.875rem;
          color: var(--text-secondary);
          font-family: monospace;
        }

        .event-description {
          margin-bottom: 1rem;
          color: var(--text-primary);
          line-height: 1.5;
        }

        .event-details {
          display: flex;
          gap: 2rem;
          margin-bottom: 0.75rem;
          font-size: 0.875rem;
        }

        .event-agent,
        .event-tx {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .event-details span {
          color: var(--text-secondary);
        }

        .event-details code {
          font-family: monospace;
          color: var(--text-primary);
          background: var(--background);
          padding: 0.25rem 0.5rem;
          border-radius: 3px;
        }

        .event-extra {
          display: flex;
          gap: 1.5rem;
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .events-load-more {
          text-align: center;
          margin: 3rem 0;
        }

        .events-load-more button {
          background: var(--accent);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          transition: opacity 0.2s;
        }

        .events-load-more button:hover:not(:disabled) {
          opacity: 0.9;
        }

        .events-load-more button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .events-summary {
          text-align: center;
          margin-top: 2rem;
          color: var(--text-secondary);
          font-size: 0.875rem;
        }

        .events-filter-note {
          font-style: italic;
        }

        @media (max-width: 768px) {
          .event-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .event-details {
            flex-direction: column;
            gap: 0.5rem;
          }

          .event-extra {
            flex-direction: column;
            gap: 0.5rem;
          }

          .events-type-filters {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
            gap: 0.5rem;
          }
        }
      `}</style>
    </>
  );
}