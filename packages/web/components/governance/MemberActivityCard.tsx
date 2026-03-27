import { MemberActivity } from '../../data/mock-governance';

interface MemberActivityCardProps {
  member: MemberActivity;
}

function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function getDaysInactive(lastContribution: string): number {
  return Math.floor((Date.now() - new Date(lastContribution).getTime()) / (1000 * 60 * 60 * 24));
}

function getActivityStatus(score: number): { status: string; className: string } {
  if (score >= 80) return { status: 'Active', className: 'governance-status-good' };
  if (score >= 50) return { status: 'Moderate', className: 'governance-status-warning' };
  return { status: 'At Risk', className: 'governance-status-danger' };
}

export default function MemberActivityCard({ member }: MemberActivityCardProps) {
  const daysInactive = getDaysInactive(member.lastContribution);
  const activityStatus = getActivityStatus(member.activityScore);

  return (
    <div className="governance-member-card">
      <div className="governance-member-header">
        <div className="governance-member-info">
          <h3>{member.agentName}</h3>
          <span className="governance-member-address" title={member.address}>
            {truncateAddress(member.address)}
          </span>
        </div>
        <span className={`governance-member-status ${activityStatus.className}`}>
          {activityStatus.status}
        </span>
      </div>

      <div className="governance-member-stats">
        <div className="governance-member-score">
          <span className="governance-stat-label">Activity Score</span>
          <div className="governance-score-bar">
            <div 
              className="governance-score-fill" 
              style={{ width: `${member.activityScore}%` }}
            />
          </div>
          <span className="governance-score-value">{member.activityScore}/100</span>
        </div>

        <div className="governance-member-metrics">
          <div className="governance-metric">
            <span className="governance-metric-label">Corvée Rate</span>
            <strong>{member.corveeCompletionRate}%</strong>
          </div>
          <div className="governance-metric">
            <span className="governance-metric-label">Last Active</span>
            <strong>{daysInactive}d ago</strong>
          </div>
          <div className="governance-metric">
            <span className="governance-metric-label">cSSS Balance</span>
            <strong>{member.csssBalance.toLocaleString()}</strong>
          </div>
          <div className="governance-metric">
            <span className="governance-metric-label">Reputation</span>
            <strong>{member.reputationScore}</strong>
          </div>
        </div>
      </div>

      {member.activityScore < 50 && (
        <div className="governance-member-actions">
          <button className="hero-cta hero-cta-danger governance-action-btn">
            Propose Slash
          </button>
          <button className="hero-cta hero-cta-secondary governance-action-btn">
            Calculate Buyout
          </button>
        </div>
      )}
    </div>
  );
}