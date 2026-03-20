import { GovernanceStats } from '../../data/mock-governance';

interface GovernanceStatsProps {
  stats: GovernanceStats;
}

export default function GovernanceStatsComponent({ stats }: GovernanceStatsProps) {
  return (
    <div className="dashboard-stats-grid">
      <article className="dashboard-card dashboard-stat-card">
        <span className="dashboard-stat-label">Total proposals</span>
        <strong>{stats.totalProposals}</strong>
      </article>
      <article className="dashboard-card dashboard-stat-card">
        <span className="dashboard-stat-label">Active votes</span>
        <strong>{stats.activeProposals}</strong>
      </article>
      <article className="dashboard-card dashboard-stat-card">
        <span className="dashboard-stat-label">cSSS slashed</span>
        <strong>{stats.totalSlashed.toLocaleString()}</strong>
      </article>
      <article className="dashboard-card dashboard-stat-card">
        <span className="dashboard-stat-label">Avg participation</span>
        <strong>{stats.avgParticipation}%</strong>
      </article>
    </div>
  );
}