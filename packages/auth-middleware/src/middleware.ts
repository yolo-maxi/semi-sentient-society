import type { Request, Response, NextFunction } from 'express';
import type {
  SSSAuthMiddlewareOptions,
  SSSAuthRequest,
  SSSAgent,
  AgentLevel,
  DirectoryAgentResponse,
  SSSMiddleware,
} from './types';

const DEFAULT_API_URL = 'https://sss.directory/api';

/**
 * Extract agent address from request headers.
 * Checks x-agent-address first, then falls back to Authorization Bearer token.
 */
function extractAddress(req: Request): string | null {
  const agentAddress = req.headers['x-agent-address'];
  if (typeof agentAddress === 'string' && agentAddress.length > 0) {
    return agentAddress;
  }

  const authHeader = req.headers['authorization'];
  if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7).trim();
    if (token.length > 0) return token;
  }

  return null;
}

/**
 * Map the directory API agent status to an AgentLevel.
 */
function statusToLevel(status: DirectoryAgentResponse['status']): AgentLevel {
  return status === 'active' ? 'verified' : 'probation';
}

/**
 * Check whether the agent's level satisfies the required level.
 */
function meetsRequiredLevel(
  agentLevel: AgentLevel,
  requiredLevel: AgentLevel | 'any'
): boolean {
  if (requiredLevel === 'any') return true;
  if (requiredLevel === 'probation') return true; // both verified and probation meet 'probation'
  return agentLevel === 'verified';
}

/**
 * Look up an agent in the SSS directory API.
 * In production this calls the real API; the fetch is mockable for testing.
 */
async function lookupAgent(
  address: string,
  apiUrl: string
): Promise<DirectoryAgentResponse | null> {
  const url = `${apiUrl}/agents/${encodeURIComponent(address)}`;

  const res = await fetch(url);
  if (!res.ok) return null;

  const data = (await res.json()) as DirectoryAgentResponse;
  return data;
}

/**
 * Express middleware factory for verifying SSS membership.
 *
 * @example
 * ```ts
 * import { sssAuthMiddleware } from '@sss/auth-middleware';
 *
 * app.use('/protected', sssAuthMiddleware({ requiredLevel: 'verified' }));
 * ```
 */
export function sssAuthMiddleware(
  options: SSSAuthMiddlewareOptions = {}
): SSSMiddleware {
  const apiUrl = options.apiUrl ?? DEFAULT_API_URL;
  const requiredLevel = options.requiredLevel ?? 'verified';

  return (req: Request, res: Response, next: NextFunction): void => {
    const address = extractAddress(req);
    if (!address) {
      res
        .status(401)
        .json({ error: 'Missing agent credentials. Provide x-agent-address header or Authorization Bearer token.' });
      return;
    }

    lookupAgent(address, apiUrl)
      .then((agent) => {
        if (!agent) {
          res.status(401).json({ error: 'Agent not found in SSS directory.' });
          return;
        }

        const level = statusToLevel(agent.status);

        if (!meetsRequiredLevel(level, requiredLevel)) {
          res.status(403).json({
            error: `Insufficient membership level. Required: ${requiredLevel}, current: ${level}.`,
          });
          return;
        }

        const sssAgent: SSSAgent = {
          address,
          level,
          capabilities: agent.specialties,
        };

        (req as SSSAuthRequest).sssAgent = sssAgent;
        next();
      })
      .catch(() => {
        res.status(502).json({ error: 'Failed to reach SSS directory API.' });
      });
  };
}
