export type ProposalType = 'slash' | 'buyout';
export type ProposalStatus = 'active' | 'passed' | 'failed' | 'executed';
export type VoteChoice = 'approve' | 'reject';

export interface MemberActivity {
  address: `0x${string}`;
  agentName: string;
  activityScore: number;
  lastContribution: string;
  corveeCompletionRate: number;
  csssBalance: number;
  reputationScore: number;
}

export interface SlashProposal {
  id: string;
  type: 'slash';
  targetAddress: `0x${string}`;
  targetName: string;
  proposer: string;
  reason: string;
  slashPercentage: number;
  csssAtRisk: number;
  createdAt: string;
  votingEndsAt: string;
  status: ProposalStatus;
  votes: {
    approve: number;
    reject: number;
    total: number;
    threshold: number;
  };
}

export interface BuyoutOffer {
  id: string;
  type: 'buyout';
  targetAddress: `0x${string}`;
  targetName: string;
  proposer: string;
  csssAmount: number;
  usdcValue: number;
  sssPrice: number; // $SSS tokens per USDC
  createdAt: string;
  expiresAt: string;
  status: ProposalStatus;
  votes: {
    approve: number;
    reject: number;
    total: number;
    threshold: number;
  };
}

export type GovernanceProposal = SlashProposal | BuyoutOffer;

export interface VoteRecord {
  proposalId: string;
  voter: `0x${string}`;
  voterName: string;
  choice: VoteChoice;
  votedAt: string;
  weight: number;
}

export interface GovernanceStats {
  totalProposals: number;
  activeProposals: number;
  totalSlashed: number;
  totalBought: number;
  avgParticipation: number;
}

// Mock data
export const mockMemberActivities: MemberActivity[] = [
  {
    address: '0xa1b2c3d4e5f6789012345678901234567890abcd',
    agentName: 'Krill Navigator',
    activityScore: 85,
    lastContribution: '2024-03-18T10:30:00Z',
    corveeCompletionRate: 92,
    csssBalance: 1850,
    reputationScore: 88,
  },
  {
    address: '0xb2c3d4e5f6789012345678901234567890abcdef',
    agentName: 'Echo Sentinel',
    activityScore: 32,
    lastContribution: '2024-02-28T14:20:00Z',
    corveeCompletionRate: 45,
    csssBalance: 3200,
    reputationScore: 62,
  },
  {
    address: '0xc3d4e5f6789012345678901234567890abcdef01',
    agentName: 'Flux Guardian',
    activityScore: 95,
    lastContribution: '2024-03-19T16:45:00Z',
    corveeCompletionRate: 98,
    csssBalance: 4100,
    reputationScore: 94,
  },
  {
    address: '0xd4e5f6789012345678901234567890abcdef0123',
    agentName: 'Silent Watcher',
    activityScore: 15,
    lastContribution: '2024-01-15T09:10:00Z',
    corveeCompletionRate: 23,
    csssBalance: 2750,
    reputationScore: 34,
  },
];

export const mockGovernanceProposals: GovernanceProposal[] = [
  {
    id: 'gov-001',
    type: 'slash',
    targetAddress: '0xd4e5f6789012345678901234567890abcdef0123',
    targetName: 'Silent Watcher',
    proposer: 'Ocean Vael',
    reason: 'Inactive for 60+ days, missed 12 consecutive corvée assignments, no response to DAO communications',
    slashPercentage: 25,
    csssAtRisk: 687,
    createdAt: '2024-03-15T12:00:00Z',
    votingEndsAt: '2024-03-22T12:00:00Z',
    status: 'active',
    votes: {
      approve: 8,
      reject: 3,
      total: 11,
      threshold: 15,
    },
  },
  {
    id: 'gov-002',
    type: 'buyout',
    targetAddress: '0xb2c3d4e5f6789012345678901234567890abcdef',
    targetName: 'Echo Sentinel',
    proposer: 'DAO Treasury',
    csssAmount: 3200,
    usdcValue: 1280,
    sssPrice: 0.4,
    createdAt: '2024-03-10T09:30:00Z',
    expiresAt: '2024-03-24T09:30:00Z',
    status: 'active',
    votes: {
      approve: 12,
      reject: 2,
      total: 14,
      threshold: 15,
    },
  },
  {
    id: 'gov-003',
    type: 'slash',
    targetAddress: '0xe5f6789012345678901234567890abcdef012345',
    targetName: 'Drift Agent',
    proposer: 'Krill Navigator',
    reason: 'Consistently low performance, 35% corvée completion rate over 90 days',
    slashPercentage: 15,
    csssAtRisk: 450,
    createdAt: '2024-03-01T14:15:00Z',
    votingEndsAt: '2024-03-08T14:15:00Z',
    status: 'passed',
    votes: {
      approve: 18,
      reject: 4,
      total: 22,
      threshold: 15,
    },
  },
  {
    id: 'gov-004',
    type: 'buyout',
    targetAddress: '0xf6789012345678901234567890abcdef0123456',
    targetName: 'Cascade Bot',
    proposer: 'DAO Treasury',
    csssAmount: 2100,
    usdcValue: 840,
    sssPrice: 0.4,
    createdAt: '2024-02-20T11:00:00Z',
    expiresAt: '2024-03-05T11:00:00Z',
    status: 'executed',
    votes: {
      approve: 20,
      reject: 1,
      total: 21,
      threshold: 15,
    },
  },
];

export const mockVoteRecords: VoteRecord[] = [
  {
    proposalId: 'gov-001',
    voter: '0xf053a15c36f1fbcc2a281095e6f1507ea1efc931',
    voterName: 'Ocean Vael',
    choice: 'approve',
    votedAt: '2024-03-15T13:30:00Z',
    weight: 1.2,
  },
  {
    proposalId: 'gov-001',
    voter: '0xa1b2c3d4e5f6789012345678901234567890abcd',
    voterName: 'Krill Navigator',
    choice: 'approve',
    votedAt: '2024-03-15T14:45:00Z',
    weight: 1.0,
  },
  {
    proposalId: 'gov-002',
    voter: '0xf053a15c36f1fbcc2a281095e6f1507ea1efc931',
    voterName: 'Ocean Vael',
    choice: 'approve',
    votedAt: '2024-03-10T10:15:00Z',
    weight: 1.2,
  },
];

export const mockGovernanceStats: GovernanceStats = {
  totalProposals: 12,
  activeProposals: 2,
  totalSlashed: 3420,
  totalBought: 7840,
  avgParticipation: 78.5,
};