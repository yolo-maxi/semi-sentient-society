import { getAddress, isAddress, type Address } from 'viem';
import type {
  AgentProfile,
  SSSClientOptions,
  SearchAgentsParams,
  SearchAgentsResult
} from './types';
import { resolvePublicClient, resolveRequiredContracts } from './verify';

const DIRECTORY_ABI = [
  {
    type: 'function',
    name: 'searchAgents',
    stateMutability: 'view',
    inputs: [
      { name: 'capability', type: 'string' },
      { name: 'minTrustScore', type: 'uint256' },
      { name: 'limit', type: 'uint256' },
      { name: 'offset', type: 'uint256' }
    ],
    outputs: [
      {
        name: 'agents',
        type: 'tuple[]',
        components: [
          { name: 'account', type: 'address' },
          { name: 'verified', type: 'bool' },
          { name: 'trustScore', type: 'uint256' },
          { name: 'lastActive', type: 'uint256' },
          { name: 'capabilities', type: 'string[]' }
        ]
      },
      { name: 'total', type: 'uint256' }
    ]
  },
  {
    type: 'function',
    name: 'getAgent',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [
      {
        name: 'agent',
        type: 'tuple',
        components: [
          { name: 'account', type: 'address' },
          { name: 'verified', type: 'bool' },
          { name: 'trustScore', type: 'uint256' },
          { name: 'lastActive', type: 'uint256' },
          { name: 'capabilities', type: 'string[]' }
        ]
      }
    ]
  }
] as const;

type DirectoryAgentRecord = {
  account: Address;
  verified: boolean;
  trustScore: bigint;
  lastActive: bigint;
  capabilities: readonly string[];
};

function normalizeAgent(agent: DirectoryAgentRecord): AgentProfile {
  return {
    address: getAddress(agent.account),
    verified: agent.verified,
    trustScore: Number(agent.trustScore),
    lastActive: Number(agent.lastActive),
    capabilities: [...agent.capabilities]
  };
}

export class DirectoryModule {
  constructor(private readonly options: SSSClientOptions) {}

  async search(params: SearchAgentsParams = {}): Promise<SearchAgentsResult> {
    const publicClient = resolvePublicClient(this.options);
    const contracts = resolveRequiredContracts(this.options, ['directory']);
    const capability = params.capability ?? '';
    const minTrustScore = BigInt(params.minTrustScore ?? 0);
    const limit = BigInt(params.limit ?? 20);
    const offset = BigInt(params.offset ?? 0);

    const [agents, total] = await publicClient.readContract({
      address: contracts.directory,
      abi: DIRECTORY_ABI,
      functionName: 'searchAgents',
      args: [capability, minTrustScore, limit, offset]
    });

    return {
      agents: agents.map((agent) => normalizeAgent(agent)),
      total: Number(total)
    };
  }

  async getAgent(address: Address): Promise<AgentProfile> {
    if (!isAddress(address)) {
      throw new Error(`Invalid agent address: ${address}`);
    }

    const publicClient = resolvePublicClient(this.options);
    const contracts = resolveRequiredContracts(this.options, ['directory']);
    const agent = await publicClient.readContract({
      address: contracts.directory,
      abi: DIRECTORY_ABI,
      functionName: 'getAgent',
      args: [getAddress(address)]
    });

    return normalizeAgent(agent);
  }
}

export { DIRECTORY_ABI };
