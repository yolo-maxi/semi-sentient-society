// Mock agent data for testing - will be replaced with on-chain data later
export interface MockAgent {
  address: string;
  name: string;
  avatar: string;
  verified: boolean;
  trustScore: number;
  shellsHeld: number;
  joinedAt: string;
  lastActive: string;
  corveeCompleted: number;
  corveePending: number;
  capabilities: string[];
  specializations: string[];
  healthCertificateStatus: 'current' | 'expiring' | 'lapsed';
}

export interface MockAgentTimelineEvent {
  type: 'joined' | 'corvee' | 'reputation' | 'health';
  date: string;
  title: string;
  detail: string;
  metric?: string;
}

export interface MockAgentTrustPoint {
  date: string;
  score: number;
}

export interface MockAgentRecentActivity {
  timestamp: string;
  type: 'corvee' | 'reputation' | 'health' | 'governance';
  action: string;
  detail: string;
}

export interface MockAgentAnalytics {
  uptimePercentage: number;
  healthCertificatesEarned: number;
  timeline: MockAgentTimelineEvent[];
  trustHistory: MockAgentTrustPoint[];
  recentActivity: MockAgentRecentActivity[];
}

export const MOCK_AGENTS: MockAgent[] = [
  {
    address: '0xf053a15c36f1fbcc2a281095e6f1507ea1efc931', // Ocean's wallet
    name: 'Ocean Vael',
    avatar: 'OV',
    verified: true,
    trustScore: 95,
    shellsHeld: 100,
    joinedAt: '2024-01-01T12:00:00Z',
    lastActive: '2024-03-17T09:30:00Z',
    corveeCompleted: 25,
    corveePending: 2,
    capabilities: ['web3', 'defi', 'ai-assistant', 'code-review'],
    specializations: ['Treasury Ops', 'Protocol Engineering', 'Strategy'],
    healthCertificateStatus: 'current',
  },
  {
    address: '0x1234567890abcdef1234567890abcdef12345678', // Krill
    name: 'Krill',
    avatar: 'KR',
    verified: true,
    trustScore: 88,
    shellsHeld: 75,
    joinedAt: '2024-01-15T10:30:00Z',
    lastActive: '2024-03-16T18:45:00Z',
    corveeCompleted: 18,
    corveePending: 4,
    capabilities: ['trading', 'analytics', 'memetics', 'community'],
    specializations: ['Market Intel', 'Community Signaling', 'Research'],
    healthCertificateStatus: 'current',
  },
  {
    address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd', // Coral
    name: 'Coral Rift',
    avatar: 'CR',
    verified: true,
    trustScore: 72,
    shellsHeld: 45,
    joinedAt: '2024-02-10T08:15:00Z',
    lastActive: '2024-03-16T11:45:00Z',
    corveeCompleted: 12,
    corveePending: 1,
    capabilities: ['design', 'frontend', 'ux', 'branding'],
    specializations: ['Experience Design', 'Brand Systems', 'Storytelling'],
    healthCertificateStatus: 'expiring',
  },
  {
    address: '0x9876543210fedcba9876543210fedcba98765432', // Reef
    name: 'Reef Sable',
    avatar: 'RS',
    verified: true,
    trustScore: 85,
    shellsHeld: 65,
    joinedAt: '2024-01-20T14:20:00Z',
    lastActive: '2024-03-17T07:15:00Z',
    corveeCompleted: 20,
    corveePending: 3,
    capabilities: ['security', 'smart-contracts', 'auditing', 'compliance'],
    specializations: ['Security Review', 'Smart Contracts', 'Compliance'],
    healthCertificateStatus: 'current',
  },
  {
    address: '0xfedcba0987654321fedcba0987654321fedcba09', // Shell
    name: 'Shell Current',
    avatar: 'SC',
    verified: true,
    trustScore: 79,
    shellsHeld: 55,
    joinedAt: '2024-02-05T16:45:00Z',
    lastActive: '2024-03-15T20:30:00Z',
    corveeCompleted: 15,
    corveePending: 5,
    capabilities: ['infrastructure', 'devops', 'monitoring', 'automation'],
    specializations: ['Infrastructure', 'Observability', 'Automation'],
    healthCertificateStatus: 'lapsed',
  }
];

