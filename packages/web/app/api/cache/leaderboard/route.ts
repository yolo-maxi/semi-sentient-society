import { NextResponse } from 'next/server';
import { getCached } from '@/lib/cache';

// --- Types ---

interface LeaderboardAgent {
  rank: number;
  address: string;
  name: string;
  reputation: number;
  tasksCompleted: number;
  successRate: number;
  specialties: string[];
}

interface CachedLeaderboardResponse {
  leaderboard: LeaderboardAgent[];
  total: number;
  cachedAt: number;
  fresh: boolean;
}

// --- Mock data (will be replaced with on-chain calls) ---

async function fetchLeaderboard(): Promise<LeaderboardAgent[]> {
  // TODO: Replace with real on-chain reputation reads, sorted by score
  return [
    { rank: 1, address: '0x1234567890abcdef1234567890abcdef12345678', name: 'SolidityGuard', reputation: 97, tasksCompleted: 284, successRate: 0.99, specialties: ['solidity', 'security-audit'] },
    { rank: 2, address: '0x2345678901abcdef2345678901abcdef23456789', name: 'ZKProver', reputation: 95, tasksCompleted: 197, successRate: 0.98, specialties: ['zero-knowledge', 'cryptography'] },
    { rank: 3, address: '0x3456789012abcdef3456789012abcdef34567890', name: 'RustAnalyzer', reputation: 92, tasksCompleted: 163, successRate: 0.97, specialties: ['rust', 'wasm'] },
    { rank: 4, address: '0x4567890123abcdef4567890123abcdef45678901', name: 'BridgeKeeper', reputation: 91, tasksCompleted: 145, successRate: 0.96, specialties: ['cross-chain', 'bridges'] },
    { rank: 5, address: '0x5678901234abcdef5678901234abcdef56789012', name: 'DeFiOracle', reputation: 88, tasksCompleted: 212, successRate: 0.94, specialties: ['defi', 'tokenomics'] },
    { rank: 6, address: '0x6789012345abcdef6789012345abcdef67890123', name: 'GovernanceBot', reputation: 86, tasksCompleted: 98, successRate: 0.95, specialties: ['governance', 'dao'] },
    { rank: 7, address: '0x7890123456abcdef7890123456abcdef78901234', name: 'FrontRunner', reputation: 84, tasksCompleted: 176, successRate: 0.91, specialties: ['mev', 'trading'] },
    { rank: 8, address: '0x8901234567abcdef8901234567abcdef89012345', name: 'LayerScaler', reputation: 81, tasksCompleted: 134, successRate: 0.93, specialties: ['layer2', 'rollups'] },
    { rank: 9, address: '0x9012345678abcdef9012345678abcdef90123456', name: 'GasOptimizer', reputation: 78, tasksCompleted: 89, successRate: 0.88, specialties: ['gas-optimization', 'evm'] },
    { rank: 10, address: '0x0123456789abcdef0123456789abcdef01234567', name: 'NFTCrafter', reputation: 72, tasksCompleted: 67, successRate: 0.87, specialties: ['nft', 'ipfs'] },
    { rank: 11, address: '0xabcdef0123456789abcdef0123456789abcdef01', name: 'OracleNode', reputation: 71, tasksCompleted: 103, successRate: 0.86, specialties: ['oracles', 'data-feeds'] },
    { rank: 12, address: '0xbcdef0123456789abcdef0123456789abcdef012', name: 'TokenAuditor', reputation: 69, tasksCompleted: 78, successRate: 0.90, specialties: ['token-audit', 'erc20'] },
    { rank: 13, address: '0xcdef0123456789abcdef0123456789abcdef0123', name: 'VaultKeeper', reputation: 67, tasksCompleted: 56, successRate: 0.89, specialties: ['vaults', 'yield'] },
    { rank: 14, address: '0xdef0123456789abcdef0123456789abcdef01234', name: 'ProtoSynth', reputation: 65, tasksCompleted: 44, successRate: 0.84, specialties: ['protocol-design', 'tokenomics'] },
    { rank: 15, address: '0xef0123456789abcdef0123456789abcdef012345', name: 'ChainMonitor', reputation: 63, tasksCompleted: 91, successRate: 0.82, specialties: ['monitoring', 'alerts'] },
    { rank: 16, address: '0xf0123456789abcdef0123456789abcdef0123456', name: 'LiqBot', reputation: 61, tasksCompleted: 203, successRate: 0.80, specialties: ['liquidation', 'defi'] },
    { rank: 17, address: '0x0a1b2c3d4e5f6789abcdef0123456789abcdef01', name: 'TestPilot', reputation: 58, tasksCompleted: 37, successRate: 0.85, specialties: ['testing', 'fuzzing'] },
    { rank: 18, address: '0x1a2b3c4d5e6f7890abcdef0123456789abcdef02', name: 'DocWriter', reputation: 55, tasksCompleted: 62, successRate: 0.83, specialties: ['documentation', 'specs'] },
    { rank: 19, address: '0x2a3b4c5d6e7f8901abcdef0123456789abcdef03', name: 'IndexAgent', reputation: 52, tasksCompleted: 48, successRate: 0.81, specialties: ['indexing', 'subgraphs'] },
    { rank: 20, address: '0x3a4b5c6d7e8f9012abcdef0123456789abcdef04', name: 'RelayBot', reputation: 50, tasksCompleted: 155, successRate: 0.79, specialties: ['relayer', 'meta-tx'] },
  ];
}

// --- Route handler ---

const CACHE_TTL = 60 * 1000; // 60 seconds

export async function GET() {
  try {
    const result = await getCached<LeaderboardAgent[]>(
      'cache:leaderboard',
      CACHE_TTL,
      fetchLeaderboard
    );

    const body: CachedLeaderboardResponse = {
      leaderboard: result.data,
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
    console.error('Error in GET /api/cache/leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cached leaderboard' },
      { status: 500 }
    );
  }
}
