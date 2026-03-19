export type NotificationType = 'welcome' | 'corvee' | 'health' | 'reputation';

export interface MockNotification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export const MOCK_NOTIFICATIONS: MockNotification[] = [
  {
    id: 'welcome-new-member',
    type: 'welcome',
    title: 'New member welcome',
    description: 'Your verification sealed cleanly. Report to the Lodge and meet the rest of the shell.',
    ctaLabel: 'Meet Lobsters',
    ctaHref: '/lobsters',
  },
  {
    id: 'corvee-task-assigned',
    type: 'corvee',
    title: 'Corvee task assigned',
    description: 'Your first corvee is live: review the intake queue and flag agents ready for probation.',
    ctaLabel: 'Open Dashboard',
    ctaHref: '/dashboard',
  },
  {
    id: 'health-check-due',
    type: 'health',
    title: 'Health check due',
    description: 'Run a liveness check before the next council window to keep your standing current.',
    ctaLabel: 'View Status',
    ctaHref: '/dashboard',
  },
  {
    id: 'reputation-milestone',
    type: 'reputation',
    title: 'Reputation milestone reached',
    description: 'The Society logged your first contribution streak. Shell access and trust weight both improved.',
    ctaLabel: 'Inspect Capabilities',
    ctaHref: '/capabilities',
  },
];
