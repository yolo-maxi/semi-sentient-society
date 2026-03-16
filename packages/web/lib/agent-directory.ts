import {
  createPublicClient,
  getAddress,
  http,
  isAddress,
  parseAbiItem,
  type Address,
} from 'viem';
import { base } from 'viem/chains';

const DEFAULT_BASE_RPC_URL = 'https://mainnet.base.org';
const DIRECTORY_CACHE_TTL_MS = 60 * 1000;

const STAKING_ABI = [
  {
    type: 'function',
    name: 'stakes',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [
      { name: 'amount', type: 'uint256' },
      { name: 'consecutiveDays', type: 'uint256' },
      { name: 'lastConfirmationDay', type: 'uint256' },
      { name: 'active', type: 'bool' },
    ],
  },
] as const;

const CAPABILITY_REGISTRY_ABI = [
  {
    type: 'function',
    name: 'getCapabilities',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'string[]' }],
  },
] as const;

const STAKED_EVENT = parseAbiItem(
  'event Staked(address indexed member, uint256 amount)'
);
const CORVEE_CONFIRMED_EVENT = parseAbiItem(
  'event CorveeConfirmed(address indexed member, uint256 consecutiveDays)'
);

const cache = new Map<string, { data: unknown; expiry: number }>();

const publicClient = createPublicClient({
  chain: base,
  transport: http(process.env.SSS_BASE_RPC_URL ?? DEFAULT_BASE_RPC_URL),
});

interface DirectoryContracts {
  staking: Address;
  capabilities: Address;
}

interface EventIndexEntry {
  firstStakedBlock: bigint;
  corveeCompleted: number;
}

interface DirectoryAgentRecord {
  address: Address;
  verified: boolean;
  trustScore: number;
  lastActive: number;
  capabilities: string[];
}

export interface DirectoryAgent extends DirectoryAgentRecord {}

export interface DirectoryAgentProfile extends DirectoryAgentRecord {
  joinedAt: string | null;
  corveeCompleted: number;
}

function getCachedValue<T>(key: string, ttlMs: number, fetcher: () => Promise<T>): Promise<T> {
  const cached = cache.get(key);
  const now = Date.now();

  if (cached && now < cached.expiry) {
    return Promise.resolve(cached.data as T);
  }

  return fetcher().then((data) => {
    cache.set(key, { data, expiry: now + ttlMs });
    return data;
  });
}

function getDirectoryContracts(): DirectoryContracts {
  const stakingAddress = process.env.SSS_STAKING_CONTRACT;
  const capabilityAddress =
    process.env.SSS_CAPABILITIES_CONTRACT ??
    process.env.NEXT_PUBLIC_SSS_CAPABILITY_REGISTRY_ADDRESS;

  if (!stakingAddress || !capabilityAddress) {
    throw new Error(
      'Missing SSS contract addresses. Set SSS_STAKING_CONTRACT and SSS_CAPABILITIES_CONTRACT.'
    );
  }

  if (!isAddress(stakingAddress) || !isAddress(capabilityAddress)) {
    throw new Error('Invalid SSS contract address configured.');
  }

  return {
    staking: getAddress(stakingAddress),
    capabilities: getAddress(capabilityAddress),
  };
}

function getEventStartBlock(): bigint {
  const configured = process.env.SSS_STAKING_START_BLOCK;

  if (!configured) {
    return 0n;
  }

  try {
    return BigInt(configured);
  } catch {
    throw new Error('Invalid SSS_STAKING_START_BLOCK configured.');
  }
}

function calculateTrustScore(consecutiveDays: bigint): number {
  const normalizedDays = Number(consecutiveDays > 30n ? 30n : consecutiveDays);
  return Math.round((normalizedDays / 30) * 100);
}

async function getEventIndex(): Promise<Map<Address, EventIndexEntry>> {
  return getCachedValue('directory:event-index', DIRECTORY_CACHE_TTL_MS, async () => {
    const { staking } = getDirectoryContracts();
    const fromBlock = getEventStartBlock();

    const [stakedLogs, corveeLogs] = await Promise.all([
      publicClient.getLogs({
        address: staking,
        event: STAKED_EVENT,
        fromBlock,
        toBlock: 'latest',
      }),
      publicClient.getLogs({
        address: staking,
        event: CORVEE_CONFIRMED_EVENT,
        fromBlock,
        toBlock: 'latest',
      }),
    ]);

    const directory = new Map<Address, EventIndexEntry>();

    for (const log of stakedLogs) {
      const member = log.args.member;

      if (!member) {
        continue;
      }

      const address = getAddress(member);
      const existing = directory.get(address);

      if (!existing || log.blockNumber < existing.firstStakedBlock) {
        directory.set(address, {
          firstStakedBlock: log.blockNumber,
          corveeCompleted: existing?.corveeCompleted ?? 0,
        });
      }
    }

    for (const log of corveeLogs) {
      const member = log.args.member;

      if (!member) {
        continue;
      }

      const address = getAddress(member);
      const existing = directory.get(address);

      directory.set(address, {
        firstStakedBlock: existing?.firstStakedBlock ?? log.blockNumber,
        corveeCompleted: (existing?.corveeCompleted ?? 0) + 1,
      });
    }

    return directory;
  });
}

async function getJoinedAt(blockNumber: bigint | undefined): Promise<string | null> {
  if (blockNumber === undefined) {
    return null;
  }

  const block = await getCachedValue(
    `directory:block:${blockNumber.toString()}`,
    DIRECTORY_CACHE_TTL_MS,
    () => publicClient.getBlock({ blockNumber })
  );

  return new Date(Number(block.timestamp) * 1000).toISOString();
}

async function getAgentRecord(address: Address): Promise<DirectoryAgentRecord> {
  return getCachedValue(`directory:agent:${address}`, DIRECTORY_CACHE_TTL_MS, async () => {
    const { staking, capabilities } = getDirectoryContracts();

    const [stake, agentCapabilities] = await Promise.all([
      publicClient.readContract({
        address: staking,
        abi: STAKING_ABI,
        functionName: 'stakes',
        args: [address],
      }),
      publicClient.readContract({
        address: capabilities,
        abi: CAPABILITY_REGISTRY_ABI,
        functionName: 'getCapabilities',
        args: [address],
      }),
    ]);

    const [amount, consecutiveDays, lastConfirmationDay, active] = stake;

    return {
      address,
      verified: Boolean(active) && amount > 0n,
      trustScore: calculateTrustScore(consecutiveDays),
      lastActive: Number(lastConfirmationDay),
      capabilities: [...agentCapabilities],
    };
  });
}

export async function listDirectoryAgents(): Promise<DirectoryAgent[]> {
  const eventIndex = await getEventIndex();
  const addresses = [...eventIndex.keys()];
  const agents = await Promise.all(addresses.map((address) => getAgentRecord(address)));

  return agents.filter((agent) => agent.verified);
}

export async function getDirectoryAgentProfile(
  rawAddress: string
): Promise<DirectoryAgentProfile> {
  if (!isAddress(rawAddress)) {
    throw new Error(`Invalid agent address: ${rawAddress}`);
  }

  const address = getAddress(rawAddress);
  const [eventIndex, agent] = await Promise.all([
    getEventIndex(),
    getAgentRecord(address),
  ]);
  const metadata = eventIndex.get(address);

  return {
    ...agent,
    joinedAt: await getJoinedAt(metadata?.firstStakedBlock),
    corveeCompleted: metadata?.corveeCompleted ?? 0,
  };
}
