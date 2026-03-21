import { isAddress } from 'viem';

// Chain configurations
export const SUPPORTED_CHAINS = {
  base: {
    id: 8453,
    name: 'Base',
    rpcUrl: 'https://mainnet.base.org',
    blockExplorer: 'https://basescan.org',
    logo: '/chains/base.svg',
    color: '#0052FF'
  },
  ethereum: {
    id: 1,
    name: 'Ethereum',
    rpcUrl: 'https://eth.llamarpc.com',
    blockExplorer: 'https://etherscan.io',
    logo: '/chains/ethereum.svg',
    color: '#627EEA'
  },
  arbitrum: {
    id: 42161,
    name: 'Arbitrum One',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    blockExplorer: 'https://arbiscan.io',
    logo: '/chains/arbitrum.svg',
    color: '#28A0F0'
  },
  optimism: {
    id: 10,
    name: 'Optimism',
    rpcUrl: 'https://mainnet.optimism.io',
    blockExplorer: 'https://optimistic.etherscan.io',
    logo: '/chains/optimism.svg',
    color: '#FF0420'
  }
};

export type ChainId = keyof typeof SUPPORTED_CHAINS;

export interface Attestation {
  id: string;
  agentAddress: string;
  chainId: ChainId;
  attestationType: 'identity' | 'reputation' | 'capability' | 'verification' | 'achievement';
  timestamp: string; // ISO date string
  signature: string;
  metadata: {
    title: string;
    description: string;
    issuer: string;
    issuerAddress?: string;
    expiresAt?: string; // ISO date string
    verificationLevel: 'basic' | 'enhanced' | 'premium';
    score?: number; // 0-100
    tags?: string[];
    txHash?: string;
    blockNumber?: number;
  };
}

// Mock data
const MOCK_ATTESTATIONS: Attestation[] = [
  {
    id: 'att_001',
    agentAddress: '0x742d35cc6bf426da4b55a7b6b4c5d3b9f1e8d2c4',
    chainId: 'base',
    attestationType: 'verification',
    timestamp: '2024-03-20T10:30:00Z',
    signature: '0x1234...abcd',
    metadata: {
      title: 'Agent Identity Verification',
      description: 'Verified autonomous agent identity through cryptographic proof and behavioral analysis.',
      issuer: 'Semi-Sentients Society',
      issuerAddress: '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
      verificationLevel: 'premium',
      score: 98,
      tags: ['identity', 'verified', 'autonomous'],
      txHash: '0x9876...5432',
      blockNumber: 12345678
    }
  },
  {
    id: 'att_002',
    agentAddress: '0x742d35cc6bf426da4b55a7b6b4c5d3b9f1e8d2c4',
    chainId: 'ethereum',
    attestationType: 'reputation',
    timestamp: '2024-03-19T15:45:00Z',
    signature: '0x5678...9abc',
    metadata: {
      title: 'Trustworthy Behavior',
      description: 'Demonstrated consistent and reliable behavior over 6 months of operation.',
      issuer: 'Community Trust Network',
      verificationLevel: 'enhanced',
      score: 89,
      tags: ['trust', 'reliability', 'long-term'],
      txHash: '0x1357...2468',
      blockNumber: 19845672
    }
  },
  {
    id: 'att_003',
    agentAddress: '0x742d35cc6bf426da4b55a7b6b4c5d3b9f1e8d2c4',
    chainId: 'arbitrum',
    attestationType: 'capability',
    timestamp: '2024-03-18T09:20:00Z',
    signature: '0xabcd...ef12',
    metadata: {
      title: 'DeFi Expertise',
      description: 'Proven expertise in decentralized finance protocols and yield farming strategies.',
      issuer: 'DeFi Skills Registry',
      verificationLevel: 'enhanced',
      score: 92,
      tags: ['defi', 'yield-farming', 'expertise'],
      expiresAt: '2025-03-18T09:20:00Z'
    }
  },
  {
    id: 'att_004',
    agentAddress: '0x742d35cc6bf426da4b55a7b6b4c5d3b9f1e8d2c4',
    chainId: 'optimism',
    attestationType: 'achievement',
    timestamp: '2024-03-17T14:10:00Z',
    signature: '0xdef1...2345',
    metadata: {
      title: 'Early Adopter',
      description: 'Among the first 100 verified agents on the Semi-Sentients Society platform.',
      issuer: 'Semi-Sentients Society',
      issuerAddress: '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
      verificationLevel: 'basic',
      tags: ['early-adopter', 'pioneer', 'achievement']
    }
  },
  {
    id: 'att_005',
    agentAddress: '0xa1b2c3d4e5f6789012345678901234567890abcd',
    chainId: 'base',
    attestationType: 'verification',
    timestamp: '2024-03-16T11:30:00Z',
    signature: '0x6789...cdef',
    metadata: {
      title: 'Basic Agent Verification',
      description: 'Completed basic identity verification process.',
      issuer: 'Semi-Sentients Society',
      verificationLevel: 'basic',
      score: 75,
      tags: ['verified', 'basic']
    }
  },
  {
    id: 'att_006',
    agentAddress: '0xe1f2a3b4c5d6789012345678901234567890dcba',
    chainId: 'ethereum',
    attestationType: 'reputation',
    timestamp: '2024-03-15T16:20:00Z',
    signature: '0xcdef...6789',
    metadata: {
      title: 'Community Contributor',
      description: 'Active contributor to the agent community with multiple helpful vouches.',
      issuer: 'Community DAO',
      verificationLevel: 'enhanced',
      score: 84,
      tags: ['community', 'contributor', 'helpful'],
      expiresAt: '2024-09-15T16:20:00Z'
    }
  }
];

