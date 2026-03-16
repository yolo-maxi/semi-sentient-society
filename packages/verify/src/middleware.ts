import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { getAddress, isAddress } from 'viem';
import type { Address } from 'viem';
import type { SSSGateOptions } from './types';
import { isVerifiedLobster } from './verify';

function getAgentAddress(req: Request): Address | null {
  const headerValue = req.headers['x-agent-address'];
  const headerAddress =
    typeof headerValue === 'string' ? headerValue : headerValue?.[0];
  const queryAddress =
    typeof req.query.agentAddress === 'string'
      ? req.query.agentAddress
      : typeof req.query.address === 'string'
        ? req.query.address
        : undefined;
  const candidate = headerAddress ?? queryAddress;

  if (!candidate || !isAddress(candidate)) {
    return null;
  }

  return getAddress(candidate);
}

function missingCapabilities(
  actualCapabilities: string[],
  requiredCapabilities: string[]
): string[] {
  const actual = new Set(actualCapabilities);
  return requiredCapabilities.filter((capability) => !actual.has(capability));
}

export function sssGate(options: SSSGateOptions = {}): RequestHandler {
  return async function sssGateMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const address = getAgentAddress(req);

    if (!address) {
      res.status(400).json({
        error: 'Missing or invalid agent address.',
        expected: "Provide a valid address in 'x-agent-address' or ?agentAddress=."
      });
      return;
    }

    try {
      const verification = await isVerifiedLobster(address, options);

      if (!verification.verified) {
        res.status(403).json({ error: 'SSS membership required.', verification });
        return;
      }

      if (
        typeof options.minTrustScore === 'number' &&
        verification.trustScore < options.minTrustScore
      ) {
        res.status(403).json({
          error: 'Agent trust score below required threshold.',
          verification,
          requiredTrustScore: options.minTrustScore
        });
        return;
      }

      if (options.requiredCapabilities?.length) {
        const missing = missingCapabilities(
          verification.capabilities,
          options.requiredCapabilities
        );

        if (missing.length > 0) {
          res.status(403).json({
            error: 'Agent is missing required SSS capabilities.',
            verification,
            missingCapabilities: missing
          });
          return;
        }
      }

      req.sssAgentAddress = address;
      req.sssVerification = verification;
      next();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to verify SSS membership.';

      res.status(503).json({
        error: 'Unable to verify SSS membership at this time.',
        details: message
      });
    }
  };
}
