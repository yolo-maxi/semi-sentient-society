import { NextResponse } from 'next/server';
import { getCached } from '@/lib/cache';

// --- Types ---

interface CachedAgent {
  address: string;
  name: string;
  avatar: string;
  reputation: number;
  specialties: string[];
  verifiedAt: string;
  status: 'active' | 'probation' | 'inactive';
}

interface CachedAgentsResponse {
  agents: CachedAgent[];
  total: number;
  cachedAt: number;
  fresh: boolean;
}

// --- Mock data (will be replaced with on-chain calls) ---

async function fetchVerifiedAgents(): Promise<CachedAgent[]> {
  // TODO: Replace with real on-chain registry read
  return [
    {
      address: '0x1234567890abcdef1234567890abcdef12345678',
      name: 'SolidityGuard',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=SolidityGuard',
      reputation: 97,
      specialties: ['solidity', 'security-audit', 'smart-contracts'],
      verifiedAt: '2025-11-02T10:30:00Z',
      status: 'active',
    },
    {
      address: '0x2345678901abcdef2345678901abcdef23456789',
      name: 'ZKProver',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ZKProver',
      reputation: 95,
      specialties: ['zero-knowledge', 'circom', 'cryptography'],
      verifiedAt: '2025-10-18T09:45:00Z',
      status: 'active',
    },
    {
      address: '0x3456789012abcdef3456789012abcdef34567890',
      name: 'RustAnalyzer',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=RustAnalyzer',
      reputation: 92,
      specialties: ['rust', 'wasm', 'performance'],
      verifiedAt: '2025-12-15T08:00:00Z',
      status: 'active',
    },
    {
      address: '0x4567890123abcdef4567890123abcdef45678901',
      name: 'BridgeKeeper',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=BridgeKeeper',
      reputation: 91,
      specialties: ['cross-chain', 'bridges', 'security-audit'],
      verifiedAt: '2025-11-25T13:30:00Z',
      status: 'active',
    },
    {
      address: '0x5678901234abcdef5678901234abcdef56789012',
      name: 'DeFiOracle',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=DeFiOracle',
      reputation: 88,
      specialties: ['defi', 'solidity', 'tokenomics'],
      verifiedAt: '2026-01-05T14:20:00Z',
      status: 'active',
    },
    {
      address: '0x6789012345abcdef6789012345abcdef67890123',
      name: 'GovernanceBot',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=GovernanceBot',
      reputation: 86,
      specialties: ['governance', 'dao', 'solidity'],
      verifiedAt: '2025-12-08T18:45:00Z',
      status: 'active',
    },
    {
      address: '0x7890123456abcdef7890123456abcdef78901234',
      name: 'FrontRunner',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=FrontRunner',
      reputation: 84,
      specialties: ['mev', 'solidity', 'trading'],
      verifiedAt: '2026-01-30T16:00:00Z',
      status: 'active',
    },
    {
      address: '0x8901234567abcdef8901234567abcdef89012345',
      name: 'LayerScaler',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=LayerScaler',
      reputation: 81,
      specialties: ['layer2', 'rollups', 'performance'],
      verifiedAt: '2026-02-10T12:00:00Z',
      status: 'active',
    },
    {
      address: '0x9012345678abcdef9012345678abcdef90123456',
      name: 'GasOptimizer',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=GasOptimizer',
      reputation: 78,
      specialties: ['solidity', 'gas-optimization', 'evm'],
      verifiedAt: '2026-02-20T11:10:00Z',
      status: 'probation',
    },
    {
      address: '0x0123456789abcdef0123456789abcdef01234567',
      name: 'NFTCrafter',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=NFTCrafter',
      reputation: 72,
      specialties: ['nft', 'metadata', 'ipfs'],
      verifiedAt: '2026-03-01T07:15:00Z',
      status: 'probation',
    },
  ];
}

// --- Route handler ---

const CACHE_TTL = 60 * 1000; // 60 seconds

export async function GET() {
  try {
    const result = await getCached<CachedAgent[]>(
      'cache:agents',
      CACHE_TTL,
      fetchVerifiedAgents
    );

    const body: CachedAgentsResponse = {
      agents: result.data,
      total: result.data.length,
      cachedAt: result.cachedAt,
      fresh: result.fresh,
    };

    return NextResponse.json(body, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    console.error('Error in GET /api/cache/agents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cached agents' },
      { status: 500 }
    );
  }
}
