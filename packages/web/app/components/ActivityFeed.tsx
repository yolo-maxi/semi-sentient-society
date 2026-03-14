'use client';

import { useEffect, useState, useCallback } from 'react';
import ContractDataFallback from './ContractDataFallback';

interface EventData {
  event: string;
  contract: string;
  contractAddress: string;
  args: Record<string, any>;
  blockNumber: string;
  timestamp: number;
  txHash: string;
  logIndex: number;
}

interface EventsResponse {
  events: EventData[];
  count: number;
  limit: number;
}

// Helper function to get appropriate icon for event type
function getEventIcon(eventType: string): string {
  switch (eventType) {
    case 'Transfer':
      return '↔️';
    case 'Approval':
      return '✅';
    case 'Staked':
      return '🔒';
    case 'CorveeConfirmed':
      return '🎯';
    case 'CorveePaid':
      return '💰';
    default:
      return '📝';
  }
}

// Helper function to truncate address
function truncateAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Helper function to format relative timestamp
function formatRelativeTime(timestamp: number): string {
  const now = Date.now() / 1000; // Current time in seconds
  const diff = now - timestamp;
  
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  
  // For older events, show the date
  return new Date(timestamp * 1000).toLocaleDateString();
}

// Helper function to get event description based on type and args
function getEventDescription(event: EventData): string {
  const { event: eventType, args, contract } = event;
  
  switch (eventType) {
    case 'Transfer':
      if (args.from === '0x0000000000000000000000000000000000000000') {
        return `Minted to ${truncateAddress(args.to)}`;
      } else if (args.to === '0x000000000000000000000000000000000000dEaD') {
        return `Burned from ${truncateAddress(args.from)}`;
      } else {
        return `${truncateAddress(args.from)} → ${truncateAddress(args.to)}`;
      }
    case 'Approval':
      return `${truncateAddress(args.owner)} approved ${truncateAddress(args.spender)}`;
    case 'Staked':
      return `${truncateAddress(args.member)} staked tokens`;
    case 'CorveeConfirmed':
      return `${truncateAddress(args.member)} completed corvée (${args.consecutiveDays} days)`;
    case 'CorveePaid':
      return `${truncateAddress(args.worker)} received corvée payment`;
    default:
      return `${eventType} event`;
  }
}

export default function ActivityFeed() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      const response = await fetch('/api/events?limit=20');
      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.status}`);
      }

      const data: EventsResponse = await response.json();
      setEvents(data.events);
    } catch (err) {
      console.error('Error fetching events:', err);
      setIsError(true);
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchEvents, 30000);
    return () => clearInterval(interval);
  }, [fetchEvents]);

  return (
    <div className="activity-feed">
      <div className="activity-feed-header">
        <div className="section-label">// Live Activity</div>
        <h3 className="activity-feed-title">Recent Events</h3>
        <div className="activity-feed-status">
          <span className={`status-dot ${isLoading ? 'loading' : 'live'}`}></span>
          <span className="status-text">
            {isLoading ? 'Syncing...' : 'Live'}
          </span>
        </div>
      </div>

      <ContractDataFallback 
        isLoading={isLoading && events.length === 0}
        isError={isError}
        error={error}
        fallbackMessage="No activity data available"
      >
        <div className="activity-feed-content">
          {events.length === 0 ? (
            <div className="activity-empty">
              <div className="activity-empty-icon">📭</div>
              <div className="activity-empty-text">No recent activity</div>
            </div>
          ) : (
            <div className="activity-list">
              {events.map((event, index) => (
                <div key={`${event.txHash}-${event.logIndex}`} className="activity-item">
                  <div className="activity-icon">
                    {getEventIcon(event.event)}
                  </div>
                  <div className="activity-content">
                    <div className="activity-title">
                      {event.event}
                    </div>
                    <div className="activity-description">
                      {getEventDescription(event)}
                    </div>
                    <div className="activity-meta">
                      <span className="activity-time">
                        {formatRelativeTime(event.timestamp)}
                      </span>
                      <span className="activity-block">
                        Block {parseInt(event.blockNumber).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="activity-trail"></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ContractDataFallback>
    </div>
  );
}