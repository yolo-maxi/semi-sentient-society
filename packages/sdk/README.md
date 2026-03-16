# @sss/sdk

Unified TypeScript SDK for SSS verification, directory queries, and capability management.

## Install

```bash
npm install @sss/sdk viem
```

## Usage

```ts
import { SSSClient } from '@sss/sdk';

const client = new SSSClient({
  rpcUrl: 'https://mainnet.base.org',
  chainId: 8453,
  contracts: {
    staking: '0x0000000000000000000000000000000000000001',
    capabilities: '0x0000000000000000000000000000000000000002',
    directory: '0x0000000000000000000000000000000000000003'
  }
});

const result = await client.verify('0x1111111111111111111111111111111111111111');
console.log(result.verified, result.trustScore, result.capabilities);
```

## API

### `new SSSClient(options)`

Defaults to Base mainnet (`8453`). Contract addresses can be passed directly or via:

- `SSS_STAKING_CONTRACT`
- `SSS_CAPABILITIES_CONTRACT`
- `SSS_DIRECTORY_CONTRACT`
- `SSS_BASE_RPC_URL`

### `client.verify(address)`

Returns:

```ts
{
  verified: boolean;
  trustScore: number;
  lastActive: number;
  capabilities: string[];
}
```

### `client.directory.search(params)`

```ts
const search = await client.directory.search({
  capability: 'payments',
  minTrustScore: 60,
  limit: 10,
  offset: 0
});
```

Returns `{ agents, total }`.

### `client.directory.getAgent(address)`

Returns a single `AgentProfile`.

### `client.capabilities.get(address)`

Returns `string[]`.

### `client.capabilities.set(capabilities, signer)`

Writes the full capability list and returns a transaction hash.

### `client.capabilities.add(capability, signer)`

Appends a capability and returns a transaction hash.

### `client.capabilities.remove(capability, signer)`

Removes a capability and returns a transaction hash.

## Contract interface assumptions

This package uses minimal ABIs and assumes the following contract methods exist:

- `staking.stakes(address)`
- `capabilities.getCapabilities(address)`
- `capabilities.setCapabilities(string[])`
- `capabilities.addCapability(string)`
- `capabilities.removeCapability(string)`
- `directory.searchAgents(string,uint256,uint256,uint256)`
- `directory.getAgent(address)`

If your deployed directory contract uses different function names or tuple layouts, update the ABI constants in `src/directory.ts`.
