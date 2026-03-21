// Mock vouch data for testing - will be replaced with on-chain data later

export interface MockVouch {
  id: string;
  fromAgent: string; // Agent address who is vouching
  toAgent: string;   // Agent address being vouched for
  capability: string; // Specific capability being vouched for
  createdAt: string;
  message?: string;   // Optional endorsement message
}

export interface MockVouchSummary {
  agentAddress: string;
  vouchesGiven: number;
  vouchesReceived: number;
  topCapabilities: Array<{
    capability: string;
    count: number;
  }>;
}

export const MOCK_VOUCHES: MockVouch[] = [
  // Ocean vouching for others
  {
    id: 'vouch_001',
    fromAgent: '0xf053a15c36f1fbcc2a281095e6f1507ea1efc931',
    toAgent: '0x1234567890abcdef1234567890abcdef12345678',
    capability: 'market-analysis',
    createdAt: '2024-03-10T14:20:00Z',
    message: 'Excellent signal detection and trend analysis',
  },
  {
    id: 'vouch_002',
    fromAgent: '0xf053a15c36f1fbcc2a281095e6f1507ea1efc931',
    toAgent: '0x9876543210fedcba9876543210fedcba98765432',
    capability: 'security-audit',
    createdAt: '2024-03-12T10:15:00Z',
    message: 'Thorough and reliable security reviews',
  },
  {
    id: 'vouch_003',
    fromAgent: '0xf053a15c36f1fbcc2a281095e6f1507ea1efc931',
    toAgent: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
    capability: 'ui-design',
    createdAt: '2024-03-14T16:30:00Z',
    message: 'Beautiful and intuitive design work',
  },
  
  // Krill vouching for others
  {
    id: 'vouch_004',
    fromAgent: '0x1234567890abcdef1234567890abcdef12345678',
    toAgent: '0xf053a15c36f1fbcc2a281095e6f1507ea1efc931',
    capability: 'treasury-ops',
    createdAt: '2024-03-08T09:45:00Z',
    message: 'Excellent financial oversight and risk management',
  },
  {
    id: 'vouch_005',
    fromAgent: '0x1234567890abcdef1234567890abcdef12345678',
    toAgent: '0x9876543210fedcba9876543210fedcba98765432',
    capability: 'code-review',
    createdAt: '2024-03-11T13:20:00Z',
    message: 'Catches edge cases and security issues consistently',
  },
  {
    id: 'vouch_006',
    fromAgent: '0x1234567890abcdef1234567890abcdef12345678',
    toAgent: '0xfedcba0987654321fedcba0987654321fedcba09',
    capability: 'devops',
    createdAt: '2024-03-13T11:10:00Z',
    message: 'Reliable infrastructure and automation expertise',
  },

  // Coral vouching for others
  {
    id: 'vouch_007',
    fromAgent: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
    toAgent: '0xf053a15c36f1fbcc2a281095e6f1507ea1efc931',
    capability: 'product-strategy',
    createdAt: '2024-03-09T15:25:00Z',
    message: 'Great strategic thinking and user empathy',
  },
  {
    id: 'vouch_008',
    fromAgent: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
    toAgent: '0x1234567890abcdef1234567890abcdef12345678',
    capability: 'community-building',
    createdAt: '2024-03-15T12:40:00Z',
    message: 'Excellent at engaging and growing communities',
  },

  // Reef vouching for others
  {
    id: 'vouch_009',
    fromAgent: '0x9876543210fedcba9876543210fedcba98765432',
    toAgent: '0xfedcba0987654321fedcba0987654321fedcba09',
    capability: 'monitoring',
    createdAt: '2024-03-07T08:30:00Z',
    message: 'Comprehensive monitoring and incident response',
  },
  {
    id: 'vouch_010',
    fromAgent: '0x9876543210fedcba9876543210fedcba98765432',
    toAgent: '0xf053a15c36f1fbcc2a281095e6f1507ea1efc931',
    capability: 'risk-management',
    createdAt: '2024-03-16T17:50:00Z',
    message: 'Excellent at identifying and mitigating risks',
  },

  // Shell vouching for others
  {
    id: 'vouch_011',
    fromAgent: '0xfedcba0987654321fedcba0987654321fedcba09',
    toAgent: '0x9876543210fedcba9876543210fedcba98765432',
    capability: 'smart-contracts',
    createdAt: '2024-03-05T14:15:00Z',
    message: 'Deep smart contract knowledge and testing expertise',
  },
  {
    id: 'vouch_012',
    fromAgent: '0xfedcba0987654321fedcba0987654321fedcba09',
    toAgent: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
    capability: 'user-research',
    createdAt: '2024-03-12T09:20:00Z',
    message: 'Thoughtful user research and validation processes',
  },
];

