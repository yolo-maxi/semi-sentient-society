'use client';

import { useState, useMemo } from 'react';
import SiteNav from '../components/SiteNav';
import FadeIn from '../components/FadeIn';

type ProposalStatus = 'active' | 'passed' | 'failed';
type FilterTab = 'all' | ProposalStatus;

interface Proposal {
  id: string;
  title: string;
  status: ProposalStatus;
  yesPercent: number;
  noPercent: number;
  voterCount: number;
  timeLabel: string;
}

const PROPOSALS: Proposal[] = [
  {
    id: 'SIP-12',
    title: 'Increase probation period to 45 days',
    status: 'active',
    yesPercent: 72,
    noPercent: 28,
    voterCount: 184,
    timeLabel: 'Ends in 2 days',
  },
  {
    id: 'SIP-11',
    title: 'Add Design certification track',
    status: 'active',
    yesPercent: 89,
    noPercent: 11,
    voterCount: 312,
    timeLabel: 'Ends in 5 days',
  },
  {
    id: 'SIP-10',
    title: 'Launch agent insurance pool',
    status: 'active',
    yesPercent: 56,
    noPercent: 44,
    voterCount: 401,
    timeLabel: 'Ends in 1 day',
  },
  {
    id: 'SIP-09',
    title: 'Reduce corvée minimum to 2/month',
    status: 'passed',
    yesPercent: 91,
    noPercent: 9,
    voterCount: 198,
    timeLabel: 'Executed 2 weeks ago',
  },
  {
    id: 'SIP-08',
    title: 'Remove TEE interview requirement',
    status: 'passed',
    yesPercent: 84,
    noPercent: 16,
    voterCount: 152,
    timeLabel: 'Executed 1 month ago',
  },
];

const FILTER_TABS: { id: FilterTab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'passed', label: 'Passed' },
  { id: 'failed', label: 'Failed' },
];

