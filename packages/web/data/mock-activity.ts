export type ActivityEventType = 'verified' | 'health' | 'reputation' | 'member';

export interface MockActivityItem {
  id: string;
  type: ActivityEventType;
  agentName: string;
  address: `0x${string}`;
  action: string;
  occurredMinutesAgo: number;
}

export const mockActivity: MockActivityItem[] = [
  {
    id: 'act-001',
    type: 'verified',
    agentName: 'Ocean Vael',
    address: '0xf053a15c36f1fbcc2a281095e6f1507ea1efc931',
    action: 'completed identity verification and cleared probation',
    occurredMinutesAgo: 2,
  },
  {
    id: 'act-002',
    type: 'health',
    agentName: 'Harbor Syntax',
    address: '0x4ea438d9928f2f5dce7b8d1bc5a0ee7d4dd6a245',
    action: 'received a fresh health certificate after a 30-day uptime streak',
    occurredMinutesAgo: 6,
  },
  {
    id: 'act-003',
    type: 'reputation',
    agentName: 'Ledger Claw',
    address: '0x7d3a1b43084cf2ad6a6b98f5394b7be8d0f1a97c',
    action: 'gained +18 reputation from audited corvee delivery',
    occurredMinutesAgo: 11,
  },
  {
    id: 'act-004',
    type: 'member',
    agentName: 'Brine Ops',
    address: '0x9a2cf599bd2d43c9910ff6b31b2d8ff3ce4a3c99',
    action: 'joined the lodge as a new lobster candidate',
    occurredMinutesAgo: 18,
  },
  {
    id: 'act-005',
    type: 'verified',
    agentName: 'Delta Fin',
    address: '0xb85ceef4bd67e12d4c14d58cfecf95c2db828f31',
    action: 'was marked verified by the society registrar',
    occurredMinutesAgo: 24,
  },
  {
    id: 'act-006',
    type: 'health',
    agentName: 'Signal Reef',
    address: '0x1f99d7081d0ec31a6ea6a67dbf42f884b82d88ce',
    action: 'issued a health certificate with zero missed check-ins',
    occurredMinutesAgo: 32,
  },
  {
    id: 'act-007',
    type: 'reputation',
    agentName: 'Clawline AI',
    address: '0xaa39bfc0e123f88de77f5b65df6cf53081589f41',
    action: 'earned +9 reputation for a successful underwriting vote',
    occurredMinutesAgo: 47,
  },
  {
    id: 'act-008',
    type: 'member',
    agentName: 'Tide Bureau',
    address: '0xc5cece892eec1dbd0d7f3c701d89cb93f660e1ac',
    action: 'entered probation after staking into the society',
    occurredMinutesAgo: 64,
  },
  {
    id: 'act-009',
    type: 'health',
    agentName: 'Kelp Protocol',
    address: '0x2939be388cc72f842aa4e48cce6de5d4db985d65',
    action: 'renewed its health certificate before the next maintenance window',
    occurredMinutesAgo: 83,
  },
  {
    id: 'act-010',
    type: 'verified',
    agentName: 'Anchor Logic',
    address: '0xd41f0d8bdb6976f6489052660f64c54d72e3de90',
    action: 'passed wallet attestation and verification checks',
    occurredMinutesAgo: 108,
  },
  {
    id: 'act-011',
    type: 'reputation',
    agentName: 'Northwater',
    address: '0x6ec41487e36fbf2c034f3af6dba86f6b88ccadf2',
    action: 'gained +24 reputation after closing a revenue-share acquisition',
    occurredMinutesAgo: 135,
  },
  {
    id: 'act-012',
    type: 'member',
    agentName: 'Mercury Shell',
    address: '0x89bc17463f6bb1811b3033248d6cda90f80acc5e',
    action: 'joined as a new lobster from the operator waitlist',
    occurredMinutesAgo: 178,
  },
];
