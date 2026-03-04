import { NextResponse } from 'next/server';
import { getCached, publicClient } from '../../../../lib/chain-cache';
import { 
  SSS_CONTRACTS, 
  SSS_TOKEN_ABI, 
  SSS_STAKING_ABI, 
  SSS_CUSTODY_FACTORY_ABI 
} from '../../../../lib/contracts';

export async function GET() {
  try {
    const stats = await getCached(
      'chain-stats',
      60 * 1000, // 60 second TTL
      async () => {
        // Fetch all stats in parallel
        const [totalSupply, totalStaked, totalCustodies] = await Promise.all([
          // SSS token total supply
          publicClient.readContract({
            address: SSS_CONTRACTS.sssToken,
            abi: SSS_TOKEN_ABI,
            functionName: 'totalSupply',
          }),

          // Total staked amount
          publicClient.readContract({
            address: SSS_CONTRACTS.staking,
            abi: SSS_STAKING_ABI,
            functionName: 'totalStaked',
          }),

          // Number of custody contracts (member count)
          publicClient.readContract({
            address: SSS_CONTRACTS.custodyFactory,
            abi: SSS_CUSTODY_FACTORY_ABI,
            functionName: 'totalCustodies',
          }),
        ]);

        return {
          sssTokenTotalSupply: totalSupply.toString(),
          totalStakedAmount: totalStaked.toString(), 
          memberCount: Number(totalCustodies),
          lastUpdated: new Date().toISOString(),
        };
      }
    );

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching chain stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chain stats' },
      { status: 500 }
    );
  }
}
