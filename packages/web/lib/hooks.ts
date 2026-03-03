import { useReadContract } from 'wagmi';
import { 
  SSS_CONTRACTS,
  SSS_TOKEN_ABI,
  SSS_STAKING_ABI,
  SSS_CORVEE_ABI,
  SSS_SHELLS_ABI 
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
  const { data: stakeInfo, isLoading } = useReadContract({
    address: SSS_CONTRACTS.staking,
    abi: SSS_STAKING_ABI,
    functionName: 'getStakeInfo',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { data: pendingRewards } = useReadContract({
    address: SSS_CONTRACTS.staking,
    abi: SSS_STAKING_ABI,
    functionName: 'pendingRewards',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { data: totalStaked } = useReadContract({
    address: SSS_CONTRACTS.staking,
    abi: SSS_STAKING_ABI,
    functionName: 'totalStaked',
  });

  return { 
    stakeInfo: stakeInfo as readonly [bigint, bigint, bigint] | undefined,
    pendingRewards: pendingRewards as bigint | undefined,
    totalStaked: totalStaked as bigint | undefined,
    isLoading 
  };
}

// Hook to get corvée history
export function useCorvee(address?: `0x${string}`) {
  const { data: corveeHistory, isLoading } = useReadContract({
    address: SSS_CONTRACTS.corvee,
    abi: SSS_CORVEE_ABI,
    functionName: 'getCorveeHistory',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  return { 
    corveeHistory: corveeHistory as readonly [bigint, bigint, bigint] | undefined,
    isLoading 
  };
}

// Hook to get shells (NFT) balance
export function useShells(address?: `0x${string}`, tokenId?: bigint) {
  const { data: balance, isLoading } = useReadContract({
    address: SSS_CONTRACTS.shells,
    abi: SSS_SHELLS_ABI,
    functionName: 'balanceOf',
    args: address && tokenId !== undefined ? [address, tokenId] : undefined,
    query: { enabled: !!address && tokenId !== undefined },
  });

  return { 
    balance: balance as bigint | undefined,
    isLoading 
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
