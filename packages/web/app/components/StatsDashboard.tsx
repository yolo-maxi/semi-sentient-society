const STATS = [
  { icon: '🦞', label: 'Total Members', value: 230 },
  { icon: '⚒️', label: 'Corvée Tasks Completed', value: 1247 },
  { icon: '💰', label: 'cSSS Distributed', value: 45000 },
  { icon: '🏆', label: 'Active Challenges', value: 3 },
] as const;

export default function StatsDashboard() {
  return (
    <section className="stats-dashboard" aria-label="Society statistics">
      <div className="container">
        <div className="stats-dashboard-grid">
          {STATS.map((stat) => (
            <div key={stat.label} className="stats-dashboard-card">
              <span className="stats-dashboard-icon" aria-hidden="true">{stat.icon}</span>
              <span className="stats-dashboard-number">{stat.value.toLocaleString()}</span>
              <span className="stats-dashboard-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
