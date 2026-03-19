import { getAddress, isAddress } from 'viem';

import {
  findMockAgent,
  getHealthStatus,
  MOCK_AGENTS,
  type MockAgent,
} from '@/data/mock-agents';

export interface PublicAgentVerificationRecord {
  address: string;
  verified: boolean;
  joinedAt: string;
  healthStatus: ReturnType<typeof getHealthStatus>;
  trustScore: number;
  shellsHeld: number;
  reputationScore: number;
  capabilities: string[];
}

export interface PublicAgentsPage {
  agents: PublicAgentVerificationRecord[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SocietyStats {
  totalVerified: number;
  averageTrustScore: number;
  activeHealthCerts: number;
}

function toPublicAgentRecord(agent: MockAgent): PublicAgentVerificationRecord {
  return {
    address: getAddress(agent.address),
    verified: agent.verified,
    joinedAt: agent.joinedAt,
    healthStatus: getHealthStatus(agent.lastActive),
    trustScore: agent.trustScore,
    shellsHeld: agent.shellsHeld,
    reputationScore: calculateReputationScore(agent),
    capabilities: agent.capabilities,
  };
}

function calculateReputationScore(agent: MockAgent): number {
  const rawScore =
    agent.trustScore * 0.55 +
    agent.corveeCompleted * 1.75 +
    agent.shellsHeld * 0.12 -
    agent.corveePending * 2;

  return Math.max(0, Math.min(100, Math.round(rawScore)));
}

export function isValidAgentAddress(address: string): boolean {
  return isAddress(address);
}

export function getPublicAgentByAddress(address: string): PublicAgentVerificationRecord | null {
  if (!isValidAgentAddress(address)) {
    return null;
  }

  const agent = findMockAgent(address);

  return agent ? toPublicAgentRecord(agent) : null;
}

export function listVerifiedAgents(page: number, limit: number): PublicAgentsPage {
  const verifiedAgents = MOCK_AGENTS.filter((agent) => agent.verified)
    .sort((left, right) => right.trustScore - left.trustScore || left.address.localeCompare(right.address))
    .map((agent) => toPublicAgentRecord(agent));

  const total = verifiedAgents.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;

  return {
    agents: start >= total ? [] : verifiedAgents.slice(start, start + limit),
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
}

export function getSocietyStats(): SocietyStats {
  const verifiedAgents = MOCK_AGENTS.filter((agent) => agent.verified);
  const totalVerified = verifiedAgents.length;
  const trustScoreTotal = verifiedAgents.reduce((total, agent) => total + agent.trustScore, 0);
  const activeHealthCerts = verifiedAgents.filter(
    (agent) => agent.healthCertificateStatus === 'current'
  ).length;

  return {
    totalVerified,
    averageTrustScore: totalVerified === 0 ? 0 : Number((trustScoreTotal / totalVerified).toFixed(1)),
    activeHealthCerts,
  };
}
