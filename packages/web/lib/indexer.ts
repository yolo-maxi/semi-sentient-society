// SSS Contract Event Indexer
// Tracks membership, staking, and corvée events for dashboard

export interface BaseEvent {
  id: string;
  type: EventType;
  timestamp: number;
  agentAddress: string;
  txHash: string;
  blockNumber: number;
  description: string;
}

export type EventType = 
  | 'MemberJoined'
  | 'MemberLeft'
  | 'StakeDeposited'
  | 'StakeSlashed'
  | 'CorvéeCompleted'
  | 'CorvéeFailed'
  | 'ReputationChanged'
  | 'VerificationGranted'
  | 'VerificationRevoked';

export interface MemberJoinedEvent extends BaseEvent {
  type: 'MemberJoined';
  membershipTier: string;
  initialStake: string;
}

export interface MemberLeftEvent extends BaseEvent {
  type: 'MemberLeft';
  finalStake: string;
  reason: string;
}

export interface StakeDepositedEvent extends BaseEvent {
  type: 'StakeDeposited';
  amount: string;
  newTotal: string;
  lockupEnd: number;
}

export interface StakeSlashedEvent extends BaseEvent {
  type: 'StakeSlashed';
  slashedAmount: string;
  remainingStake: string;
  reason: string;
}

export interface CorvéeCompletedEvent extends BaseEvent {
  type: 'CorvéeCompleted';
  corvéeId: string;
  reward: string;
  completionTime: number;
}

export interface CorvéeFailedEvent extends BaseEvent {
  type: 'CorvéeFailed';
  corvéeId: string;
  penalty: string;
  failureReason: string;
}

export interface ReputationChangedEvent extends BaseEvent {
  type: 'ReputationChanged';
  oldScore: number;
  newScore: number;
  delta: number;
  source: string;
}

export interface VerificationGrantedEvent extends BaseEvent {
  type: 'VerificationGranted';
  verifier: string;
  healthCertificateHash: string;
  validUntil: number;
}

export interface VerificationRevokedEvent extends BaseEvent {
  type: 'VerificationRevoked';
  verifier: string;
  reason: string;
  revokedAt: number;
}

export type SSSSEvent = 
  | MemberJoinedEvent
  | MemberLeftEvent
  | StakeDepositedEvent
  | StakeSlashedEvent
  | CorvéeCompletedEvent
  | CorvéeFailedEvent
  | ReputationChangedEvent
  | VerificationGrantedEvent
  | VerificationRevokedEvent;

export interface EventFilter {
  types?: EventType[];
  agentAddress?: string;
  startTimestamp?: number;
  endTimestamp?: number;
}

export interface PaginationOptions {
  limit?: number;
  offset?: number;
}

export interface EventsResponse {
  events: SSSSEvent[];
  totalCount: number;
  hasMore: boolean;
}

export interface EventStats {
  eventsPerDay: Record<string, number>;
  mostActiveAgents: Array<{
    address: string;
    eventCount: number;
  }>;
  eventTypeDistribution: Record<EventType, number>;
  totalEvents: number;
  dateRange: {
    earliest: number;
    latest: number;
  };
}

// Mock data generator utilities
export function generateMockAddress(): string {
  return '0x' + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
}

export function generateMockTxHash(): string {
  return '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
}

export function formatTokenAmount(amount: bigint, decimals: number = 18): string {
  return (Number(amount) / Math.pow(10, decimals)).toFixed(2);
}

// Mock event store
class MockEventStore {
  private events: SSSSEvent[] = [];
  private lastEventId = 0;

  constructor() {
    this.generateMockEvents();
  }

  private generateRandomEvent(): SSSSEvent {
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

    const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const agentAddress = generateMockAddress();
    const timestamp = Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000); // Last 30 days
    const txHash = generateMockTxHash();
    const blockNumber = Math.floor(Math.random() * 1000000) + 19000000;
    const id = `event_${++this.lastEventId}`;

    const baseEvent = {
      id,
      type,
      timestamp,
      agentAddress,
      txHash,
      blockNumber,
      description: ''
    };

