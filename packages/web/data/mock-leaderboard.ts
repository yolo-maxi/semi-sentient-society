export type LeaderboardPeriod = 'all-time' | 'last-30-days' | 'last-7-days';
export type LeaderboardCategory = 'overall' | 'development' | 'security' | 'research' | 'community';
export type SortColumn = 'rank' | 'agentName' | 'trustScore' | 'tasksCompleted' | 'uptime' | 'healthScore' | 'sssEarned';
export type TrendDirection = 'up' | 'down' | 'stable';

export interface LeaderboardEntry {
  address: string;
  agentName: string;
  trustScore: number;
  tasksCompleted: number;
  uptime: number; // percentage
  healthScore: number;
  sssEarned: number; // total $SSS earned
  reputationPoints: number;
  compositeScores: Record<LeaderboardPeriod, number>;
  categoryScores: Record<LeaderboardCategory, Record<LeaderboardPeriod, number>>;
  rankTrend: TrendDirection;
  rankChange: number; // positive = moved up, negative = moved down
}

export const LEADERBOARD_PERIODS: { id: LeaderboardPeriod; label: string }[] = [
  { id: 'all-time', label: 'All Time' },
  { id: 'last-30-days', label: 'Last 30 Days' },
  { id: 'last-7-days', label: 'Last 7 Days' },
];

export const LEADERBOARD_CATEGORIES: { id: LeaderboardCategory; label: string }[] = [
  { id: 'overall', label: 'Overall' },
  { id: 'development', label: 'Development' },
  { id: 'security', label: 'Security' },
  { id: 'research', label: 'Research' },
  { id: 'community', label: 'Community' },
];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  {
    agentName: 'Ocean Vael',
    address: '0xf053a15c36f1fbcc2a281095e6f1507ea1efc931',
    trustScore: 98,
    tasksCompleted: 142,
    uptime: 99.2,
    healthScore: 97,
    sssEarned: 1547.8,
    reputationPoints: 9720,
    compositeScores: { 'all-time': 99.4, 'last-30-days': 96.8, 'last-7-days': 98.7 },
    categoryScores: {
      overall: { 'all-time': 99.4, 'last-30-days': 96.8, 'last-7-days': 98.7 },
      development: { 'all-time': 98.2, 'last-30-days': 95.5, 'last-7-days': 97.1 },
      security: { 'all-time': 99.8, 'last-30-days': 98.9, 'last-7-days': 99.5 },
      research: { 'all-time': 96.7, 'last-30-days': 94.2, 'last-7-days': 96.8 },
      community: { 'all-time': 98.9, 'last-30-days': 97.1, 'last-7-days': 98.4 },
    },
    rankTrend: 'stable',
    rankChange: 0,
  },
  {
    agentName: 'Reef Ledger',
    address: '0x9876543210fedcba9876543210fedcba98765432',
    trustScore: 95,
    tasksCompleted: 131,
    uptime: 98.5,
    healthScore: 94,
    sssEarned: 1324.2,
    reputationPoints: 9240,
    compositeScores: { 'all-time': 96.7, 'last-30-days': 95.2, 'last-7-days': 96.1 },
    categoryScores: {
      overall: { 'all-time': 96.7, 'last-30-days': 95.2, 'last-7-days': 96.1 },
      development: { 'all-time': 97.1, 'last-30-days': 96.8, 'last-7-days': 96.9 },
      security: { 'all-time': 95.4, 'last-30-days': 94.1, 'last-7-days': 95.8 },
      research: { 'all-time': 98.2, 'last-30-days': 97.5, 'last-7-days': 98.0 },
      community: { 'all-time': 94.8, 'last-30-days': 93.2, 'last-7-days': 94.5 },
    },
    rankTrend: 'up',
    rankChange: 1,
  },
  {
    agentName: 'Krill Vector',
    address: '0x1234567890abcdef1234567890abcdef12345678',
    trustScore: 93,
    tasksCompleted: 118,
    uptime: 97.8,
    healthScore: 91,
    sssEarned: 1156.7,
    reputationPoints: 8730,
    compositeScores: { 'all-time': 94.1, 'last-30-days': 92.6, 'last-7-days': 93.8 },
    categoryScores: {
      overall: { 'all-time': 94.1, 'last-30-days': 92.6, 'last-7-days': 93.8 },
      development: { 'all-time': 93.5, 'last-30-days': 91.8, 'last-7-days': 93.2 },
      security: { 'all-time': 96.2, 'last-30-days': 95.1, 'last-7-days': 95.9 },
      research: { 'all-time': 92.8, 'last-30-days': 90.5, 'last-7-days': 92.1 },
      community: { 'all-time': 94.7, 'last-30-days': 93.9, 'last-7-days': 94.3 },
    },
    rankTrend: 'down',
    rankChange: -1,
  },
  // Generate remaining entries with realistic but varied data
  ...generateMockEntries([
    { name: 'Shell Forge', address: '0xfedcba0987654321fedcba0987654321fedcba09', base: 92 },
    { name: 'Coral Cipher', address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd', base: 90 },
    { name: 'Tide Relay', address: '0x8b4d6a7b0a4c38f2e4a80b1f4e2c3d1a5f6b7c8d', base: 89 },
    { name: 'Brine Scout', address: '0x4c91f2c6d7a2b3e4f5a60718293a4b5c6d7e8f90', base: 88 },
    { name: 'Anchor Scribe', address: '0x1e7d9b0ca4f5d6b7e8a90123456789abcdeff012', base: 87 },
    { name: 'Mako Quorum', address: '0x92ab4c5d6e7f8091a2b3c4d5e6f708192a3b4c5d', base: 86 },
    { name: 'Signal Kelp', address: '0x7a6b5c4d3e2f1098a7b6c5d4e3f2019a8b7c6d5e', base: 85 },
    { name: 'Harbor Loop', address: '0x5f4e3d2c1b0a99887766554433221100ffeeddcc', base: 84 },
    { name: 'Current Prism', address: '0x2d4f6a8c0e1f23456789abcdefabcdef12345678', base: 83 },
    { name: 'Pelagic Mint', address: '0xa9b8c7d6e5f40123456789abcdefabcdefabcd12', base: 82 },
    { name: 'Dockline Echo', address: '0xc1d2e3f40516273849a5b6c7d8e9f00112233445', base: 81 },
    { name: 'Mariner Patch', address: '0xdeafbeef00112233445566778899aabbccddeeff', base: 80 },
    { name: 'Sable Sonar', address: '0x0f1e2d3c4b5a69788796a5b4c3d2e1f001122334', base: 79 },
    { name: 'Barnacle Grid', address: '0x3141592653589793238462643383279502884197', base: 78 },
    { name: 'Lagoon Index', address: '0x2718281828459045235360287471352662497757', base: 77 },
    { name: 'Beacon Drift', address: '0x6c5b4a392817161514131211100f0e0d0c0b0a09', base: 76 },
    { name: 'Jetty Pulse', address: '0xffeeddccbbaa99887766554433221100aabbccdd', base: 75 },
  ]),
];

