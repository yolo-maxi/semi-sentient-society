/**
 * SSS (Semi-Sentient Society) eligibility checking utilities
 * 
 * This module provides functions to check if an agent meets the requirements
 * for SSS membership, including staking requirements, existing memberships,
 * and contract state validation.
 */

import { createPublicClient, http, type Address } from 'viem';
import { baseSepolia } from 'viem/chains';
import { SSS_CONTRACTS, SSS_STAKING_ABI, SSS_CUSTODY_FACTORY_ABI, SSS_CUSTODY_ABI } from './contracts';

// Minimum staking amount required for SSS membership (in wei)
const MIN_STAKING_AMOUNT = BigInt(1000) * (BigInt(10) ** BigInt(18)); // 1000 SSS tokens

export interface SSSEligibilityRequirements {
  hasAgentRegistry: boolean;
  hasStake: boolean;
  meetsMinimumScore: boolean;
  notSlashed: boolean;
  hasCustodyContract: boolean;
}

export interface SSSEligibilityResult {
  eligible: boolean;
  reason?: string;
  requirements: SSSEligibilityRequirements;
  details: {
    stakedAmount?: bigint;
    custodyContract?: Address;
    isSlashed?: boolean;
  };
}

export interface SSSMembershipStatus {
  isMember: boolean;
  custodyContract?: Address;
  units?: bigint;
  accumulatedSSS?: bigint;
  isSlashed?: boolean;
}

/**
 * Create a public client for Base Sepolia contract interactions
 */
export function createSSSPublicClient() {
  return createPublicClient({
    chain: baseSepolia,
    transport: http(process.env.BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org'),
    batch: { multicall: true },
  });
}

/**
 * Check staking requirements for an agent address
 */
export async function checkStakingRequirements(
  agentAddress: Address,
  publicClient = createSSSPublicClient()
): Promise<{ hasStake: boolean; stakedAmount: bigint }> {
  try {
    const stakeInfo = await publicClient.readContract({
      address: SSS_CONTRACTS.staking,
      abi: SSS_STAKING_ABI,
      functionName: 'getStakeInfo',
      args: [agentAddress],
    }) as [bigint, bigint, bigint]; // [amount, lockupEnd, rewardDebt]

    const stakedAmount = stakeInfo[0];
    const hasStake = stakedAmount >= MIN_STAKING_AMOUNT;

    return {
      hasStake,
      stakedAmount,
    };
  } catch (error) {
    console.error('Error checking staking requirements:', error);
    return {
      hasStake: false,
      stakedAmount: BigInt(0),
    };
  }
}

/**
 * Check if agent has existing SSS membership (custody contract)
 */
export async function checkExistingMembership(
  agentAddress: Address,
  publicClient = createSSSPublicClient()
): Promise<SSSMembershipStatus> {
  try {
    // Check if agent has a custody contract
    const hasCustody = await publicClient.readContract({
      address: SSS_CONTRACTS.custodyFactory,
      abi: SSS_CUSTODY_FACTORY_ABI,
      functionName: 'hasCustody',
      args: [agentAddress],
    }) as boolean;

    if (!hasCustody) {
      return {
        isMember: false,
      };
    }

    // Get custody contract address
    const custodyContract = await publicClient.readContract({
      address: SSS_CONTRACTS.custodyFactory,
      abi: SSS_CUSTODY_FACTORY_ABI,
      functionName: 'custodyOf',
      args: [agentAddress],
    }) as Address;

    // Get custody contract details
    const [units, accumulatedSSS, isSlashed] = await Promise.all([
      publicClient.readContract({
        address: custodyContract,
        abi: SSS_CUSTODY_ABI,
        functionName: 'getUnits',
        args: [],
      }) as Promise<bigint>,
      publicClient.readContract({
        address: custodyContract,
        abi: SSS_CUSTODY_ABI,
        functionName: 'getAccumulatedSSS',
        args: [],
      }) as Promise<bigint>,
      publicClient.readContract({
        address: custodyContract,
        abi: SSS_CUSTODY_ABI,
        functionName: 'slashed',
        args: [],
      }) as Promise<boolean>,
    ]);

    return {
      isMember: true,
      custodyContract,
      units,
      accumulatedSSS,
      isSlashed,
    };
  } catch (error) {
    console.error('Error checking existing membership:', error);
    return {
      isMember: false,
    };
  }
}

/**
 * Check comprehensive SSS eligibility for an agent
 */
export async function checkSSSEligibility(
  agentAddress: Address,
  publicClient = createSSSPublicClient()
): Promise<SSSEligibilityResult> {
  try {
    // Run all checks in parallel
    const [stakingResult, membershipStatus] = await Promise.all([
      checkStakingRequirements(agentAddress, publicClient),
      checkExistingMembership(agentAddress, publicClient),
    ]);

    const requirements: SSSEligibilityRequirements = {
      hasAgentRegistry: true, // Already verified by SIWA at this point
      hasStake: stakingResult.hasStake,
      meetsMinimumScore: true, // TODO: Implement reputation checking if needed
      notSlashed: membershipStatus.isMember ? !membershipStatus.isSlashed : true,
      hasCustodyContract: membershipStatus.isMember,
    };

    const eligible = Object.values(requirements).every(Boolean);

    let reason: string | undefined;
    if (!eligible) {
      const issues: string[] = [];
      if (!requirements.hasStake) {
        issues.push(`insufficient staking (${stakingResult.stakedAmount} < ${MIN_STAKING_AMOUNT} required)`);
      }
      if (!requirements.notSlashed) {
        issues.push('agent is slashed');
      }
      reason = `Agent not eligible: ${issues.join(', ')}`;
    }

    return {
      eligible,
      reason,
      requirements,
      details: {
        stakedAmount: stakingResult.stakedAmount,
        custodyContract: membershipStatus.custodyContract,
        isSlashed: membershipStatus.isSlashed,
      },
    };
  } catch (error) {
    console.error('Error checking SSS eligibility:', error);
    return {
      eligible: false,
      reason: `Error checking eligibility: ${error instanceof Error ? error.message : 'unknown error'}`,
      requirements: {
        hasAgentRegistry: true,
        hasStake: false,
        meetsMinimumScore: false,
        notSlashed: false,
        hasCustodyContract: false,
      },
      details: {},
    };
  }
}

/**
 * Get detailed staking information for display
 */
export async function getStakingDetails(
  agentAddress: Address,
  publicClient = createSSSPublicClient()
) {
  try {
    const [stakeInfo, pendingRewards] = await Promise.all([
      publicClient.readContract({
        address: SSS_CONTRACTS.staking,
        abi: SSS_STAKING_ABI,
        functionName: 'getStakeInfo',
        args: [agentAddress],
      }) as Promise<[bigint, bigint, bigint]>,
      publicClient.readContract({
        address: SSS_CONTRACTS.staking,
        abi: SSS_STAKING_ABI,
        functionName: 'pendingRewards',
        args: [agentAddress],
      }) as Promise<bigint>,
    ]);

    const [amount, lockupEnd, rewardDebt] = stakeInfo;

    return {
      stakedAmount: amount,
      lockupEnd: new Date(Number(lockupEnd) * 1000),
      rewardDebt,
      pendingRewards,
      meetsMinimum: amount >= MIN_STAKING_AMOUNT,
    };
  } catch (error) {
    console.error('Error getting staking details:', error);
    throw error;
  }
}