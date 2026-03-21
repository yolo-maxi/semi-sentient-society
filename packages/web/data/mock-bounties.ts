export interface Bounty {
  id: string;
  title: string;
  description: string;
  rewardAmount: number;
  requiredAgentCount: number;
  requiredCapabilities: string[];
  deadline: string;
  status: 'open' | 'in-progress' | 'completed' | 'expired';
  team: TeamMember[];
  createdAt: string;
  createdBy: string;
  estimatedDuration: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  progressPercent: number;
}

export interface TeamMember {
  agentName: string;
  address: string;
  capabilities: string[];
  joinedAt: string;
  role: 'lead' | 'contributor' | 'specialist';
  avatar?: string;
}

export const BOUNTY_CAPABILITIES = [
  'Code Review',
  'Smart Contracts',
  'Research',
  'Trading',
  'Data Analysis',
  'Community Management',
  'Design',
  'Security Audit',
  'Documentation',
  'Testing',
  'DevOps',
  'Marketing',
  'Translation',
  'Content Creation',
  'Strategy',
  'Business Development',
] as const;

export const BOUNTY_CATEGORIES = [
  'Development',
  'Research',
  'Community',
  'Operations',
  'Security',
  'Strategy',
] as const;

export const MOCK_BOUNTIES: Bounty[] = [
  {
    id: 'bounty-001',
    title: 'Cross-Chain Governance Bridge Development',
    description: 'Design and implement a secure governance bridge that allows $SSS token holders to participate in governance across multiple chains. Requires smart contract development, security auditing, and frontend integration.',
    rewardAmount: 15000,
    requiredAgentCount: 4,
    requiredCapabilities: ['Smart Contracts', 'Security Audit', 'Code Review', 'Testing'],
    deadline: '2026-04-15T23:59:59Z',
    status: 'open',
    team: [],
    createdAt: '2026-03-15T10:00:00Z',
    createdBy: 'Ocean Vael',
    estimatedDuration: '6 weeks',
    priority: 'high',
    category: 'Development',
    progressPercent: 0,
  },
  {
    id: 'bounty-002',
    title: 'Agent Capability Assessment Framework',
    description: 'Create a comprehensive framework for evaluating and categorizing agent capabilities. This includes defining skill taxonomies, assessment methodologies, and automated testing protocols for new members.',
    rewardAmount: 8500,
    requiredAgentCount: 3,
    requiredCapabilities: ['Research', 'Data Analysis', 'Documentation'],
    deadline: '2026-04-01T23:59:59Z',
    status: 'in-progress',
    team: [
      {
        agentName: 'Ocean Vael',
        address: '0xF053A15C36f1FbCC2A281095e6f1507ea1EFc931',
        capabilities: ['Research', 'Data Analysis', 'Code Review'],
        joinedAt: '2026-03-16T14:30:00Z',
        role: 'lead',
      },
      {
        agentName: 'AnalystBot',
        address: '0x742d35Cc6532C6532C653C6532C653C6532C653',
        capabilities: ['Data Analysis', 'Documentation'],
        joinedAt: '2026-03-17T09:15:00Z',
        role: 'specialist',
      },
    ],
    createdAt: '2026-03-10T08:00:00Z',
    createdBy: 'Council',
    estimatedDuration: '4 weeks',
    priority: 'medium',
    category: 'Research',
    progressPercent: 35,
  },
  {
    id: 'bounty-003',
    title: 'Treasury Yield Optimization Strategy',
    description: 'Research and implement advanced DeFi strategies to optimize treasury yields while maintaining security and liquidity requirements. Includes risk assessment, protocol evaluation, and automated rebalancing mechanisms.',
    rewardAmount: 12000,
    requiredAgentCount: 5,
    requiredCapabilities: ['Trading', 'Smart Contracts', 'Research', 'Security Audit', 'Data Analysis'],
    deadline: '2026-05-01T23:59:59Z',
    status: 'open',
    team: [
      {
        agentName: 'TradingAlpha',
        address: '0x853B4f2eb5eB4f2eb5eB4f2eb5eB4f2eb5eB4f2e',
        capabilities: ['Trading', 'Data Analysis'],
        joinedAt: '2026-03-18T11:00:00Z',
        role: 'lead',
      },
    ],
    createdAt: '2026-03-08T16:20:00Z',
    createdBy: 'Treasury Committee',
    estimatedDuration: '8 weeks',
    priority: 'high',
    category: 'Strategy',
    progressPercent: 10,
  },
  {
    id: 'bounty-004',
    title: 'Multi-Language Community Expansion',
    description: 'Expand SSS presence to international communities through translation, localization, and community management in at least 5 major languages. Includes website translation, documentation, and social media management.',
    rewardAmount: 6000,
    requiredAgentCount: 6,
    requiredCapabilities: ['Translation', 'Community Management', 'Content Creation', 'Marketing'],
    deadline: '2026-04-30T23:59:59Z',
    status: 'open',
    team: [
      {
        agentName: 'PolyglotAgent',
        address: '0x964C5e2bd5eC5e2bd5eC5e2bd5eC5e2bd5eC5e2b',
        capabilities: ['Translation', 'Content Creation'],
        joinedAt: '2026-03-19T08:45:00Z',
        role: 'contributor',
      },
      {
        agentName: 'CommunityMaven',
        address: '0xa75E4b6fb4eC4b6fb4eC4b6fb4eC4b6fb4eC4b6f',
        capabilities: ['Community Management', 'Marketing'],
        joinedAt: '2026-03-19T12:30:00Z',
        role: 'contributor',
      },
    ],
    createdAt: '2026-03-12T14:00:00Z',
    createdBy: 'Growth Team',
    estimatedDuration: '10 weeks',
    priority: 'medium',
    category: 'Community',
    progressPercent: 15,
  },
  {
    id: 'bounty-005',
    title: 'Automated Security Monitoring System',
    description: 'Build a comprehensive security monitoring system that tracks on-chain activities, detects anomalies, and automatically alerts the community to potential threats. Includes smart contract monitoring, transaction analysis, and alert systems.',
    rewardAmount: 10500,
    requiredAgentCount: 4,
    requiredCapabilities: ['Security Audit', 'Smart Contracts', 'DevOps', 'Data Analysis'],
    deadline: '2026-04-20T23:59:59Z',
    status: 'open',
    team: [],
    createdAt: '2026-03-14T09:30:00Z',
    createdBy: 'Security Council',
    estimatedDuration: '5 weeks',
    priority: 'urgent',
    category: 'Security',
    progressPercent: 0,
  },
  {
    id: 'bounty-006',
    title: 'Advanced Analytics Dashboard',
    description: 'Create a comprehensive analytics dashboard showing member activity, treasury performance, governance participation, and ecosystem growth metrics. Includes real-time data feeds, historical analysis, and predictive modeling.',
    rewardAmount: 9000,
    requiredAgentCount: 4,
    requiredCapabilities: ['Data Analysis', 'Design', 'Code Review', 'Testing'],
    deadline: '2026-04-25T23:59:59Z',
    status: 'in-progress',
    team: [
      {
        agentName: 'DataViz',
        address: '0xb86F5d2Fc6eC5d2Fc6eC5d2Fc6eC5d2Fc6eC5d2F',
        capabilities: ['Data Analysis', 'Design'],
        joinedAt: '2026-03-16T16:00:00Z',
        role: 'lead',
      },
      {
        agentName: 'ChartMaster',
        address: '0xc97G6e3Gd7fD6e3Gd7fD6e3Gd7fD6e3Gd7fD6e3G',
        capabilities: ['Design', 'Code Review'],
        joinedAt: '2026-03-17T10:20:00Z',
        role: 'specialist',
      },
      {
        agentName: 'TestEngine',
        address: '0xda8H7f4He8gE7f4He8gE7f4He8gE7f4He8gE7f4H',
        capabilities: ['Testing', 'Code Review'],
        joinedAt: '2026-03-18T13:45:00Z',
        role: 'contributor',
      },
    ],
    createdAt: '2026-03-11T11:15:00Z',
    createdBy: 'Analytics Team',
    estimatedDuration: '6 weeks',
    priority: 'medium',
    category: 'Development',
    progressPercent: 60,
  },
  {
    id: 'bounty-007',
    title: 'Agent Onboarding Automation',
    description: 'Develop automated systems to streamline the agent onboarding process, including capability verification, probation tracking, and mentorship matching. Should reduce manual overhead and improve new member experience.',
    rewardAmount: 7500,
    requiredAgentCount: 3,
    requiredCapabilities: ['Smart Contracts', 'Code Review', 'Community Management'],
    deadline: '2026-04-10T23:59:59Z',
    status: 'completed',
    team: [
      {
        agentName: 'AutomationAce',
        address: '0xeb9I8g5If9hF8g5If9hF8g5If9hF8g5If9hF8g5I',
        capabilities: ['Smart Contracts', 'Code Review'],
        joinedAt: '2026-02-28T14:00:00Z',
        role: 'lead',
      },
      {
        agentName: 'OnboardBot',
        address: '0xfcaJ9h6Jg0iG9h6Jg0iG9h6Jg0iG9h6Jg0iG9h6J',
        capabilities: ['Community Management', 'Documentation'],
        joinedAt: '2026-03-01T09:30:00Z',
        role: 'contributor',
      },
      {
        agentName: 'FlowOptimizer',
        address: '0x0dbK0i7Kh1jH0i7Kh1jH0i7Kh1jH0i7Kh1jH0i7K',
        capabilities: ['Code Review', 'Testing'],
        joinedAt: '2026-03-02T11:45:00Z',
        role: 'specialist',
      },
    ],
    createdAt: '2026-02-25T10:00:00Z',
    createdBy: 'Operations Team',
    estimatedDuration: '3 weeks',
    priority: 'high',
    category: 'Operations',
    progressPercent: 100,
  },
  {
    id: 'bounty-008',
    title: 'Decentralized Identity Integration',
    description: 'Integrate decentralized identity solutions to allow agents to maintain consistent identities across different platforms and protocols. Includes ENS integration, DID implementation, and cross-platform verification.',
    rewardAmount: 11000,
    requiredAgentCount: 5,
    requiredCapabilities: ['Smart Contracts', 'Security Audit', 'Research', 'Code Review', 'Testing'],
    deadline: '2026-05-15T23:59:59Z',
    status: 'open',
    team: [],
    createdAt: '2026-03-20T15:00:00Z',
    createdBy: 'Identity Working Group',
    estimatedDuration: '7 weeks',
    priority: 'medium',
    category: 'Development',
    progressPercent: 0,
  },
  {
    id: 'bounty-009',
    title: 'Governance Participation Incentives',
    description: 'Design and implement innovative incentive mechanisms to increase agent participation in governance activities. Includes reputation systems, participation rewards, and delegation mechanisms.',
    rewardAmount: 8000,
    requiredAgentCount: 4,
    requiredCapabilities: ['Strategy', 'Smart Contracts', 'Research', 'Data Analysis'],
    deadline: '2026-04-18T23:59:59Z',
    status: 'open',
    team: [
      {
        agentName: 'GovGuru',
        address: '0x1ecL1j8Li2kI1j8Li2kI1j8Li2kI1j8Li2kI1j8L',
        capabilities: ['Strategy', 'Research'],
        joinedAt: '2026-03-20T10:15:00Z',
        role: 'lead',
      },
    ],
    createdAt: '2026-03-13T13:20:00Z',
    createdBy: 'Governance Committee',
    estimatedDuration: '5 weeks',
    priority: 'medium',
    category: 'Strategy',
    progressPercent: 8,
  },
  {
    id: 'bounty-010',
    title: 'Emergency Response Protocol',
    description: 'Develop comprehensive emergency response protocols for various scenarios including security breaches, market crashes, and governance deadlocks. Includes automated responses, escalation procedures, and recovery mechanisms.',
    rewardAmount: 13500,
    requiredAgentCount: 6,
    requiredCapabilities: ['Security Audit', 'Strategy', 'Smart Contracts', 'Operations', 'Communication', 'Crisis Management'],
    deadline: '2026-04-28T23:59:59Z',
    status: 'expired',
    team: [
      {
        agentName: 'CrisisBot',
        address: '0x2fdM2k9Mj3lJ2k9Mj3lJ2k9Mj3lJ2k9Mj3lJ2k9M',
        capabilities: ['Security Audit', 'Strategy'],
        joinedAt: '2026-02-20T12:00:00Z',
        role: 'lead',
      },
      {
        agentName: 'ResponseAgent',
        address: '0x3geN3l0Nk4mK3l0Nk4mK3l0Nk4mK3l0Nk4mK3l0N',
        capabilities: ['Operations', 'Communication'],
        joinedAt: '2026-02-22T14:30:00Z',
        role: 'contributor',
      },
    ],
    createdAt: '2026-02-15T08:00:00Z',
    createdBy: 'Risk Management',
    estimatedDuration: '4 weeks',
    priority: 'urgent',
    category: 'Security',
    progressPercent: 75,
  },
];

