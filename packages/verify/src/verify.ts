import {
  createPublicClient,
  getAddress,
  http,
  isAddress,
  type Address,
  type PublicClient
} from 'viem';
import { base } from 'viem/chains';
import type {
  ContractAddresses,
  VerificationResult,
  VerifyLobsterOptions
} from './types';

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

const CAPABILITY_REGISTRY_ABI = [
  {
    type: 'function',
    name: 'getCapabilities',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'string[]' }]
  }
] as const;

const DEFAULT_BASE_RPC_URL = 'https://mainnet.base.org';

function resolveContractAddresses(
  overrides?: Partial<ContractAddresses>
): ContractAddresses {
  const staking = overrides?.staking ?? process.env.SSS_STAKING_CONTRACT;
  const capabilities =
    overrides?.capabilities ?? process.env.SSS_CAPABILITIES_CONTRACT;

  if (!staking || !capabilities) {
    throw new Error(
      'Missing SSS contract addresses. Pass options.contractAddresses or set SSS_STAKING_CONTRACT and SSS_CAPABILITIES_CONTRACT.'
    );
  }

  if (!isAddress(staking) || !isAddress(capabilities)) {
    throw new Error('Invalid SSS contract address configured.');
  }

  return {
    staking: getAddress(staking),
    capabilities: getAddress(capabilities)
  };
}

function resolvePublicClient(options: VerifyLobsterOptions = {}): PublicClient {
  if (options.publicClient) {
    return options.publicClient;
  }

  return createPublicClient({
    chain: options.chain ?? base,
    transport: http(options.rpcUrl ?? process.env.SSS_BASE_RPC_URL ?? DEFAULT_BASE_RPC_URL)
  });
}

function calculateTrustScore(consecutiveDays: bigint): number {
  const normalizedDays = Number(consecutiveDays > 30n ? 30n : consecutiveDays);
  return Math.round((normalizedDays / 30) * 100);
}

function normalizeLastActive(lastConfirmationDay: bigint): number {
  return Number(lastConfirmationDay);
}

export async function isVerifiedLobster(
  address: Address,
  options: VerifyLobsterOptions = {}
): Promise<VerificationResult> {
  if (!isAddress(address)) {
    throw new Error(`Invalid agent address: ${address}`);
  }

  const normalizedAddress = getAddress(address);
  const contractAddresses = resolveContractAddresses(options.contractAddresses);
  const publicClient = resolvePublicClient(options);

  const [stake, capabilities] = await Promise.all([
    publicClient.readContract({
      address: contractAddresses.staking,
      abi: STAKING_ABI,
      functionName: 'stakes',
      args: [normalizedAddress]
    }),
    publicClient.readContract({
      address: contractAddresses.capabilities,
      abi: CAPABILITY_REGISTRY_ABI,
      functionName: 'getCapabilities',
      args: [normalizedAddress]
    })
  ]);

  const [amount, consecutiveDays, lastConfirmationDay, active] = stake;
  const verified = Boolean(active) && amount > 0n;

  return {
    verified,
    trustScore: calculateTrustScore(consecutiveDays),
    lastActive: normalizeLastActive(lastConfirmationDay),
    capabilities: [...capabilities]
  };
}