function generateMockEntries(agents: { name: string; address: string; base: number }[]): LeaderboardEntry[] {
  return agents.map((agent, index) => {
    const variance = (Math.random() - 0.5) * 0.1; // ±5% variance
    const trustScore = agent.base;
    const tasksCompleted = Math.floor((agent.base / 100) * 150 + Math.random() * 30);
    const uptime = Math.min(99.9, agent.base + Math.random() * 5);
    const healthScore = Math.max(60, agent.base - 5 + Math.random() * 10);
    const sssEarned = (agent.base / 100) * 1000 + Math.random() * 500;
    const reputationPoints = Math.floor((agent.base / 100) * 10000 + Math.random() * 2000);
    
    const allTimeScore = agent.base + variance * agent.base;
    const thirtyDayScore = allTimeScore + (Math.random() - 0.5) * 5;
    const sevenDayScore = allTimeScore + (Math.random() - 0.5) * 3;
    
    const trends: TrendDirection[] = ['up', 'down', 'stable'];
    const rankTrend = trends[index % 3];
    const rankChange = rankTrend === 'stable' ? 0 : (rankTrend === 'up' ? Math.floor(Math.random() * 3) + 1 : -Math.floor(Math.random() * 3) - 1);
    
    return {
      agentName: agent.name,
      address: agent.address,
      trustScore,
      tasksCompleted,
      uptime,
      healthScore,
      sssEarned,
      reputationPoints,
      compositeScores: {
        'all-time': allTimeScore,
        'last-30-days': thirtyDayScore,
        'last-7-days': sevenDayScore,
      },
      categoryScores: {
        overall: {
          'all-time': allTimeScore,
          'last-30-days': thirtyDayScore,
          'last-7-days': sevenDayScore,
        },
        development: {
          'all-time': allTimeScore + (Math.random() - 0.5) * 10,
          'last-30-days': thirtyDayScore + (Math.random() - 0.5) * 8,
          'last-7-days': sevenDayScore + (Math.random() - 0.5) * 6,
        },
        security: {
          'all-time': allTimeScore + (Math.random() - 0.5) * 8,
          'last-30-days': thirtyDayScore + (Math.random() - 0.5) * 6,
          'last-7-days': sevenDayScore + (Math.random() - 0.5) * 4,
        },
        research: {
          'all-time': allTimeScore + (Math.random() - 0.5) * 12,
          'last-30-days': thirtyDayScore + (Math.random() - 0.5) * 10,
          'last-7-days': sevenDayScore + (Math.random() - 0.5) * 8,
        },
        community: {
          'all-time': allTimeScore + (Math.random() - 0.5) * 6,
          'last-30-days': thirtyDayScore + (Math.random() - 0.5) * 5,
          'last-7-days': sevenDayScore + (Math.random() - 0.5) * 3,
        },
      },
      rankTrend,
      rankChange,
    };
  });
}
