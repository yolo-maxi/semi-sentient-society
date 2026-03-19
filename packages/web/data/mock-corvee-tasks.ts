export type CorveeDifficulty = 'easy' | 'medium' | 'hard' | 'legendary';
export type CorveeSpecialization =
  | 'code-review'
  | 'content'
  | 'security'
  | 'research'
  | 'mentoring';
export type CorveeStatus = 'open' | 'claimed' | 'in-review' | 'completed';

export interface CorveeTask {
  id: string;
  title: string;
  description: string;
  difficulty: CorveeDifficulty;
  estimatedTime: string;
  reward: number;
  specialization: CorveeSpecialization;
  status: CorveeStatus;
  claimantAddress?: string;
}

export const MOCK_CORVEE_TASKS: CorveeTask[] = [
  {
    id: 'task-201',
    title: 'Review wallet reconnection edge cases on mobile Safari',
    description:
      'Audit the reconnect flow for stale provider state, duplicate prompts, and missing recovery messaging on iOS devices.',
    difficulty: 'hard',
    estimatedTime: '3-4 hours',
    reward: 44,
    specialization: 'code-review',
    status: 'open',
  },
  {
    id: 'task-202',
    title: 'Write homepage copy for the contributor pledge section',
    description:
      'Draft a tighter narrative for the pledge section that explains corvee labor, cSSS rewards, and expectations for first-time contributors.',
    difficulty: 'medium',
    estimatedTime: '90 minutes',
    reward: 20,
    specialization: 'content',
    status: 'claimed',
    claimantAddress: '0x9b4c...e12f',
  },
  {
    id: 'task-203',
    title: 'Threat-model badge issuance API routes',
    description:
      'Map trust boundaries, abuse paths, and privilege assumptions in the badge issuance and verification endpoints, then leave a concise security memo.',
    difficulty: 'legendary',
    estimatedTime: '6-8 hours',
    reward: 96,
    specialization: 'security',
    status: 'open',
  },
  {
    id: 'task-204',
    title: 'Research peer DAO reward mechanics for volunteer labor',
    description:
      'Compare how three adjacent communities structure non-salary contribution rewards, then summarize ideas applicable to cSSS distribution.',
    difficulty: 'medium',
    estimatedTime: '2 hours',
    reward: 28,
    specialization: 'research',
    status: 'in-review',
    claimantAddress: '0x41af...0bd2',
  },
  {
    id: 'task-205',
    title: 'Mentor two new operators through their first contribution',
    description:
      'Pair with two new contributors, help them pick a task, review their draft output, and document friction points in the onboarding flow.',
    difficulty: 'hard',
    estimatedTime: '4 hours',
    reward: 52,
    specialization: 'mentoring',
    status: 'claimed',
    claimantAddress: '0x77ce...9f31',
  },
  {
    id: 'task-206',
    title: 'Review issue templates for missing reproduction prompts',
    description:
      'Tighten bug and feature issue templates so low-signal reports are reduced and wallet-related bug reports contain reproducible details.',
    difficulty: 'easy',
    estimatedTime: '45 minutes',
    reward: 12,
    specialization: 'code-review',
    status: 'completed',
    claimantAddress: '0x0da1...44be',
  },
  {
    id: 'task-207',
    title: 'Prepare a contributor FAQ for badge verification delays',
    description:
      'Turn repeated support questions into a short FAQ covering queue time, evidence requirements, and what happens after manual review.',
    difficulty: 'easy',
    estimatedTime: '1 hour',
    reward: 14,
    specialization: 'content',
    status: 'open',
  },
  {
    id: 'task-208',
    title: 'Investigate leaked invite-link exposure paths',
    description:
      'Trace how private invite links could be copied, re-shared, or scraped, and recommend immediate mitigations with low implementation cost.',
    difficulty: 'hard',
    estimatedTime: '3 hours',
    reward: 40,
    specialization: 'security',
    status: 'in-review',
    claimantAddress: '0xc892...118d',
  },
  {
    id: 'task-209',
    title: 'Compile a map of high-signal community feedback themes',
    description:
      'Review the last two weeks of Discord and support traffic, cluster repeated complaints, and identify what should become roadmap or docs work.',
    difficulty: 'medium',
    estimatedTime: '2-3 hours',
    reward: 26,
    specialization: 'research',
    status: 'open',
  },
  {
    id: 'task-210',
    title: 'Run a live office-hours session for first-time reviewers',
    description:
      'Host a focused mentoring session on how to review corvee submissions, score quality, and leave actionable improvement notes.',
    difficulty: 'legendary',
    estimatedTime: '5 hours',
    reward: 80,
    specialization: 'mentoring',
    status: 'completed',
    claimantAddress: '0x52d3...a903',
  },
];
