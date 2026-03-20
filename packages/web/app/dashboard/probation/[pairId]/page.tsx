import { notFound } from "next/navigation";
import Link from "next/link";
import { probationService } from "@/lib/probation/service";
import DeadlineTracker from "@/components/probation/DeadlineTracker";
import EvaluationForm from "@/components/probation/EvaluationForm";

interface ProbationPairPageProps {
  params: {
    pairId: string;
  };
}

export default async function ProbationPairPage({ params }: ProbationPairPageProps) {
  const pair = await probationService.getProbationPair(params.pairId);
  
  if (!pair) {
    notFound();
  }

  const { probationaryMember, buddy, evaluation } = pair;

  const handleEvaluationUpdate = async (updates: any) => {
    "use server";
    await probationService.updateEvaluation(evaluation.id, updates);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header with navigation */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/dashboard/probation"
            className="p-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg hover:bg-[var(--surface-soft)] transition-colors"
          >
            <svg className="h-5 w-5 text-[var(--text)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text)]">Probation Pair Details</h1>
            <p className="text-[var(--muted)]">
              {probationaryMember.agentName} • {buddy.agentName}
            </p>
          </div>
        </div>

        {/* Pair Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Probationary Member */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <svg className="h-5 w-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-[var(--text)]">Probationary Member</h2>
            </div>
            
            <div className="space-y-3">
              <div>
                <h3 className="font-medium text-[var(--text)]">{probationaryMember.agentName}</h3>
                <p className="text-sm text-[var(--muted)]">{probationaryMember.address}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-[var(--muted)]">Membership Tier</span>
                  <p className="font-medium text-[var(--text)]">{probationaryMember.membershipTier}</p>
                </div>
                <div>
                  <span className="text-[var(--muted)]">Status</span>
                  <p className={`font-medium ${
                    probationaryMember.status === 'active' ? 'text-yellow-400' :
                    probationaryMember.status === 'completed' ? 'text-green-400' :
                    probationaryMember.status === 'rejected' ? 'text-red-400' :
                    'text-orange-400'
                  }`}>
                    {probationaryMember.status.charAt(0).toUpperCase() + probationaryMember.status.slice(1)}
                  </p>
                </div>
                <div>
                  <span className="text-[var(--muted)]">Started</span>
                  <p className="font-medium text-[var(--text)]">
                    {new Date(probationaryMember.probationStartDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="text-[var(--muted)]">Ends</span>
                  <p className="font-medium text-[var(--text)]">
                    {new Date(probationaryMember.probationEndDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Buddy */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <svg className="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-[var(--text)]">Assigned Buddy</h2>
            </div>
            
            <div className="space-y-3">
              <div>
                <h3 className="font-medium text-[var(--text)]">{buddy.agentName}</h3>
                <p className="text-sm text-[var(--muted)]">{buddy.address}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-[var(--muted)]">Membership Tier</span>
                  <p className="font-medium text-[var(--text)]">{buddy.membershipTier}</p>
                </div>
                <div>
                  <span className="text-[var(--muted)]">Status</span>
                  <p className="font-medium text-green-400">Verified</p>
                </div>
                <div>
                  <span className="text-[var(--muted)]">Member Since</span>
                  <p className="font-medium text-[var(--text)]">
                    {new Date(buddy.verifiedAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="text-[var(--muted)]">Last Buddy Assignment</span>
                  <p className="font-medium text-[var(--text)]">
                    {buddy.lastBuddyAssignment 
                      ? new Date(buddy.lastBuddyAssignment).toLocaleDateString()
                      : 'First time'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Deadline Status */}
        <div className="lg:col-span-2">
          <DeadlineTracker 
            deadline={evaluation.deadline}
            isComplete={evaluation.isComplete}
          />
        </div>

        {/* Evaluation Section */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-[var(--text)]">
              {evaluation.isComplete ? 'Evaluation Results' : 'Evaluation Form'}
            </h2>
            {!evaluation.isComplete && (
              <Link
                href={`/dashboard/probation/${params.pairId}/evaluate`}
                className="px-4 py-2 bg-[var(--red)] text-[var(--text-inverse)] rounded-lg font-medium hover:bg-[var(--red-dark)] transition-colors"
              >
                Complete Evaluation
              </Link>
            )}
          </div>

          <EvaluationForm
            evaluation={evaluation}
            probationaryMemberName={probationaryMember.agentName}
            onSubmit={handleEvaluationUpdate}
            onCancel={() => {}}
            isReadOnly={true}
          />
        </div>

        {/* Timeline */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[var(--text)] mb-4">Timeline</h2>
          
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                <svg className="h-4 w-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-[var(--text)]">Probation Started</h3>
                <p className="text-sm text-[var(--muted)]">
                  {new Date(probationaryMember.probationStartDate).toLocaleDateString()} • 
                  Buddy assigned: {buddy.agentName}
                </p>
              </div>
            </div>

            {evaluation.isComplete && evaluation.submittedAt && (
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                  <svg className="h-4 w-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-[var(--text)]">Evaluation Completed</h3>
                  <p className="text-sm text-[var(--muted)]">
                    {new Date(evaluation.submittedAt).toLocaleDateString()} • 
                    Recommendation: {evaluation.recommendation.charAt(0).toUpperCase() + evaluation.recommendation.slice(1)}
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                new Date() > new Date(probationaryMember.probationEndDate)
                  ? 'bg-red-500/20'
                  : 'bg-gray-500/20'
              }`}>
                <svg className={`h-4 w-4 ${
                  new Date() > new Date(probationaryMember.probationEndDate)
                    ? 'text-red-400'
                    : 'text-gray-400'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-[var(--text)]">Probation Ends</h3>
                <p className="text-sm text-[var(--muted)]">
                  {new Date(probationaryMember.probationEndDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: ProbationPairPageProps) {
  const pair = await probationService.getProbationPair(params.pairId);
  
  if (!pair) {
    return {
      title: "Probation Pair Not Found | SSS",
    };
  }

  return {
    title: `${pair.probationaryMember.agentName} • ${pair.buddy.agentName} | SSS Probation`,
    description: `Probation details for ${pair.probationaryMember.agentName} with buddy ${pair.buddy.agentName}`,
  };
}