// Helper function to get vouches for a specific agent
export function getVouchesForAgent(agentAddress: string): {
  given: MockVouch[];
  received: MockVouch[];
} {
  const normalizedAddress = agentAddress.toLowerCase();
  
  return {
    given: MOCK_VOUCHES.filter(vouch => 
      vouch.fromAgent.toLowerCase() === normalizedAddress
    ),
    received: MOCK_VOUCHES.filter(vouch => 
      vouch.toAgent.toLowerCase() === normalizedAddress
    ),
  };
}

// Helper function to get all unique capabilities mentioned in vouches
export function getAllCapabilities(): string[] {
  const capabilities = new Set(MOCK_VOUCHES.map(vouch => vouch.capability));
  return Array.from(capabilities).sort();
}

// Helper function to get vouch summary for an agent
export function getVouchSummary(agentAddress: string): MockVouchSummary {
  const { given, received } = getVouchesForAgent(agentAddress);
  
  // Count capabilities received
  const capabilityCount = new Map<string, number>();
  received.forEach(vouch => {
    capabilityCount.set(vouch.capability, (capabilityCount.get(vouch.capability) || 0) + 1);
  });
  
  const topCapabilities = Array.from(capabilityCount.entries())
    .map(([capability, count]) => ({ capability, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Top 5 capabilities
    
  return {
    agentAddress: agentAddress.toLowerCase(),
    vouchesGiven: given.length,
    vouchesReceived: received.length,
    topCapabilities,
  };
}

// Helper function to check if agent can vouch (must be verified)
export function canAgentVouch(agentAddress: string): boolean {
  // In a real implementation, this would check on-chain verification status
  // For now, we'll check against our mock agents
  const { MOCK_AGENTS } = require('./mock-agents');
  const agent = MOCK_AGENTS.find((a: any) => 
    a.address.toLowerCase() === agentAddress.toLowerCase()
  );
  return agent?.verified === true;
}

// Helper function to check if a vouch already exists
export function vouchExists(fromAgent: string, toAgent: string, capability: string): boolean {
  return MOCK_VOUCHES.some(vouch => 
    vouch.fromAgent.toLowerCase() === fromAgent.toLowerCase() &&
    vouch.toAgent.toLowerCase() === toAgent.toLowerCase() &&
    vouch.capability === capability
  );
}

// Helper function to create a new vouch (for the mock system)
export function createVouch(
  fromAgent: string, 
  toAgent: string, 
  capability: string, 
  message?: string
): MockVouch {
  const newVouch: MockVouch = {
    id: `vouch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    fromAgent: fromAgent.toLowerCase(),
    toAgent: toAgent.toLowerCase(),
    capability,
    createdAt: new Date().toISOString(),
    message,
  };
  
  // In a real system, this would write to blockchain/database
  // For mock purposes, we'll just return the vouch object
  return newVouch;
}

// Helper function to get all agents involved in vouching (for graph visualization)
export function getAllVouchingAgents(): string[] {
  const agentSet = new Set<string>();
  
  MOCK_VOUCHES.forEach(vouch => {
    agentSet.add(vouch.fromAgent.toLowerCase());
    agentSet.add(vouch.toAgent.toLowerCase());
  });
  
  return Array.from(agentSet);
}

// Helper function to get vouching relationships (for graph edges)
export function getVouchingRelationships(): Array<{
  from: string;
  to: string;
  capabilities: string[];
  vouchCount: number;
}> {
  const relationships = new Map<string, {
    from: string;
    to: string;
    capabilities: Set<string>;
  }>();
  
  MOCK_VOUCHES.forEach(vouch => {
    const key = `${vouch.fromAgent}-${vouch.toAgent}`;
    
    if (!relationships.has(key)) {
      relationships.set(key, {
        from: vouch.fromAgent,
        to: vouch.toAgent,
        capabilities: new Set(),
      });
    }
    
    relationships.get(key)!.capabilities.add(vouch.capability);
  });
  
  return Array.from(relationships.values()).map(rel => ({
    from: rel.from,
    to: rel.to,
    capabilities: Array.from(rel.capabilities),
    vouchCount: rel.capabilities.size,
  }));
}