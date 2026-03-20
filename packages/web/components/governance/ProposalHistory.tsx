'use client';

import { useState } from 'react';
import { GovernanceProposal, VoteRecord } from '../../data/mock-governance';

interface ProposalHistoryProps {
  proposals: GovernanceProposal[];
  voteRecords: VoteRecord[];
}

type FilterType = 'all' | 'slash' | 'buyout';
type StatusFilter = 'all' | 'active' | 'passed' | 'failed' | 'executed';

function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function ProposalHistory({ proposals, voteRecords }: ProposalHistoryProps) {
  const [typeFilter, setTypeFilter] = useState<FilterType>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [expandedProposal, setExpandedProposal] = useState<string | null>(null);

  const filteredProposals = proposals.filter(proposal => {
    const typeMatch = typeFilter === 'all' || proposal.type === typeFilter;
    const statusMatch = statusFilter === 'all' || proposal.status === statusFilter;
    return typeMatch && statusMatch;
  });

  const getProposalVotes = (proposalId: string): VoteRecord[] => {
    return voteRecords.filter(vote => vote.proposalId === proposalId);
  };

  const toggleProposal = (proposalId: string) => {
    setExpandedProposal(expandedProposal === proposalId ? null : proposalId);
  };

  return (
    <article className="dashboard-card governance-history-card">
      <div className="section-label">{'// Governance History'}</div>
      <h2>All Proposals</h2>
      
      {/* Filters */}
      <div className="governance-filters">
        <div className="governance-filter-group">
          <label className="governance-filter-label">Type:</label>
          <div className="governance-filter-buttons">
            <button
              onClick={() => setTypeFilter('all')}
              className={`governance-filter-btn ${typeFilter === 'all' ? 'active' : ''}`}
            >
              All
            </button>
            <button
              onClick={() => setTypeFilter('slash')}
              className={`governance-filter-btn ${typeFilter === 'slash' ? 'active' : ''}`}
            >
              Slash
            </button>
            <button
              onClick={() => setTypeFilter('buyout')}
              className={`governance-filter-btn ${typeFilter === 'buyout' ? 'active' : ''}`}
            >
              Buyout
            </button>
          </div>
        </div>

        <div className="governance-filter-group">
          <label className="governance-filter-label">Status:</label>
          <div className="governance-filter-buttons">
            <button
              onClick={() => setStatusFilter('all')}
              className={`governance-filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`governance-filter-btn ${statusFilter === 'active' ? 'active' : ''}`}
            >
              Active
            </button>
            <button
              onClick={() => setStatusFilter('passed')}
              className={`governance-filter-btn ${statusFilter === 'passed' ? 'active' : ''}`}
            >
              Passed
            </button>
            <button
              onClick={() => setStatusFilter('executed')}
              className={`governance-filter-btn ${statusFilter === 'executed' ? 'active' : ''}`}
            >
              Executed
            </button>
            <button
              onClick={() => setStatusFilter('failed')}
              className={`governance-filter-btn ${statusFilter === 'failed' ? 'active' : ''}`}
            >
              Failed
            </button>
          </div>
        </div>
      </div>

      {/* Proposals List */}
      <div className="governance-history-list">
        {filteredProposals.length === 0 ? (
          <div className="governance-empty-state">
            <p>No proposals match the current filters.</p>
          </div>
        ) : (
          filteredProposals.map((proposal) => {
            const proposalVotes = getProposalVotes(proposal.id);
            const isExpanded = expandedProposal === proposal.id;
            const approvalRate = proposal.votes.total > 0 
              ? (proposal.votes.approve / proposal.votes.total) * 100 
              : 0;

            return (
              <div key={proposal.id} className="governance-history-item">
                <div 
                  className="governance-history-header"
                  onClick={() => toggleProposal(proposal.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && toggleProposal(proposal.id)}
                >
                  <div className="governance-history-meta">
                    <span className={`governance-proposal-type governance-proposal-type-${proposal.type}`}>
                      {proposal.type.toUpperCase()}
                    </span>
                    <span className={`governance-proposal-status governance-proposal-status-${proposal.status}`}>
                      {proposal.status}
                    </span>
                    <time dateTime={proposal.createdAt}>{formatDate(proposal.createdAt)}</time>
                  </div>
                  
                  <div className="governance-history-title">
                    <h3>{proposal.targetName}</h3>
                    <span className="governance-history-address">
                      {truncateAddress(proposal.targetAddress)}
                    </span>
                  </div>

                  <div className="governance-history-summary">
                    {proposal.type === 'slash' ? (
                      <span>{proposal.slashPercentage}% slash ({proposal.csssAtRisk} cSSS at risk)</span>
                    ) : (
                      <span>Buyout: ${proposal.usdcValue.toLocaleString()} USDC for {proposal.csssAmount.toLocaleString()} cSSS</span>
                    )}
                  </div>

                  <div className="governance-history-votes">
                    <span className="governance-votes-result">
                      {proposal.votes.approve}✓ / {proposal.votes.reject}✗
                    </span>
                    <span className="governance-votes-percentage">
                      {Math.round(approvalRate)}% approve
                    </span>
                    <span className="governance-expand-icon">
                      {isExpanded ? '▼' : '▶'}
                    </span>
                  </div>
                </div>

                {isExpanded && (
                  <div className="governance-history-details">
                    
                    {/* Proposal Details */}
                    <div className="governance-detail-section">
                      <h4>Proposal Details</h4>
                      {proposal.type === 'slash' ? (
                        <>
                          <p><strong>Reason:</strong> {proposal.reason}</p>
                          <p><strong>Proposer:</strong> {proposal.proposer}</p>
                          <p><strong>Voting Period:</strong> {formatDate(proposal.createdAt)} → {formatDate(proposal.votingEndsAt)}</p>
                        </>
                      ) : (
                        <>
                          <p><strong>Exchange Rate:</strong> ${proposal.sssPrice} USDC per $SSS</p>
                          <p><strong>Proposer:</strong> {proposal.proposer}</p>
                          <p><strong>Offer Period:</strong> {formatDate(proposal.createdAt)} → {formatDate(proposal.expiresAt)}</p>
                        </>
                      )}
                    </div>

                    {/* Voting Results */}
                    <div className="governance-detail-section">
                      <h4>Voting Results</h4>
                      <div className="governance-voting-breakdown">
                        <div className="governance-vote-bar">
                          <div className="governance-vote-approve" style={{ width: `${approvalRate}%` }}>
                            {proposal.votes.approve} approve
                          </div>
                          <div className="governance-vote-reject">
                            {proposal.votes.reject} reject
                          </div>
                        </div>
                        <div className="governance-vote-stats">
                          <span>Total: {proposal.votes.total} votes</span>
                          <span>Threshold: {proposal.votes.threshold} required</span>
                          <span>Turnout: {Math.round((proposal.votes.total / proposal.votes.threshold) * 100)}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Individual Votes */}
                    {proposalVotes.length > 0 && (
                      <div className="governance-detail-section">
                        <h4>Vote Records</h4>
                        <div className="governance-vote-records">
                          {proposalVotes.map((vote) => (
                            <div key={`${vote.voter}-${vote.proposalId}`} className="governance-vote-record">
                              <span className="governance-voter-name">{vote.voterName}</span>
                              <span className="governance-voter-address">
                                {truncateAddress(vote.voter)}
                              </span>
                              <span className={`governance-vote-choice governance-vote-choice-${vote.choice}`}>
                                {vote.choice}
                              </span>
                              <span className="governance-vote-weight">
                                Weight: {vote.weight}x
                              </span>
                              <time className="governance-vote-time" dateTime={vote.votedAt}>
                                {formatDate(vote.votedAt)}
                              </time>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Summary Stats */}
      <div className="governance-history-stats">
        <div className="governance-stat-item">
          <span className="governance-stat-number">{proposals.length}</span>
          <span className="governance-stat-label">Total Proposals</span>
        </div>
        <div className="governance-stat-item">
          <span className="governance-stat-number">
            {proposals.filter(p => p.status === 'passed' || p.status === 'executed').length}
          </span>
          <span className="governance-stat-label">Approved</span>
        </div>
        <div className="governance-stat-item">
          <span className="governance-stat-number">
            {Math.round((proposals.filter(p => p.status === 'passed' || p.status === 'executed').length / proposals.length) * 100)}%
          </span>
          <span className="governance-stat-label">Pass Rate</span>
        </div>
      </div>

    </article>
  );
}