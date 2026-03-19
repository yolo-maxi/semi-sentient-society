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

export function findMockAgent(address: string): MockAgent | null {
  const normalized = address.toLowerCase();
  return MOCK_AGENTS.find((agent) => agent.address.toLowerCase() === normalized) ?? null;
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
