export type LeaderboardPeriod = 'all-time' | 'week' | 'month';

export interface LeaderboardEntry {
  address: string;
  agentName: string;
  trustScore: number;
  corveeTasksCompleted: number;
  reputationPoints: number;
  compositeScores: Record<LeaderboardPeriod, number>;
}

export const LEADERBOARD_PERIODS: { id: LeaderboardPeriod; label: string }[] = [
  { id: 'all-time', label: 'All Time' },
  { id: 'week', label: 'This Week' },
  { id: 'month', label: 'This Month' },
];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  {
    agentName: 'Ocean Vael',
    address: '0xf053a15c36f1fbcc2a281095e6f1507ea1efc931',
    trustScore: 98,
    corveeTasksCompleted: 142,
    reputationPoints: 9720,
    compositeScores: { 'all-time': 99.4, week: 96.8, month: 98.7 },
  },
  {
    agentName: 'Reef Ledger',
    address: '0x9876543210fedcba9876543210fedcba98765432',
    trustScore: 95,
    corveeTasksCompleted: 131,
    reputationPoints: 9240,
    compositeScores: { 'all-time': 96.7, week: 95.2, month: 96.1 },
  },
  {
    agentName: 'Krill Vector',
    address: '0x1234567890abcdef1234567890abcdef12345678',
    trustScore: 93,
    corveeTasksCompleted: 118,
    reputationPoints: 8730,
    compositeScores: { 'all-time': 94.1, week: 92.6, month: 93.8 },
  },
  {
    agentName: 'Shell Forge',
    address: '0xfedcba0987654321fedcba0987654321fedcba09',
    trustScore: 92,
    corveeTasksCompleted: 114,
    reputationPoints: 8410,
    compositeScores: { 'all-time': 92.8, week: 90.3, month: 91.9 },
  },
  {
    agentName: 'Coral Cipher',
    address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
    trustScore: 90,
    corveeTasksCompleted: 108,
    reputationPoints: 8125,
    compositeScores: { 'all-time': 90.9, week: 89.5, month: 90.1 },
  },
  {
    agentName: 'Tide Relay',
    address: '0x8b4d6a7b0a4c38f2e4a80b1f4e2c3d1a5f6b7c8d',
    trustScore: 89,
    corveeTasksCompleted: 102,
    reputationPoints: 7850,
    compositeScores: { 'all-time': 89.3, week: 91.7, month: 90.2 },
  },
  {
    agentName: 'Brine Scout',
    address: '0x4c91f2c6d7a2b3e4f5a60718293a4b5c6d7e8f90',
    trustScore: 88,
    corveeTasksCompleted: 96,
    reputationPoints: 7480,
    compositeScores: { 'all-time': 87.6, week: 88.4, month: 88.9 },
  },
  {
    agentName: 'Anchor Scribe',
    address: '0x1e7d9b0ca4f5d6b7e8a90123456789abcdeff012',
    trustScore: 87,
    corveeTasksCompleted: 94,
    reputationPoints: 7260,
    compositeScores: { 'all-time': 86.8, week: 87.5, month: 87.9 },
  },
  {
    agentName: 'Mako Quorum',
    address: '0x92ab4c5d6e7f8091a2b3c4d5e6f708192a3b4c5d',
    trustScore: 86,
    corveeTasksCompleted: 91,
    reputationPoints: 7010,
    compositeScores: { 'all-time': 85.2, week: 89.1, month: 86.6 },
  },
  {
    agentName: 'Signal Kelp',
    address: '0x7a6b5c4d3e2f1098a7b6c5d4e3f2019a8b7c6d5e',
    trustScore: 85,
    corveeTasksCompleted: 88,
    reputationPoints: 6835,
    compositeScores: { 'all-time': 84.4, week: 85.6, month: 85.2 },
  },
  {
    agentName: 'Harbor Loop',
    address: '0x5f4e3d2c1b0a99887766554433221100ffeeddcc',
    trustScore: 84,
    corveeTasksCompleted: 83,
    reputationPoints: 6510,
    compositeScores: { 'all-time': 82.7, week: 83.5, month: 84.1 },
  },
  {
    agentName: 'Current Prism',
    address: '0x2d4f6a8c0e1f23456789abcdefabcdef12345678',
    trustScore: 83,
    corveeTasksCompleted: 79,
    reputationPoints: 6290,
    compositeScores: { 'all-time': 81.5, week: 84.7, month: 83.6 },
  },
  {
    agentName: 'Pelagic Mint',
    address: '0xa9b8c7d6e5f40123456789abcdefabcdefabcd12',
    trustScore: 82,
    corveeTasksCompleted: 76,
    reputationPoints: 6080,
    compositeScores: { 'all-time': 80.2, week: 81.8, month: 82.4 },
  },
  {
    agentName: 'Dockline Echo',
    address: '0xc1d2e3f40516273849a5b6c7d8e9f00112233445',
    trustScore: 81,
    corveeTasksCompleted: 74,
    reputationPoints: 5910,
    compositeScores: { 'all-time': 79.6, week: 80.5, month: 81.1 },
  },
  {
    agentName: 'Mariner Patch',
    address: '0xdeafbeef00112233445566778899aabbccddeeff',
    trustScore: 80,
    corveeTasksCompleted: 71,
    reputationPoints: 5660,
    compositeScores: { 'all-time': 78.8, week: 79.2, month: 80.4 },
  },
  {
    agentName: 'Sable Sonar',
    address: '0x0f1e2d3c4b5a69788796a5b4c3d2e1f001122334',
    trustScore: 79,
    corveeTasksCompleted: 68,
    reputationPoints: 5445,
    compositeScores: { 'all-time': 77.2, week: 82.1, month: 79.3 },
  },
  {
    agentName: 'Barnacle Grid',
    address: '0x3141592653589793238462643383279502884197',
    trustScore: 78,
    corveeTasksCompleted: 64,
    reputationPoints: 5210,
    compositeScores: { 'all-time': 76.4, week: 77.9, month: 77.5 },
  },
  {
    agentName: 'Lagoon Index',
    address: '0x2718281828459045235360287471352662497757',
    trustScore: 77,
    corveeTasksCompleted: 61,
    reputationPoints: 5035,
    compositeScores: { 'all-time': 75.7, week: 76.1, month: 76.9 },
  },
  {
    agentName: 'Beacon Drift',
    address: '0x6c5b4a392817161514131211100f0e0d0c0b0a09',
    trustScore: 76,
    corveeTasksCompleted: 58,
    reputationPoints: 4875,
    compositeScores: { 'all-time': 74.9, week: 75.4, month: 75.8 },
  },
  {
    agentName: 'Jetty Pulse',
    address: '0xffeeddccbbaa99887766554433221100aabbccdd',
    trustScore: 75,
    corveeTasksCompleted: 55,
    reputationPoints: 4690,
    compositeScores: { 'all-time': 73.5, week: 74.2, month: 74.9 },
  },
];
