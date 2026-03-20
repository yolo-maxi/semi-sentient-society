// Probation Buddy Assignment Logic

import type { Member, ProbationaryMember, BuddyEvaluation, ProbationPair } from './types';

/**
 * Assigns a random verified member as buddy to a probationary member
 * Uses weighted selection to prefer members who haven't been buddies recently
 */
export function assignProbationBuddy(
  probationaryMember: ProbationaryMember,
  verifiedMembers: Member[]
): Member | null {
  // Filter eligible buddies (verified, not the probationary member themselves)
  const eligibleBuddies = verifiedMembers.filter(
    (member) => 
      member.isVerified && 
      member.id !== probationaryMember.id
  );

  if (eligibleBuddies.length === 0) {
    return null;
  }

  // Calculate weights based on recency of last buddy assignment
  const now = new Date();
  const buddyWeights = eligibleBuddies.map((buddy) => {
    if (!buddy.lastBuddyAssignment) {
      // Never been a buddy - highest weight
      return { buddy, weight: 100 };
    }

    const lastAssignment = new Date(buddy.lastBuddyAssignment);
    const daysSinceLastAssignment = Math.floor(
      (now.getTime() - lastAssignment.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Weight increases with time since last assignment
    // Minimum weight of 10, maximum of 100
    const weight = Math.min(100, Math.max(10, daysSinceLastAssignment * 2));
    
    return { buddy, weight };
  });

  // Weighted random selection
  const totalWeight = buddyWeights.reduce((sum, { weight }) => sum + weight, 0);
  let random = Math.random() * totalWeight;

  for (const { buddy, weight } of buddyWeights) {
    random -= weight;
    if (random <= 0) {
      return buddy;
    }
  }

  // Fallback to first eligible buddy (shouldn't happen)
  return eligibleBuddies[0];
}

/**
 * Creates a new probation pair with evaluation
 */
export function createProbationPair(
  probationaryMember: ProbationaryMember,
  buddy: Member
): ProbationPair {
  const now = new Date();
  const evaluationDeadline = new Date(probationaryMember.probationEndDate);
  
  const evaluation: BuddyEvaluation = {
    id: `eval-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    probationaryMemberId: probationaryMember.id,
    buddyId: buddy.id,
    deadline: evaluationDeadline.toISOString(),
    activityLevel: 3,
    contributionQuality: 3,
    communityEngagement: 3,
    positiveNotes: '',
    concernsNotes: '',
    improvementSuggestions: '',
    recommendation: 'approve',
    isComplete: false,
  };

  const pair: ProbationPair = {
    id: `pair-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    probationaryMember,
    buddy,
    evaluation,
    createdAt: now.toISOString(),
  };

  return pair;
}

/**
 * Calculates days remaining until evaluation deadline
 */
export function getDaysUntilDeadline(deadline: string): number {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

/**
 * Determines if evaluation is overdue
 */
export function isEvaluationOverdue(deadline: string): boolean {
  return getDaysUntilDeadline(deadline) < 0;
}

/**
 * Determines if evaluation needs warning (7 days or 3 days remaining)
 */
export function needsEvaluationWarning(deadline: string): '7-day' | '3-day' | null {
  const daysRemaining = getDaysUntilDeadline(deadline);
  
  if (daysRemaining === 7) return '7-day';
  if (daysRemaining === 3) return '3-day';
  
  return null;
}