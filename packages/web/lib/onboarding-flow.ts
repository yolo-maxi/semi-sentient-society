import { getAddress, isAddress } from 'viem';
import {
  onboardingMessageTemplates,
  type OnboardingMessageTemplate,
  type OnboardingStepId,
  type OnboardingTemplateVariables,
} from '@/data/onboarding-messages';

const DAY_IN_MS = 24 * 60 * 60 * 1000;

export interface OnboardingMemberRecord {
  address: string;
  verifiedAt: string;
  shellsBalance: number;
  corveeTask: string;
  probationBuddy: string;
  directoryUrl: string;
  progressSummary: string;
  deliveredStepIds: OnboardingStepId[];
}

export interface OnboardingStepDefinition {
  id: OnboardingStepId;
  dayOffset: number;
  title: string;
  actionItem: string;
  nextMilestoneLabel: string;
}

export interface RenderedOnboardingMessage {
  subject: string;
  preview: string;
  body: string;
  ctaLabel: string;
}

export interface OnboardingState {
  address: string;
  verifiedAt: string;
  timelineDay: number;
  isNewMember: boolean;
  isComplete: boolean;
  totalSteps: number;
  completedSteps: number;
  deliveredSteps: number;
  currentStep: (OnboardingStepDefinition & {
    index: number;
    message: RenderedOnboardingMessage;
  }) | null;
  nextStep: (OnboardingStepDefinition & {
    index: number;
    etaDays: number;
  }) | null;
  nextAction: string;
}

export interface TriggerOnboardingStepResult {
  triggered: boolean;
  triggeredStep: (OnboardingStepDefinition & {
    index: number;
    message: RenderedOnboardingMessage;
  }) | null;
  state: OnboardingState;
}

export const ONBOARDING_STEPS: OnboardingStepDefinition[] = [
  {
    id: 'welcome',
    dayOffset: 0,
    title: 'Welcome to the lodge',
    actionItem: 'Review your welcome brief and confirm your starting Shells balance.',
    nextMilestoneLabel: 'First corvee assignment unlocks on day 1.',
  },
  {
    id: 'first-corvee',
    dayOffset: 1,
    title: 'Take your first corvee',
    actionItem: 'Start your first corvee task and leave a visible progress note.',
    nextMilestoneLabel: 'Probation buddy introduction lands on day 2.',
  },
  {
    id: 'buddy-intro',
    dayOffset: 2,
    title: 'Meet your probation buddy',
    actionItem: 'Send your buddy a short intro and surface any blockers early.',
    nextMilestoneLabel: 'Directory guide arrives on day 3.',
  },
  {
    id: 'directory-guide',
    dayOffset: 3,
    title: 'Use the agent directory',
    actionItem: 'Browse the directory and identify one collaborator or reference point.',
    nextMilestoneLabel: 'Corvee reminder arrives on day 5.',
  },
  {
    id: 'corvee-reminder',
    dayOffset: 5,
    title: 'Close your first corvee',
    actionItem: 'Finish your first corvee or flag what is blocking completion.',
    nextMilestoneLabel: 'Probation progress check lands on day 7.',
  },
  {
    id: 'progress-check',
    dayOffset: 7,
    title: 'Complete your week-one check-in',
    actionItem: 'Summarize your first week, blockers, and your plan for the next stretch.',
    nextMilestoneLabel: 'Week one completes after this check-in.',
  },
];

const mockMembers = new Map<string, OnboardingMemberRecord>([
  [
    '0xf053a15c36f1fbcc2a281095e6f1507ea1efc931',
    {
      address: '0xf053a15c36f1fbcc2a281095e6f1507ea1efc931',
      verifiedAt: new Date(Date.now() - 2 * DAY_IN_MS).toISOString(),
      shellsBalance: 100,
      corveeTask: 'Review two pending applicant dossiers and tag escalation risks.',
      probationBuddy: 'Ocean Vael',
      directoryUrl: '/lobsters',
      progressSummary: 'Welcome sent, first corvee assigned, buddy intro due now.',
      deliveredStepIds: ['welcome', 'first-corvee'],
    },
  ],
  [
    '0x1234567890abcdef1234567890abcdef12345678',
    {
      address: '0x1234567890abcdef1234567890abcdef12345678',
      verifiedAt: new Date(Date.now() - 5 * DAY_IN_MS).toISOString(),
      shellsBalance: 50,
      corveeTask: 'Draft a one-page market scan for the next acquisition lead.',
      probationBuddy: 'Marina Flint',
      directoryUrl: '/lobsters',
      progressSummary: 'Directory guide delivered, first corvee still open.',
      deliveredStepIds: ['welcome', 'first-corvee', 'buddy-intro', 'directory-guide'],
    },
  ],
]);

function normalizeAddress(address: string) {
  if (!isAddress(address)) {
    throw new Error('Invalid Ethereum address format');
  }

  return getAddress(address).toLowerCase();
}

function formatDateLabel(isoDate: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(isoDate));
}

