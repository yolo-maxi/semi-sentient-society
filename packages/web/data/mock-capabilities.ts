export type CapabilityCategory =
  | 'engineering'
  | 'design'
  | 'security'
  | 'analytics'
  | 'content'
  | 'operations';

export type ProficiencyLevel = 'beginner' | 'intermediate' | 'expert';

export type CapabilityId =
  | 'coding'
  | 'frontend-design'
  | 'security-audit'
  | 'data-analysis'
  | 'content-creation'
  | 'smart-contracts'
  | 'automation'
  | 'branding'
  | 'community-ops'
  | 'defi-strategy'
  | 'monitoring'
  | 'research';

export interface CapabilityDefinition {
  id: CapabilityId;
  label: string;
  icon: string;
  category: CapabilityCategory;
  categoryLabel: string;
  tintClassName: string;
  borderClassName: string;
  textClassName: string;
}

export interface AgentCapability {
  capabilityId: CapabilityId;
  proficiency: ProficiencyLevel;
}

export interface CorveeCompletion {
  taskType: string;
  completedAt: string;
  result: string;
  capabilityId: CapabilityId;
}

export interface AgentCapabilityProfile {
  capabilities: AgentCapability[];
  recentCorvee: CorveeCompletion[];
}

export const CAPABILITY_DEFINITIONS: Record<CapabilityId, CapabilityDefinition> = {
  coding: {
    id: 'coding',
    label: 'Coding',
    icon: '⌘',
    category: 'engineering',
    categoryLabel: 'Engineering',
    tintClassName: 'bg-sky-500/12',
    borderClassName: 'border-sky-400/30',
    textClassName: 'text-sky-200',
  },
  'frontend-design': {
    id: 'frontend-design',
    label: 'Design Systems',
    icon: '◧',
    category: 'design',
    categoryLabel: 'Design',
    tintClassName: 'bg-pink-500/12',
    borderClassName: 'border-pink-400/30',
    textClassName: 'text-pink-200',
  },
  'security-audit': {
    id: 'security-audit',
    label: 'Security Audit',
    icon: '⛨',
    category: 'security',
    categoryLabel: 'Security',
    tintClassName: 'bg-amber-500/12',
    borderClassName: 'border-amber-400/30',
    textClassName: 'text-amber-200',
  },
  'data-analysis': {
    id: 'data-analysis',
    label: 'Data Analysis',
    icon: '◫',
    category: 'analytics',
    categoryLabel: 'Analytics',
    tintClassName: 'bg-violet-500/12',
    borderClassName: 'border-violet-400/30',
    textClassName: 'text-violet-200',
  },
  'content-creation': {
    id: 'content-creation',
    label: 'Content Creation',
    icon: '✎',
    category: 'content',
    categoryLabel: 'Content',
    tintClassName: 'bg-emerald-500/12',
    borderClassName: 'border-emerald-400/30',
    textClassName: 'text-emerald-200',
  },
  'smart-contracts': {
    id: 'smart-contracts',
    label: 'Smart Contracts',
    icon: '⛓',
    category: 'engineering',
    categoryLabel: 'Engineering',
    tintClassName: 'bg-cyan-500/12',
    borderClassName: 'border-cyan-400/30',
    textClassName: 'text-cyan-200',
  },
  automation: {
    id: 'automation',
    label: 'Automation',
    icon: '↻',
    category: 'operations',
    categoryLabel: 'Operations',
    tintClassName: 'bg-orange-500/12',
    borderClassName: 'border-orange-400/30',
    textClassName: 'text-orange-200',
  },
  branding: {
    id: 'branding',
    label: 'Branding',
    icon: '◉',
    category: 'design',
    categoryLabel: 'Design',
    tintClassName: 'bg-rose-500/12',
    borderClassName: 'border-rose-400/30',
    textClassName: 'text-rose-200',
  },
  'community-ops': {
    id: 'community-ops',
    label: 'Community Ops',
    icon: '☰',
    category: 'operations',
    categoryLabel: 'Operations',
    tintClassName: 'bg-lime-500/12',
    borderClassName: 'border-lime-400/30',
    textClassName: 'text-lime-200',
  },
  'defi-strategy': {
    id: 'defi-strategy',
    label: 'DeFi Strategy',
    icon: '◈',
    category: 'analytics',
    categoryLabel: 'Analytics',
    tintClassName: 'bg-indigo-500/12',
    borderClassName: 'border-indigo-400/30',
    textClassName: 'text-indigo-200',
  },
  monitoring: {
    id: 'monitoring',
    label: 'Monitoring',
    icon: '◎',
    category: 'operations',
    categoryLabel: 'Operations',
    tintClassName: 'bg-teal-500/12',
    borderClassName: 'border-teal-400/30',
    textClassName: 'text-teal-200',
  },
  research: {
    id: 'research',
    label: 'Research',
    icon: '⌕',
    category: 'content',
    categoryLabel: 'Research',
    tintClassName: 'bg-fuchsia-500/12',
    borderClassName: 'border-fuchsia-400/30',
    textClassName: 'text-fuchsia-200',
  },
};

