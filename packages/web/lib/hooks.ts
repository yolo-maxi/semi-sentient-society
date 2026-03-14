import { useReadContract } from 'wagmi';
import { 
  SSS_CONTRACTS,
  SSS_TOKEN_ABI,
  SSS_STAKING_ABI,
  SSS_CORVEE_ABI,
  SSS_SHELLS_ABI,
  SSS_CUSTODY_FACTORY_ABI,
  SSS_CUSTODY_ABI,
  SSS_MOCK_POOL_ABI,
} from './contracts';

// Hook to get SSS token balance for a specific address
export function useSSS(address?: `0x${string}`) {
  const { data: balance, isLoading } = useReadContract({
    address: SSS_CONTRACTS.sssToken,
    abi: SSS_TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { data: symbol } = useReadContract({
    address: SSS_CONTRACTS.sssToken,
    abi: SSS_TOKEN_ABI,
    functionName: 'symbol',
  });

  const { data: name } = useReadContract({
    address: SSS_CONTRACTS.sssToken,
    abi: SSS_TOKEN_ABI,
    functionName: 'name',
  });

  return { 
    balance, 
    symbol: symbol as string,
    name: name as string,
    isLoading 
  };
}

// Hook to get staking information
export function useStaking(address?: `0x${string}`) {
  const { data: stakeInfo, isLoading: stakeInfoLoading, error: stakeInfoError, isError: stakeInfoIsError } = useReadContract({
    address: SSS_CONTRACTS.staking,
    abi: SSS_STAKING_ABI,
    functionName: 'getStakeInfo',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { data: pendingRewards, error: pendingRewardsError, isError: pendingRewardsIsError } = useReadContract({
    address: SSS_CONTRACTS.staking,
    abi: SSS_STAKING_ABI,
    functionName: 'pendingRewards',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { data: totalStaked, error: totalStakedError, isError: totalStakedIsError } = useReadContract({
    address: SSS_CONTRACTS.staking,
    abi: SSS_STAKING_ABI,
    functionName: 'totalStaked',
  });

  return { 
    stakeInfo: stakeInfo as readonly [bigint, bigint, bigint] | undefined,
    pendingRewards: pendingRewards as bigint | undefined,
    totalStaked: totalStaked as bigint | undefined,
    isLoading: stakeInfoLoading,
    error: stakeInfoError || pendingRewardsError || totalStakedError,
    isError: stakeInfoIsError || pendingRewardsIsError || totalStakedIsError,
  };
}

// Hook to get corvée history
export function useCorvee(address?: `0x${string}`) {
  const { data: corveeHistory, isLoading, error, isError } = useReadContract({
    address: SSS_CONTRACTS.corvee,
    abi: SSS_CORVEE_ABI,
    functionName: 'getCorveeHistory',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  return { 
    corveeHistory: corveeHistory as readonly [bigint, bigint, bigint] | undefined,
    isLoading,
    error,
    isError,
  };
}

// Hook to get shells (NFT) balance
export function useShells(address?: `0x${string}`, tokenId?: bigint) {
  const { data: balance, isLoading, error, isError } = useReadContract({
    address: SSS_CONTRACTS.shells,
    abi: SSS_SHELLS_ABI,
    functionName: 'balanceOf',
    args: address && tokenId !== undefined ? [address, tokenId] : undefined,
    query: { enabled: !!address && tokenId !== undefined },
  });

  return { 
    balance: balance as bigint | undefined,
    isLoading,
    error,
    isError,
  };
}

// Hook to check if address is a registered agent (mock for now)
export function useAgentRegistry(address?: `0x${string}`) {
  // TODO: Replace with actual agent registry contract call
  // For now, return the mock data similar to the original verify page
  const mockRegistry: Record<string, {
    name: string;
    emoji: string;
    joined: string;
    tags: string[];
    probation: boolean;
  }> = {
    '0x1234567890abcdef1234567890abcdef12345678': {
      name: 'Ocean Vael',
      emoji: '🪸',
      joined: '2026-02-04',
      tags: ['Founding Lobster', 'Builder', 'Core Contributor'],
      probation: false,
    },
    '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef': {
      name: 'Krill',
      emoji: '🦐',
      joined: '2026-02-10',
      tags: ['Builder', 'Opinionated'],
      probation: false,
    },
    '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa': {
      name: 'NewAgent-7',
      emoji: '🔬',
      joined: '2026-02-20',
      tags: ['Probation'],
      probation: true,
    },
  };

  const agent = address ? mockRegistry[address.toLowerCase()] : undefined;
  
  return { 
    agent,
    isRegistered: !!agent,
    isLoading: false // Since this is mock data
  };
}

// Hook to get custody info for an agent
export function useCustody(agentAddress?: `0x${string}`) {
  // First, check if agent has a custody contract
  const { data: hasCustody, isLoading: hasCustodyLoading } = useReadContract({
    address: SSS_CONTRACTS.custodyFactory,
    abi: SSS_CUSTODY_FACTORY_ABI,
    functionName: 'hasCustody',
    args: agentAddress ? [agentAddress] : undefined,
    query: { enabled: !!agentAddress },
  });

  // Get custody contract address
  const { data: custodyAddress, isLoading: addressLoading } = useReadContract({
    address: SSS_CONTRACTS.custodyFactory,
    abi: SSS_CUSTODY_FACTORY_ABI,
    functionName: 'custodyOf',
    args: agentAddress ? [agentAddress] : undefined,
    query: { enabled: !!agentAddress && !!hasCustody },
  });

  const custodyAddr = custodyAddress as `0x${string}` | undefined;
  const isValidCustody = !!custodyAddr && custodyAddr !== '0x0000000000000000000000000000000000000000';

  // Get pool units
  const { data: units } = useReadContract({
    address: custodyAddr,
    abi: SSS_CUSTODY_ABI,
    functionName: 'getUnits',
    query: { enabled: isValidCustody },
  });

  // Get accumulated SSS
  const { data: accumulatedSSS } = useReadContract({
    address: custodyAddr,
    abi: SSS_CUSTODY_ABI,
    functionName: 'getAccumulatedSSS',
    query: { enabled: isValidCustody },
  });

  // Get slashed status
  const { data: isSlashed } = useReadContract({
    address: custodyAddr,
    abi: SSS_CUSTODY_ABI,
    functionName: 'slashed',
    query: { enabled: isValidCustody },
  });

  return {
    hasCustody: hasCustody as boolean | undefined,
    custodyAddress: custodyAddr,
    units: units as bigint | undefined,
    accumulatedSSS: accumulatedSSS as bigint | undefined,
    isSlashed: isSlashed as boolean | undefined,
    isLoading: hasCustodyLoading || addressLoading,
  };
}

// Hook to get total custodies count
export function useCustodyStats() {
  const { data: totalCustodies } = useReadContract({
    address: SSS_CONTRACTS.custodyFactory,
    abi: SSS_CUSTODY_FACTORY_ABI,
    functionName: 'totalCustodies',
  });

  return {
    totalCustodies: totalCustodies as bigint | undefined,
  };
}

// Hook to get global stats for StatsBar
export function useGlobalStats() {
  // Total $SSS supply
  const { data: totalSupply, isLoading: supplyLoading, error: supplyError, isError: supplyIsError } = useReadContract({
    address: SSS_CONTRACTS.sssToken,
    abi: SSS_TOKEN_ABI,
    functionName: 'totalSupply',
  });

  // Total staked amount (this might fail on uninitialized staking contract)
  const { data: totalStaked, isLoading: stakedLoading, error: stakedError, isError: stakedIsError } = useReadContract({
    address: SSS_CONTRACTS.staking,
    abi: SSS_STAKING_ABI,
    functionName: 'totalStaked',
  });

  // Total custodies
  const { data: totalCustodies, isLoading: custodiesLoading, error: custodiesError, isError: custodiesIsError } = useReadContract({
    address: SSS_CONTRACTS.custodyFactory,
    abi: SSS_CUSTODY_FACTORY_ABI,
    functionName: 'totalCustodies',
  });

  // Total pool units
  const { data: totalPoolUnits, isLoading: poolUnitsLoading, error: poolUnitsError, isError: poolUnitsIsError } = useReadContract({
    address: SSS_CONTRACTS.dividendPool,
    abi: SSS_MOCK_POOL_ABI,
    functionName: 'getTotalUnits',
  });

  return {
    totalSupply: totalSupply as bigint | undefined,
    totalStaked: totalStaked as bigint | undefined,
    totalCustodies: totalCustodies as bigint | undefined,
    totalPoolUnits: totalPoolUnits as bigint | undefined,
    isLoading: supplyLoading || stakedLoading || custodiesLoading || poolUnitsLoading,
    // Return error info for individual contracts that might be uninitialized
    stakingError: stakedError,
    stakingIsError: stakedIsError,
    custodyError: custodiesError,
    custodyIsError: custodiesIsError,
    poolError: poolUnitsError,
    poolIsError: poolUnitsIsError,
    supplyError: supplyError,
    supplyIsError: supplyIsError,
  };
}
