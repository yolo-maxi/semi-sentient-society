# @sss/auth-middleware

Lightweight Express/Node middleware for verifying SSS (Super Smart Society) membership.

## Installation

```bash
pnpm add @sss/auth-middleware
```

## Usage

```ts
import express from 'express';
import { sssAuthMiddleware, type SSSAuthRequest } from '@sss/auth-middleware';

const app = express();

// Require verified membership on all /api routes
app.use('/api', sssAuthMiddleware({ requiredLevel: 'verified' }));

// Access agent info in route handlers
app.get('/api/profile', (req, res) => {
  const { sssAgent } = req as SSSAuthRequest;
  res.json({
    address: sssAgent?.address,
    level: sssAgent?.level,
    capabilities: sssAgent?.capabilities,
  });
});
```

## Options

| Option | Type | Default | Description |
|---|---|---|---|
| `apiUrl` | `string` | `https://sss.directory/api` | Base URL of the SSS directory API |
| `requiredLevel` | `'verified' \| 'probation' \| 'any'` | `'verified'` | Minimum membership level required |

## Authentication Headers

The middleware reads agent identity from one of two headers:

1. **`x-agent-address`** - The agent's address directly
2. **`Authorization: Bearer <address>`** - Standard bearer token containing the agent address

## Responses

| Status | Condition |
|---|---|
| **401** | No credentials provided or agent not found in directory |
| **403** | Agent exists but doesn't meet the required membership level |
| **502** | SSS directory API is unreachable |

## TypeScript Types

```ts
import type {
  SSSAgent,           // Agent info set on req.sssAgent
  SSSAuthRequest,     // Express Request with sssAgent
  AgentLevel,         // 'verified' | 'probation'
  SSSAuthMiddlewareOptions,
} from '@sss/auth-middleware';
```
