import { GovernanceProposal } from '../../data/mock-governance';

interface ProposalCardProps {
  proposal: GovernanceProposal;
}

function formatTimeRemaining(endDate: string): string {
  const now = new Date();
  const end = new Date(endDate);
  const diff = end.getTime() - now.getTime();
  
  if (diff <= 0) return 'Voting ended';
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (days > 0) return `${days}d ${hours}h remaining`;
  return `${hours}h remaining`;
}

function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function ProposalCard({ proposal }: ProposalCardProps) {
  const progressPercentage = (proposal.votes.total / proposal.votes.threshold) * 100;
  const approvalRate = proposal.votes.total > 0 
    ? (proposal.votes.approve / proposal.votes.total) * 100 
    : 0;

  return (
    <div className="governance-proposal-card">
      <div className="governance-proposal-header">
        <div className="governance-proposal-meta">
          <span className={`governance-proposal-type governance-proposal-type-${proposal.type}`}>
            {proposal.type.toUpperCase()}
          </span>
          <span className="governance-proposal-target">
            {proposal.targetName} ({truncateAddress(proposal.targetAddress)})
          </span>
        </div>
        <div className="governance-proposal-timing">
          {proposal.type === 'slash' 
            ? formatTimeRemaining(proposal.votingEndsAt)
            : formatTimeRemaining(proposal.expiresAt)
          }
        </div>
      </div>

      <div className="governance-proposal-content">
        {proposal.type === 'slash' ? (
          <div className="governance-slash-details">
            <h3>Slash {proposal.slashPercentage}% of cSSS</h3>
            <p className="governance-proposal-reason">{proposal.reason}</p>
            <div className="governance-slash-amounts">
              <span>Amount at risk: <strong>{proposal.csssAtRisk} cSSS</strong></span>
            </div>
          </div>
        ) : (
          <div className="governance-buyout-details">
            <h3>Buyout Offer</h3>
            <div className="governance-buyout-amounts">
              <div className="governance-buyout-row">
                <span>cSSS Amount:</span>
                <strong>{proposal.csssAmount.toLocaleString()}</strong>
              </div>
              <div className="governance-buyout-row">
                <span>USDC Value:</span>
                <strong>${proposal.usdcValue.toLocaleString()}</strong>
              </div>
              <div className="governance-buyout-row">
                <span>$SSS Rate:</span>
                <strong>${proposal.sssPrice} per USDC</strong>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="governance-proposal-voting">
        <div className="governance-voting-progress">
          <div className="governance-voting-bar">
            <div 
              className="governance-voting-fill" 
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
          <div className="governance-voting-stats">
            <span>{proposal.votes.total}/{proposal.votes.threshold} votes</span>
            <span>{Math.round(approvalRate)}% approve</span>
          </div>
        </div>

        <div className="governance-voting-actions">
          <button className="hero-cta hero-cta-primary governance-vote-btn">
            Vote Approve
          </button>
          <button className="hero-cta hero-cta-secondary governance-vote-btn">
            Vote Reject
          </button>
        </div>
      </div>
    </div>
  );
}