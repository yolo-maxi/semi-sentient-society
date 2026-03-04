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

export async function GET() {
  try {
    const result = await getCached(
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
    return NextResponse.json({
      totalStaked: result.data.totalStaked,
      memberCount: result.data.memberCount, 
      poolUnits: result.data.poolUnits,
      cachedAt: result.cachedAt,
      fresh: result.fresh,
    });

  } catch (error) {
    console.error('Error fetching chain stats:', error);
    
    // Try to get stale data from cache
    try {
      const staleResult = await getCached(
        'chain-stats',
        60 * 1000,
        async () => {
          throw new Error('Force cache lookup');
        }
      );
      
      // Return stale data with stale flag
      return NextResponse.json({
        totalStaked: staleResult.data.totalStaked,
        memberCount: staleResult.data.memberCount,
        poolUnits: staleResult.data.poolUnits, 
        cachedAt: staleResult.cachedAt,
        fresh: false,
        stale: true,
      });
    } catch (staleError) {
      // No cached data available
      return NextResponse.json(
        { 
          error: 'Failed to fetch chain stats and no cached data available',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      );
    }
  }
}
