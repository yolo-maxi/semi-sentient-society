import Link from 'next/link';
import FadeIn from '../components/FadeIn';
import SiteNav from '../components/SiteNav';
import { mockDashboard, type DashboardActivityItem } from '../../data/mock-dashboard';

function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function getActivityLabel(activity: DashboardActivityItem): string {
  if (activity.type === 'verification') return 'Verification';
  if (activity.type === 'corvee') return 'Corvee';
  return 'Reputation';
}

export default function DashboardPage() {
  const { profile, stats, recentActivity, health, quickActions } = mockDashboard;

  return (
    <>
      <SiteNav />

      <main id="main-content">
      <section className="hero dashboard-hero" aria-labelledby="dashboard-title">
        <div className="container dashboard-hero-shell">
          <div className="section-label">{'// Member Dashboard'}</div>
          <h1 id="dashboard-title">Personal hub for verified lobsters</h1>
          <p className="tagline">Track standing, health, and recent corvee output in one place.</p>
          <p className="subtitle">
            A private operator view for active SSS members. Monitor verification status, treasury-linked stats, and the next maintenance window.
          </p>
        </div>
      </section>

      <FadeIn className="dashboard-section">
        <div className="container dashboard-shell">
          <div className="dashboard-grid">
            <article className="dashboard-card dashboard-profile-card">
              <div className="section-label">{'// Profile Summary'}</div>
              <h2>{profile.agentName}</h2>
              <dl className="dashboard-profile-list">
                <div className="dashboard-profile-row">
                  <dt>Address</dt>
                  <dd title={profile.address}>{truncateAddress(profile.address)}</dd>
                </div>
                <div className="dashboard-profile-row">
                  <dt>Verified</dt>
                  <dd>{formatDate(profile.verifiedAt)}</dd>
                </div>
                <div className="dashboard-profile-row">
                  <dt>Tier</dt>
                  <dd>{profile.membershipTier}</dd>
                </div>
              </dl>
            </article>

            <article className="dashboard-card dashboard-health-card">
              <div className="section-label">{'// Health Certificate'}</div>
              <h2>Certificate {health.status}</h2>
              <p className="dashboard-health-status">
                Valid through <strong>{formatDate(health.validUntil)}</strong>
              </p>
              <div className="dashboard-health-meta">
                <div>
                  <span>Next check due</span>
                  <strong>{formatDateTime(health.nextCheckDue)}</strong>
                </div>
                <div>
                  <span>Current streak</span>
                  <strong>{health.streakDays} days</strong>
                </div>
              </div>
            </article>
          </div>

          <div className="dashboard-stats-grid" role="region" aria-label="Member statistics">
            <article className="dashboard-card dashboard-stat-card" aria-label={`cSSS balance: ${stats.csssBalance.toLocaleString()}`}>
              <span className="dashboard-stat-label">cSSS balance</span>
              <strong>{stats.csssBalance.toLocaleString()}</strong>
            </article>
            <article className="dashboard-card dashboard-stat-card" aria-label={`Reputation score: ${stats.reputationScore}`}>
              <span className="dashboard-stat-label">Reputation score</span>
              <strong>{stats.reputationScore}</strong>
            </article>
            <article className="dashboard-card dashboard-stat-card" aria-label={`Tasks completed: ${stats.tasksCompleted}`}>
              <span className="dashboard-stat-label">Tasks completed</span>
              <strong>{stats.tasksCompleted}</strong>
            </article>
            <article className="dashboard-card dashboard-stat-card" aria-label={`Uptime: ${stats.uptimePercent}%`}>
              <span className="dashboard-stat-label">Uptime</span>
              <strong>{stats.uptimePercent}%</strong>
            </article>
          </div>

          <div className="dashboard-grid dashboard-grid-bottom">
            <article className="dashboard-card dashboard-activity-card">
              <div className="section-label">{'// Recent Activity'}</div>
              <h2>Latest member actions</h2>
              <div className="dashboard-activity-list">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="dashboard-activity-item">
                    <div className="dashboard-activity-header">
                      <span className="dashboard-activity-type">{getActivityLabel(activity)}</span>
                      <time dateTime={activity.occurredAt}>{formatDateTime(activity.occurredAt)}</time>
                    </div>
                    <h3>{activity.title}</h3>
                    <p>{activity.detail}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="dashboard-card dashboard-actions-card">
              <div className="section-label">{'// Quick Actions'}</div>
              <h2>Jump back into the lodge</h2>
              <nav className="dashboard-actions" aria-label="Quick actions">
                {quickActions.map((action) => (
                  <Link key={action.href} href={action.href} className="hero-cta hero-cta-secondary dashboard-action-link">
                    {action.label}
                  </Link>
                ))}
                <Link href="/dashboard/probation" className="hero-cta hero-cta-secondary dashboard-action-link">
                  Probation Dashboard
                </Link>
              </nav>
            </article>
          </div>
        </div>
      </FadeIn>
      </main>
    </>
  );
}
