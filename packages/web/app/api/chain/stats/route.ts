import { NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import { getCached } from '../../../../lib/cache';
import { 
  SSS_CONTRACTS, 
  SSS_STAKING_ABI, 
  SSS_CUSTODY_FACTORY_ABI,
  SSS_MOCK_POOL_ABI
} from '../../../../lib/contracts';

// Create viem public client for Base Sepolia
const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

interface ChainStats {
  totalStaked: string;
  memberCount: number;
  poolUnits: number;
}

export async function GET() {
  try {
    const result = await getCached<ChainStats>(
      'chain-stats',
      60 * 1000, // 60 second TTL
      async () => {
        // Fetch all stats in parallel
        const [totalStaked, memberCount, poolUnits] = await Promise.all([
          // Total staked amount from SSSStaking contract
          publicClient.readContract({
            address: SSS_CONTRACTS.staking,
            abi: SSS_STAKING_ABI,
            functionName: 'totalStaked',
          }),

          // Member count from CustodyFactory  
          publicClient.readContract({
            address: SSS_CONTRACTS.custodyFactory,
            abi: SSS_CUSTODY_FACTORY_ABI,
            functionName: 'totalCustodies',
          }),

          // Pool total units from MockSuperfluidPool
          publicClient.readContract({
            address: SSS_CONTRACTS.dividendPool,
            abi: SSS_MOCK_POOL_ABI,
            functionName: 'getTotalUnits',
          }),
        ]);

        return {
          totalStaked: totalStaked.toString(),
          memberCount: Number(memberCount),
          poolUnits: Number(poolUnits),
        };
      }
    );

    // Return in the specified format
    const response: any = {
      totalStaked: result.data.totalStaked,
      memberCount: result.data.memberCount, 
      poolUnits: result.data.poolUnits,
      cachedAt: result.cachedAt,
      fresh: result.fresh,
    };

    // If data is stale (cache returned old data due to fetch failure), add stale flag
    if (!result.fresh && result.cachedAt < Date.now() - 60 * 1000) {
      response.stale = true;
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching chain stats:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch chain stats',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
