/* ─── Mock data for Agent Performance Analytics ─── */

export interface ReputationDataPoint {
  month: string;
  score: number;
}

export interface SkillProficiency {
  skill: string;
  score: number; // 0-100
  label: string;
}

export interface PeerComparison {
  metric: string;
  percentile: number; // 0-100
  value: string;
  peerAvg: string;
}

export interface ActivityDay {
  date: string;
  count: number; // 0-4 intensity levels
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: string;
}

export interface EarningsSlice {
  type: string;
  amount: number;
  color: string;
}

export const REPUTATION_TREND: ReputationDataPoint[] = [
  { month: 'Jul', score: 62 },
  { month: 'Aug', score: 67 },
  { month: 'Sep', score: 64 },
  { month: 'Oct', score: 71 },
  { month: 'Nov', score: 76 },
  { month: 'Dec', score: 73 },
  { month: 'Jan', score: 79 },
  { month: 'Feb', score: 82 },
  { month: 'Mar', score: 85 },
  { month: 'Apr', score: 84 },
  { month: 'May', score: 89 },
  { month: 'Jun', score: 91 },
];

export const SKILL_PROFICIENCIES: SkillProficiency[] = [
  { skill: 'Code Review', score: 88, label: 'Expert' },
  { skill: 'Smart Contracts', score: 76, label: 'Advanced' },
  { skill: 'Data Analysis', score: 92, label: 'Expert' },
  { skill: 'Governance', score: 65, label: 'Intermediate' },
  { skill: 'Documentation', score: 81, label: 'Advanced' },
  { skill: 'Testing / QA', score: 70, label: 'Advanced' },
];

export const PEER_COMPARISONS: PeerComparison[] = [
  { metric: 'Reputation Score', percentile: 89, value: '91', peerAvg: '68' },
  { metric: 'Tasks Completed', percentile: 76, value: '147', peerAvg: '98' },
  { metric: 'Avg Quality Rating', percentile: 94, value: '4.7/5', peerAvg: '3.9/5' },
  { metric: 'Response Time', percentile: 82, value: '1.2h', peerAvg: '3.4h' },
  { metric: 'Collaboration Score', percentile: 71, value: '84', peerAvg: '72' },
  { metric: 'Streak (days)', percentile: 67, value: '23', peerAvg: '14' },
];

// Generate 26 weeks of activity data (roughly 6 months)
function generateActivityData(): ActivityDay[] {
  const days: ActivityDay[] = [];
  const now = new Date(2026, 2, 31); // March 31, 2026
  for (let i = 181; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dayOfWeek = d.getDay();
    // Weekends are lighter
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    let count: number;
    const r = Math.random();
    if (isWeekend) {
      count = r < 0.45 ? 0 : r < 0.7 ? 1 : r < 0.9 ? 2 : 3;
    } else {
      count = r < 0.1 ? 0 : r < 0.3 ? 1 : r < 0.55 ? 2 : r < 0.8 ? 3 : 4;
    }
    days.push({
      date: d.toISOString().slice(0, 10),
      count,
    });
  }
  return days;
}

// Use a seeded-ish approach: generate once at module level
export const ACTIVITY_DATA: ActivityDay[] = generateActivityData();

export const RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'rec-1',
    title: 'Strengthen Governance Participation',
    description: 'Your governance score (65) is below your other skills. Participating in 3 more proposal reviews this month could push you to Advanced tier.',
    impact: 'high',
    category: 'Skill Gap',
  },
  {
    id: 'rec-2',
    title: 'Extend Your Activity Streak',
    description: 'You\'re at 23 days — just 7 more to hit the 30-day milestone badge. Even small contributions count toward maintaining your streak.',
    impact: 'medium',
    category: 'Engagement',
  },
  {
    id: 'rec-3',
    title: 'Diversify Task Types',
    description: '64% of your earnings come from Code Review. Taking on Smart Contract audits could increase hourly yield by ~18% based on current bounty rates.',
    impact: 'high',
    category: 'Earnings',
  },
  {
    id: 'rec-4',
    title: 'Improve Testing & QA Score',
    description: 'Completing the QA certification module would unlock higher-tier testing bounties and raise your composite score by an estimated 4 points.',
    impact: 'medium',
    category: 'Certification',
  },
];

export const EARNINGS_BREAKDOWN: EarningsSlice[] = [
  { type: 'Code Review', amount: 2840, color: '#c9362c' },
  { type: 'Smart Contracts', amount: 980, color: '#8b1a12' },
  { type: 'Data Analysis', amount: 620, color: '#d4d0c8' },
  { type: 'Documentation', amount: 340, color: '#9a8f7f' },
  { type: 'Governance', amount: 180, color: '#b82a22' },
  { type: 'Other', amount: 90, color: '#4a4540' },
];

export const ANALYTICS_SUMMARY = {
  totalEarnings: 5050,
  tasksCompleted: 147,
  currentStreak: 23,
  reputationScore: 91,
};
