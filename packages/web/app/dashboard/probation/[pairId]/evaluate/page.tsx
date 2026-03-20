"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import Link from "next/link";
import { probationService } from "@/lib/probation/service";
import EvaluationForm from "@/components/probation/EvaluationForm";
import type { BuddyEvaluation } from "@/lib/probation/types";

interface EvaluationPageProps {
  params: {
    pairId: string;
  };
}

// This would normally be a server component, but we need client functionality for the form
// In a real app, you'd fetch the initial data server-side and pass it to a client component
export default function EvaluationPage({ params }: EvaluationPageProps) {
  const router = useRouter();
  const [pair, setPair] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch pair data on component mount (in real app, this would be server-side)
  useEffect(() => {
    probationService.getProbationPair(params.pairId)
      .then(pairData => {
        if (!pairData) {
          notFound();
          return;
        }
        setPair(pairData);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load probation pair data');
        setLoading(false);
      });
  }, [params.pairId]);

  const handleSubmitEvaluation = async (updates: Partial<BuddyEvaluation>) => {
    if (!pair) return;

    try {
      await probationService.updateEvaluation(pair.evaluation.id, updates);
      
      // Redirect to the pair details page
      router.push(`/dashboard/probation/${params.pairId}`);
    } catch (err) {
      setError('Failed to submit evaluation');
      throw err; // Re-throw so the form can handle it
    }
  };

  const handleCancel = () => {
    router.push(`/dashboard/probation/${params.pairId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-10 w-10 bg-[var(--surface)] rounded-lg"></div>
              <div>
                <div className="h-8 bg-[var(--surface)] rounded w-64 mb-2"></div>
                <div className="h-4 bg-[var(--surface)] rounded w-96"></div>
              </div>
            </div>
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
              <div className="space-y-4">
                <div className="h-6 bg-[var(--surface-soft)] rounded w-48"></div>
                <div className="h-4 bg-[var(--surface-soft)] rounded w-96"></div>
                <div className="grid grid-cols-3 gap-6">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="space-y-3">
                      <div className="h-5 bg-[var(--surface-soft)] rounded w-32"></div>
                      <div className="flex gap-2">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <div key={j} className="h-10 w-12 bg-[var(--surface-soft)] rounded-lg"></div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !pair) {
    return (
      <div className="min-h-screen bg-[var(--background)] py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-6">
            <svg className="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h2 className="text-xl font-bold text-red-400 mb-2">Error</h2>
            <p className="text-red-300 mb-4">
              {error || 'Probation pair not found'}
            </p>
            <Link
              href="/dashboard/probation"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded-lg hover:bg-[var(--surface-soft)] transition-colors"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (pair.evaluation.isComplete) {
    return (
      <div className="min-h-screen bg-[var(--background)] py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-6">
            <svg className="mx-auto h-12 w-12 text-green-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-bold text-green-400 mb-2">Evaluation Complete</h2>
            <p className="text-green-300 mb-4">
              The evaluation for {pair.probationaryMember.agentName} has already been submitted.
            </p>
            <Link
              href={`/dashboard/probation/${params.pairId}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded-lg hover:bg-[var(--surface-soft)] transition-colors"
            >
              View Results
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header with navigation */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href={`/dashboard/probation/${params.pairId}`}
            className="p-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg hover:bg-[var(--surface-soft)] transition-colors"
          >
            <svg className="h-5 w-5 text-[var(--text)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text)]">Complete Evaluation</h1>
            <p className="text-[var(--muted)]">
              Evaluate {pair.probationaryMember.agentName}&apos;s probation period
            </p>
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4">
          <div className="flex gap-3">
            <svg className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-medium text-blue-400 mb-1">Evaluation Guidelines</h3>
              <ul className="text-sm text-blue-300 space-y-1">
                <li>• Evaluate based on the member&apos;s activity, contribution quality, and community engagement</li>
                <li>• Provide constructive feedback to help them grow</li>
                <li>• Consider their progress throughout the entire probation period</li>
                <li>• Your evaluation affects their membership status - be thorough and fair</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Evaluation Form */}
        <EvaluationForm
          evaluation={pair.evaluation}
          probationaryMemberName={pair.probationaryMember.agentName}
          onSubmit={handleSubmitEvaluation}
          onCancel={handleCancel}
          isReadOnly={false}
        />
      </div>
    </div>
  );
}