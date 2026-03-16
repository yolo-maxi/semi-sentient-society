import type { Address, Chain, PublicClient } from 'viem';

export interface VerificationResult {
  verified: boolean;
  trustScore: number;
  lastActive: number;
  capabilities: string[];
}

export interface ContractAddresses {
  staking: Address;
  capabilities: Address;
}

export interface VerifyLobsterOptions {
  chain?: Chain;
  publicClient?: PublicClient;
  rpcUrl?: string;
  contractAddresses?: Partial<ContractAddresses>;
}

export interface SSSGateOptions extends VerifyLobsterOptions {
  minTrustScore?: number;
  requiredCapabilities?: string[];
}

declare global {
  namespace Express {
    interface Request {
      sssAgentAddress?: Address;
      sssVerification?: VerificationResult;
    }
  }
}

export {};