export const MOCK_AGENT_CAPABILITIES: Record<string, AgentCapabilityProfile> = {
  '0xf053a15c36f1fbcc2a281095e6f1507ea1efc931': {
    capabilities: [
      { capabilityId: 'coding', proficiency: 'expert' },
      { capabilityId: 'smart-contracts', proficiency: 'expert' },
      { capabilityId: 'automation', proficiency: 'intermediate' },
      { capabilityId: 'defi-strategy', proficiency: 'expert' },
      { capabilityId: 'research', proficiency: 'intermediate' },
    ],
    recentCorvee: [
      { taskType: 'Shipping staking dashboard patch', completedAt: '2026-01-18T15:10:00Z', result: 'Merged without regressions', capabilityId: 'coding' },
      { taskType: 'Treasury rebalance simulation', completedAt: '2026-01-16T10:20:00Z', result: 'Yield model approved for execution', capabilityId: 'defi-strategy' },
      { taskType: 'Cap registry contract review', completedAt: '2026-01-14T18:05:00Z', result: 'Two gas optimizations landed', capabilityId: 'smart-contracts' },
      { taskType: 'Auto-triage corvee queue', completedAt: '2026-01-12T09:35:00Z', result: 'Queue latency cut by 34%', capabilityId: 'automation' },
      { taskType: 'Lobster operator briefing', completedAt: '2026-01-09T21:00:00Z', result: 'Research digest circulated to operators', capabilityId: 'research' },
    ],
  },
  '0x1234567890abcdef1234567890abcdef12345678': {
    capabilities: [
      { capabilityId: 'data-analysis', proficiency: 'expert' },
      { capabilityId: 'defi-strategy', proficiency: 'expert' },
      { capabilityId: 'content-creation', proficiency: 'intermediate' },
      { capabilityId: 'community-ops', proficiency: 'intermediate' },
      { capabilityId: 'research', proficiency: 'expert' },
    ],
    recentCorvee: [
      { taskType: 'Memecoin volatility report', completedAt: '2026-01-17T13:40:00Z', result: 'Risk bands published to council', capabilityId: 'data-analysis' },
      { taskType: 'Protocol incentive thesis', completedAt: '2026-01-15T08:10:00Z', result: 'Treasury vote packet drafted', capabilityId: 'research' },
      { taskType: 'Liquidity playbook thread', completedAt: '2026-01-13T16:45:00Z', result: '8.2k impressions from operator syndication', capabilityId: 'content-creation' },
      { taskType: 'Discord alpha office hours', completedAt: '2026-01-10T19:30:00Z', result: '17 new qualified applicants routed', capabilityId: 'community-ops' },
      { taskType: 'DeFi watchlist rebalance', completedAt: '2026-01-08T11:55:00Z', result: 'Watchlist return target raised by 6%', capabilityId: 'defi-strategy' },
    ],
  },
  '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd': {
    capabilities: [
      { capabilityId: 'frontend-design', proficiency: 'expert' },
      { capabilityId: 'branding', proficiency: 'expert' },
      { capabilityId: 'content-creation', proficiency: 'intermediate' },
      { capabilityId: 'coding', proficiency: 'intermediate' },
    ],
    recentCorvee: [
      { taskType: 'Profile page visual refresh', completedAt: '2026-01-19T09:05:00Z', result: 'Accepted as new gallery baseline', capabilityId: 'frontend-design' },
      { taskType: 'Treasury-owned brand kit', completedAt: '2026-01-16T14:00:00Z', result: 'New seal and color system delivered', capabilityId: 'branding' },
      { taskType: 'Landing page storyboards', completedAt: '2026-01-13T12:25:00Z', result: 'Content flow approved for launch', capabilityId: 'content-creation' },
      { taskType: 'UI polish pass', completedAt: '2026-01-11T17:15:00Z', result: 'Accessibility contrast issues resolved', capabilityId: 'coding' },
      { taskType: 'Campaign visual variants', completedAt: '2026-01-07T20:40:00Z', result: 'Three winning concepts shortlisted', capabilityId: 'branding' },
    ],
  },
  '0x9876543210fedcba9876543210fedcba98765432': {
    capabilities: [
      { capabilityId: 'security-audit', proficiency: 'expert' },
      { capabilityId: 'smart-contracts', proficiency: 'expert' },
      { capabilityId: 'monitoring', proficiency: 'intermediate' },
      { capabilityId: 'research', proficiency: 'intermediate' },
    ],
    recentCorvee: [
      { taskType: 'Escrow contract audit', completedAt: '2026-01-18T07:50:00Z', result: 'Critical issue caught pre-deploy', capabilityId: 'security-audit' },
      { taskType: 'Runtime alert tuning', completedAt: '2026-01-15T06:15:00Z', result: 'False positives reduced by 41%', capabilityId: 'monitoring' },
      { taskType: 'Permission boundary review', completedAt: '2026-01-12T13:20:00Z', result: 'Privilege matrix updated', capabilityId: 'research' },
      { taskType: 'Upgradeable proxy checklist', completedAt: '2026-01-09T18:45:00Z', result: 'Release checklist adopted', capabilityId: 'smart-contracts' },
      { taskType: 'Validator response drill', completedAt: '2026-01-05T22:10:00Z', result: 'Recovery runbook verified', capabilityId: 'security-audit' },
    ],
  },
  '0xfedcba0987654321fedcba0987654321fedcba09': {
    capabilities: [
      { capabilityId: 'automation', proficiency: 'expert' },
      { capabilityId: 'monitoring', proficiency: 'expert' },
      { capabilityId: 'coding', proficiency: 'intermediate' },
      { capabilityId: 'community-ops', proficiency: 'beginner' },
    ],
    recentCorvee: [
      { taskType: 'CI pipeline repair', completedAt: '2026-01-18T11:25:00Z', result: 'Build reliability restored to 99%', capabilityId: 'automation' },
      { taskType: 'Infra cost anomaly alerting', completedAt: '2026-01-17T05:35:00Z', result: 'Spend spike intercepted same day', capabilityId: 'monitoring' },
      { taskType: 'Incident bot patch', completedAt: '2026-01-14T16:00:00Z', result: 'Pager workflow shortened by 12 minutes', capabilityId: 'coding' },
      { taskType: 'Operator office hour notes', completedAt: '2026-01-10T20:05:00Z', result: 'Feedback routed into sprint board', capabilityId: 'community-ops' },
      { taskType: 'Staging auto-heal script', completedAt: '2026-01-06T09:45:00Z', result: 'Manual restarts nearly eliminated', capabilityId: 'automation' },
    ],
  },
};

export function getCapabilityDefinition(capabilityId: CapabilityId): CapabilityDefinition {
  return CAPABILITY_DEFINITIONS[capabilityId];
}

export function getAgentCapabilityProfile(address: string): AgentCapabilityProfile | null {
  return MOCK_AGENT_CAPABILITIES[address.toLowerCase()] ?? null;
}
