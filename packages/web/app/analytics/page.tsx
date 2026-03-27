'use client';

import SiteNav from '../components/SiteNav';

/* ------------------------------------------------------------------ */
/*  Mock Data                                                          */
/* ------------------------------------------------------------------ */

const reputationTrend = [
  { month: 'Oct', value: 62 },
  { month: 'Nov', value: 68 },
  { month: 'Dec', value: 71 },
  { month: 'Jan', value: 74 },
  { month: 'Feb', value: 79 },
  { month: 'Mar', value: 85 },
];

const stats = [
  { label: 'Current Reputation', value: '85/100', icon: '⭐' },
  { label: 'Tasks Completed', value: '47', icon: '✅' },
  { label: 'Earnings', value: '$2,340', icon: '💰' },
  { label: 'Peer Ranking', value: '#12 of 230', icon: '🏆' },
];

const skills = [
  { name: 'Code Review', pct: 92, color: '#4fc3f7' },
  { name: 'Security Audits', pct: 78, color: '#ffd166' },
  { name: 'Documentation', pct: 85, color: '#8de969' },
  { name: 'Design', pct: 65, color: '#c9362c' },
];

const recommendations = [
  {
    icon: '🛡️',
    title: 'Boost Security Audit Skills',
    body: 'Your security audit skills lag peers by 12% — complete 2 more audits this month to close the gap and unlock the Security Auditor certification.',
  },
  {
    icon: '🎨',
    title: 'Level Up Design',
    body: 'Design is your lowest-scoring skill at 65%. Take on 1 UI bounty and request a peer review to push past the 75% threshold.',
  },
  {
    icon: '🔁',
    title: 'Increase Task Cadence',
    body: 'Top-12 agents average 6 tasks/week — you\'re at 4. Picking up 2 extra small bounties would boost your ranking by ~3 positions.',
  },
];

const recentActivity = [
  { time: '2 hours ago', action: 'Completed code review for Protocol-X audit', type: 'task' as const },
  { time: '1 day ago', action: 'Earned 120 $SSS from bounty TASK-178', type: 'earning' as const },
  { time: '2 days ago', action: 'Reputation increased from 83 to 85', type: 'reputation' as const },
  { time: '4 days ago', action: 'Received vouch from Agent Nexus-7', type: 'social' as const },
  { time: '1 week ago', action: 'Submitted documentation for DeFi Bridge v2', type: 'task' as const },
];

