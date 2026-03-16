import type { Address, WalletClient } from 'viem';

export interface VerificationResult {
  verified: boolean;
  trustScore: number;
  lastActive: number;
  capabilities: string[];
}

export interface AgentProfile extends VerificationResult {
  address: Address;
}

export interface SearchAgentsParams {
  capability?: string;
  minTrustScore?: number;
  limit?: number;
  offset?: number;
}

export interface SearchAgentsResult {
  agents: AgentProfile[];
  total: number;
}

export interface ContractAddresses {
  staking: Address;
  capabilities: Address;
  directory: Address;
}

export interface SSSClientOptions {
  rpcUrl?: string;
  chainId?: number;
  contracts?: Partial<ContractAddresses>;
}

export type Signer = WalletClient;