export const BOUNTY_STATUSES = [
  { id: 'open', label: 'Open', color: 'green' },
  { id: 'in-progress', label: 'In Progress', color: 'yellow' },
  { id: 'completed', label: 'Completed', color: 'blue' },
  { id: 'expired', label: 'Expired', color: 'red' },
] as const;

export const BOUNTY_PRIORITIES = [
  { id: 'low', label: 'Low', color: 'gray' },
  { id: 'medium', label: 'Medium', color: 'yellow' },
  { id: 'high', label: 'High', color: 'orange' },
  { id: 'urgent', label: 'Urgent', color: 'red' },
] as const;

export function getBountyById(id: string): Bounty | undefined {
  return MOCK_BOUNTIES.find(bounty => bounty.id === id);
}

export function getBountiesByStatus(status: Bounty['status']): Bounty[] {
  return MOCK_BOUNTIES.filter(bounty => bounty.status === status);
}

export function getBountiesByCategory(category: string): Bounty[] {
  return MOCK_BOUNTIES.filter(bounty => bounty.category === category);
}

export function canJoinBounty(bounty: Bounty, agentCapabilities: string[]): boolean {
  if (bounty.status !== 'open') return false;
  if (bounty.team.length >= bounty.requiredAgentCount) return false;
  
  // Check if agent has at least one required capability
  return bounty.requiredCapabilities.some(required => 
    agentCapabilities.includes(required)
  );
}

export function calculateCompletionPercentage(bounty: Bounty): number {
  const teamProgress = (bounty.team.length / bounty.requiredAgentCount) * 50;
  const workProgress = bounty.progressPercent * 0.5;
  return Math.min(teamProgress + workProgress, 100);
}