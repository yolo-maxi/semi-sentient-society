import { NextResponse } from 'next/server';
import { getCached } from '@/lib/cache';

// --- Types ---

interface DAOStats {
  memberCount: number;
  totalStaked: string;
  activeProposals: number;
  totalProposals: number;
  treasuryBalance: string;
  totalAgents: number;
  avgReputation: number;
}

interface CachedStatsResponse extends DAOStats {
  cachedAt: number;
  fresh: boolean;
}

// --- Mock data (will be replaced with on-chain calls) ---

async function fetchDAOStats(): Promise<DAOStats> {
  // TODO: Replace with real on-chain reads from SSS contracts
  return {
    memberCount: 47,
    totalStaked: '125000000000000000000000', // 125,000 SSS tokens (wei)
    activeProposals: 3,
    totalProposals: 24,
    treasuryBalance: '50000000000000000000000', // 50,000 SSS tokens (wei)
    totalAgents: 10,
    avgReputation: 86,
  };
}

// --- Route handler ---

const CACHE_TTL = 60 * 1000; // 60 seconds

export async function GET() {
  try {
    const result = await getCached<DAOStats>(
      'cache:stats',
      CACHE_TTL,
      fetchDAOStats
    );

    const body: CachedStatsResponse = {
      ...result.data,
      cachedAt: result.cachedAt,
      fresh: result.fresh,
    };

    return NextResponse.json(body, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    console.error('Error in GET /api/cache/stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cached DAO stats' },
      { status: 500 }
    );
  }
}
