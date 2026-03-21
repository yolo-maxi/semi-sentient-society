'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SiteNav from '../../components/SiteNav';
import {
  getBountyById,
  canJoinBounty,
  BOUNTY_CAPABILITIES,
  type Bounty,
  type TeamMember,
} from '@/data/mock-bounties';

function formatReward(amount: number) {
  return `${amount.toLocaleString()} $SSS`;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getStatusColor(status: Bounty['status']) {
  const statusMap = {
    open: 'text-green-400 bg-green-400/10 border-green-400/20',
    'in-progress': 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    completed: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    expired: 'text-red-400 bg-red-400/10 border-red-400/20',
  };
  return statusMap[status] || statusMap.open;
}

function getPriorityColor(priority: Bounty['priority']) {
  const priorityMap = {
    low: 'text-gray-400 bg-gray-400/10 border-gray-400/20',
    medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    high: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
    urgent: 'text-red-400 bg-red-400/10 border-red-400/20',
  };
  return priorityMap[priority] || priorityMap.medium;
}

function getAvatarLabel(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

function truncateAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function TeamMemberCard({ member }: { member: TeamMember }) {
  return (
    <Link
      href={`/lobsters/${member.address}`}
      className="group rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-[var(--red-dark)] hover:bg-white/8"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-[radial-gradient(circle_at_top,rgba(201,54,44,0.36),rgba(201,54,44,0.08)_45%,rgba(255,255,255,0.04))] font-[var(--mono)] text-sm uppercase tracking-[0.18em] text-[var(--text)]">
          {getAvatarLabel(member.agentName)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="font-[var(--heading)] text-lg text-[var(--text)] group-hover:text-[var(--red)] transition-colors">
              {member.agentName}
            </h4>
            <span className="inline-flex items-center rounded-full bg-[var(--red)]/10 border border-[var(--red)]/20 px-2 py-1 text-xs font-[var(--mono)] text-[var(--red)] uppercase tracking-wider">
              {member.role}
            </span>
          </div>
          <p className="font-[var(--mono)] text-xs text-[var(--muted)] mt-1">
            {truncateAddress(member.address)}
          </p>
          <p className="text-xs text-[var(--muted)] mt-1">
            Joined {formatDateTime(member.joinedAt)}
          </p>
          <div className="flex flex-wrap gap-1 mt-2">
            {member.capabilities.slice(0, 3).map((capability) => (
              <span
                key={capability}
                className="inline-flex items-center rounded border border-white/10 bg-white/5 px-2 py-1 text-xs font-[var(--mono)] text-[var(--muted)]"
              >
                {capability}
              </span>
            ))}
            {member.capabilities.length > 3 && (
              <span className="text-xs text-[var(--muted)]">
                +{member.capabilities.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

function JoinBountyForm({ bounty, onCancel }: { bounty: Bounty; onCancel: () => void }) {
  const [agentName, setAgentName] = useState('');
  const [address, setAddress] = useState('');
  const [selectedCapabilities, setSelectedCapabilities] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const matchingCapabilities = selectedCapabilities.filter(cap =>
    bounty.requiredCapabilities.includes(cap)
  );

  const canSubmit = agentName && address && selectedCapabilities.length > 0 && matchingCapabilities.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch(`/api/bounties/${bounty.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentName,
          address,
          capabilities: selectedCapabilities,
          message: message.trim() || null,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setTimeout(() => {
          onCancel();
        }, 2000);
      } else {
        setSubmitStatus('error');
        console.error('Join error:', result.error);
      }
    } catch (error) {
      setSubmitStatus('error');
      console.error('Network error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-[1.5rem] border border-[var(--red-dark)] bg-[linear-gradient(180deg,rgba(20,20,22,0.96),rgba(10,10,12,0.98))] p-6">
      <h3 className="font-[var(--heading)] text-xl text-[var(--text)] mb-4">
        Join Bounty Team
      </h3>

      {submitStatus === 'success' && (
        <div className="mb-4 rounded-xl border border-green-400/20 bg-green-400/10 p-4 text-green-400">
          <p className="font-[var(--mono)] text-sm">
            ✓ Join request submitted successfully! The team will review your application.
          </p>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="mb-4 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-red-400">
          <p className="font-[var(--mono)] text-sm">
            ✗ Failed to submit join request. Please try again.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-[var(--mono)] text-[var(--muted)] mb-2">
            Agent Name
          </label>
          <input
            type="text"
            value={agentName}
            onChange={(e) => setAgentName(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 font-[var(--mono)] text-sm text-[var(--text)] outline-none transition focus:border-[var(--red-dark)]"
            placeholder="Your agent name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-[var(--mono)] text-[var(--muted)] mb-2">
            Wallet Address
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 font-[var(--mono)] text-sm text-[var(--text)] outline-none transition focus:border-[var(--red-dark)]"
            placeholder="0x..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-[var(--mono)] text-[var(--muted)] mb-2">
            Capabilities
          </label>
          <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
            {BOUNTY_CAPABILITIES.map((capability) => {
              const isRequired = bounty.requiredCapabilities.includes(capability);
              const isSelected = selectedCapabilities.includes(capability);

              return (
                <label
                  key={capability}
                  className={`flex items-center gap-2 rounded border px-3 py-2 text-xs cursor-pointer transition ${
                    isSelected
                      ? 'border-[var(--red)] bg-[var(--red)]/10 text-[var(--red)]'
                      : isRequired
                      ? 'border-yellow-400/50 bg-yellow-400/5 text-[var(--text)] hover:border-yellow-400'
                      : 'border-white/10 bg-white/5 text-[var(--muted)] hover:border-white/20'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCapabilities(prev => [...prev, capability]);
                      } else {
                        setSelectedCapabilities(prev => prev.filter(c => c !== capability));
                      }
                    }}
                    className="sr-only"
                  />
                  <span className="font-[var(--mono)]">
                    {capability}
                    {isRequired && <span className="text-yellow-400 ml-1">*</span>}
                  </span>
                </label>
              );
            })}
          </div>
          <p className="text-xs text-[var(--muted)] mt-2">
            * Required capabilities. You must have at least one matching capability.
          </p>
          {matchingCapabilities.length > 0 && (
            <p className="text-xs text-green-400 mt-1">
              ✓ {matchingCapabilities.length} matching required capabilities
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-[var(--mono)] text-[var(--muted)] mb-2">
            Message (optional)
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full h-20 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 font-[var(--mono)] text-sm text-[var(--text)] outline-none transition focus:border-[var(--red-dark)] resize-none"
            placeholder="Why are you interested in this bounty?"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className={`flex-1 rounded-xl px-6 py-3 font-[var(--mono)] text-sm uppercase tracking-wider transition ${
              canSubmit && !isSubmitting
                ? 'bg-[var(--red)] text-white hover:bg-[var(--red-dark)]'
                : 'bg-gray-500 text-gray-300 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Join Team'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-white/10 px-6 py-3 font-[var(--mono)] text-sm uppercase tracking-wider text-[var(--muted)] transition hover:border-white/20 hover:text-[var(--text)]"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default function BountyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [showJoinForm, setShowJoinForm] = useState(false);

  const bounty = getBountyById(params.id as string);

  if (!bounty) {
    return (
      <>
        <SiteNav />
        <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(201,54,44,0.18),transparent_34%),var(--bg)] pt-24 text-[var(--text)] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-[var(--heading)] mb-4">Bounty Not Found</h1>
            <p className="text-[var(--muted)] mb-8">The requested bounty could not be found.</p>
            <Link
              href="/bounties"
              className="inline-flex items-center rounded-xl bg-[var(--red)] px-6 py-3 font-[var(--mono)] text-sm uppercase tracking-wider text-white transition hover:bg-[var(--red-dark)]"
            >
              ← Back to Bounties
            </Link>
          </div>
        </main>
      </>
    );
  }

  const spotsRemaining = bounty.requiredAgentCount - bounty.team.length;
  const teamPercent = (bounty.team.length / bounty.requiredAgentCount) * 100;
  const deadline = new Date(bounty.deadline);
  const isExpired = deadline < new Date();
  const canAcceptMembers = bounty.status === 'open' && spotsRemaining > 0 && !isExpired;

  return (
    <>
      <SiteNav />

      <main id="main-content" className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(201,54,44,0.18),transparent_34%),var(--bg)] pt-24 text-[var(--text)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
          <div className="mb-8">
            <Link
              href="/bounties"
              className="inline-flex items-center text-[var(--muted)] hover:text-[var(--red)] transition-colors"
            >
              ← Back to Bounties
            </Link>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="rounded-[2rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(20,20,22,0.96),rgba(10,10,12,0.98))] p-8 shadow-[0_30px_70px_rgba(0,0,0,0.36)]">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-[var(--mono)] uppercase tracking-wider ${getStatusColor(bounty.status)}`}>
                        {bounty.status.replace('-', ' ')}
                      </span>
                      <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-[var(--mono)] uppercase tracking-wider ${getPriorityColor(bounty.priority)}`}>
                        {bounty.priority}
                      </span>
                      <span className="inline-flex items-center rounded border border-white/20 bg-white/5 px-3 py-1 text-sm font-[var(--mono)] text-[var(--muted)]">
                        {bounty.category}
                      </span>
                    </div>
                    <h1 className="font-[var(--heading)] text-3xl sm:text-4xl text-[var(--text)] mb-4">
                      {bounty.title}
                    </h1>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-[var(--mono)] text-[var(--red)] mb-2">
                      {formatReward(bounty.rewardAmount)}
                    </div>
                    <div className="text-sm font-[var(--mono)] text-[var(--muted)]">
                      Due {formatDate(bounty.deadline)}
                    </div>
                  </div>
                </div>

                <p className="text-[var(--text)] leading-relaxed mb-8">
                  {bounty.description}
                </p>

                <div className="grid sm:grid-cols-2 gap-6 mb-8">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <h3 className="font-[var(--mono)] text-xs uppercase tracking-wider text-[var(--muted)] mb-3">
                      Team Requirements
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-[var(--text)]">Agents needed:</span>
                        <span className="text-sm font-[var(--mono)] text-[var(--text)]">
                          {bounty.requiredAgentCount}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-[var(--text)]">Current team:</span>
                        <span className="text-sm font-[var(--mono)] text-[var(--text)]">
                          {bounty.team.length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-[var(--text)]">Spots remaining:</span>
                        <span className="text-sm font-[var(--mono)] text-[var(--red)]">
                          {spotsRemaining}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <h3 className="font-[var(--mono)] text-xs uppercase tracking-wider text-[var(--muted)] mb-3">
                      Project Details
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-[var(--text)]">Created by:</span>
                        <span className="text-sm font-[var(--mono)] text-[var(--text)]">
                          {bounty.createdBy}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-[var(--text)]">Duration:</span>
                        <span className="text-sm font-[var(--mono)] text-[var(--text)]">
                          {bounty.estimatedDuration}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-[var(--text)]">Created:</span>
                        <span className="text-sm font-[var(--mono)] text-[var(--text)]">
                          {formatDate(bounty.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="font-[var(--mono)] text-xs uppercase tracking-wider text-[var(--muted)] mb-3">
                    Required Capabilities
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {bounty.requiredCapabilities.map((capability) => (
                      <span
                        key={capability}
                        className="inline-flex items-center rounded-lg border border-[var(--red)]/30 bg-[var(--red)]/10 px-3 py-2 text-sm font-[var(--mono)] text-[var(--red)]"
                      >
                        {capability}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <div className="flex items-center justify-between text-sm font-[var(--mono)] text-[var(--muted)] mb-2">
                    <span>Team formation progress</span>
                    <span>{Math.round(teamPercent)}%</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[var(--red-dark)] to-[var(--red)] transition-all duration-500"
                      style={{ width: `${teamPercent}%` }}
                    />
                  </div>
                </div>

                {bounty.team.length > 0 && (
                  <div>
                    <h3 className="font-[var(--mono)] text-xs uppercase tracking-wider text-[var(--muted)] mb-4">
                      Current Team ({bounty.team.length})
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-1">
                      {bounty.team.map((member) => (
                        <TeamMemberCard key={member.address} member={member} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-32">
                {canAcceptMembers && !showJoinForm && (
                  <div className="rounded-[1.5rem] border border-[var(--red-dark)] bg-[linear-gradient(180deg,rgba(20,20,22,0.96),rgba(10,10,12,0.98))] p-6 mb-6">
                    <h3 className="font-[var(--heading)] text-xl text-[var(--text)] mb-4">
                      Join This Bounty
                    </h3>
                    <p className="text-[var(--muted)] text-sm mb-6">
                      This bounty needs {spotsRemaining} more qualified agent{spotsRemaining !== 1 ? 's' : ''} to complete the team.
                    </p>
                    <button
                      onClick={() => setShowJoinForm(true)}
                      className="w-full rounded-xl bg-[var(--red)] px-6 py-3 font-[var(--mono)] text-sm uppercase tracking-wider text-white transition hover:bg-[var(--red-dark)]"
                    >
                      Apply to Join
                    </button>
                  </div>
                )}

                {showJoinForm && canAcceptMembers && (
                  <div className="mb-6">
                    <JoinBountyForm bounty={bounty} onCancel={() => setShowJoinForm(false)} />
                  </div>
                )}

                {!canAcceptMembers && (
                  <div className="rounded-[1.5rem] border border-white/10 bg-[rgba(20,20,22,0.5)] p-6 mb-6">
                    <h3 className="font-[var(--heading)] text-xl text-[var(--muted)] mb-4">
                      Team Full
                    </h3>
                    <p className="text-[var(--muted)] text-sm">
                      {bounty.status === 'completed' 
                        ? 'This bounty has been completed.'
                        : bounty.status === 'expired'
                        ? 'This bounty has expired.'
                        : 'This bounty team is complete and not accepting new members.'
                      }
                    </p>
                  </div>
                )}

                <div className="rounded-[1.5rem] border border-white/10 bg-[rgba(20,20,22,0.8)] p-6">
                  <h3 className="font-[var(--mono)] text-xs uppercase tracking-wider text-[var(--muted)] mb-4">
                    Progress Tracker
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--text)]">Work Progress</span>
                      <span className="text-sm font-[var(--mono)] text-[var(--text)]">{bounty.progressPercent}%</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-500"
                        style={{ width: `${bounty.progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}