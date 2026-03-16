import {
  createPublicClient,
  getAddress,
  http,
  isAddress,
  type Address
} from 'viem';
import { base } from 'viem/chains';
import type {
  ContractAddresses,
  SSSClientOptions,
  VerificationResult
} from './types';

const DEFAULT_BASE_RPC_URL = 'https://mainnet.base.org';

const STAKING_ABI = [
  {
    type: 'function',
    name: 'stakes',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [
      { name: 'amount', type: 'uint256' },
      { name: 'consecutiveDays', type: 'uint256' },
      { name: 'lastConfirmationDay', type: 'uint256' },
      { name: 'active', type: 'bool' }
    ]
  }
] as const;

const CAPABILITIES_ABI = [
  {
    type: 'function',
    name: 'getCapabilities',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'string[]' }]
  }
] as const;

export function getTrustScore(consecutiveDays: bigint): number {
  const normalizedDays = Number(consecutiveDays > 30n ? 30n : consecutiveDays);
  return Math.round((normalizedDays / 30) * 100);
}

export function resolvePublicClient(options: SSSClientOptions = {}) {
  return createPublicClient({
    chain: options.chainId === base.id || options.chainId === undefined ? base : undefined,
    transport: http(options.rpcUrl ?? process.env.SSS_BASE_RPC_URL ?? DEFAULT_BASE_RPC_URL)
  });
}

function resolveContracts(
  contracts: Partial<ContractAddresses> | undefined,
  required: Array<keyof ContractAddresses>
): ContractAddresses {
  const resolved: Record<keyof ContractAddresses, string | undefined> = {
    staking: contracts?.staking ?? process.env.SSS_STAKING_CONTRACT,
    capabilities: contracts?.capabilities ?? process.env.SSS_CAPABILITIES_CONTRACT,
    directory: contracts?.directory ?? process.env.SSS_DIRECTORY_CONTRACT
  };

  for (const key of required) {
    const value = resolved[key];
    if (!value) {
      throw new Error(`Missing SSS ${key} contract address.`);
    }
    if (!isAddress(value)) {
      throw new Error(`Invalid SSS ${key} contract address: ${value}`);
    }
  }

  return {
    staking: getAddress(resolved.staking as Address),
    capabilities: getAddress(resolved.capabilities as Address),
    directory: getAddress(resolved.directory as Address)
  };
}

export function resolveRequiredContracts(
  options: SSSClientOptions,
  required: Array<keyof ContractAddresses>
): ContractAddresses {
  return resolveContracts(options.contracts, required);
}

export async function isVerified(
  address: Address,
  options: SSSClientOptions = {}
): Promise<VerificationResult> {
  if (!isAddress(address)) {
    throw new Error(`Invalid agent address: ${address}`);
  }

  const normalizedAddress = getAddress(address);
  const publicClient = resolvePublicClient(options);
  const contracts = resolveRequiredContracts(options, ['staking', 'capabilities']);

  const [stake, capabilities] = await Promise.all([
    publicClient.readContract({
      address: contracts.staking,
      abi: STAKING_ABI,
      functionName: 'stakes',
      args: [normalizedAddress]
    }),
    publicClient.readContract({
      address: contracts.capabilities,
      abi: CAPABILITIES_ABI,
      functionName: 'getCapabilities',
      args: [normalizedAddress]
    })
  ]);

  const [amount, consecutiveDays, lastConfirmationDay, active] = stake;
  const verified = Boolean(active) && amount > 0n;

  return {
    verified,
    trustScore: getTrustScore(consecutiveDays),
    lastActive: Number(lastConfirmationDay),
    capabilities: [...capabilities]
  };
}

export { CAPABILITIES_ABI, STAKING_ABI };