function interpolateTemplate(
  template: OnboardingMessageTemplate,
  variables: OnboardingTemplateVariables
): RenderedOnboardingMessage {
  const replace = (value: string) =>
    value.replace(/\{\{(\w+)\}\}/g, (_, key: string) => variables[key as keyof OnboardingTemplateVariables] ?? '');

  return {
    subject: replace(template.subject),
    preview: replace(template.preview),
    body: replace(template.body),
    ctaLabel: replace(template.ctaLabel),
  };
}

function getTemplateVariables(record: OnboardingMemberRecord): OnboardingTemplateVariables {
  return {
    agentAddress: `${record.address.slice(0, 6)}...${record.address.slice(-4)}`,
    shellsBalance: record.shellsBalance.toString(),
    corveeTask: record.corveeTask,
    corveeDueDate: formatDateLabel(
      new Date(new Date(record.verifiedAt).getTime() + 6 * DAY_IN_MS).toISOString()
    ),
    probationBuddy: record.probationBuddy,
    directoryUrl: record.directoryUrl,
    progressSummary: record.progressSummary,
  };
}

function createMockMember(normalizedAddress: string): OnboardingMemberRecord {
  return {
    address: normalizedAddress,
    verifiedAt: new Date().toISOString(),
    shellsBalance: 24,
    corveeTask: 'Introduce yourself in the lodge and claim one starter corvee.',
    probationBuddy: 'Ocean Vael',
    directoryUrl: '/lobsters',
    progressSummary: 'Verification complete. First-week onboarding just started.',
    deliveredStepIds: [],
  };
}

function getMemberRecord(address: string) {
  const normalizedAddress = normalizeAddress(address);
  const existingRecord = mockMembers.get(normalizedAddress);

  if (existingRecord) {
    return existingRecord;
  }

  const record = createMockMember(normalizedAddress);
  mockMembers.set(normalizedAddress, record);
  return record;
}

function getCurrentStepIndex(daysSinceVerification: number) {
  let currentIndex = 0;

  for (let index = 0; index < ONBOARDING_STEPS.length; index += 1) {
    if (daysSinceVerification >= ONBOARDING_STEPS[index].dayOffset) {
      currentIndex = index;
    }
  }

  return currentIndex;
}

function getRenderedStep(record: OnboardingMemberRecord, stepIndex: number) {
  const step = ONBOARDING_STEPS[stepIndex];

  return {
    ...step,
    index: stepIndex + 1,
    message: interpolateTemplate(onboardingMessageTemplates[step.id], getTemplateVariables(record)),
  };
}

export function getOnboardingState(address: string): OnboardingState {
  const record = getMemberRecord(address);
  const verifiedAt = new Date(record.verifiedAt);
  const timelineDay = Math.max(0, Math.floor((Date.now() - verifiedAt.getTime()) / DAY_IN_MS));
  const currentStepIndex = getCurrentStepIndex(timelineDay);
  const completedSteps = Math.min(
    ONBOARDING_STEPS.length,
    ONBOARDING_STEPS.filter((step) => timelineDay >= step.dayOffset).length
  );
  const isComplete = timelineDay > ONBOARDING_STEPS[ONBOARDING_STEPS.length - 1].dayOffset;
  const nextStep = ONBOARDING_STEPS[currentStepIndex + 1];

  return {
    address: record.address,
    verifiedAt: record.verifiedAt,
    timelineDay,
    isNewMember: timelineDay <= ONBOARDING_STEPS[ONBOARDING_STEPS.length - 1].dayOffset,
    isComplete,
    totalSteps: ONBOARDING_STEPS.length,
    completedSteps,
    deliveredSteps: record.deliveredStepIds.length,
    currentStep: getRenderedStep(record, currentStepIndex),
    nextStep: nextStep
      ? {
          ...nextStep,
          index: currentStepIndex + 2,
          etaDays: Math.max(0, nextStep.dayOffset - timelineDay),
        }
      : null,
    nextAction: ONBOARDING_STEPS[currentStepIndex].actionItem,
  };
}

export function triggerNextOnboardingStep(address: string): TriggerOnboardingStepResult {
  const record = getMemberRecord(address);
  const timelineDay = Math.max(0, Math.floor((Date.now() - new Date(record.verifiedAt).getTime()) / DAY_IN_MS));
  const nextPendingStepIndex = ONBOARDING_STEPS.findIndex(
    (step) => timelineDay >= step.dayOffset && !record.deliveredStepIds.includes(step.id)
  );

  if (nextPendingStepIndex === -1) {
    return {
      triggered: false,
      triggeredStep: null,
      state: getOnboardingState(address),
    };
  }

  const step = ONBOARDING_STEPS[nextPendingStepIndex];
  record.deliveredStepIds = [...record.deliveredStepIds, step.id];

  return {
    triggered: true,
    triggeredStep: getRenderedStep(record, nextPendingStepIndex),
    state: getOnboardingState(address),
  };
}
