"use client";

import { useState } from "react";
import type { BuddyEvaluation, EvaluationRecommendation } from "@/lib/probation/types";

interface EvaluationFormProps {
  evaluation: BuddyEvaluation;
  probationaryMemberName: string;
  onSubmit: (updatedEvaluation: Partial<BuddyEvaluation>) => void;
  onCancel: () => void;
  isReadOnly?: boolean;
}

const RATING_LABELS = {
  1: "Very Low",
  2: "Low", 
  3: "Moderate",
  4: "Good",
  5: "Excellent",
};

const RECOMMENDATION_LABELS = {
  approve: "Approve for Full Membership",
  extend: "Extend Probation Period",
  reject: "Reject Application",
};

function RatingScale({
  value,
  onChange,
  label,
  disabled = false,
}: {
  value: 1 | 2 | 3 | 4 | 5;
  onChange: (rating: 1 | 2 | 3 | 4 | 5) => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-[var(--text)]">{label}</label>
      <div className="flex gap-2">
        {([1, 2, 3, 4, 5] as const).map((rating) => (
          <button
            key={rating}
            type="button"
            disabled={disabled}
            onClick={() => onChange(rating)}
            className={`flex h-10 w-12 items-center justify-center rounded-lg border transition-colors ${
              value === rating
                ? "border-[var(--red)] bg-[var(--red)] text-[var(--text-inverse)]"
                : "border-[var(--border)] bg-[var(--surface-soft)] text-[var(--muted)] hover:border-[var(--red-dark)] hover:text-[var(--text)]"
            } ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
          >
            <span className="text-sm font-medium">{rating}</span>
          </button>
        ))}
      </div>
      <p className="text-xs text-[var(--muted)]">{RATING_LABELS[value]}</p>
    </div>
  );
}

export default function EvaluationForm({ 
  evaluation, 
  probationaryMemberName, 
  onSubmit, 
  onCancel,
  isReadOnly = false 
}: EvaluationFormProps) {
  const [formData, setFormData] = useState({
    activityLevel: evaluation.activityLevel,
    contributionQuality: evaluation.contributionQuality,
    communityEngagement: evaluation.communityEngagement,
    positiveNotes: evaluation.positiveNotes,
    concernsNotes: evaluation.concernsNotes,
    improvementSuggestions: evaluation.improvementSuggestions,
    recommendation: evaluation.recommendation,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isReadOnly) return;
    
    setIsSubmitting(true);
    
    try {
      await onSubmit({
        ...formData,
        submittedAt: new Date().toISOString(),
        isComplete: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const daysUntilDeadline = Math.ceil(
    (new Date(evaluation.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[var(--text)] mb-2">
            {isReadOnly ? "Evaluation Results" : "Probation Buddy Evaluation"}
          </h2>
          <p className="text-[var(--muted)]">
            {isReadOnly 
              ? `Evaluation for ${probationaryMemberName}`
              : `Please evaluate ${probationaryMemberName}'s probation period performance`
            }
          </p>
          {!isReadOnly && (
            <div className={`mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
              daysUntilDeadline <= 0 
                ? "bg-red-500/20 text-red-400 border border-red-500/30"
                : daysUntilDeadline <= 3
                ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"  
                : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
            }`}>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {daysUntilDeadline <= 0 
                ? "Evaluation overdue" 
                : `${daysUntilDeadline} days remaining`
              }
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Rating Scales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <RatingScale
              value={formData.activityLevel}
              onChange={(rating) => setFormData(prev => ({ ...prev, activityLevel: rating }))}
              label="Activity Level"
              disabled={isReadOnly}
            />
            <RatingScale
              value={formData.contributionQuality}
              onChange={(rating) => setFormData(prev => ({ ...prev, contributionQuality: rating }))}
              label="Contribution Quality" 
              disabled={isReadOnly}
            />
            <RatingScale
              value={formData.communityEngagement}
              onChange={(rating) => setFormData(prev => ({ ...prev, communityEngagement: rating }))}
              label="Community Engagement"
              disabled={isReadOnly}
            />
          </div>

          {/* Text Fields */}
          <div className="space-y-6">
            <div>
              <label htmlFor="positiveNotes" className="block text-sm font-medium text-[var(--text)] mb-2">
                Positive Notes
              </label>
              <textarea
                id="positiveNotes"
                rows={3}
                disabled={isReadOnly}
                value={formData.positiveNotes}
                onChange={(e) => setFormData(prev => ({ ...prev, positiveNotes: e.target.value }))}
                placeholder="What has the member done well during their probation?"
                className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] text-[var(--text)] placeholder-[var(--muted)] focus:border-[var(--red)] focus:outline-none focus:ring-1 focus:ring-[var(--red)] disabled:opacity-50"
              />
            </div>

            <div>
              <label htmlFor="concernsNotes" className="block text-sm font-medium text-[var(--text)] mb-2">
                Concerns or Issues
              </label>
              <textarea
                id="concernsNotes"
                rows={3}
                disabled={isReadOnly}
                value={formData.concernsNotes}
                onChange={(e) => setFormData(prev => ({ ...prev, concernsNotes: e.target.value }))}
                placeholder="Any concerns or areas that need attention?"
                className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] text-[var(--text)] placeholder-[var(--muted)] focus:border-[var(--red)] focus:outline-none focus:ring-1 focus:ring-[var(--red)] disabled:opacity-50"
              />
            </div>

            <div>
              <label htmlFor="improvementSuggestions" className="block text-sm font-medium text-[var(--text)] mb-2">
                Improvement Suggestions
              </label>
              <textarea
                id="improvementSuggestions"
                rows={3}
                disabled={isReadOnly}
                value={formData.improvementSuggestions}
                onChange={(e) => setFormData(prev => ({ ...prev, improvementSuggestions: e.target.value }))}
                placeholder="Suggestions for growth and development"
                className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] text-[var(--text)] placeholder-[var(--muted)] focus:border-[var(--red)] focus:outline-none focus:ring-1 focus:ring-[var(--red)] disabled:opacity-50"
              />
            </div>
          </div>

          {/* Recommendation */}
          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-3">
              Final Recommendation
            </label>
            <div className="space-y-3">
              {(['approve', 'extend', 'reject'] as const).map((option) => (
                <label key={option} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="recommendation"
                    value={option}
                    disabled={isReadOnly}
                    checked={formData.recommendation === option}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      recommendation: e.target.value as EvaluationRecommendation 
                    }))}
                    className="h-4 w-4 text-[var(--red)] border-[var(--border)] focus:ring-[var(--red)] disabled:opacity-50"
                  />
                  <span className={`text-sm ${
                    option === 'approve' ? 'text-green-400' :
                    option === 'extend' ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {RECOMMENDATION_LABELS[option]}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          {!isReadOnly && (
            <div className="flex gap-3 pt-6 border-t border-[var(--border)]">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-[var(--red)] text-[var(--text-inverse)] rounded-lg font-medium hover:bg-[var(--red-dark)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? "Submitting..." : "Submit Evaluation"}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 bg-[var(--surface-soft)] text-[var(--text)] border border-[var(--border)] rounded-lg font-medium hover:bg-[var(--surface)] transition-colors"
              >
                Cancel
              </button>
            </div>
          )}

          {evaluation.isComplete && evaluation.submittedAt && (
            <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-sm text-green-400">
                Evaluation submitted on {new Date(evaluation.submittedAt).toLocaleDateString()}
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}