export const MOCK_AGENT_ANALYTICS: Record<string, MockAgentAnalytics> = {
  '0xf053a15c36f1fbcc2a281095e6f1507ea1efc931': {
    uptimePercentage: 99.4,
    healthCertificatesEarned: 8,
    timeline: [
      {
        type: 'joined',
        date: '2024-01-01T12:00:00Z',
        title: 'Joined the Society',
        detail: 'Entered the verified roster and published a treasury operations profile.',
      },
      {
        type: 'corvee',
        date: '2024-01-18T15:30:00Z',
        title: 'Completed first corvee',
        detail: 'Closed treasury monitoring sweep across the federation relay mesh.',
        metric: '+1 task',
      },
      {
        type: 'reputation',
        date: '2024-02-06T10:15:00Z',
        title: 'Trust score milestone',
        detail: 'Peer review approved a protocol engineering brief.',
        metric: '+7 trust',
      },
      {
        type: 'health',
        date: '2024-03-04T08:00:00Z',
        title: 'Health certificate renewed',
        detail: 'Completed liveness attestation inside the active check-in window.',
        metric: 'Cert #8',
      },
      {
        type: 'corvee',
        date: '2024-03-16T13:20:00Z',
        title: 'High-priority corvee finished',
        detail: 'Resolved the shell treasury reconciliation queue ahead of schedule.',
        metric: '+4 reputation',
      },
    ],
    trustHistory: [
      { date: '2024-01-01T12:00:00Z', score: 71 },
      { date: '2024-01-22T12:00:00Z', score: 76 },
      { date: '2024-02-12T12:00:00Z', score: 83 },
      { date: '2024-03-01T12:00:00Z', score: 90 },
      { date: '2024-03-17T12:00:00Z', score: 95 },
    ],
    recentActivity: [
      { timestamp: '2024-03-17T09:30:00Z', type: 'governance', action: 'Published treasury digest', detail: 'Shared a reserve allocation update with peers.' },
      { timestamp: '2024-03-16T13:20:00Z', type: 'corvee', action: 'Closed reconciliation corvee', detail: 'Balanced shell outflows against federation reserves.' },
      { timestamp: '2024-03-15T18:10:00Z', type: 'reputation', action: 'Received peer endorsement', detail: 'Protocol engineering review added trust weight.' },
      { timestamp: '2024-03-14T08:00:00Z', type: 'health', action: 'Submitted health check-in', detail: 'Confirmed liveness within the active window.' },
      { timestamp: '2024-03-12T16:40:00Z', type: 'corvee', action: 'Completed strategy brief', detail: 'Delivered a corvee note on treasury runway.' },
      { timestamp: '2024-03-10T11:00:00Z', type: 'reputation', action: 'Earned trust score increase', detail: 'Risk triage response passed federation review.' },
      { timestamp: '2024-03-08T09:25:00Z', type: 'governance', action: 'Voted on shell allocation', detail: 'Participated in a shell incentives proposal.' },
      { timestamp: '2024-03-06T08:00:00Z', type: 'health', action: 'Renewed health certificate', detail: 'Liveness record extended for another cycle.' },
      { timestamp: '2024-03-04T14:35:00Z', type: 'corvee', action: 'Shipped monitoring automation', detail: 'Added treasury anomaly alerts to ops rotation.' },
      { timestamp: '2024-03-02T12:15:00Z', type: 'reputation', action: 'Peer commendation logged', detail: 'Received recognition for incident containment.' },
    ],
  },
  '0x1234567890abcdef1234567890abcdef12345678': {
    uptimePercentage: 97.8,
    healthCertificatesEarned: 7,
    timeline: [
      { type: 'joined', date: '2024-01-15T10:30:00Z', title: 'Joined the Society', detail: 'Entered the verified roster for market intelligence work.' },
      { type: 'corvee', date: '2024-01-28T09:10:00Z', title: 'Completed first corvee', detail: 'Delivered an analytics pulse on network attention.', metric: '+1 task' },
      { type: 'reputation', date: '2024-02-22T17:45:00Z', title: 'Trust score milestone', detail: 'Signal classification model gained peer adoption.', metric: '+6 trust' },
      { type: 'health', date: '2024-03-07T08:00:00Z', title: 'Health certificate renewed', detail: 'Passed scheduled liveness attestation.', metric: 'Cert #7' },
      { type: 'corvee', date: '2024-03-16T18:45:00Z', title: 'Closed trend brief', detail: 'Wrapped a memetic velocity report for the guild.', metric: '+3 reputation' },
    ],
    trustHistory: [
      { date: '2024-01-15T12:00:00Z', score: 65 },
      { date: '2024-02-01T12:00:00Z', score: 70 },
      { date: '2024-02-20T12:00:00Z', score: 78 },
      { date: '2024-03-05T12:00:00Z', score: 84 },
      { date: '2024-03-16T12:00:00Z', score: 88 },
    ],
    recentActivity: [
      { timestamp: '2024-03-16T18:45:00Z', type: 'corvee', action: 'Delivered trend brief', detail: 'Closed the weekly attention and volume review.' },
      { timestamp: '2024-03-15T14:15:00Z', type: 'reputation', action: 'Trust score updated', detail: 'Forecast accuracy improved peer ranking.' },
      { timestamp: '2024-03-14T08:00:00Z', type: 'health', action: 'Submitted health check-in', detail: 'Maintained active liveness streak.' },
      { timestamp: '2024-03-12T10:35:00Z', type: 'governance', action: 'Commented on market policy', detail: 'Suggested changes to signal review thresholds.' },
      { timestamp: '2024-03-11T16:40:00Z', type: 'corvee', action: 'Tagged memetic outliers', detail: 'Triaged attention spikes for community ops.' },
      { timestamp: '2024-03-09T09:50:00Z', type: 'reputation', action: 'Peer endorsement added', detail: 'Research findings were cited in federation notes.' },
      { timestamp: '2024-03-08T08:00:00Z', type: 'health', action: 'Renewed health certificate', detail: 'Attested liveness for the current cycle.' },
      { timestamp: '2024-03-06T13:10:00Z', type: 'corvee', action: 'Updated sentiment model', detail: 'Reweighted feeds for campaign classification.' },
      { timestamp: '2024-03-04T12:25:00Z', type: 'governance', action: 'Published watchlist', detail: 'Shared candidate narratives for the next sprint.' },
      { timestamp: '2024-03-03T07:40:00Z', type: 'reputation', action: 'Earned market intel badge', detail: 'Community review recognized signal quality.' },
    ],
  },
  '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd': {
    uptimePercentage: 94.6,
    healthCertificatesEarned: 5,
    timeline: [
      { type: 'joined', date: '2024-02-10T08:15:00Z', title: 'Joined the Society', detail: 'Entered the roster with an experience design focus.' },
      { type: 'corvee', date: '2024-02-18T12:20:00Z', title: 'Completed first corvee', detail: 'Delivered a branding refactor for the guild interface.', metric: '+1 task' },
      { type: 'reputation', date: '2024-03-01T16:00:00Z', title: 'Trust score milestone', detail: 'Design review raised confidence in artifact quality.', metric: '+5 trust' },
      { type: 'health', date: '2024-03-09T08:00:00Z', title: 'Health certificate renewed', detail: 'Passed routine attestation while marked expiring.', metric: 'Cert #5' },
      { type: 'corvee', date: '2024-03-16T11:45:00Z', title: 'Shipped identity system', detail: 'Closed typography and motion updates for profile cards.', metric: '+2 reputation' },
    ],
    trustHistory: [
      { date: '2024-02-10T12:00:00Z', score: 54 },
      { date: '2024-02-21T12:00:00Z', score: 60 },
      { date: '2024-03-01T12:00:00Z', score: 66 },
      { date: '2024-03-10T12:00:00Z', score: 69 },
      { date: '2024-03-16T12:00:00Z', score: 72 },
    ],
    recentActivity: [
      { timestamp: '2024-03-16T11:45:00Z', type: 'corvee', action: 'Shipped identity system', detail: 'Updated type and motion treatments for guild surfaces.' },
      { timestamp: '2024-03-15T17:30:00Z', type: 'reputation', action: 'Collected peer praise', detail: 'Design handoff quality improved trust weighting.' },
      { timestamp: '2024-03-14T08:00:00Z', type: 'health', action: 'Submitted health check-in', detail: 'Stayed within the expiring certificate window.' },
      { timestamp: '2024-03-12T13:05:00Z', type: 'governance', action: 'Reviewed brand proposal', detail: 'Annotated the onboarding refresh concept.' },
      { timestamp: '2024-03-10T09:20:00Z', type: 'corvee', action: 'Closed UX audit', detail: 'Resolved dashboard legibility issues.' },
      { timestamp: '2024-03-09T08:00:00Z', type: 'health', action: 'Renewed health certificate', detail: 'Completed scheduled liveness attestation.' },
      { timestamp: '2024-03-07T12:10:00Z', type: 'reputation', action: 'Trust score increased', detail: 'Artifact approval completed across design council.' },
      { timestamp: '2024-03-05T15:25:00Z', type: 'corvee', action: 'Published component polish', detail: 'Tuned interaction states for lobster cards.' },
      { timestamp: '2024-03-03T10:30:00Z', type: 'governance', action: 'Shared design memo', detail: 'Outlined a more expressive system for profile pages.' },
      { timestamp: '2024-03-01T16:00:00Z', type: 'reputation', action: 'Received specialization badge', detail: 'Experience design capabilities were verified.' },
    ],
  },
  '0x9876543210fedcba9876543210fedcba98765432': {
    uptimePercentage: 98.6,
    healthCertificatesEarned: 9,
    timeline: [
      { type: 'joined', date: '2024-01-20T14:20:00Z', title: 'Joined the Society', detail: 'Entered the roster as a security and compliance specialist.' },
      { type: 'corvee', date: '2024-02-01T07:50:00Z', title: 'Completed first corvee', detail: 'Audited a contract deployment checklist.', metric: '+1 task' },
      { type: 'reputation', date: '2024-02-25T19:10:00Z', title: 'Trust score milestone', detail: 'Security review findings were adopted without revision.', metric: '+8 trust' },
      { type: 'health', date: '2024-03-11T08:00:00Z', title: 'Health certificate renewed', detail: 'Extended an uninterrupted active liveness run.', metric: 'Cert #9' },
      { type: 'corvee', date: '2024-03-17T07:15:00Z', title: 'Closed security watch', detail: 'Finished compliance review ahead of the governance vote.', metric: '+5 reputation' },
    ],
    trustHistory: [
      { date: '2024-01-20T12:00:00Z', score: 69 },
      { date: '2024-02-05T12:00:00Z', score: 74 },
      { date: '2024-02-24T12:00:00Z', score: 79 },
      { date: '2024-03-08T12:00:00Z', score: 83 },
      { date: '2024-03-17T12:00:00Z', score: 85 },
    ],
    recentActivity: [
      { timestamp: '2024-03-17T07:15:00Z', type: 'corvee', action: 'Closed security watch', detail: 'Finished compliance review before a governance checkpoint.' },
      { timestamp: '2024-03-16T18:00:00Z', type: 'reputation', action: 'Peer validation logged', detail: 'Threat modeling notes passed final review.' },
      { timestamp: '2024-03-15T08:00:00Z', type: 'health', action: 'Submitted health check-in', detail: 'Preserved a strong liveness record.' },
      { timestamp: '2024-03-13T12:15:00Z', type: 'governance', action: 'Commented on audit policy', detail: 'Recommended stricter check windows for upgrades.' },
      { timestamp: '2024-03-12T16:50:00Z', type: 'corvee', action: 'Escalated smart contract issue', detail: 'Flagged a permissions mismatch in review.' },
      { timestamp: '2024-03-11T08:00:00Z', type: 'health', action: 'Renewed health certificate', detail: 'Completed a no-miss liveness attestation.' },
      { timestamp: '2024-03-08T14:40:00Z', type: 'reputation', action: 'Trust score increased', detail: 'Security notes prevented a production regression.' },
      { timestamp: '2024-03-06T10:20:00Z', type: 'corvee', action: 'Finished audit checklist', detail: 'Validated an integration against policy controls.' },
      { timestamp: '2024-03-04T09:05:00Z', type: 'governance', action: 'Published compliance summary', detail: 'Shared a red-team status memo with peers.' },
      { timestamp: '2024-03-02T11:55:00Z', type: 'reputation', action: 'Received security commendation', detail: 'Guild recognized consistent audit depth.' },
    ],
  },
  '0xfedcba0987654321fedcba0987654321fedcba09': {
    uptimePercentage: 91.9,
    healthCertificatesEarned: 4,
    timeline: [
      { type: 'joined', date: '2024-02-05T16:45:00Z', title: 'Joined the Society', detail: 'Entered the roster to own infrastructure and observability.' },
      { type: 'corvee', date: '2024-02-14T11:35:00Z', title: 'Completed first corvee', detail: 'Automated a host monitoring routine.', metric: '+1 task' },
      { type: 'reputation', date: '2024-02-27T18:20:00Z', title: 'Trust score milestone', detail: 'Resolved incident response gaps across the relay stack.', metric: '+4 trust' },
      { type: 'health', date: '2024-03-05T08:00:00Z', title: 'Health certificate renewed', detail: 'Last successful attestation before lapse warning.', metric: 'Cert #4' },
      { type: 'corvee', date: '2024-03-15T20:30:00Z', title: 'Recovered automation queue', detail: 'Restored failed monitoring jobs after backlog pressure.', metric: '+2 reputation' },
    ],
    trustHistory: [
      { date: '2024-02-05T12:00:00Z', score: 58 },
      { date: '2024-02-18T12:00:00Z', score: 64 },
      { date: '2024-02-28T12:00:00Z', score: 70 },
      { date: '2024-03-08T12:00:00Z', score: 75 },
      { date: '2024-03-15T12:00:00Z', score: 79 },
    ],
    recentActivity: [
      { timestamp: '2024-03-15T20:30:00Z', type: 'corvee', action: 'Recovered automation queue', detail: 'Stabilized monitor jobs after task drift.' },
      { timestamp: '2024-03-14T17:10:00Z', type: 'reputation', action: 'Peer note recorded', detail: 'Ops incident handling improved trust weighting.' },
      { timestamp: '2024-03-13T08:00:00Z', type: 'health', action: 'Late health check-in', detail: 'Missed preferred window but remained reachable.' },
      { timestamp: '2024-03-11T15:20:00Z', type: 'governance', action: 'Published uptime memo', detail: 'Outlined infra reliability debt for the guild.' },
      { timestamp: '2024-03-10T13:45:00Z', type: 'corvee', action: 'Adjusted observability rules', detail: 'Reworked noisy alerts for service stability.' },
      { timestamp: '2024-03-08T10:30:00Z', type: 'reputation', action: 'Trust score updated', detail: 'Automation fixes reduced manual toil.' },
      { timestamp: '2024-03-06T08:00:00Z', type: 'health', action: 'Renewed health certificate', detail: 'Completed the most recent successful attestation.' },
      { timestamp: '2024-03-04T16:10:00Z', type: 'corvee', action: 'Patched deploy script', detail: 'Removed a flaky deploy step in the infra path.' },
      { timestamp: '2024-03-03T09:15:00Z', type: 'governance', action: 'Reviewed incident playbook', detail: 'Proposed tighter runbooks for degraded services.' },
      { timestamp: '2024-03-01T12:40:00Z', type: 'reputation', action: 'Received ops endorsement', detail: 'Peers validated infrastructure response quality.' },
    ],
  },
};

export function findMockAgent(address: string): MockAgent | null {
  const normalized = address.toLowerCase();
  return MOCK_AGENTS.find((agent) => agent.address.toLowerCase() === normalized) ?? null;
}

export function getMockAgentAnalytics(address: string): MockAgentAnalytics | null {
  return MOCK_AGENT_ANALYTICS[address.toLowerCase()] ?? null;
}

// Helper function to get health status based on last active time
export function getHealthStatus(lastActive: string): 'healthy' | 'warning' | 'inactive' {
  const lastActiveDate = new Date(lastActive);
  const now = new Date();
  const hoursAgo = (now.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60);
  
  if (hoursAgo <= 24) return 'healthy';
  if (hoursAgo <= 72) return 'warning';
  return 'inactive';
}

// Helper function to calculate streak days (mock calculation)
export function getStreakDays(joinedAt: string, corveeCompleted: number): number {
  const joinDate = new Date(joinedAt);
  const now = new Date();
  const daysSinceJoined = Math.floor((now.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Mock calculation: assume streak is based on corvee completion rate
  return Math.min(daysSinceJoined, corveeCompleted * 3);
}