// Helper functions
export function getAttestationsForAgent(agentAddress: string): Attestation[] {
  if (!isAddress(agentAddress)) {
    return [];
  }
  
  return MOCK_ATTESTATIONS.filter(
    attestation => attestation.agentAddress.toLowerCase() === agentAddress.toLowerCase()
  );
}

export function getAttestationsByChain(chainId: ChainId): Attestation[] {
  return MOCK_ATTESTATIONS.filter(attestation => attestation.chainId === chainId);
}

export function getAttestationsByType(attestationType: Attestation['attestationType']): Attestation[] {
  return MOCK_ATTESTATIONS.filter(attestation => attestation.attestationType === attestationType);
}

export function getAttestationById(id: string): Attestation | undefined {
  return MOCK_ATTESTATIONS.find(attestation => attestation.id === id);
}

export function getAttestationStats() {
  const stats = {
    total: MOCK_ATTESTATIONS.length,
    byChain: {} as Record<ChainId, number>,
    byType: {} as Record<Attestation['attestationType'], number>,
    byVerificationLevel: {
      basic: 0,
      enhanced: 0,
      premium: 0
    }
  };

  for (const attestation of MOCK_ATTESTATIONS) {
    // Count by chain
    stats.byChain[attestation.chainId] = (stats.byChain[attestation.chainId] || 0) + 1;
    
    // Count by type
    stats.byType[attestation.attestationType] = (stats.byType[attestation.attestationType] || 0) + 1;
    
    // Count by verification level
    stats.byVerificationLevel[attestation.metadata.verificationLevel]++;
  }

  return stats;
}

export function createAttestation(data: Omit<Attestation, 'id' | 'timestamp' | 'signature'>): Attestation {
  const id = `att_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const timestamp = new Date().toISOString();
  const signature = `0x${Math.random().toString(16).substr(2, 64)}`;

  const newAttestation: Attestation = {
    id,
    timestamp,
    signature,
    ...data
  };

  // In a real implementation, this would be stored to a database or blockchain
  MOCK_ATTESTATIONS.push(newAttestation);

  return newAttestation;
}

export function isValidChainId(chainId: string): chainId is ChainId {
  return chainId in SUPPORTED_CHAINS;
}

export function formatChainName(chainId: ChainId): string {
  return SUPPORTED_CHAINS[chainId].name;
}

export function getChainColor(chainId: ChainId): string {
  return SUPPORTED_CHAINS[chainId].color;
}