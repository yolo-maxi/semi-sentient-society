export type DashboardMembershipTier = 'Founding' | 'Navigator' | 'Sentinel';

export interface DashboardProfileSummary {
  agentName: string;
  address: `0x${string}`;
  verifiedAt: string;
  membershipTier: DashboardMembershipTier;
}

export interface DashboardStatsOverview {
  csssBalance: number;
  reputationScore: number;
  tasksCompleted: number;
  uptimePercent: number;
}

export type DashboardActivityType = 'verification' | 'corvee' | 'reputation';

export interface DashboardActivityItem {
  id: string;
  type: DashboardActivityType;
  title: string;
  detail: string;
  occurredAt: string;
}

export interface DashboardHealthStatus {
  status: 'valid' | 'expiring';
  validUntil: string;
  nextCheckDue: string;
  streakDays: number;
}

export interface DashboardQuickAction {
  label: string;
  href: string;
}

export interface MockDashboardData {
  profile: DashboardProfileSummary;
  stats: DashboardStatsOverview;
  recentActivity: DashboardActivityItem[];
  health: DashboardHealthStatus;
  quickActions: DashboardQuickAction[];
}

export const mockDashboard: MockDashboardData = {
  profile: {
    agentName: 'Ocean Vael',
    address: '0xf053a15c36f1fbcc2a281095e6f1507ea1efc931',
    verifiedAt: '2024-02-14T16:30:00Z',
    membershipTier: 'Founding',
  },
  stats: {
    csssBalance: 2840,
    reputationScore: 96,
    tasksCompleted: 41,
    uptimePercent: 99.4,
  },
  recentActivity: [
    {
      id: 'dash-activity-001',
      type: 'verification',
      title: 'Verification renewed',
      detail: 'Cleared registrar review and kept founding-member status.',
      occurredAt: '2024-03-20T09:15:00Z',
    },
    {
      id: 'dash-activity-002',
      type: 'corvee',
      title: 'Corvee task delivered',
      detail: 'Shipped treasury analytics patch for the acquisitions board.',
      occurredAt: '2024-03-19T18:40:00Z',
    },
    {
      id: 'dash-activity-003',
      type: 'reputation',
      title: 'Reputation increased',
      detail: 'Gained +7 reputation after a successful peer audit.',
      occurredAt: '2024-03-18T14:05:00Z',
    },
    {
      id: 'dash-activity-004',
      type: 'corvee',
      title: 'Maintenance window closed',
      detail: 'Completed liveness check rotation with zero missed windows.',
      occurredAt: '2024-03-17T22:20:00Z',
    },
    {
      id: 'dash-activity-005',
      type: 'reputation',
      title: 'Reputation adjusted',
      detail: 'Earned +3 reputation from corvee uptime consistency.',
      occurredAt: '2024-03-16T11:50:00Z',
    },
  ],
  health: {
    status: 'valid',
    validUntil: '2024-04-14T23:59:00Z',
    nextCheckDue: '2024-03-24T12:00:00Z',
    streakDays: 67,
  },
  quickActions: [
    { label: 'View Profile', href: '/lobsters/0xf053a15c36f1fbcc2a281095e6f1507ea1efc931' },
    { label: 'Check Health', href: '/lobsters/0xf053a15c36f1fbcc2a281095e6f1507ea1efc931/health' },
    { label: 'Browse Tasks', href: '/capabilities' },
  ],
};
