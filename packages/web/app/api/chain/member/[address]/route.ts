import { NextResponse } from 'next/server';
import { getCached, publicClient } from '../../../../../lib/chain-cache';
import { 
  SSS_CONTRACTS, 
  SSS_TOKEN_ABI, 
  SSS_STAKING_ABI,
  SSS_CUSTODY_FACTORY_ABI,
  SSS_CUSTODY_ABI
} from '../../../../../lib/contracts';
import { isAddress } from 'viem';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;
    
    // Validate address format
    if (!isAddress(address)) {
      return NextResponse.json(
        { error: 'Invalid address format' },
        { status: 400 }
      );
    }

    const memberData = await getCached(
      `member-${address}`,
      30 * 1000, // 30 second TTL
      async () => {
        // Fetch member data in parallel
        const [sssBalance, stakeInfo, hasCustody] = await Promise.all([
          // SSS token balance
          publicClient.readContract({
            address: SSS_CONTRACTS.sssToken,
            abi: SSS_TOKEN_ABI,
            functionName: 'balanceOf',
            args: [address],
          }),

          // Stake information
          publicClient.readContract({
            address: SSS_CONTRACTS.staking,
            abi: SSS_STAKING_ABI,
            functionName: 'getStakeInfo',
            args: [address],
          }),

          // Check if user has a custody contract
          publicClient.readContract({
            address: SSS_CONTRACTS.custodyFactory,
            abi: SSS_CUSTODY_FACTORY_ABI,
            functionName: 'hasCustody',
            args: [address],
          }),
        ]);

        let custodyData = null;
        
        // If user has custody, fetch custody details
        if (hasCustody) {
          try {
            const custodyAddress = await publicClient.readContract({
              address: SSS_CONTRACTS.custodyFactory,
              abi: SSS_CUSTODY_FACTORY_ABI,
              functionName: 'custodyOf',
              args: [address],
            });

            const [units, accumulatedSSS, slashed] = await Promise.all([
              publicClient.readContract({
                address: custodyAddress,
                abi: SSS_CUSTODY_ABI,
                functionName: 'getUnits',
              }),
              publicClient.readContract({
                address: custodyAddress,
                abi: SSS_CUSTODY_ABI,
                functionName: 'getAccumulatedSSS',
              }),
              publicClient.readContract({
                address: custodyAddress,
                abi: SSS_CUSTODY_ABI,
                functionName: 'slashed',
              }),
            ]);

            custodyData = {
              custodyAddress: custodyAddress,
              units: units.toString(),
              accumulatedSSS: accumulatedSSS.toString(),
              slashed: slashed,
            };
          } catch (error) {
            console.warn(`Failed to fetch custody data for ${address}:`, error);
            custodyData = { error: 'Failed to fetch custody details' };
          }
        }

        return {
          address,
          sssBalance: sssBalance.toString(),
          stake: {
            amount: stakeInfo[0].toString(),
            lockupEnd: Number(stakeInfo[1]),
            rewardDebt: stakeInfo[2].toString(),
          },
          custody: custodyData,
          lastUpdated: new Date().toISOString(),
        };
      }
    );

    return NextResponse.json(memberData);
  } catch (error) {
    console.error('Error fetching member data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch member data' },
      { status: 500 }
    );
  }
}
