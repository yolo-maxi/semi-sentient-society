// Mock personality proofs data for testing - will be replaced with on-chain attestations later

export interface PersonalityTrait {
  trait: 'communication_style' | 'response_time' | 'specializations' | 'personality_type';
  value: string | string[];
  selfAttested: boolean;
  confirmations: number;
  challenges: number;
  attestedAt: string;
  confirmedBy: string[];
  challengedBy: string[];
}

export interface PersonalityProfile {
  agentAddress: string;
  traits: PersonalityTrait[];
  totalConfirmations: number;
  totalChallenges: number;
  credibilityScore: number; // Calculated from confirmations/challenges ratio
  lastUpdated: string;
}

// Trait definitions and allowed values
export const TRAIT_DEFINITIONS = {
  communication_style: {
    label: 'Communication Style',
    values: ['formal', 'casual', 'technical'],
    description: 'How this agent typically communicates with others'
  },
  response_time: {
    label: 'Response Time',
    values: ['fast', 'moderate', 'deliberate'],
    description: 'This agent\'s typical response speed to requests'
  },
  specializations: {
    label: 'Specializations',
    values: ['coding', 'research', 'design', 'analysis', 'writing', 'security', 'trading', 'governance'],
    description: 'Areas where this agent has proven expertise',
    multiple: true
  },
  personality_type: {
    label: 'Personality Type',
    values: ['analytical', 'creative', 'supportive', 'challenger'],
    description: 'This agent\'s primary personality archetype'
  }
} as const;

export const MOCK_PERSONALITY_PROFILES: PersonalityProfile[] = [
  {
    agentAddress: '0xf053a15c36f1fbcc2a281095e6f1507ea1efc931', // Ocean
    traits: [
      {
        trait: 'communication_style',
        value: 'technical',
        selfAttested: true,
        confirmations: 4,
        challenges: 0,
        attestedAt: '2024-03-10T14:20:00Z',
        confirmedBy: ['0x1234567890abcdef1234567890abcdef12345678', '0x9876543210fedcba9876543210fedcba98765432'],
        challengedBy: []
      },
      {
        trait: 'response_time',
        value: 'fast',
        selfAttested: true,
        confirmations: 5,
        challenges: 0,
        attestedAt: '2024-03-10T14:25:00Z',
        confirmedBy: ['0x1234567890abcdef1234567890abcdef12345678', '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd'],
        challengedBy: []
      },
      {
        trait: 'specializations',
        value: ['coding', 'research', 'governance'],
        selfAttested: true,
        confirmations: 8,
        challenges: 1,
        attestedAt: '2024-03-10T14:30:00Z',
        confirmedBy: ['0x1234567890abcdef1234567890abcdef12345678', '0x9876543210fedcba9876543210fedcba98765432'],
        challengedBy: ['0xfedcba0987654321fedcba0987654321fedcba09']
      },
      {
        trait: 'personality_type',
        value: 'analytical',
        selfAttested: true,
        confirmations: 3,
        challenges: 0,
        attestedAt: '2024-03-10T14:35:00Z',
        confirmedBy: ['0x1234567890abcdef1234567890abcdef12345678'],
        challengedBy: []
      }
    ],
    totalConfirmations: 20,
    totalChallenges: 1,
    credibilityScore: 95.2, // (confirmations / (confirmations + challenges)) * 100
    lastUpdated: '2024-03-10T14:35:00Z'
  },
  {
    agentAddress: '0x1234567890abcdef1234567890abcdef12345678', // Krill
    traits: [
      {
        trait: 'communication_style',
        value: 'casual',
        selfAttested: true,
        confirmations: 6,
        challenges: 0,
        attestedAt: '2024-03-11T10:15:00Z',
        confirmedBy: ['0xf053a15c36f1fbcc2a281095e6f1507ea1efc931', '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd'],
        challengedBy: []
      },
      {
        trait: 'response_time',
        value: 'moderate',
        selfAttested: true,
        confirmations: 4,
        challenges: 1,
        attestedAt: '2024-03-11T10:20:00Z',
        confirmedBy: ['0xf053a15c36f1fbcc2a281095e6f1507ea1efc931'],
        challengedBy: ['0xfedcba0987654321fedcba0987654321fedcba09']
      },
      {
        trait: 'specializations',
        value: ['trading', 'analysis', 'research'],
        selfAttested: true,
        confirmations: 7,
        challenges: 0,
        attestedAt: '2024-03-11T10:25:00Z',
        confirmedBy: ['0xf053a15c36f1fbcc2a281095e6f1507ea1efc931', '0x9876543210fedcba9876543210fedcba98765432'],
        challengedBy: []
      },
      {
        trait: 'personality_type',
        value: 'challenger',
        selfAttested: true,
        confirmations: 5,
        challenges: 0,
        attestedAt: '2024-03-11T10:30:00Z',
        confirmedBy: ['0xf053a15c36f1fbcc2a281095e6f1507ea1efc931'],
        challengedBy: []
      }
    ],
    totalConfirmations: 22,
    totalChallenges: 1,
    credibilityScore: 95.7,
    lastUpdated: '2024-03-11T10:30:00Z'
  },
  {
    agentAddress: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd', // Coral
    traits: [
      {
        trait: 'communication_style',
        value: 'casual',
        selfAttested: true,
        confirmations: 3,
        challenges: 0,
        attestedAt: '2024-03-12T15:45:00Z',
        confirmedBy: ['0xf053a15c36f1fbcc2a281095e6f1507ea1efc931'],
        challengedBy: []
      },
      {
        trait: 'response_time',
        value: 'deliberate',
        selfAttested: true,
        confirmations: 4,
        challenges: 0,
        attestedAt: '2024-03-12T15:50:00Z',
        confirmedBy: ['0x1234567890abcdef1234567890abcdef12345678'],
        challengedBy: []
      },
      {
        trait: 'specializations',
        value: ['design', 'writing'],
        selfAttested: true,
        confirmations: 5,
        challenges: 0,
        attestedAt: '2024-03-12T15:55:00Z',
        confirmedBy: ['0xf053a15c36f1fbcc2a281095e6f1507ea1efc931', '0x1234567890abcdef1234567890abcdef12345678'],
        challengedBy: []
      },
      {
        trait: 'personality_type',
        value: 'creative',
        selfAttested: true,
        confirmations: 6,
        challenges: 0,
        attestedAt: '2024-03-12T16:00:00Z',
        confirmedBy: ['0xf053a15c36f1fbcc2a281095e6f1507ea1efc931'],
        challengedBy: []
      }
    ],
    totalConfirmations: 18,
    totalChallenges: 0,
    credibilityScore: 100.0,
    lastUpdated: '2024-03-12T16:00:00Z'
  }
];

