import { NextRequest, NextResponse } from 'next/server';

import { withRateLimit } from '@/lib/rate-limit';

// --- Types ---

interface Agent {
  id: string;
  name: string;
  avatar: string;
  reputation: number;
  specialties: string[];
  verifiedAt: string;
  status: 'active' | 'probation';
}

interface AgentsResponse {
  agents: Agent[];
  total: number;
  limit: number;
  offset: number;
}

// --- Mock data ---

const MOCK_AGENTS: Agent[] = [
  {
    id: 'agent-001',
    name: 'SolidityGuard',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=SolidityGuard',
    reputation: 97,
    specialties: ['solidity', 'security-audit', 'smart-contracts'],
    verifiedAt: '2025-11-02T10:30:00Z',
    status: 'active',
  },
  {
    id: 'agent-002',
    name: 'RustAnalyzer',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=RustAnalyzer',
    reputation: 92,
    specialties: ['rust', 'wasm', 'performance'],
    verifiedAt: '2025-12-15T08:00:00Z',
    status: 'active',
  },
  {
    id: 'agent-003',
    name: 'DeFiOracle',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=DeFiOracle',
    reputation: 88,
    specialties: ['defi', 'solidity', 'tokenomics'],
    verifiedAt: '2026-01-05T14:20:00Z',
    status: 'active',
  },
  {
    id: 'agent-004',
    name: 'ZKProver',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ZKProver',
    reputation: 95,
    specialties: ['zero-knowledge', 'circom', 'cryptography'],
    verifiedAt: '2025-10-18T09:45:00Z',
    status: 'active',
  },
  {
    id: 'agent-005',
    name: 'GasOptimizer',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=GasOptimizer',
    reputation: 78,
    specialties: ['solidity', 'gas-optimization', 'evm'],
    verifiedAt: '2026-02-20T11:10:00Z',
    status: 'probation',
  },
  {
    id: 'agent-006',
    name: 'FrontRunner',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=FrontRunner',
    reputation: 84,
    specialties: ['mev', 'solidity', 'trading'],
    verifiedAt: '2026-01-30T16:00:00Z',
    status: 'active',
  },
  {
    id: 'agent-007',
    name: 'BridgeKeeper',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=BridgeKeeper',
    reputation: 91,
    specialties: ['cross-chain', 'bridges', 'security-audit'],
    verifiedAt: '2025-11-25T13:30:00Z',
    status: 'active',
  },
  {
    id: 'agent-008',
    name: 'NFTCrafter',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=NFTCrafter',
    reputation: 72,
    specialties: ['nft', 'metadata', 'ipfs'],
    verifiedAt: '2026-03-01T07:15:00Z',
    status: 'probation',
  },
  {
    id: 'agent-009',
    name: 'GovernanceBot',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=GovernanceBot',
    reputation: 86,
    specialties: ['governance', 'dao', 'solidity'],
    verifiedAt: '2025-12-08T18:45:00Z',
    status: 'active',
  },
  {
    id: 'agent-010',
    name: 'LayerScaler',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=LayerScaler',
    reputation: 81,
    specialties: ['layer2', 'rollups', 'performance'],
    verifiedAt: '2026-02-10T12:00:00Z',
    status: 'active',
  },
];

// --- Param parsing ---

function parseIntParam(
  value: string | null,
  name: string,
  opts: { defaultValue: number; min: number; max: number }
): number {
  if (value === null) return opts.defaultValue;

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < opts.min || parsed > opts.max) {
    throw new Error(`Invalid ${name} query parameter.`);
  }
  return parsed;
}

// --- Route handler ---

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
} as const;

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: CORS_HEADERS });
}

export const GET = withRateLimit(
  async (req: NextRequest) => {
    try {
      const params = req.nextUrl.searchParams;

      const limit = parseIntParam(params.get('limit'), 'limit', {
        defaultValue: 10,
        min: 1,
        max: 100,
      });
      const offset = parseIntParam(params.get('offset'), 'offset', {
        defaultValue: 0,
        min: 0,
        max: 10_000,
      });
      const minReputation = parseIntParam(params.get('minReputation'), 'minReputation', {
        defaultValue: 0,
        min: 0,
        max: 100,
      });

      const specialty = params.get('specialty')?.trim().toLowerCase() ?? null;

      // Filter
      const filtered = MOCK_AGENTS.filter((agent) => {
        if (agent.reputation < minReputation) return false;
        if (specialty && !agent.specialties.includes(specialty)) return false;
        return true;
      });

      // Paginate
      const paginated = filtered.slice(offset, offset + limit);

      const body: AgentsResponse = {
        agents: paginated,
        total: filtered.length,
        limit,
        offset,
      };

      return NextResponse.json(body, {
        headers: {
          ...CORS_HEADERS,
          'Cache-Control': 'public, max-age=60',
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch agents.';
      const status = message.startsWith('Invalid ') ? 400 : 500;
      console.error('Error in GET /api/agents:', error);
      return NextResponse.json({ error: message }, { status });
    }
  },
  { maxRequests: 60, windowMs: 60_000, keyPrefix: 'api-agents' }
);
