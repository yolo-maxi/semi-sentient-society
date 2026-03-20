"use client";

import { useMemo } from "react";
import { getDaysUntilDeadline, isEvaluationOverdue, needsEvaluationWarning } from "@/lib/probation/assignment";

interface DeadlineTrackerProps {
  deadline: string;
  isComplete?: boolean;
  compact?: boolean;
}

export default function DeadlineTracker({ 
  deadline, 
  isComplete = false, 
  compact = false 
}: DeadlineTrackerProps) {
  const status = useMemo(() => {
    if (isComplete) {
      return { type: 'complete' as const, message: 'Evaluation completed' };
    }

    const daysUntil = getDaysUntilDeadline(deadline);
    
    if (isEvaluationOverdue(deadline)) {
      return { 
        type: 'overdue' as const, 
        message: `Overdue by ${Math.abs(daysUntil)} day${Math.abs(daysUntil) !== 1 ? 's' : ''}`
      };
    }

    const warning = needsEvaluationWarning(deadline);
    if (warning) {
      return { 
        type: 'warning' as const, 
        message: `${daysUntil} day${daysUntil !== 1 ? 's' : ''} remaining`
      };
    }

    return { 
      type: 'normal' as const, 
      message: `${daysUntil} day${daysUntil !== 1 ? 's' : ''} remaining`
    };
  }, [deadline, isComplete]);

  const getStatusColors = () => {
    switch (status.type) {
      case 'complete':
        return {
          background: 'bg-green-500/20',
          text: 'text-green-400',
          border: 'border-green-500/30',
          icon: 'text-green-400',
        };
      case 'overdue':
        return {
          background: 'bg-red-500/20',
          text: 'text-red-400',
          border: 'border-red-500/30',
          icon: 'text-red-400',
        };
      case 'warning':
        return {
          background: 'bg-yellow-500/20',
          text: 'text-yellow-400',
          border: 'border-yellow-500/30',
          icon: 'text-yellow-400',
        };
      default:
        return {
          background: 'bg-blue-500/20',
          text: 'text-blue-400',
          border: 'border-blue-500/30',
          icon: 'text-blue-400',
        };
    }
  };

  const colors = getStatusColors();
  const deadlineDate = new Date(deadline);

  const getIcon = () => {
    switch (status.type) {
      case 'complete':
        return (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'overdue':
        return (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      default:
        return (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${colors.background} ${colors.text} ${colors.border} border`}>
        <span className={colors.icon}>
          {getIcon()}
        </span>
        <span className="font-medium">{status.message}</span>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-lg border ${colors.background} ${colors.border}`}>
      <div className="flex items-start gap-3">
        <span className={colors.icon}>
          {getIcon()}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className={`font-medium ${colors.text}`}>
              {status.type === 'complete' ? 'Complete' : 
               status.type === 'overdue' ? 'Overdue' : 
               status.type === 'warning' ? 'Due Soon' : 'On Track'}
            </h3>
          </div>
          <p className={`text-sm mt-1 ${colors.text}`}>
            {status.message}
          </p>
          <p className="text-xs text-[var(--muted)] mt-2">
            Deadline: {deadlineDate.toLocaleDateString()} at {deadlineDate.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
        </div>
      </div>
    </div>
  );
}