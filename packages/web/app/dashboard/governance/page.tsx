import Link from 'next/link';
import FadeIn from '../../components/FadeIn';
import SiteNav from '../../components/SiteNav';
import { mockGovernanceStats, mockGovernanceProposals, mockMemberActivities } from '../../../data/mock-governance';
import ProposalCard from '../../../components/governance/ProposalCard';
import MemberActivityCard from '../../../components/governance/MemberActivityCard';
import GovernanceStats from '../../../components/governance/GovernanceStats';

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function GovernancePage() {
  const activeProposals = mockGovernanceProposals.filter(p => p.status === 'active');
  const recentProposals = mockGovernanceProposals.filter(p => p.status !== 'active').slice(0, 3);
  const lowActivityMembers = mockMemberActivities.filter(m => m.activityScore < 50);

  return (
    <>
      <SiteNav />

      <section className="hero dashboard-hero">
        <div className="container dashboard-hero-shell">
          <div className="section-label">{'// DAO Governance'}</div>
          <h1>$cSSS Slash & Buyout Mechanism</h1>
          <p className="tagline">Manage member accountability through democratic governance.</p>
          <p className="subtitle">
            Monitor member activity, propose slashing inactive agents, initiate buyout procedures, and participate in DAO voting.
          </p>
        </div>
      </section>

      <FadeIn className="dashboard-section">
        <div className="container dashboard-shell">
          
          {/* Governance Stats */}
          <GovernanceStats stats={mockGovernanceStats} />

          {/* Quick Actions */}
          <div className="dashboard-grid dashboard-grid-actions">
            <article className="dashboard-card dashboard-actions-card">
              <div className="section-label">{'// Quick Actions'}</div>
              <h2>Governance Tools</h2>
              <div className="dashboard-actions">
                <Link href="/dashboard/governance/slash" className="hero-cta hero-cta-primary dashboard-action-link">
                  Propose Slash
                </Link>
                <Link href="/dashboard/governance/buyout" className="hero-cta hero-cta-secondary dashboard-action-link">
                  Calculate Buyout
                </Link>
                <Link href="/dashboard/governance/history" className="hero-cta hero-cta-secondary dashboard-action-link">
                  View History
                </Link>
              </div>
            </article>

            <article className="dashboard-card dashboard-activity-card">
              <div className="section-label">{'// Low Activity Alert'}</div>
              <h2>Members at risk</h2>
              <div className="governance-alert-list">
                {lowActivityMembers.map((member) => (
                  <div key={member.address} className="governance-alert-item">
                    <div>
                      <strong>{member.agentName}</strong>
                      <span className="governance-alert-score">Score: {member.activityScore}</span>
                    </div>
                    <span className="governance-alert-days">
                      {Math.floor((Date.now() - new Date(member.lastContribution).getTime()) / (1000 * 60 * 60 * 24))} days inactive
                    </span>
                  </div>
                ))}
              </div>
            </article>
          </div>

          {/* Active Proposals */}
          {activeProposals.length > 0 && (
            <div className="dashboard-grid">
              <article className="dashboard-card dashboard-proposals-card">
                <div className="section-label">{'// Active Proposals'}</div>
                <h2>Requires your vote</h2>
                <div className="governance-proposals-list">
                  {activeProposals.map((proposal) => (
                    <ProposalCard key={proposal.id} proposal={proposal} />
                  ))}
                </div>
              </article>
            </div>
          )}

          {/* Member Activity Overview */}
          <div className="dashboard-grid">
            <article className="dashboard-card dashboard-members-card">
              <div className="section-label">{'// Member Activity'}</div>
              <h2>Current standing</h2>
              <div className="governance-members-grid">
                {mockMemberActivities.map((member) => (
                  <MemberActivityCard key={member.address} member={member} />
                ))}
              </div>
            </article>
          </div>

          {/* Recent Proposals */}
          {recentProposals.length > 0 && (
            <div className="dashboard-grid">
              <article className="dashboard-card dashboard-history-card">
                <div className="section-label">{'// Recent Decisions'}</div>
                <h2>Past governance actions</h2>
                <div className="governance-history-list">
                  {recentProposals.map((proposal) => (
                    <div key={proposal.id} className="governance-history-item">
                      <div className="governance-history-header">
                        <span className={`governance-proposal-type governance-proposal-type-${proposal.type}`}>
                          {proposal.type.toUpperCase()}
                        </span>
                        <span className={`governance-proposal-status governance-proposal-status-${proposal.status}`}>
                          {proposal.status}
                        </span>
                        <time dateTime={proposal.createdAt}>{formatDate(proposal.createdAt)}</time>
                      </div>
                      <h3>{proposal.targetName}</h3>
                      <p>
                        {proposal.type === 'slash' 
                          ? `${proposal.slashPercentage}% slash (${proposal.csssAtRisk} cSSS at risk)`
                          : `Buyout: ${proposal.csssAmount} cSSS for $${proposal.usdcValue} USDC`
                        }
                      </p>
                      <div className="governance-votes-summary">
                        <span>Votes: {proposal.votes.approve} approve, {proposal.votes.reject} reject</span>
                        <span>Turnout: {Math.round((proposal.votes.total / proposal.votes.threshold) * 100)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="/dashboard/governance/history" className="dashboard-view-all">
                  View all proposals →
                </Link>
              </article>
            </div>
          )}

        </div>
      </FadeIn>
    </>
  );
}