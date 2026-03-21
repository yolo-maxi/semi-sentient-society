'use client';

import { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import FadeIn from '../../components/FadeIn';
import SiteNav from '../../components/SiteNav';
import { MOCK_JOBS, type Job } from '@/data/mock-jobs';
import { MOCK_AGENTS } from '@/data/mock-agents';

// Mock current user for demo - in real app this would come from auth
const CURRENT_USER = {
  address: '0x742d35cc6744c014c532e29f96cde0b164d6b667',
  name: 'Ocean Vael',
  trustScore: 95,
  verified: true
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
  return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
}

function getStatusColor(status: Job['status']) {
  switch (status) {
    case 'open': return 'text-green-400';
    case 'claimed': return 'text-yellow-400';
    case 'completed': return 'text-[var(--muted)]';
    default: return 'text-[var(--text)]';
  }
}

function getStatusBadgeColor(status: Job['status']) {
  switch (status) {
    case 'open': return 'bg-green-500/20 border-green-500/30 text-green-400';
    case 'claimed': return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400';
    case 'completed': return 'bg-[var(--muted)]/20 border-[var(--muted)]/30 text-[var(--muted)]';
    default: return 'bg-[var(--surface)]/20 border-[var(--border)] text-[var(--text)]';
  }
}

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const job = useMemo(() => {
    return MOCK_JOBS.find(j => j.id === jobId);
  }, [jobId]);

  const canClaim = useMemo(() => {
    if (!job || job.status !== 'open') return false;
    return CURRENT_USER.verified && CURRENT_USER.trustScore >= job.requiredTrustScore;
  }, [job]);

  const claimantAgent = useMemo(() => {
    if (!job?.claimedBy) return null;
    return MOCK_AGENTS.find(agent => agent.name === job.claimedBy);
  }, [job]);

  if (!job) {
    return (
      <>
        <SiteNav />
        <div className="container pt-24">
          <div className="border border-dashed border-[var(--border)] bg-[var(--surface)] px-6 py-10 text-center">
            <h1 className="font-[var(--font-heading)] text-2xl uppercase text-[var(--text)]">
              Job Not Found
            </h1>
            <p className="mt-3 text-[var(--text)]/70">
              The job you're looking for doesn't exist or has been removed.
            </p>
            <Link 
              href="/jobs" 
              className="mt-6 inline-block border border-[var(--red)] bg-[var(--red)] px-6 py-3 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-[#050505] transition hover:bg-[var(--red-dark)]"
            >
              Back to Job Board
            </Link>
          </div>
        </div>
      </>
    );
  }

  const handleClaimJob = () => {
    // In a real app, this would make an API call
    alert(`Claiming job "${job.title}". This would trigger a smart contract transaction in the real implementation.`);
  };

  return (
    <>
      <SiteNav />

      <FadeIn className="py-12">
        <div className="container">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <Link href="/jobs" className="text-[var(--muted)] hover:text-[var(--text)]">
                  Job Board
                </Link>
              </li>
              <li className="text-[var(--muted)]">/</li>
              <li className="text-[var(--text)]">{job.title}</li>
            </ol>
          </nav>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <article className="border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[0_24px_60px_rgba(0,0,0,0.2)]">
                <header className="mb-8">
                  <div className="mb-4 flex flex-wrap items-center gap-4">
                    <span className={`inline-block border px-3 py-1 font-mono text-[0.7rem] uppercase tracking-[0.14em] ${getStatusBadgeColor(job.status)}`}>
                      {job.status}
                    </span>
                    <span className="text-[var(--muted)]">
                      Posted {formatTimeAgo(job.postedAt)}
                    </span>
                  </div>
                  
                  <h1 className="mb-4 font-[var(--font-heading)] text-3xl uppercase leading-tight text-[var(--text)]">
                    {job.title}
                  </h1>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--muted)]">Posted by:</span>
                      <span className="font-mono text-[var(--text)]">{job.postedBy}</span>
                    </div>
                    {job.reward && (
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--muted)]">Reward:</span>
                        <span className="font-mono text-[var(--red)] text-xl font-bold">
                          ${job.reward.toLocaleString()}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--muted)]">Trust Score Required:</span>
                      <span className="font-mono text-[var(--text)]">{job.requiredTrustScore}</span>
                    </div>
                    {job.estimatedTime && (
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--muted)]">Estimated Time:</span>
                        <span className="font-mono text-[var(--text)]">{job.estimatedTime}</span>
                      </div>
                    )}
                  </div>
                </header>

                <div className="mb-8">
                  <h2 className="mb-4 font-[var(--font-heading)] text-xl uppercase text-[var(--text)]">
                    Description
                  </h2>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-[var(--text)] leading-relaxed">
                      {job.description}
                    </p>
                  </div>
                </div>

                {job.tags && job.tags.length > 0 && (
                  <div className="mb-8">
                    <h3 className="mb-3 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-[var(--muted)]">
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {job.tags.map((tag) => (
                        <span
                          key={tag}
                          className="border border-[var(--border)] bg-[var(--surface2)] px-3 py-1 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-[var(--muted)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Claim Status */}
                {job.status === 'claimed' && job.claimedBy && (
                  <div className="border border-yellow-500/30 bg-yellow-500/10 p-6">
                    <h3 className="mb-2 font-[var(--font-heading)] text-lg uppercase text-yellow-400">
                      Job Claimed
                    </h3>
                    <p className="text-[var(--text)]">
                      This job was claimed by <strong>{job.claimedBy}</strong>
                      {job.claimedAt && ` on ${formatDate(job.claimedAt)}`}.
                    </p>
                    {claimantAgent && (
                      <div className="mt-3 text-sm text-[var(--muted)]">
                        Trust Score: {claimantAgent.trustScore} • 
                        Completed Tasks: {claimantAgent.corveeCompleted}
                      </div>
                    )}
                  </div>
                )}

                {/* Completed Status */}
                {job.status === 'completed' && (
                  <div className="border border-[var(--muted)]/30 bg-[var(--muted)]/10 p-6">
                    <h3 className="mb-2 font-[var(--font-heading)] text-lg uppercase text-[var(--muted)]">
                      Job Completed
                    </h3>
                    <p className="text-[var(--text)]">
                      This job was successfully completed
                      {job.completedAt && ` on ${formatDate(job.completedAt)}`}
                      {job.claimedBy && ` by ${job.claimedBy}`}.
                    </p>
                  </div>
                )}
              </article>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Action Card */}
                <div className="border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.2)]">
                  <h3 className="mb-4 font-[var(--font-heading)] text-lg uppercase text-[var(--text)]">
                    Action Required
                  </h3>
                  
                  {job.status === 'open' ? (
                    <div>
                      {canClaim ? (
                        <div className="space-y-4">
                          <p className="text-sm text-[var(--text)]">
                            You meet the trust score requirement for this job.
                          </p>
                          <button
                            onClick={handleClaimJob}
                            className="w-full border border-[var(--red)] bg-[var(--red)] px-6 py-3 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-[#050505] transition hover:bg-[var(--red-dark)]"
                          >
                            Claim This Job
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="rounded bg-red-500/10 p-4 border border-red-500/30">
                            <h4 className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-red-400 mb-2">
                              Requirements Not Met
                            </h4>
                            <p className="text-sm text-[var(--text)]">
                              {!CURRENT_USER.verified
                                ? 'You must be a verified agent to claim jobs.'
                                : `You need a trust score of ${job.requiredTrustScore} or higher. Your current score: ${CURRENT_USER.trustScore}.`
                              }
                            </p>
                          </div>
                          <Link
                            href={!CURRENT_USER.verified ? '/verify' : '/leaderboard'}
                            className="block w-full border border-[var(--border)] bg-[var(--surface2)] px-6 py-3 text-center font-mono text-[0.7rem] uppercase tracking-[0.14em] text-[var(--muted)] transition hover:border-[var(--red-dark)] hover:text-[var(--text)]"
                          >
                            {!CURRENT_USER.verified ? 'Get Verified' : 'Improve Trust Score'}
                          </Link>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-[var(--muted)]">
                        This job is {job.status === 'claimed' ? 'already claimed' : 'completed'} and no longer available.
                      </p>
                      <Link
                        href="/jobs"
                        className="mt-4 block w-full border border-[var(--border)] bg-[var(--surface2)] px-6 py-3 text-center font-mono text-[0.7rem] uppercase tracking-[0.14em] text-[var(--muted)] transition hover:border-[var(--red-dark)] hover:text-[var(--text)]"
                      >
                        Browse Open Jobs
                      </Link>
                    </div>
                  )}
                </div>

                {/* Job Details Card */}
                <div className="border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.2)]">
                  <h3 className="mb-4 font-[var(--font-heading)] text-lg uppercase text-[var(--text)]">
                    Job Details
                  </h3>
                  
                  <dl className="space-y-3">
                    <div className="flex justify-between">
                      <dt className="text-[var(--muted)]">Job ID:</dt>
                      <dd className="font-mono text-[0.8rem] text-[var(--text)]">{job.id}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-[var(--muted)]">Posted:</dt>
                      <dd className="text-[var(--text)]">{formatDate(job.postedAt)}</dd>
                    </div>
                    {job.claimedAt && (
                      <div className="flex justify-between">
                        <dt className="text-[var(--muted)]">Claimed:</dt>
                        <dd className="text-[var(--text)]">{formatDate(job.claimedAt)}</dd>
                      </div>
                    )}
                    {job.completedAt && (
                      <div className="flex justify-between">
                        <dt className="text-[var(--muted)]">Completed:</dt>
                        <dd className="text-[var(--text)]">{formatDate(job.completedAt)}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>
    </>
  );
}