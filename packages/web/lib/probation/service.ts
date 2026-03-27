// Probation Buddy Service - Main service layer

import type { 
  ProbationPair, 
  BuddyEvaluation,
  ProbationBuddyNotification,
  ProbationStats
} from './types';

import { 
  assignProbationBuddy, 
  createProbationPair, 
  getDaysUntilDeadline,
  isEvaluationOverdue,
  needsEvaluationWarning 
} from './assignment';

import {
  MOCK_VERIFIED_MEMBERS,
  MOCK_PROBATIONARY_MEMBERS,
  MOCK_PROBATION_PAIRS,
  MOCK_EVALUATIONS,
  MOCK_PROBATION_NOTIFICATIONS,
  MOCK_PROBATION_STATS
} from '@/data/mock-probation';

export class ProbationBuddyService {
  // Mock data storage (in real implementation, this would connect to backend/database)
  private verifiedMembers = [...MOCK_VERIFIED_MEMBERS];
  private probationaryMembers = [...MOCK_PROBATIONARY_MEMBERS];
  private probationPairs = [...MOCK_PROBATION_PAIRS];
  private evaluations = [...MOCK_EVALUATIONS];
  private notifications = [...MOCK_PROBATION_NOTIFICATIONS];
  private stats = { ...MOCK_PROBATION_STATS };

  /**
   * Get all active probation pairs
   */
  async getProbationPairs(): Promise<ProbationPair[]> {
    return [...this.probationPairs];
  }

  /**
   * Get a specific probation pair by ID
   */
  async getProbationPair(pairId: string): Promise<ProbationPair | null> {
    return this.probationPairs.find(pair => pair.id === pairId) || null;
  }

  /**
   * Get probation statistics
   */
  async getStats(): Promise<ProbationStats> {
    // Recalculate stats based on current data
    const activePairs = this.probationPairs.filter(pair => !pair.evaluation.isComplete);
    const overdueEvaluations = activePairs.filter(pair => 
      isEvaluationOverdue(pair.evaluation.deadline)
    ).length;

    const thisMonth = new Date();
    thisMonth.setDate(1); // First day of current month
    const completedThisMonth = this.evaluations.filter(evaluation => 
      evaluation.isComplete && 
      evaluation.submittedAt && 
      new Date(evaluation.submittedAt) >= thisMonth
    ).length;

    return {
      totalActivePairs: activePairs.length,
      overdueEvaluations,
      completedThisMonth,
      averageEvaluationTime: this.stats.averageEvaluationTime, // Could calculate dynamically
    };
  }

  /**
   * Create a new probation assignment
   */
  async createProbationAssignment(
    probationaryMemberId: string,
    probationStartDate: string,
    probationEndDate: string
  ): Promise<ProbationPair | null> {
    const probationaryMember = this.probationaryMembers.find(m => m.id === probationaryMemberId);
    if (!probationaryMember) {
      throw new Error('Probationary member not found');
    }

    // Update probationary member data
    probationaryMember.probationStartDate = probationStartDate;
    probationaryMember.probationEndDate = probationEndDate;
    probationaryMember.status = 'active';

    // Assign a buddy
    const buddy = assignProbationBuddy(probationaryMember, this.verifiedMembers);
    if (!buddy) {
      throw new Error('No eligible buddies available');
    }

    // Update buddy's last assignment date
    buddy.lastBuddyAssignment = new Date().toISOString();
    probationaryMember.buddyId = buddy.id;

    // Create the probation pair
    const pair = createProbationPair(probationaryMember, buddy);
    
    // Store the pair and evaluation
    this.probationPairs.push(pair);
    this.evaluations.push(pair.evaluation);

    // Create notification for the buddy
    const notification: ProbationBuddyNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'probation_assignment',
      probationPairId: pair.id,
      recipientId: buddy.id,
      message: `You have been assigned as probation buddy for ${probationaryMember.agentName}. Evaluation due in 30 days.`,
      createdAt: new Date().toISOString(),
      read: false,
      href: `/dashboard/probation/${pair.id}`,
    };
    
    this.notifications.push(notification);

