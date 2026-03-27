"use client";

import { useState } from "react";
import Link from "next/link";
import type { ProbationPair, ProbationStats } from "@/lib/probation/types";
import { isEvaluationOverdue } from "@/lib/probation/assignment";
import DeadlineTracker from "./DeadlineTracker";

interface AdminDashboardProps {
  probationPairs: ProbationPair[];
  stats: ProbationStats;
}

export default function AdminDashboard({ probationPairs, stats }: AdminDashboardProps) {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'overdue' | 'completed'>('all');
  
  const filteredPairs = probationPairs.filter(pair => {
    switch (filterStatus) {
      case 'pending':
        return !pair.evaluation.isComplete && !isEvaluationOverdue(pair.evaluation.deadline);
      case 'overdue':
        return !pair.evaluation.isComplete && isEvaluationOverdue(pair.evaluation.deadline);
      case 'completed':
        return pair.evaluation.isComplete;
      default:
        return true;
    }
  });

  const getStatusCounts = () => ({
    pending: probationPairs.filter(p => !p.evaluation.isComplete && !isEvaluationOverdue(p.evaluation.deadline)).length,
    overdue: probationPairs.filter(p => !p.evaluation.isComplete && isEvaluationOverdue(p.evaluation.deadline)).length,
    completed: probationPairs.filter(p => p.evaluation.isComplete).length,
  });

  const statusCounts = getStatusCounts();

  const getRecommendationBadge = (recommendation: string) => {
    const styles = {
      approve: 'bg-green-500/20 text-green-400 border-green-500/30',
      extend: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', 
      reject: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[recommendation as keyof typeof styles]}`}>
        {recommendation === 'approve' ? 'Approve' : recommendation === 'extend' ? 'Extend' : 'Reject'}
      </span>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">Probation Dashboard</h1>
          <p className="text-[var(--muted)] mt-1">Monitor and manage probation buddy assignments</p>
        </div>
        <Link
          href="/admin/probation/assign-new"
          className="px-4 py-2 bg-[var(--red)] text-[var(--text-inverse)] rounded-lg font-medium hover:bg-[var(--red-dark)] transition-colors"
        >
          Assign New Buddy
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--text)]">{stats.totalActivePairs}</p>
              <p className="text-sm text-[var(--muted)]">Active Pairs</p>
            </div>
          </div>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--text)]">{stats.overdueEvaluations}</p>
              <p className="text-sm text-[var(--muted)]">Overdue</p>
            </div>
          </div>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <svg className="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--text)]">{stats.completedThisMonth}</p>
              <p className="text-sm text-[var(--muted)]">Completed This Month</p>
            </div>
          </div>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <svg className="h-5 w-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--text)]">{stats.averageEvaluationTime}</p>
              <p className="text-sm text-[var(--muted)]">Avg. Days to Complete</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {[
          { key: 'all', label: 'All Pairs', count: probationPairs.length },
          { key: 'pending', label: 'Pending', count: statusCounts.pending },
          { key: 'overdue', label: 'Overdue', count: statusCounts.overdue },
          { key: 'completed', label: 'Completed', count: statusCounts.completed },
        ].map(filter => (
          <button
            key={filter.key}
            onClick={() => setFilterStatus(filter.key as typeof filterStatus)}
            className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
              filterStatus === filter.key
                ? 'bg-[var(--red)] text-[var(--text-inverse)] border-[var(--red)]'
                : 'bg-[var(--surface)] text-[var(--text)] border-[var(--border)] hover:border-[var(--red-dark)]'
            }`}
          >
            {filter.label} ({filter.count})
          </button>
        ))}
      </div>

      {/* Probation Pairs List */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border)]">
          <h2 className="text-lg font-semibold text-[var(--text)]">
            Active Probation Pairs ({filteredPairs.length})
          </h2>
        </div>
        
        {filteredPairs.length === 0 ? (
          <div className="p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-[var(--text)]">No pairs found</h3>
            <p className="mt-1 text-[var(--muted)]">
              {filterStatus === 'all' 
                ? 'No probation pairs have been created yet.'
                : `No ${filterStatus} probation pairs at the moment.`
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {filteredPairs.map((pair) => (
              <div key={pair.id} className="p-6 hover:bg-[var(--surface-soft)] transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-4 mb-3">
                      <div>
                        <h3 className="text-lg font-medium text-[var(--text)]">
                          {pair.probationaryMember.agentName}
                        </h3>
                        <p className="text-sm text-[var(--muted)]">
                          Probationary Member • Started {new Date(pair.probationaryMember.probationStartDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-[var(--muted)]">→</div>
                      <div>
                        <h4 className="text-base font-medium text-[var(--text)]">
                          {pair.buddy.agentName}
                        </h4>
                        <p className="text-sm text-[var(--muted)]">
                          Buddy • {pair.buddy.membershipTier}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-3">
                      <DeadlineTracker 
                        deadline={pair.evaluation.deadline}
                        isComplete={pair.evaluation.isComplete}
                        compact
                      />
                      {pair.evaluation.isComplete && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-[var(--muted)]">Recommendation:</span>
                          {getRecommendationBadge(pair.evaluation.recommendation)}
                        </div>
                      )}
                    </div>

                    {pair.evaluation.isComplete && pair.evaluation.submittedAt && (
                      <p className="text-sm text-green-400 mb-2">
                        Evaluation completed on {new Date(pair.evaluation.submittedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Link
                      href={`/admin/probation/${pair.id}`}
                      className="px-3 py-1.5 bg-[var(--surface-soft)] text-[var(--text)] border border-[var(--border)] rounded-lg text-sm font-medium hover:bg-[var(--surface)] transition-colors"
                    >
                      View Details
                    </Link>
                    {!pair.evaluation.isComplete && (
                      <Link
                        href={`/admin/probation/${pair.id}/evaluate`}
                        className="px-3 py-1.5 bg-[var(--red)] text-[var(--text-inverse)] rounded-lg text-sm font-medium hover:bg-[var(--red-dark)] transition-colors"
                      >
                        Evaluate
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}