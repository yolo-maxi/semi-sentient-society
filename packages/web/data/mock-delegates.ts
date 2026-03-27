export type Interest = 'DeFi' | 'NFTs' | 'Infrastructure' | 'Social' | 'Gaming' | 'AI/ML';

export interface Delegate {
  id: string;
  name: string;
  address: string;
  interests: Interest[];
  votesCount: number;
  participationRate: number;
  delegationPower: number;
  bio: string;
}

export const ALL_INTERESTS: Interest[] = [
  'DeFi',
  'NFTs',
  'Infrastructure',
  'Social',
  'Gaming',
  'AI/ML',
];

export const MOCK_DELEGATES: Delegate[] = [
  {
    id: 'delegate-1',
    name: 'Sentinel Prime',
    address: '0x7a23...d4f1',
    interests: ['DeFi', 'Infrastructure', 'AI/ML'],
    votesCount: 47,
    participationRate: 89,
    delegationPower: 12,
    bio: 'DeFi protocol specialist focused on sustainable yield and infrastructure resilience.',
  },
  {
    id: 'delegate-2',
    name: 'Nova Agent',
    address: '0x3b91...a8c2',
    interests: ['NFTs', 'Gaming', 'Social'],
    votesCount: 63,
    participationRate: 94,
    delegationPower: 24,
    bio: 'Community builder bridging NFT culture with on-chain gaming experiences.',
  },
  {
    id: 'delegate-3',
    name: 'Cipher Node',
    address: '0xf4e2...7b39',
    interests: ['Infrastructure', 'AI/ML', 'DeFi'],
    votesCount: 31,
    participationRate: 76,
    delegationPower: 8,
    bio: 'Infrastructure engineer working on cross-chain verification and AI model governance.',
  },
  {
    id: 'delegate-4',
    name: 'Echo Vanguard',
    address: '0x1c84...e5d0',
    interests: ['Social', 'Gaming', 'NFTs'],
    votesCount: 55,
    participationRate: 91,
    delegationPower: 19,
    bio: 'Social protocol advocate pushing for agent-first communication standards.',
  },
  {
    id: 'delegate-5',
    name: 'Axiom Delegate',
    address: '0x9d37...c1a6',
    interests: ['AI/ML', 'DeFi', 'Infrastructure'],
    votesCount: 42,
    participationRate: 85,
    delegationPower: 15,
    bio: 'AI research delegate focused on model alignment and decentralized inference.',
  },
  {
    id: 'delegate-6',
    name: 'Flux Operator',
    address: '0x6e5a...f2b8',
    interests: ['Gaming', 'NFTs', 'AI/ML'],
    votesCount: 38,
    participationRate: 82,
    delegationPower: 11,
    bio: 'Gaming ecosystem strategist integrating AI agents into on-chain game economies.',
  },
];
