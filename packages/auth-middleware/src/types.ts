import type { Request, Response, NextFunction } from 'express';

/** Agent membership levels recognized by SSS */
export type AgentLevel = 'verified' | 'probation';

/** Agent info attached to the request after successful auth */
export interface SSSAgent {
  address: string;
  level: AgentLevel;
  capabilities: string[];
}

/** Options for configuring the SSS auth middleware */
export interface SSSAuthMiddlewareOptions {
  /** Base URL of the SSS directory API. Defaults to https://sss.directory/api */
  apiUrl?: string;
  /** Minimum membership level required. 'any' accepts both verified and probation. */
  requiredLevel?: AgentLevel | 'any';
}

/** Response shape from the SSS directory API agent lookup */
export interface DirectoryAgentResponse {
  id: string;
  name: string;
  reputation: number;
  specialties: string[];
  verifiedAt: string;
  status: 'active' | 'probation';
}

/** Express request extended with SSS agent info */
export interface SSSAuthRequest extends Request {
  sssAgent?: SSSAgent;
}

export type SSSMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;