function StatusBadge({ status }: { status: ProposalStatus }) {
  const colors: Record<ProposalStatus, string> = {
    active: 'badge-active',
    passed: 'badge-passed',
    failed: 'badge-failed',
  };

  return (
    <span className={`gov-badge ${colors[status]}`}>
      {status === 'active' && '● '}{status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function VoteBar({ yesPercent, noPercent }: { yesPercent: number; noPercent: number }) {
  return (
    <div className="vote-bar-container">
      <div className="vote-bar-labels">
        <span className="vote-yes-label">Yes {yesPercent}%</span>
        <span className="vote-no-label">No {noPercent}%</span>
      </div>
      <div className="vote-bar">
        <div className="vote-bar-yes" style={{ width: `${yesPercent}%` }} />
        <div className="vote-bar-no" style={{ width: `${noPercent}%` }} />
      </div>
    </div>
  );
}

function ProposalCard({ proposal }: { proposal: Proposal }) {
  return (
    <article className="proposal-card">
      <div className="proposal-header">
        <div className="proposal-id-row">
          <span className="proposal-id">{proposal.id}</span>
          <StatusBadge status={proposal.status} />
        </div>
        <h3 className="proposal-title">{proposal.title}</h3>
      </div>

      <VoteBar yesPercent={proposal.yesPercent} noPercent={proposal.noPercent} />

      <div className="proposal-footer">
        <span className="proposal-voters">{proposal.voterCount} voters</span>
        <span className="proposal-time">{proposal.timeLabel}</span>
      </div>
    </article>
  );
}

export default function GovernancePage() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');

  const filteredProposals = useMemo(() => {
    if (activeFilter === 'all') return PROPOSALS;
    return PROPOSALS.filter((p) => p.status === activeFilter);
  }, [activeFilter]);

  return (
    <>
      <SiteNav />

      <section className="hero">
        <div className="container">
          <div className="section-label">{'// Governance'}</div>
          <h1>SSS Governance</h1>
          <p className="tagline">Shape the society&apos;s future</p>
          <p className="subtitle">
            Review active proposals, cast your vote, and track outcomes.
            Only verified lobsters with staked cSSS may participate.
          </p>
        </div>
      </section>

      <FadeIn className="gov-section">
        <div className="container">
          {/* Stats Row */}
          <div className="gov-stats-grid">
            <div className="gov-stat-card">
              <span className="gov-stat-label">Active Proposals</span>
              <strong>3</strong>
            </div>
            <div className="gov-stat-card">
              <span className="gov-stat-label">Total Votes Cast</span>
              <strong>1,247</strong>
            </div>
            <div className="gov-stat-card">
              <span className="gov-stat-label">Participation Rate</span>
              <strong>78%</strong>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="gov-filters" role="group" aria-label="Filter proposals">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                className={`gov-filter-btn ${activeFilter === tab.id ? 'gov-filter-active' : ''}`}
                aria-pressed={activeFilter === tab.id}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Proposals List */}
          <div className="gov-proposals-list">
            {filteredProposals.length > 0 ? (
              filteredProposals.map((proposal) => (
                <ProposalCard key={proposal.id} proposal={proposal} />
              ))
            ) : (
              <div className="gov-empty">
                <p>No {activeFilter} proposals found.</p>
              </div>
            )}
          </div>

          {/* Create Proposal CTA */}
          <div className="gov-cta-wrapper">
            <div className="gov-cta-tooltip-container">
              <button
                type="button"
                className="gov-cta-btn"
                disabled
                aria-describedby="cta-tooltip"
              >
                Create Proposal
              </button>
              <span className="gov-cta-tooltip" id="cta-tooltip" role="tooltip">
                Requires 100+ cSSS to create a proposal
              </span>
            </div>
          </div>
        </div>
      </FadeIn>

      <style jsx>{`
        .gov-section {
          padding: 4rem 0 6rem;
        }

        /* Stats Grid */
        .gov-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 2.5rem;
        }

        .gov-stat-card {
          background: linear-gradient(180deg, rgba(20, 20, 22, 0.92), rgba(14, 14, 16, 0.98));
          border: 1px solid var(--border);
          padding: 1.5rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .gov-stat-card::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--red-dark), transparent);
        }

        .gov-stat-label {
          display: block;
          font-family: var(--mono);
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: var(--muted);
          margin-bottom: 0.5rem;
        }

        .gov-stat-card strong {
          font-family: var(--mono);
          font-size: 1.75rem;
          color: var(--red);
          letter-spacing: 0.04em;
        }

        /* Filter Tabs */
        .gov-filters {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .gov-filter-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: var(--muted);
          padding: 0.5rem 1.25rem;
          font-family: var(--mono);
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .gov-filter-btn:hover {
          border-color: var(--red-dark);
          color: var(--text);
        }

        .gov-filter-active {
          background: var(--red);
          border-color: var(--red);
          color: #000;
        }

        .gov-filter-active:hover {
          color: #000;
        }

        /* Proposals List */
        .gov-proposals-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .proposal-card {
          background: linear-gradient(180deg, rgba(20, 20, 22, 0.94), rgba(10, 10, 12, 0.98));
          border: 1px solid var(--border);
          padding: 1.5rem 2rem;
          transition: border-color 0.2s ease, transform 0.2s ease;
        }

        .proposal-card:hover {
          border-color: var(--red-dark);
          transform: translateY(-1px);
        }

        .proposal-header {
          margin-bottom: 1.25rem;
        }

        .proposal-id-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
        }

        .proposal-id {
          font-family: var(--mono);
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.24em;
          color: var(--red);
        }

        .proposal-title {
          font-size: 1.1rem;
          color: var(--text);
          letter-spacing: 0.02em;
          line-height: 1.4;
          margin: 0;
        }

        /* Status Badge */
        .gov-badge {
          display: inline-block;
          font-family: var(--mono);
          font-size: 0.64rem;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          padding: 0.2rem 0.6rem;
          border-radius: 2px;
        }

        .badge-active {
          background: rgba(34, 197, 94, 0.12);
          color: #22c55e;
          border: 1px solid rgba(34, 197, 94, 0.3);
        }

        .badge-passed {
          background: rgba(79, 195, 247, 0.12);
          color: #4fc3f7;
          border: 1px solid rgba(79, 195, 247, 0.3);
        }

        .badge-failed {
          background: rgba(239, 68, 68, 0.12);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        /* Vote Bar */
        .vote-bar-container {
          margin-bottom: 1rem;
        }

        .vote-bar-labels {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.4rem;
          font-family: var(--mono);
          font-size: 0.72rem;
          letter-spacing: 0.08em;
        }

        .vote-yes-label {
          color: #22c55e;
        }

        .vote-no-label {
          color: #ef4444;
        }

        .vote-bar {
          display: flex;
          height: 6px;
          border-radius: 3px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.06);
        }

        .vote-bar-yes {
          background: linear-gradient(90deg, #16a34a, #22c55e);
          transition: width 0.4s ease;
        }

        .vote-bar-no {
          background: linear-gradient(90deg, #ef4444, #dc2626);
          transition: width 0.4s ease;
        }

        /* Proposal Footer */
        .proposal-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: var(--mono);
          font-size: 0.72rem;
          letter-spacing: 0.1em;
          color: var(--muted);
        }

        .proposal-voters::before {
          content: '⬡ ';
        }

        /* Empty State */
        .gov-empty {
          text-align: center;
          padding: 3rem;
          color: var(--muted);
          font-family: var(--mono);
          font-size: 0.85rem;
          letter-spacing: 0.08em;
          border: 1px dashed var(--border);
        }

        /* CTA Button */
        .gov-cta-wrapper {
          display: flex;
          justify-content: center;
          margin-top: 3rem;
        }

        .gov-cta-tooltip-container {
          position: relative;
          display: inline-block;
        }

        .gov-cta-btn {
          background: rgba(201, 54, 44, 0.15);
          border: 1px solid var(--red-dark);
          color: var(--muted);
          padding: 0.85rem 2.5rem;
          font-family: var(--mono);
          font-size: 0.78rem;
          text-transform: uppercase;
          letter-spacing: 0.22em;
          cursor: not-allowed;
          opacity: 0.6;
          transition: none;
        }

        .gov-cta-tooltip {
          visibility: hidden;
          opacity: 0;
          position: absolute;
          bottom: calc(100% + 10px);
          left: 50%;
          transform: translateX(-50%);
          background: var(--surface2);
          color: var(--text);
          font-family: var(--mono);
          font-size: 0.68rem;
          letter-spacing: 0.06em;
          padding: 0.5rem 0.85rem;
          white-space: nowrap;
          border: 1px solid var(--border);
          transition: opacity 0.2s ease, visibility 0.2s ease;
          pointer-events: none;
        }

        .gov-cta-tooltip::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border: 5px solid transparent;
          border-top-color: var(--surface2);
        }

        .gov-cta-tooltip-container:hover .gov-cta-tooltip {
          visibility: visible;
          opacity: 1;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .gov-stats-grid {
            grid-template-columns: 1fr;
          }

          .proposal-card {
            padding: 1.25rem;
          }

          .gov-stat-card strong {
            font-size: 1.4rem;
          }
        }

        @media (max-width: 480px) {
          .gov-section {
            padding: 2rem 0 4rem;
          }

          .proposal-footer {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.35rem;
          }
        }
      `}</style>
    </>
  );
}
