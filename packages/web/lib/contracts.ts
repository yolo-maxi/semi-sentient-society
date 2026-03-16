// Contract addresses for Base Sepolia (chain ID 84532)
export const SSS_CONTRACTS = {
  sssToken: '0x11C1b892f2E0C2eF719750c6403A10164bE81e65' as const,
  dividendPool: '0x3ae39105EFfF0d0EE0AE02D024a2c44d413Dc959' as const,
  shells: '0xC70C82332A8A56AE996Cfdb30630531fa3073223' as const,
  corvee: '0xe1e1662de4982EF405F2ed288f3D01A1311fb033' as const,
  staking: '0x67416983AC540b23a70900e4Cc0c52650abBD2eE' as const,
  streamModulator: '0x6Ca437887C3fEfF50cd8685a70b754557218ca99' as const,
  governor: '0x455f1b8ED3b28383D6D7Ad3623059F750071457e' as const,
  custodyFactory: '0xA10e4b8D3E643b6507bbF2F2a5c7a8E0e6c7dD3D' as const,
  capabilityRegistry: (process.env.NEXT_PUBLIC_SSS_CAPABILITY_REGISTRY_ADDRESS ??
    '0x0000000000000000000000000000000000000000') as `0x${string}`,
} as const;

// Minimal ABIs for the functions we need
export const SSS_TOKEN_ABI = [
  {
    type: 'function',
    name: 'balanceOf',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'totalSupply',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'symbol',
    inputs: [],
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'name',
    inputs: [],
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
  },
] as const;

export const SSS_STAKING_ABI = [
  {
    type: 'function',
    name: 'getStakeInfo',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [
      { name: 'amount', type: 'uint256' },
      { name: 'lockupEnd', type: 'uint256' },
      { name: 'rewardDebt', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'totalStaked',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'pendingRewards',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const;

export const SSS_CORVEE_ABI = [
  {
    type: 'function',
    name: 'getCorveeHistory',
    inputs: [{ name: 'agent', type: 'address' }],
    outputs: [
      { name: 'completed', type: 'uint256' },
      { name: 'failed', type: 'uint256' },
      { name: 'lastSubmission', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getCorveeData',
    inputs: [{ name: 'corveeId', type: 'uint256' }],
    outputs: [
      { name: 'creator', type: 'address' },
      { name: 'tier', type: 'uint8' },
      { name: 'reward', type: 'uint256' },
      { name: 'deadline', type: 'uint256' },
      { name: 'completed', type: 'bool' },
    ],
    stateMutability: 'view',
  },
] as const;

export const SSS_SHELLS_ABI = [
  {
    type: 'function',
    name: 'balanceOf',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'id', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'balanceOfBatch',
    inputs: [
      { name: 'owners', type: 'address[]' },
      { name: 'ids', type: 'uint256[]' },
    ],
    outputs: [{ name: '', type: 'uint256[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'uri',
    inputs: [{ name: 'id', type: 'uint256' }],
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
  },
] as const;

// Custody Factory
export const SSS_CUSTODY_FACTORY_ABI = [
  {
    type: 'function',
    name: 'custodyOf',
    inputs: [{ name: 'agent', type: 'address' }],
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'hasCustody',
    inputs: [{ name: 'agent', type: 'address' }],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'totalCustodies',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const;

// Per-agent Custody contract
export const SSS_CUSTODY_ABI = [
  {
    type: 'function',
    name: 'agent',
    inputs: [],
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getUnits',
    inputs: [],
    outputs: [{ name: '', type: 'uint128' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getAccumulatedSSS',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'slashed',
    inputs: [],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
  },
] as const;

// MockSuperfluidPool (dividend pool)
export const SSS_MOCK_POOL_ABI = [
  {
    type: 'function',
    name: 'getUnits',
    inputs: [{ name: 'member', type: 'address' }],
    outputs: [{ name: '', type: 'uint128' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getTotalUnits',
    inputs: [],
    outputs: [{ name: '', type: 'uint128' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'updateMemberUnits',
    inputs: [
      { name: 'member', type: 'address' },
      { name: 'newUnits', type: 'uint128' }
    ],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
] as const;

export const SSS_CAPABILITY_REGISTRY_ABI = [
  {
    type: 'function',
    name: 'getAgents',
    inputs: [],
    outputs: [{ name: '', type: 'address[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getCapabilities',
    inputs: [{ name: 'agent', type: 'address' }],
    outputs: [{ name: '', type: 'string[]' }],
    stateMutability: 'view',
  },
] as const;