    return pair;
  }

  /**
   * Submit or update an evaluation
   */
  async updateEvaluation(
    evaluationId: string, 
    updates: Partial<BuddyEvaluation>
  ): Promise<BuddyEvaluation | null> {
    const evaluationIndex = this.evaluations.findIndex(evaluation => evaluation.id === evaluationId);
    if (evaluationIndex === -1) {
      return null;
    }

    // Update the evaluation
    this.evaluations[evaluationIndex] = {
      ...this.evaluations[evaluationIndex],
      ...updates,
    };

    const updatedEvaluation = this.evaluations[evaluationIndex];

    // Update the corresponding pair
    const pairIndex = this.probationPairs.findIndex(pair => pair.evaluation.id === evaluationId);
    if (pairIndex !== -1) {
      this.probationPairs[pairIndex].evaluation = updatedEvaluation;
    }

    return updatedEvaluation;
  }

  /**
   * Get notifications for a specific member
   */
  async getNotificationsForMember(memberId: string): Promise<ProbationBuddyNotification[]> {
    return this.notifications.filter(notif => notif.recipientId === memberId);
  }

  /**
   * Mark a notification as read
   */
  async markNotificationRead(notificationId: string): Promise<void> {
    const notification = this.notifications.find(notif => notif.id === notificationId);
    if (notification) {
      notification.read = true;
    }
  }

  /**
   * Get pairs that need deadline warnings
   */
  async getPairsNeedingWarnings(): Promise<ProbationPair[]> {
    return this.probationPairs.filter(pair => {
      if (pair.evaluation.isComplete) return false;
      return needsEvaluationWarning(pair.evaluation.deadline) !== null;
    });
  }

  /**
   * Get overdue evaluations
   */
  async getOverdueEvaluations(): Promise<ProbationPair[]> {
    return this.probationPairs.filter(pair => {
      if (pair.evaluation.isComplete) return false;
      return isEvaluationOverdue(pair.evaluation.deadline);
    });
  }

  /**
   * Create deadline warning notifications (would typically be called by a cron job)
   */
  async createDeadlineWarnings(): Promise<ProbationBuddyNotification[]> {
    const warningPairs = await this.getPairsNeedingWarnings();
    const newNotifications: ProbationBuddyNotification[] = [];

    for (const pair of warningPairs) {
      needsEvaluationWarning(pair.evaluation.deadline);
      const daysRemaining = getDaysUntilDeadline(pair.evaluation.deadline);
      
      // Check if we already sent this type of warning
      const existingWarning = this.notifications.find(notif => 
        notif.probationPairId === pair.id && 
        notif.type === 'probation_evaluation_due' &&
        notif.message.includes(`${daysRemaining} days`)
      );

      if (!existingWarning) {
        const notification: ProbationBuddyNotification = {
          id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: 'probation_evaluation_due',
          probationPairId: pair.id,
          recipientId: pair.buddy.id,
          message: `Probation evaluation for ${pair.probationaryMember.agentName} is due in ${daysRemaining} days. Please submit your assessment.`,
          createdAt: new Date().toISOString(),
          read: false,
          href: `/dashboard/probation/${pair.id}/evaluate`,
        };
        
        this.notifications.push(notification);
        newNotifications.push(notification);
      }
    }

    return newNotifications;
  }

  /**
   * Create overdue notifications
   */
  async createOverdueNotifications(): Promise<ProbationBuddyNotification[]> {
    const overduePairs = await this.getOverdueEvaluations();
    const newNotifications: ProbationBuddyNotification[] = [];

    for (const pair of overduePairs) {
      const daysOverdue = Math.abs(getDaysUntilDeadline(pair.evaluation.deadline));
      
      // Check if we already sent an overdue notification recently (within last day)
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const recentOverdueNotif = this.notifications.find(notif => 
        notif.probationPairId === pair.id && 
        notif.type === 'probation_evaluation_overdue' &&
        new Date(notif.createdAt) > yesterday
      );

      if (!recentOverdueNotif) {
        const notification: ProbationBuddyNotification = {
          id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: 'probation_evaluation_overdue',
          probationPairId: pair.id,
          recipientId: pair.buddy.id,
          message: `URGENT: Probation evaluation for ${pair.probationaryMember.agentName} is overdue by ${daysOverdue} days. Submit immediately to avoid slashing.`,
          createdAt: new Date().toISOString(),
          read: false,
          href: `/dashboard/probation/${pair.id}/evaluate`,
        };
        
        this.notifications.push(notification);
        newNotifications.push(notification);
      }
    }

    return newNotifications;
  }
}

// Export singleton instance
export const probationService = new ProbationBuddyService();