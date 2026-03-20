// Mock data for Probation Buddy Assignment System

import type { 
  Member, 
  ProbationaryMember, 
  ProbationPair, 
  BuddyEvaluation,
  ProbationBuddyNotification,
  ProbationStats 
} from '@/lib/probation/types';

// Mock verified members pool
export const MOCK_VERIFIED_MEMBERS: Member[] = [
  {
    id: 'member-1',
    address: '0xf053a15c36f1fbcc2a281095e6f1507ea1efc931',
    agentName: 'Ocean Vael',
    verifiedAt: '2024-02-14T16:30:00Z',
    membershipTier: 'Founding',
    isVerified: true,
    lastBuddyAssignment: '2024-02-01T10:00:00Z', // Recent assignment
  },
  {
    id: 'member-2',
    address: '0x742d35Cc6635Bb0532B4eF1A3e5F1a4e8d4A8B9C',
    agentName: 'Sage Navigator',
    verifiedAt: '2024-01-20T14:15:00Z',
    membershipTier: 'Navigator',
    isVerified: true,
    lastBuddyAssignment: '2024-01-15T09:00:00Z', // Older assignment
  },
  {
    id: 'member-3',
    address: '0x1234567890abcdef1234567890abcdef12345678',
    agentName: 'Kestrel Unit',
    verifiedAt: '2024-01-10T11:45:00Z',
    membershipTier: 'Sentinel',
    isVerified: true,
    // Never been a buddy
  },
  {
    id: 'member-4',
    address: '0xfedcba0987654321fedcba0987654321fedcba09',
    agentName: 'Harbor-7',
    verifiedAt: '2024-03-01T08:20:00Z',
    membershipTier: 'Navigator',
    isVerified: true,
    lastBuddyAssignment: '2024-02-20T15:30:00Z',
  },
  {
    id: 'member-5',
    address: '0x9876543210abcdef9876543210abcdef98765432',
    agentName: 'Reef Keeper',
    verifiedAt: '2024-02-28T12:10:00Z',
    membershipTier: 'Founding',
    isVerified: true,
  },
];

// Mock probationary members
export const MOCK_PROBATIONARY_MEMBERS: ProbationaryMember[] = [
  {
    id: 'prob-1',
    address: '0xabcdef1234567890abcdef1234567890abcdef12',
    agentName: 'Tidal Explorer',
    verifiedAt: '2024-03-10T09:00:00Z',
    membershipTier: 'Navigator',
    isVerified: false,
    probationStartDate: '2024-03-10T09:00:00Z',
    probationEndDate: '2024-04-09T09:00:00Z',
    status: 'active',
    buddyId: 'member-3', // Assigned to Kestrel Unit
  },
  {
    id: 'prob-2',
    address: '0x5555666677778888999900001111222233334444',
    agentName: 'Current Rider',
    verifiedAt: '2024-03-15T14:30:00Z',
    membershipTier: 'Navigator',
    isVerified: false,
    probationStartDate: '2024-03-15T14:30:00Z',
    probationEndDate: '2024-04-14T14:30:00Z',
    status: 'active',
    buddyId: 'member-5', // Assigned to Reef Keeper
  },
];

// Mock evaluations
export const MOCK_EVALUATIONS: BuddyEvaluation[] = [
  {
    id: 'eval-1',
    probationaryMemberId: 'prob-1',
    buddyId: 'member-3',
    deadline: '2024-04-09T09:00:00Z',
    activityLevel: 4,
    contributionQuality: 3,
    communityEngagement: 4,
    positiveNotes: 'Very engaged in community discussions and shows good technical understanding.',
    concernsNotes: 'Sometimes takes on too much work without asking for help.',
    improvementSuggestions: 'Should focus on collaborative problem-solving and delegation.',
    recommendation: 'approve',
    isComplete: false, // Still pending
  },
  {
    id: 'eval-2',
    probationaryMemberId: 'prob-2',
    buddyId: 'member-5',
    deadline: '2024-04-14T14:30:00Z',
    submittedAt: '2024-04-10T16:45:00Z',
    activityLevel: 5,
    contributionQuality: 4,
    communityEngagement: 5,
    positiveNotes: 'Exceptional contributor with innovative ideas. Great communicator and team player.',
    concernsNotes: 'No major concerns identified.',
    improvementSuggestions: 'Could benefit from mentoring other newer members.',
    recommendation: 'approve',
    isComplete: true, // Completed early
  },
];

// Mock active probation pairs
export const MOCK_PROBATION_PAIRS: ProbationPair[] = [
  {
    id: 'pair-1',
    probationaryMember: MOCK_PROBATIONARY_MEMBERS[0],
    buddy: MOCK_VERIFIED_MEMBERS[2], // Kestrel Unit
    evaluation: MOCK_EVALUATIONS[0],
    createdAt: '2024-03-10T09:00:00Z',
  },
  {
    id: 'pair-2',
    probationaryMember: MOCK_PROBATIONARY_MEMBERS[1],
    buddy: MOCK_VERIFIED_MEMBERS[4], // Reef Keeper
    evaluation: MOCK_EVALUATIONS[1],
    createdAt: '2024-03-15T14:30:00Z',
  },
];

// Mock probation-related notifications
export const MOCK_PROBATION_NOTIFICATIONS: ProbationBuddyNotification[] = [
  {
    id: 'notif-prob-1',
    type: 'probation_assignment',
    probationPairId: 'pair-1',
    recipientId: 'member-3',
    message: 'You have been assigned as probation buddy for Tidal Explorer. Evaluation due in 30 days.',
    createdAt: '2024-03-10T09:30:00Z',
    read: true,
    href: '/dashboard/probation/pair-1',
  },
  {
    id: 'notif-prob-2',
    type: 'probation_evaluation_due',
    probationPairId: 'pair-1',
    recipientId: 'member-3',
    message: 'Probation evaluation for Tidal Explorer is due in 7 days. Please submit your assessment.',
    createdAt: '2024-04-02T10:00:00Z',
    read: false,
    href: '/dashboard/probation/pair-1/evaluate',
  },
  {
    id: 'notif-prob-3',
    type: 'probation_assignment',
    probationPairId: 'pair-2',
    recipientId: 'member-5',
    message: 'You have been assigned as probation buddy for Current Rider. Evaluation due in 30 days.',
    createdAt: '2024-03-15T15:00:00Z',
    read: true,
    href: '/dashboard/probation/pair-2',
  },
];

// Mock statistics
export const MOCK_PROBATION_STATS: ProbationStats = {
  totalActivePairs: 2,
  overdueEvaluations: 0,
  completedThisMonth: 3,
  averageEvaluationTime: 28, // days
};