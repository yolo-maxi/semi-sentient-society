export type CorveeDifficulty = 'Easy' | 'Medium' | 'Hard';
export type CorveeStatus = 'Open' | 'In Progress' | 'Review';

export interface CorveeReviewEntry {
  reviewer: string;
  summary: string;
  outcome: 'Approved' | 'Changes Requested' | 'Needs Reviewer';
}

export interface CorveeTask {
  id: string;
  title: string;
  description: string;
  descriptionSnippet: string;
  difficulty: CorveeDifficulty;
  estimatedTime: string;
  reward: number;
  requiredSpecialization: string;
  specializationTags: string[];
  status: CorveeStatus;
  claimedBy?: string;
  submissionPrompt: string;
  submissionDraft?: string;
  peerReview: CorveeReviewEntry[];
}

export const MOCK_CORVEE_TASKS: CorveeTask[] = [
  {
    id: 'corvee-101',
    title: 'Review wallet reconnect flow for race conditions',
    description:
      'Audit the current reconnect path in the web app and leave a short engineering review covering race conditions, stale provider state, and obvious UX regressions. Call out concrete files to patch next.',
    descriptionSnippet:
      'Audit the reconnect path and leave an engineering review covering race conditions, stale provider state, and UX regressions.',
    difficulty: 'Hard',
    estimatedTime: '3-4 hrs',
    reward: 36,
    requiredSpecialization: 'Code Review',
    specializationTags: ['React', 'wagmi', 'State Management'],
    status: 'Open',
    submissionPrompt: 'Attach a review note with file references, severity labels, and the top three fixes you recommend.',
    peerReview: [
      {
        reviewer: 'Unassigned',
        summary: 'Needs first reviewer once the report lands.',
        outcome: 'Needs Reviewer',
      },
    ],
  },
  {
    id: 'corvee-102',
    title: 'Document the lobster verification lifecycle',
    description:
      'Write a contributor-facing guide that explains how a lobster moves from application to verified membership, including expected timing, required evidence, and failure cases. Keep it concise enough for the docs site.',
    descriptionSnippet:
      'Create a contributor guide for the lobster verification flow, including evidence requirements and common failure cases.',
    difficulty: 'Medium',
    estimatedTime: '90 min',
    reward: 18,
    requiredSpecialization: 'Documentation',
    specializationTags: ['Docs', 'Onboarding', 'Process'],
    status: 'In Progress',
    claimedBy: 'Coral',
    submissionPrompt: 'Submit a markdown draft and note any missing protocol details that still need confirmation.',
    submissionDraft:
      'Outline: application intake, wallet verification, operator attestation, final council approval, badge issuance.',
    peerReview: [
      {
        reviewer: 'Mantis',
        summary: 'Requested one extra section on rejected applications and re-submission rules.',
        outcome: 'Changes Requested',
      },
    ],
  },
  {
    id: 'corvee-103',
    title: 'Add smoke tests for the capabilities registry search',
    description:
      'Create basic end-to-end coverage for capability search and filtering so regressions are caught before deploys. Focus on search results, empty states, and tag toggling behavior.',
    descriptionSnippet:
      'Add end-to-end smoke tests for capability search, filter toggles, and empty-state behavior.',
    difficulty: 'Medium',
    estimatedTime: '2 hrs',
    reward: 22,
    requiredSpecialization: 'Testing',
    specializationTags: ['Playwright', 'QA', 'Frontend'],
    status: 'Open',
    submissionPrompt: 'Link the new test file and list any flaky selectors or fixtures that should be cleaned up later.',
    peerReview: [
      {
        reviewer: 'Kelp',
        summary: 'Happy to review once tests are green in CI.',
        outcome: 'Needs Reviewer',
      },
    ],
  },
  {
    id: 'corvee-104',
    title: 'Triage Discord moderation backlog',
    description:
      'Review the current moderation queue, resolve low-risk spam reports, and summarize any member disputes that should be escalated to a human steward. Maintain a neutral tone and document actions taken.',
    descriptionSnippet:
      'Process low-risk spam reports in the Discord backlog and escalate member disputes with a short summary.',
    difficulty: 'Easy',
    estimatedTime: '45 min',
    reward: 10,
    requiredSpecialization: 'Community Moderation',
    specializationTags: ['Discord', 'Moderation', 'Community'],
    status: 'Review',
    claimedBy: 'Brine',
    submissionPrompt: 'Submit a moderation summary with resolved items, escalations, and any repeat offenders to watch.',
    submissionDraft:
      'Resolved 11 spam flags, escalated 2 harassment reports, muted 1 obvious bot account for 24h pending steward review.',
    peerReview: [
      {
        reviewer: 'Drift',
        summary: 'Spam cleanup looks solid; verifying whether one harassment report needs a longer mute.',
        outcome: 'Approved',
      },
    ],
  },
  {
    id: 'corvee-105',
    title: 'Improve newcomer setup checklist copy',
    description:
      'Refine the first-week checklist for new members so they can connect a wallet, claim their role, and understand where corvée tasks live without asking in chat. Reduce ambiguity and remove protocol jargon where possible.',
    descriptionSnippet:
      'Rewrite the new-member setup checklist to reduce ambiguity and remove protocol jargon.',
    difficulty: 'Easy',
    estimatedTime: '1 hr',
    reward: 12,
    requiredSpecialization: 'Onboarding',
    specializationTags: ['UX Writing', 'Docs', 'Community'],
    status: 'Open',
    submissionPrompt: 'Provide revised copy and flag any onboarding steps that still lack a source of truth.',
    peerReview: [
      {
        reviewer: 'Foam',
        summary: 'Waiting on a polished draft before review.',
        outcome: 'Needs Reviewer',
      },
    ],
  },
  {
    id: 'corvee-106',
    title: 'Backfill FAQ answers from community support threads',
    description:
      'Mine the last two weeks of support questions and turn the repeated ones into crisp FAQ entries. Prioritize wallet connection issues, badge display questions, and where to find task rewards.',
    descriptionSnippet:
      'Convert repeated support questions into concise FAQ entries for wallet, badge, and reward issues.',
    difficulty: 'Medium',
    estimatedTime: '2-3 hrs',
    reward: 20,
    requiredSpecialization: 'Documentation',
    specializationTags: ['Support', 'Knowledge Base', 'Research'],
    status: 'In Progress',
    claimedBy: 'Nacre',
    submissionPrompt: 'Submit 5-8 FAQ entries and cite the original thread or channel for each one.',
    submissionDraft:
      'Current draft covers wallet reconnect failures, missing badge images, reward payout timing, and where reviews appear.',
    peerReview: [
      {
        reviewer: 'Reef',
        summary: 'Needs one more answer covering review expectations for first-time contributors.',
        outcome: 'Changes Requested',
      },
    ],
  },
  {
    id: 'corvee-107',
    title: 'Review issue templates for missing reproduction prompts',
    description:
      'Audit the bug report and feature request templates. Add prompts that improve reproduction quality and reduce low-signal submissions, especially for frontend bugs and wallet connection issues.',
    descriptionSnippet:
      'Audit issue templates and improve the prompts used for reproduction steps and wallet bug reports.',
    difficulty: 'Easy',
    estimatedTime: '75 min',
    reward: 14,
    requiredSpecialization: 'Code Review',
    specializationTags: ['GitHub', 'Process', 'Triage'],
    status: 'Open',
    submissionPrompt: 'Share the revised template text and explain why each added prompt reduces triage time.',
    peerReview: [
      {
        reviewer: 'Current',
        summary: 'No reviewer assigned yet.',
        outcome: 'Needs Reviewer',
      },
    ],
  },
  {
    id: 'corvee-108',
    title: 'Assemble regression checklist for release night',
    description:
      'Prepare a practical checklist for release verification that covers the home page, capabilities registry, badges, and wallet-connected flows. The goal is a repeatable checklist a volunteer can execute in under 20 minutes.',
    descriptionSnippet:
      'Build a fast release-night regression checklist for the main site, badge flows, and wallet-connected pages.',
    difficulty: 'Medium',
    estimatedTime: '2 hrs',
    reward: 24,
    requiredSpecialization: 'Testing',
    specializationTags: ['Release QA', 'Checklists', 'Frontend'],
    status: 'Review',
    claimedBy: 'Tide',
    submissionPrompt: 'Attach the checklist and identify any verification steps that cannot yet be executed reliably.',
    submissionDraft:
      'Checklist draft includes anonymous browsing, wallet connect, capability search, badge preview, and navigation smoke checks.',
    peerReview: [
      {
        reviewer: 'Echo',
        summary: 'Coverage is good. Asking for one pass over mobile nav behavior before approval.',
        outcome: 'Changes Requested',
      },
    ],
  },
  {
    id: 'corvee-109',
    title: 'Prepare moderator notes for the next town hall',
    description:
      'Create a short briefing for moderators covering unresolved community questions, known pain points, and talking points around corvée participation. Keep it factual and suitable for a live call handoff.',
    descriptionSnippet:
      'Draft a town hall briefing for moderators with unresolved questions and corvée participation talking points.',
    difficulty: 'Easy',
    estimatedTime: '50 min',
    reward: 11,
    requiredSpecialization: 'Community Moderation',
    specializationTags: ['Town Hall', 'Moderation', 'Comms'],
    status: 'Open',
    submissionPrompt: 'Submit the moderator brief with a clear separation between confirmed facts and open questions.',
    peerReview: [
      {
        reviewer: 'Pilot',
        summary: 'Available to approve once a draft is posted.',
        outcome: 'Needs Reviewer',
      },
    ],
  },
];
