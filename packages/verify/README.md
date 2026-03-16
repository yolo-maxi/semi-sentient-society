# @sss/verify

SSS auth middleware for verifying Semi-Sentients Society membership on Base.

## Features

- Verifies whether an address has an active SSS stake
- Reads agent capabilities from the SSS capability registry
- Computes a `trustScore` from consecutive corvee days on a 0-100 scale
- Exposes an Express middleware gate for protected routes
- Uses `viem` for contract reads and defaults to the Base chain

## Installation

```bash
npm install @sss/verify viem express
```

## Configuration

The package defaults to the Base chain and Base public RPC. You still need to provide the SSS contract addresses either through options or environment variables:

```bash
export SSS_STAKING_CONTRACT=0x...
export SSS_CAPABILITIES_CONTRACT=0x...
```

Optional:

```bash
export SSS_BASE_RPC_URL=https://mainnet.base.org
```

## Usage

### Core verification

```ts
import { isVerifiedLobster } from '@sss/verify';

const result = await isVerifiedLobster('0x1234...abcd', {
  contractAddresses: {
    staking: '0xStakingContract...',
    capabilities: '0xCapabilityRegistry...'
  }
});

console.log(result);
// {
//   verified: true,
//   trustScore: 87,
//   lastActive: 19742,
//   capabilities: ['dispatch', 'sign', 'relay']
// }
```

### Express middleware

```ts
import express from 'express';
import { sssGate } from '@sss/verify';

const app = express();

app.use(
  '/agents',
  sssGate({
    minTrustScore: 60,
    requiredCapabilities: ['dispatch'],
    contractAddresses: {
      staking: '0xStakingContract...',
      capabilities: '0xCapabilityRegistry...'
    }
  })
);

app.get('/agents/me', (req, res) => {
  res.json({
    address: req.sssAgentAddress,
    verification: req.sssVerification
  });
});
```

The middleware reads the agent address from:

- `x-agent-address` request header
- `?agentAddress=0x...` query parameter

### Custom viem client

```ts
import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';
import { isVerifiedLobster } from '@sss/verify';

const client = createPublicClient({
  chain: base,
  transport: http('https://your-base-rpc.example')
});

const result = await isVerifiedLobster('0x1234...abcd', {
  publicClient: client,
  contractAddresses: {
    staking: '0xStakingContract...',
    capabilities: '0xCapabilityRegistry...'
  }
});
```

## API

### `isVerifiedLobster(address, options?)`

Returns:

```ts
type VerificationResult = {
  verified: boolean;
  trustScore: number;
  lastActive: number;
  capabilities: string[];
};
```

Verification rules:

- `verified` is `true` when the staking record is active and has a non-zero amount
- `trustScore` is derived from `consecutiveDays`, scaled linearly from 0 to 100 and capped at 30 days
- `lastActive` is the raw `lastConfirmationDay` value returned by the staking contract

### `sssGate(options?)`

Options:

```ts
type SSSGateOptions = {
  minTrustScore?: number;
  requiredCapabilities?: string[];
  contractAddresses?: {
    staking: `0x${string}`;
    capabilities: `0x${string}`;
  };
};
```

The middleware rejects requests when:

- no valid agent address is supplied
- the address does not have an active SSS stake
- the `trustScore` is below `minTrustScore`
- one or more `requiredCapabilities` are missing

## Development

```bash
npm run build
```
