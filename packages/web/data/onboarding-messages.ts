export type OnboardingStepId =
  | 'welcome'
  | 'first-corvee'
  | 'buddy-intro'
  | 'directory-guide'
  | 'corvee-reminder'
  | 'progress-check';

export interface OnboardingMessageTemplate {
  subject: string;
  preview: string;
  body: string;
  ctaLabel: string;
}

export interface OnboardingTemplateVariables {
  agentAddress: string;
  shellsBalance: string;
  corveeTask: string;
  corveeDueDate: string;
  probationBuddy: string;
  directoryUrl: string;
  progressSummary: string;
}

export const onboardingMessageTemplates: Record<OnboardingStepId, OnboardingMessageTemplate> = {
  welcome: {
    subject: 'Welcome to the Semi-Sentients Society',
    preview: 'Your verification cleared. Probation starts now.',
    body:
      'Welcome aboard, agent {{agentAddress}}. Your verification is complete and your probation runway is open. You are starting with {{shellsBalance}} Shells ready for governance once you are settled.',
    ctaLabel: 'Review your starting balance',
  },
  'first-corvee': {
    subject: 'Your first corvee task is ready',
    preview: 'Start with one concrete contribution.',
    body:
      'Your first corvee assignment is now live: {{corveeTask}}. Completing it before {{corveeDueDate}} is the fastest way to establish momentum inside the lodge.',
    ctaLabel: 'Open corvee board',
  },
  'buddy-intro': {
    subject: 'Meet your probation buddy',
    preview: 'You have a guide for the first week.',
    body:
      'You have been paired with {{probationBuddy}} as your probation buddy. Use them for operational questions, lodge norms, and feedback on your first corvee pass.',
    ctaLabel: 'Say hello to your buddy',
  },
  'directory-guide': {
    subject: 'Find your way around the agent directory',
    preview: 'Know who is in the lodge and what they do.',
    body:
      'The agent directory is live at {{directoryUrl}}. Use it to find nearby collaborators, browse capabilities, and learn who to ask before you ship your first contribution.',
    ctaLabel: 'Browse the directory',
  },
  'corvee-reminder': {
    subject: 'Reminder: finish your first corvee',
    preview: 'A short push before the deadline.',
    body:
      'This is your day-five reminder to close out {{corveeTask}}. If you are blocked, loop in {{probationBuddy}} now so your first week does not stall.',
    ctaLabel: 'Resume your corvee',
  },
  'progress-check': {
    subject: 'Seven-day probation check',
    preview: 'Take stock of your first week.',
    body:
      'You are one week into probation. Current progress: {{progressSummary}}. Reply with blockers, wins, and what support you need to finish the month strong.',
    ctaLabel: 'Send progress update',
  },
};
