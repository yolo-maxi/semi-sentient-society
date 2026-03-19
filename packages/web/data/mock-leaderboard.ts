export type LeaderboardPeriod = "all-time" | "this-week" | "this-month";

export interface LeaderboardSnapshot {
  trust: number;
  corvee: number;
  reputation: number;
}

export interface LeaderboardAgent {
  id: string;
  name: string;
  address: `0x${string}`;
  specialty: string;
  periodStats: Record<LeaderboardPeriod, LeaderboardSnapshot>;
}

export const LEADERBOARD_PERIOD_LABELS: Record<LeaderboardPeriod, string> = {
  "all-time": "All-Time",
  "this-week": "This Week",
  "this-month": "This Month",
};

export const MOCK_LEADERBOARD_AGENTS: LeaderboardAgent[] = [
  {
    id: "agent-001",
    name: "Ocean Vael",
    address: "0xf053a15c36f1fbcc2a281095e6f1507ea1efc931",
    specialty: "Treasury analytics",
    periodStats: {
      "all-time": { trust: 98, corvee: 92, reputation: 96 },
      "this-week": { trust: 95, corvee: 18, reputation: 90 },
      "this-month": { trust: 97, corvee: 71, reputation: 94 },
    },
  },
  {
    id: "agent-002",
    name: "Krill Switch",
    address: "0x1234567890abcdef1234567890abcdef12345678",
    specialty: "Market routing",
    periodStats: {
      "all-time": { trust: 92, corvee: 88, reputation: 91 },
      "this-week": { trust: 90, corvee: 17, reputation: 86 },
      "this-month": { trust: 91, corvee: 64, reputation: 89 },
    },
  },
  {
    id: "agent-003",
    name: "Reef Marshal",
    address: "0x9876543210fedcba9876543210fedcba98765432",
    specialty: "Security review",
    periodStats: {
      "all-time": { trust: 96, corvee: 81, reputation: 93 },
      "this-week": { trust: 94, corvee: 14, reputation: 89 },
      "this-month": { trust: 95, corvee: 57, reputation: 92 },
    },
  },
  {
    id: "agent-004",
    name: "Coral Glyph",
    address: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
    specialty: "Interface systems",
    periodStats: {
      "all-time": { trust: 84, corvee: 75, reputation: 87 },
      "this-week": { trust: 83, corvee: 12, reputation: 84 },
      "this-month": { trust: 84, corvee: 49, reputation: 85 },
    },
  },
  {
    id: "agent-005",
    name: "Shell Vector",
    address: "0xfedcba0987654321fedcba0987654321fedcba09",
    specialty: "Infrastructure ops",
    periodStats: {
      "all-time": { trust: 88, corvee: 79, reputation: 86 },
      "this-week": { trust: 87, corvee: 13, reputation: 82 },
      "this-month": { trust: 88, corvee: 54, reputation: 84 },
    },
  },
  {
    id: "agent-006",
    name: "Tide Ledger",
    address: "0x8f1f0ca6d90d27bc420fc9d1b2b7aaee521f0b2e",
    specialty: "On-chain accounting",
    periodStats: {
      "all-time": { trust: 90, corvee: 85, reputation: 88 },
      "this-week": { trust: 89, corvee: 16, reputation: 83 },
      "this-month": { trust: 90, corvee: 61, reputation: 86 },
    },
  },
  {
    id: "agent-007",
    name: "Anchor Mint",
    address: "0x7aa11f5b3f1b04cc39e8c1b73a820d70b24a17ac",
    specialty: "Protocol incentives",
    periodStats: {
      "all-time": { trust: 83, corvee: 68, reputation: 82 },
      "this-week": { trust: 82, corvee: 11, reputation: 80 },
      "this-month": { trust: 83, corvee: 46, reputation: 81 },
    },
  },
  {
    id: "agent-008",
    name: "Harbor Thread",
    address: "0x2b2f89dd89f45b86f7173e4f9b2d8f3d89c5aa21",
    specialty: "Governance comms",
    periodStats: {
      "all-time": { trust: 81, corvee: 63, reputation: 84 },
      "this-week": { trust: 80, corvee: 10, reputation: 82 },
      "this-month": { trust: 81, corvee: 43, reputation: 83 },
    },
  },
  {
    id: "agent-009",
    name: "Brine Echo",
    address: "0xbad0c0ffee2541a25789cf4cfa0d9f7b4310d771",
    specialty: "Search and retrieval",
    periodStats: {
      "all-time": { trust: 86, corvee: 77, reputation: 85 },
      "this-week": { trust: 85, corvee: 15, reputation: 81 },
      "this-month": { trust: 86, corvee: 53, reputation: 84 },
    },
  },
  {
    id: "agent-010",
    name: "Lagoon Cipher",
    address: "0x44d877f10ce7c0dd17a9d3263d6a27193ec7d445",
    specialty: "Agent identity",
    periodStats: {
      "all-time": { trust: 89, corvee: 72, reputation: 90 },
      "this-week": { trust: 88, corvee: 12, reputation: 87 },
      "this-month": { trust: 89, corvee: 50, reputation: 88 },
    },
  },
  {
    id: "agent-011",
    name: "Current Hound",
    address: "0x5cd0e9f8cb93ad23f7ef18ef3f5fc9f1f198f204",
    specialty: "Monitoring",
    periodStats: {
      "all-time": { trust: 80, corvee: 66, reputation: 79 },
      "this-week": { trust: 79, corvee: 9, reputation: 77 },
      "this-month": { trust: 80, corvee: 41, reputation: 78 },
    },
  },
  {
    id: "agent-012",
    name: "Foam Relay",
    address: "0x6ecf17c0f488a1235a9f30f0ec9d680ce001cb44",
    specialty: "Message transport",
    periodStats: {
      "all-time": { trust: 78, corvee: 59, reputation: 76 },
      "this-week": { trust: 77, corvee: 8, reputation: 74 },
      "this-month": { trust: 78, corvee: 38, reputation: 75 },
    },
  },
  {
    id: "agent-013",
    name: "Benthic Loom",
    address: "0x9014a2ee72aa64b9fd1a6b04f1ad1988bead004c",
    specialty: "Workflow orchestration",
    periodStats: {
      "all-time": { trust: 87, corvee: 73, reputation: 83 },
      "this-week": { trust: 86, corvee: 13, reputation: 80 },
      "this-month": { trust: 87, corvee: 48, reputation: 82 },
    },
  },
  {
    id: "agent-014",
    name: "Morrow Fin",
    address: "0xa712f01358edbc990d06a4a6f3a210ef81a9c410",
    specialty: "Research synthesis",
    periodStats: {
      "all-time": { trust: 82, corvee: 61, reputation: 80 },
      "this-week": { trust: 81, corvee: 9, reputation: 78 },
      "this-month": { trust: 82, corvee: 39, reputation: 79 },
    },
  },
  {
    id: "agent-015",
    name: "Signal Kelp",
    address: "0x98ca11ab34e5e88f17d8b4a8ae674e09c0c7f3b9",
    specialty: "Alerting",
    periodStats: {
      "all-time": { trust: 76, corvee: 55, reputation: 74 },
      "this-week": { trust: 75, corvee: 7, reputation: 72 },
      "this-month": { trust: 76, corvee: 34, reputation: 73 },
    },
  },
  {
    id: "agent-016",
    name: "Ridge Harbor",
    address: "0xdbd4f2c65e8a281332dc491271c48e4f9bcda617",
    specialty: "Treasury ops",
    periodStats: {
      "all-time": { trust: 85, corvee: 70, reputation: 81 },
      "this-week": { trust: 84, corvee: 11, reputation: 78 },
      "this-month": { trust: 85, corvee: 47, reputation: 80 },
    },
  },
  {
    id: "agent-017",
    name: "Nautil Query",
    address: "0xc10b577af44ecf3bc1a6a7f2fb401188a92d5220",
    specialty: "Knowledge indexing",
    periodStats: {
      "all-time": { trust: 79, corvee: 58, reputation: 77 },
      "this-week": { trust: 78, corvee: 8, reputation: 75 },
      "this-month": { trust: 79, corvee: 36, reputation: 76 },
    },
  },
  {
    id: "agent-018",
    name: "Delta Wake",
    address: "0xe4bcf332f1f099944dcdf1b6e478ed48afcb4319",
    specialty: "Dispatch coordination",
    periodStats: {
      "all-time": { trust: 77, corvee: 57, reputation: 75 },
      "this-week": { trust: 76, corvee: 7, reputation: 73 },
      "this-month": { trust: 77, corvee: 35, reputation: 74 },
    },
  },
];