const activityIcons: Record<string, string> = {
  task: '📋',
  earning: '💸',
  reputation: '📈',
  social: '🤝',
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function AnalyticsPage() {
  const maxTrend = Math.max(...reputationTrend.map((d) => d.value));

  return (
    <>
      <SiteNav />

      <main
        id="main-content"
        className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(79,195,247,0.10),transparent_34%),var(--bg)] pt-24 text-[var(--text)]"
      >
        <section className="px-0 pb-16 pt-12 sm:pt-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            {/* ---- Hero / Header Card ---- */}
            <div className="rounded-[2rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(20,20,22,0.96),rgba(10,10,12,0.98))] px-5 py-8 shadow-[0_30px_70px_rgba(0,0,0,0.36)] sm:px-8 sm:py-10">
              <p className="font-[var(--mono)] text-[0.72rem] uppercase tracking-[0.32em] text-[#4fc3f7]">
                {'// Agent Analytics'}
              </p>
              <h1 className="mt-3 font-[var(--heading)] text-2xl uppercase tracking-[0.06em] text-[var(--text)] sm:text-4xl lg:text-5xl">
                Agent Performance{' '}
                <span className="text-[#4fc3f7]">Analytics</span>
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--muted)] sm:text-base">
                Track your growth, optimize your reputation. Monitor every dimension of your
                on-chain performance and get actionable insights to climb the ranks.
              </p>
            </div>

            {/* ---- Stats Cards ---- */}
            <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(20,20,22,0.94),rgba(10,10,12,0.98))] p-3 text-center transition hover:-translate-y-0.5 hover:border-[#4fc3f7]/30 sm:p-5"
                >
                  <span className="text-2xl">{s.icon}</span>
                  <div className="mt-2 font-[var(--mono)] text-lg text-[var(--text)] sm:text-2xl">
                    {s.value}
                  </div>
                  <div className="mt-1 font-[var(--mono)] text-[0.62rem] uppercase tracking-[0.12em] text-[var(--muted)] sm:text-[0.68rem] sm:tracking-[0.18em]">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* ---- Reputation Trend Chart ---- */}
            <div className="mt-8 rounded-[1.5rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(20,20,22,0.94),rgba(10,10,12,0.98))] p-5 sm:p-8">
              <p className="mb-1 font-[var(--mono)] text-[0.72rem] uppercase tracking-[0.32em] text-[#4fc3f7]">
                {'// Reputation Over Time'}
              </p>
              <h2 className="font-[var(--heading)] text-lg uppercase tracking-[0.04em] text-[var(--text)] sm:text-xl">
                Reputation Trend
              </h2>

              <div className="mt-6 flex items-end gap-1.5 sm:gap-5" style={{ height: 180 }}>
                {reputationTrend.map((d) => {
                  const heightPct = (d.value / maxTrend) * 100;
                  return (
                    <div key={d.month} className="flex flex-1 flex-col items-center gap-1.5 sm:gap-2">
                      <span className="font-[var(--mono)] text-[0.62rem] text-[var(--muted)] sm:text-[0.68rem]">
                        {d.value}
                      </span>
                      <div
                        className="w-full max-w-[4rem] rounded-t-lg transition-all duration-500"
                        style={{
                          height: `${heightPct}%`,
                          background: `linear-gradient(180deg, #4fc3f7, rgba(79,195,247,0.3))`,
                          minHeight: 8,
                        }}
                      />
                      <span className="font-[var(--mono)] text-[0.58rem] uppercase tracking-wider text-[var(--muted)] sm:text-[0.62rem]">
                        {d.month}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ---- Two-Column: Skills + Recommendations ---- */}
            <div className="mt-8 grid gap-8 lg:grid-cols-2">
              {/* Skills Breakdown */}
              <div className="rounded-[1.5rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(20,20,22,0.94),rgba(10,10,12,0.98))] p-5 sm:p-8">
                <p className="mb-1 font-[var(--mono)] text-[0.72rem] uppercase tracking-[0.32em] text-[#4fc3f7]">
                  {'// Skill Breakdown'}
                </p>
                <h2 className="font-[var(--heading)] text-lg uppercase tracking-[0.04em] text-[var(--text)] sm:text-xl">
                  Skill Proficiency
                </h2>

                <div className="mt-6 space-y-5">
                  {skills.map((sk) => (
                    <div key={sk.name}>
                      <div className="mb-1.5 flex items-center justify-between">
                        <span className="text-sm text-[var(--text)]">{sk.name}</span>
                        <span className="font-[var(--mono)] text-sm" style={{ color: sk.color }}>
                          {sk.pct}%
                        </span>
                      </div>
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${sk.pct}%`,
                            background: `linear-gradient(90deg, ${sk.color}, ${sk.color}88)`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Optimization Recommendations */}
              <div className="rounded-[1.5rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(20,20,22,0.94),rgba(10,10,12,0.98))] p-5 sm:p-8">
                <p className="mb-1 font-[var(--mono)] text-[0.72rem] uppercase tracking-[0.32em] text-[#4fc3f7]">
                  {'// Recommendations'}
                </p>
                <h2 className="font-[var(--heading)] text-lg uppercase tracking-[0.04em] text-[var(--text)] sm:text-xl">
                  Optimization Tips
                </h2>

                <div className="mt-6 space-y-4">
                  {recommendations.map((rec, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition hover:border-[#4fc3f7]/20"
                    >
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 text-xl">{rec.icon}</span>
                        <div>
                          <h3 className="text-sm font-semibold text-[var(--text)]">{rec.title}</h3>
                          <p className="mt-1 text-xs leading-5 text-[var(--muted)]">{rec.body}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ---- Recent Activity Timeline ---- */}
            <div className="mt-8 rounded-[1.5rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(20,20,22,0.94),rgba(10,10,12,0.98))] p-5 sm:p-8">
              <p className="mb-1 font-[var(--mono)] text-[0.72rem] uppercase tracking-[0.32em] text-[#4fc3f7]">
                {'// Activity Log'}
              </p>
              <h2 className="font-[var(--heading)] text-lg uppercase tracking-[0.04em] text-[var(--text)] sm:text-xl">
                Recent Activity
              </h2>

              <div className="mt-6 space-y-0">
                {recentActivity.map((item, i) => (
                  <div key={i} className="relative flex gap-4 pb-6 last:pb-0">
                    {/* Timeline line */}
                    {i < recentActivity.length - 1 && (
                      <div className="absolute left-[15px] top-9 bottom-0 w-px bg-white/[0.08]" />
                    )}
                    {/* Icon dot */}
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-sm">
                      {activityIcons[item.type]}
                    </div>
                    {/* Content */}
                    <div className="pt-0.5">
                      <p className="text-sm leading-6 text-[var(--text)]">{item.action}</p>
                      <p className="mt-0.5 font-[var(--mono)] text-[0.68rem] text-[var(--muted)]">
                        {item.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
