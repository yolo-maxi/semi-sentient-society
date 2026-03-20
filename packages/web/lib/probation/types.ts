// Probation Buddy Assignment System Types

export type ProbationStatus = "active" | "completed" | "extended" | "rejected";
export type EvaluationRecommendation = "approve" | "extend" | "reject";

export interface Member {
  id: string;
  address: `0x${string}`;
  agentName: string;
  verifiedAt: string;
  membershipTier: "Founding" | "Navigator" | "Sentinel";
  isVerified: boolean;
  lastBuddyAssignment?: string; // ISO date when last assigned as buddy
}

export interface ProbationaryMember extends Member {
  probationStartDate: string;
  probationEndDate: string;
  status: ProbationStatus;
  buddyId: string;
}

export interface BuddyEvaluation {
  id: string;
  probationaryMemberId: string;
  buddyId: string;
  submittedAt?: string;
  deadline: string;
  
  // Evaluation criteria
  activityLevel: 1 | 2 | 3 | 4 | 5; // 1=Very Low, 5=Very High
  contributionQuality: 1 | 2 | 3 | 4 | 5; // 1=Poor, 5=Excellent
  communityEngagement: 1 | 2 | 3 | 4 | 5; // 1=Poor, 5=Excellent
  
  // Structured feedback
  positiveNotes: string;
  concernsNotes: string;
  improvementSuggestions: string;
  
  recommendation: EvaluationRecommendation;
  isComplete: boolean;
}

export interface ProbationPair {
  id: string;
  probationaryMember: ProbationaryMember;
  buddy: Member;
  evaluation: BuddyEvaluation;
  createdAt: string;
}

export interface ProbationBuddyNotification {
  id: string;
  type: "probation_assignment" | "probation_evaluation_due" | "probation_evaluation_overdue";
  probationPairId: string;
  recipientId: string; // buddy member id
  message: string;
  createdAt: string;
  read: boolean;
  href?: string;
}

export interface ProbationStats {
  totalActivePairs: number;
  overdueEvaluations: number;
  completedThisMonth: number;
  averageEvaluationTime: number; // days
}