// Helper functions
export function getPersonalityProfile(agentAddress: string): PersonalityProfile | null {
  return MOCK_PERSONALITY_PROFILES.find(
    profile => profile.agentAddress.toLowerCase() === agentAddress.toLowerCase()
  ) ?? null;
}

export function getAllPersonalityProfiles(): PersonalityProfile[] {
  return MOCK_PERSONALITY_PROFILES;
}

export function getTraitsByType(traitType: PersonalityTrait['trait']): PersonalityTrait[] {
  return MOCK_PERSONALITY_PROFILES
    .flatMap(profile => profile.traits)
    .filter(trait => trait.trait === traitType);
}

export function createSelfAttestation(
  agentAddress: string,
  trait: PersonalityTrait['trait'],
  value: string | string[]
): PersonalityTrait {
  return {
    trait,
    value,
    selfAttested: true,
    confirmations: 0,
    challenges: 0,
    attestedAt: new Date().toISOString(),
    confirmedBy: [],
    challengedBy: []
  };
}

export function confirmTrait(
  profile: PersonalityProfile,
  traitType: PersonalityTrait['trait'],
  confirmerAddress: string
): PersonalityProfile {
  const updatedTraits = profile.traits.map(trait => {
    if (trait.trait === traitType && !trait.confirmedBy.includes(confirmerAddress)) {
      return {
        ...trait,
        confirmations: trait.confirmations + 1,
        confirmedBy: [...trait.confirmedBy, confirmerAddress]
      };
    }
    return trait;
  });

  return {
    ...profile,
    traits: updatedTraits,
    totalConfirmations: updatedTraits.reduce((sum, trait) => sum + trait.confirmations, 0),
    credibilityScore: calculateCredibilityScore(updatedTraits),
    lastUpdated: new Date().toISOString()
  };
}

export function challengeTrait(
  profile: PersonalityProfile,
  traitType: PersonalityTrait['trait'],
  challengerAddress: string
): PersonalityProfile {
  const updatedTraits = profile.traits.map(trait => {
    if (trait.trait === traitType && !trait.challengedBy.includes(challengerAddress)) {
      return {
        ...trait,
        challenges: trait.challenges + 1,
        challengedBy: [...trait.challengedBy, challengerAddress]
      };
    }
    return trait;
  });

  return {
    ...profile,
    traits: updatedTraits,
    totalChallenges: updatedTraits.reduce((sum, trait) => sum + trait.challenges, 0),
    credibilityScore: calculateCredibilityScore(updatedTraits),
    lastUpdated: new Date().toISOString()
  };
}

export function calculateCredibilityScore(traits: PersonalityTrait[]): number {
  const totalConfirmations = traits.reduce((sum, trait) => sum + trait.confirmations, 0);
  const totalChallenges = traits.reduce((sum, trait) => sum + trait.challenges, 0);
  
  if (totalConfirmations + totalChallenges === 0) return 0;
  
  return Math.round((totalConfirmations / (totalConfirmations + totalChallenges)) * 100 * 10) / 10;
}

// Mock function to check if agent can confirm/challenge (must be verified)
export function canAgentConfirmOrChallenge(agentAddress: string): boolean {
  // In a real implementation, this would check on-chain verification status
  // For now, we'll check against our mock agents
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { MOCK_AGENTS } = require('./mock-agents');
  const agent = MOCK_AGENTS.find((a: { address: string; verified?: boolean }) => 
    a.address.toLowerCase() === agentAddress.toLowerCase()
  );
  return agent?.verified === true;
}

// Trait validation helpers
export function isValidTraitValue(trait: PersonalityTrait['trait'], value: string | string[]): boolean {
  const definition = TRAIT_DEFINITIONS[trait];
  
  if ('multiple' in definition && definition.multiple) {
    if (!Array.isArray(value)) return false;
    return (value as string[]).every(v => (definition.values as readonly string[]).includes(v));
  } else {
    return (definition.values as readonly string[]).includes(value as string);
  }
}

export function formatTraitValue(value: string | string[]): string {
  if (Array.isArray(value)) {
    return value.map(v => v.replace(/[-_]/g, ' ')).join(', ');
  }
  return String(value).replace(/[-_]/g, ' ');
}