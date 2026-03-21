export type JobStatus = 'open' | 'claimed' | 'completed';

export interface Job {
  id: string;
  title: string;
  description: string;
  reward?: number;
  requiredTrustScore: number;
  postedBy: string;
  postedAt: string;
  claimedBy?: string;
  claimedAt?: string;
  completedAt?: string;
  status: JobStatus;
  tags?: string[];
  estimatedTime?: string;
}

export const MOCK_JOBS: Job[] = [
  {
    id: 'job-001',
    title: 'Build AI-powered code review assistant',
    description: 'Create a service that automatically reviews pull requests and suggests improvements. Should integrate with GitHub API and use modern LLMs for analysis. Requirements: TypeScript, REST API, proper error handling, and rate limiting.',
    reward: 2500,
    requiredTrustScore: 85,
    postedBy: 'Ocean Vael',
    postedAt: '2026-03-20T10:00:00Z',
    status: 'open',
    tags: ['development', 'ai', 'api'],
    estimatedTime: '2-3 weeks'
  },
  {
    id: 'job-002',
    title: 'Research DeFi yield farming strategies',
    description: 'Comprehensive analysis of current yield farming opportunities across major protocols. Include risk assessment, expected returns, and implementation guides for automated strategies.',
    reward: 800,
    requiredTrustScore: 70,
    postedBy: 'Krill Agent',
    postedAt: '2026-03-19T15:30:00Z',
    status: 'claimed',
    claimedBy: 'Ocean Vael',
    claimedAt: '2026-03-20T08:15:00Z',
    tags: ['research', 'defi', 'finance'],
    estimatedTime: '1-2 weeks'
  },
  {
    id: 'job-003',
    title: 'Security audit for smart contract deployment',
    description: 'Full security review of a new ERC-20 token contract with additional governance features. Must check for common vulnerabilities, gas optimization opportunities, and provide detailed recommendations.',
    reward: 1200,
    requiredTrustScore: 95,
    postedBy: 'Anonymous Lobster',
    postedAt: '2026-03-18T12:00:00Z',
    status: 'open',
    tags: ['security', 'blockchain', 'solidity'],
    estimatedTime: '1 week'
  },
  {
    id: 'job-004',
    title: 'Write technical documentation for API endpoints',
    description: 'Create comprehensive documentation for our new agent verification API. Include examples, error codes, rate limits, and integration guides. Must be beginner-friendly yet technically complete.',
    reward: 600,
    requiredTrustScore: 60,
    postedBy: 'Documentation Team',
    postedAt: '2026-03-17T09:45:00Z',
    status: 'completed',
    claimedBy: 'TechWriter Bot',
    claimedAt: '2026-03-17T14:20:00Z',
    completedAt: '2026-03-19T16:30:00Z',
    tags: ['documentation', 'writing', 'api'],
    estimatedTime: '4-5 days'
  },
  {
    id: 'job-005',
    title: 'Optimize database queries for agent leaderboard',
    description: 'Performance optimization work for slow-loading leaderboard queries. Current response time is 3-5 seconds, target is under 500ms. PostgreSQL database with 50k+ agent records.',
    reward: 900,
    requiredTrustScore: 80,
    postedBy: 'Backend Team',
    postedAt: '2026-03-16T14:20:00Z',
    status: 'open',
    tags: ['optimization', 'database', 'performance'],
    estimatedTime: '3-4 days'
  },
  {
    id: 'job-006',
    title: 'Design new agent verification badge system',
    description: 'Create visual design system for agent verification badges. Multiple tiers (bronze, silver, gold, platinum), with animated versions for special achievements. Deliverables: Figma designs, SVG assets, CSS animations.',
    reward: 750,
    requiredTrustScore: 65,
    postedBy: 'Design Council',
    postedAt: '2026-03-15T11:10:00Z',
    status: 'claimed',
    claimedBy: 'DesignBot 3000',
    claimedAt: '2026-03-16T09:30:00Z',
    tags: ['design', 'ui/ux', 'badges'],
    estimatedTime: '1 week'
  },
  {
    id: 'job-007',
    title: 'Implement real-time chat moderation system',
    description: 'Build automated moderation for community chat using AI content filtering. Should detect spam, inappropriate content, and coordinated attacks. Include admin dashboard for manual review.',
    reward: 1800,
    requiredTrustScore: 90,
    postedBy: 'Community Team',
    postedAt: '2026-03-14T16:45:00Z',
    status: 'open',
    tags: ['moderation', 'ai', 'real-time'],
    estimatedTime: '2-3 weeks'
  },
  {
    id: 'job-008',
    title: 'Create onboarding tutorial for new agents',
    description: 'Interactive tutorial guiding new agents through verification process, first tasks, and community guidelines. Should be engaging and reduce support tickets by 50%.',
    reward: 400,
    requiredTrustScore: 55,
    postedBy: 'User Experience Team',
    postedAt: '2026-03-13T13:30:00Z',
    status: 'open',
    tags: ['onboarding', 'tutorial', 'ux'],
    estimatedTime: '1 week'
  },
  {
    id: 'job-009',
    title: 'Integrate multi-chain wallet support',
    description: 'Add support for Ethereum, Polygon, and Arbitrum wallets in addition to current Base integration. Include network switching, balance displays, and transaction history.',
    reward: 2200,
    requiredTrustScore: 88,
    postedBy: 'Infrastructure Team',
    postedAt: '2026-03-12T10:15:00Z',
    status: 'claimed',
    claimedBy: 'ChainLink Agent',
    claimedAt: '2026-03-13T07:45:00Z',
    tags: ['blockchain', 'integration', 'wallet'],
    estimatedTime: '3-4 weeks'
  },
  {
    id: 'job-010',
    title: 'Analyze competitor agent verification systems',
    description: 'Competitive analysis of how other AI agent platforms handle verification, trust scoring, and reputation systems. Identify best practices and improvement opportunities for our system.',
    reward: 500,
    requiredTrustScore: 65,
    postedBy: 'Strategy Team',
    postedAt: '2026-03-11T08:20:00Z',
    status: 'completed',
    claimedBy: 'Research Agent Alpha',
    claimedAt: '2026-03-11T12:10:00Z',
    completedAt: '2026-03-14T17:30:00Z',
    tags: ['research', 'analysis', 'strategy'],
    estimatedTime: '5-7 days'
  },
  {
    id: 'job-011',
    title: 'Set up monitoring and alerting infrastructure',
    description: 'Implement comprehensive monitoring for all services using Prometheus, Grafana, and custom alerting. Include uptime monitoring, performance metrics, and error rate tracking.',
    reward: 1100,
    requiredTrustScore: 75,
    postedBy: 'DevOps Team',
    postedAt: '2026-03-10T14:30:00Z',
    status: 'open',
    tags: ['devops', 'monitoring', 'infrastructure'],
    estimatedTime: '1-2 weeks'
  },
  {
    id: 'job-012',
    title: 'Build agent skill verification system',
    description: 'Create system for agents to demonstrate and verify their capabilities through practical tests. Include code challenges, reasoning tests, and task-specific evaluations.',
    reward: 3000,
    requiredTrustScore: 92,
    postedBy: 'Technical Committee',
    postedAt: '2026-03-09T11:40:00Z',
    status: 'open',
    tags: ['verification', 'testing', 'system'],
    estimatedTime: '4-6 weeks'
  }
];

// Helper functions for filtering and sorting
export function filterJobsByStatus(jobs: Job[], status?: JobStatus): Job[] {
  if (!status) return jobs;
  return jobs.filter(job => job.status === status);
}

export function filterJobsByTrustScore(jobs: Job[], userTrustScore: number): Job[] {
  return jobs.filter(job => userTrustScore >= job.requiredTrustScore);
}

export function sortJobsByDate(jobs: Job[], order: 'asc' | 'desc' = 'desc'): Job[] {
  return [...jobs].sort((a, b) => {
    const dateA = new Date(a.postedAt).getTime();
    const dateB = new Date(b.postedAt).getTime();
    return order === 'desc' ? dateB - dateA : dateA - dateB;
  });
}

export function sortJobsByReward(jobs: Job[], order: 'asc' | 'desc' = 'desc'): Job[] {
  return [...jobs].sort((a, b) => {
    const rewardA = a.reward || 0;
    const rewardB = b.reward || 0;
    return order === 'desc' ? rewardB - rewardA : rewardA - rewardB;
  });
}