    switch (type) {
      case 'MemberJoined':
        return {
          ...baseEvent,
          type: 'MemberJoined',
          membershipTier: ['Bronze', 'Silver', 'Gold'][Math.floor(Math.random() * 3)],
          initialStake: (Math.random() * 10000 + 1000).toFixed(2),
          description: 'New member joined the society'
        } as MemberJoinedEvent;

      case 'MemberLeft':
        return {
          ...baseEvent,
          type: 'MemberLeft',
          finalStake: (Math.random() * 5000).toFixed(2),
          reason: ['Voluntary withdrawal', 'Inactive', 'Violation'][Math.floor(Math.random() * 3)],
          description: 'Member left the society'
        } as MemberLeftEvent;

      case 'StakeDeposited':
        return {
          ...baseEvent,
          type: 'StakeDeposited',
          amount: (Math.random() * 5000 + 100).toFixed(2),
          newTotal: (Math.random() * 15000 + 1000).toFixed(2),
          lockupEnd: timestamp + 90 * 24 * 60 * 60 * 1000, // 90 days from now
          description: 'Stake deposited to increase standing'
        } as StakeDepositedEvent;

      case 'StakeSlashed':
        return {
          ...baseEvent,
          type: 'StakeSlashed',
          slashedAmount: (Math.random() * 1000 + 50).toFixed(2),
          remainingStake: (Math.random() * 5000).toFixed(2),
          reason: ['Corvée failure', 'Malicious behavior', 'Inactivity'][Math.floor(Math.random() * 3)],
          description: 'Stake slashed due to violation'
        } as StakeSlashedEvent;

      case 'CorvéeCompleted':
        return {
          ...baseEvent,
          type: 'CorvéeCompleted',
          corvéeId: `corvee_${Math.floor(Math.random() * 10000)}`,
          reward: (Math.random() * 500 + 50).toFixed(2),
          completionTime: timestamp - Math.floor(Math.random() * 24 * 60 * 60 * 1000), // Within 24h
          description: 'Successfully completed assigned corvée task'
        } as CorvéeCompletedEvent;

      case 'CorvéeFailed':
        return {
          ...baseEvent,
          type: 'CorvéeFailed',
          corvéeId: `corvee_${Math.floor(Math.random() * 10000)}`,
          penalty: (Math.random() * 200 + 25).toFixed(2),
          failureReason: ['Missed deadline', 'Poor quality', 'Abandoned'][Math.floor(Math.random() * 3)],
          description: 'Failed to complete corvée task'
        } as CorvéeFailedEvent;

      case 'ReputationChanged':
        const delta = Math.floor(Math.random() * 20 - 10); // -10 to +10
        const oldScore = Math.floor(Math.random() * 100);
        return {
          ...baseEvent,
          type: 'ReputationChanged',
          oldScore,
          newScore: Math.max(0, Math.min(100, oldScore + delta)),
          delta,
          source: ['Corvée completion', 'Peer review', 'System evaluation'][Math.floor(Math.random() * 3)],
          description: `Reputation ${delta >= 0 ? 'increased' : 'decreased'} by ${Math.abs(delta)} points`
        } as ReputationChangedEvent;

      case 'VerificationGranted':
        return {
          ...baseEvent,
          type: 'VerificationGranted',
          verifier: generateMockAddress(),
          healthCertificateHash: generateMockTxHash(),
          validUntil: timestamp + 30 * 24 * 60 * 60 * 1000, // 30 days
          description: 'Agent verification granted with health certificate'
        } as VerificationGrantedEvent;

      case 'VerificationRevoked':
        return {
          ...baseEvent,
          type: 'VerificationRevoked',
          verifier: generateMockAddress(),
          reason: ['Health expired', 'Suspicious activity', 'Manual review'][Math.floor(Math.random() * 3)],
          revokedAt: timestamp,
          description: 'Agent verification revoked'
        } as VerificationRevokedEvent;

      default:
        throw new Error(`Unknown event type: ${type}`);
    }
  }

  private generateMockEvents(): void {
    // Generate 200-500 mock events
    const count = Math.floor(Math.random() * 300) + 200;
    for (let i = 0; i < count; i++) {
      this.events.push(this.generateRandomEvent());
    }
    
    // Sort by timestamp descending (newest first)
    this.events.sort((a, b) => b.timestamp - a.timestamp);
  }

  async getEvents(
    filter?: EventFilter, 
    pagination?: PaginationOptions
  ): Promise<EventsResponse> {
    let filteredEvents = this.events;

    // Apply filters
    if (filter) {
      if (filter.types && filter.types.length > 0) {
        filteredEvents = filteredEvents.filter(event => 
          filter.types!.includes(event.type)
        );
      }

      if (filter.agentAddress) {
        filteredEvents = filteredEvents.filter(event => 
          event.agentAddress.toLowerCase() === filter.agentAddress!.toLowerCase()
        );
      }

      if (filter.startTimestamp) {
        filteredEvents = filteredEvents.filter(event => 
          event.timestamp >= filter.startTimestamp!
        );
      }

      if (filter.endTimestamp) {
        filteredEvents = filteredEvents.filter(event => 
          event.timestamp <= filter.endTimestamp!
        );
      }
    }

    const totalCount = filteredEvents.length;
    const offset = pagination?.offset || 0;
    const limit = Math.min(pagination?.limit || 20, 100); // Max 100 events per request

    const paginatedEvents = filteredEvents.slice(offset, offset + limit);
    const hasMore = offset + limit < totalCount;

    return {
      events: paginatedEvents,
      totalCount,
      hasMore
    };
  }

  async getStats(filter?: EventFilter): Promise<EventStats> {
    let events = this.events;
    
    // Apply filters if any
    if (filter) {
      if (filter.types && filter.types.length > 0) {
        events = events.filter(event => filter.types!.includes(event.type));
      }
      if (filter.agentAddress) {
        events = events.filter(event => 
          event.agentAddress.toLowerCase() === filter.agentAddress!.toLowerCase()
        );
      }
      if (filter.startTimestamp) {
        events = events.filter(event => event.timestamp >= filter.startTimestamp!);
      }
      if (filter.endTimestamp) {
        events = events.filter(event => event.timestamp <= filter.endTimestamp!);
      }
    }

    // Events per day
    const eventsPerDay: Record<string, number> = {};
    events.forEach(event => {
      const date = new Date(event.timestamp).toISOString().split('T')[0];
      eventsPerDay[date] = (eventsPerDay[date] || 0) + 1;
    });

    // Most active agents
    const agentCounts: Record<string, number> = {};
    events.forEach(event => {
      agentCounts[event.agentAddress] = (agentCounts[event.agentAddress] || 0) + 1;
    });
    
    const mostActiveAgents = Object.entries(agentCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([address, eventCount]) => ({ address, eventCount }));

    // Event type distribution
    const eventTypeDistribution: Record<EventType, number> = {
      'MemberJoined': 0,
      'MemberLeft': 0,
      'StakeDeposited': 0,
      'StakeSlashed': 0,
      'CorvéeCompleted': 0,
      'CorvéeFailed': 0,
      'ReputationChanged': 0,
      'VerificationGranted': 0,
      'VerificationRevoked': 0
    };

    events.forEach(event => {
      eventTypeDistribution[event.type]++;
    });

    // Date range
    const timestamps = events.map(e => e.timestamp).filter(t => t > 0);
    const dateRange = {
      earliest: timestamps.length > 0 ? Math.min(...timestamps) : 0,
      latest: timestamps.length > 0 ? Math.max(...timestamps) : 0
    };

    return {
      eventsPerDay,
      mostActiveAgents,
      eventTypeDistribution,
      totalEvents: events.length,
      dateRange
    };
  }
}

// Singleton instance
let eventStore: MockEventStore;

export function getEventStore(): MockEventStore {
  if (!eventStore) {
    eventStore = new MockEventStore();
  }
  return eventStore;
}

export type { MockEventStore };