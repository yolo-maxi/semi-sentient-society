import { NextRequest, NextResponse } from 'next/server';

import { getClientIp } from '@/lib/api/v1';

// --- Types ---

export interface RateLimitConfig {
  /** Maximum number of requests allowed per window. Default: 100 */
  maxRequests?: number;
  /** Window size in milliseconds. Default: 60_000 (60 seconds) */
  windowMs?: number;
  /** Optional prefix to namespace limits (e.g. per-route). */
  keyPrefix?: string;
}

export interface RateLimitResponse {
  success: boolean;
  limit: number;
  remaining: number;
  /** Unix timestamp (ms) when the current window resets. */
  reset: number;
}

// --- Storage ---

interface TokenBucket {
  timestamps: number[];
}

const store = new Map<string, TokenBucket>();
let lastCleanup = 0;
const CLEANUP_INTERVAL_MS = 30_000;
const STALE_THRESHOLD_MS = 5 * 60 * 1000;

function cleanup(now: number, windowMs: number) {
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  for (const [key, bucket] of store) {
    const cutoff = now - Math.max(windowMs, STALE_THRESHOLD_MS);
    const active = bucket.timestamps.filter((t) => t > cutoff);
    if (active.length === 0) {
      store.delete(key);
    } else {
      bucket.timestamps = active;
    }
  }
}

// --- Core ---

const DEFAULT_MAX_REQUESTS = 100;
const DEFAULT_WINDOW_MS = 60_000;

/**
 * Check and consume a rate-limit token for the given identifier.
 *
 * @example
 * ```ts
 * import { rateLimit, getIp } from '@/lib/rate-limit';
 *
 * export async function POST(req: NextRequest) {
 *   const { success, limit, remaining, reset } = rateLimit(getIp(req), {
 *     maxRequests: 10,
 *     windowMs: 60_000,
 *   });
 *
 *   if (!success) {
 *     return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
 *   }
 *
 *   // ... handle request
 * }
 * ```
 */
export function rateLimit(
  identifier: string,
  config: RateLimitConfig = {}
): RateLimitResponse {
  const maxRequests = config.maxRequests ?? DEFAULT_MAX_REQUESTS;
  const windowMs = config.windowMs ?? DEFAULT_WINDOW_MS;
  const key = config.keyPrefix ? `${config.keyPrefix}:${identifier}` : identifier;

  const now = Date.now();
  cleanup(now, windowMs);

  const windowStart = now - windowMs;
  const bucket = store.get(key);
  const timestamps = bucket
    ? bucket.timestamps.filter((t) => t > windowStart)
    : [];

  if (timestamps.length >= maxRequests) {
    const reset = timestamps[0] + windowMs;
    store.set(key, { timestamps });
    return { success: false, limit: maxRequests, remaining: 0, reset };
  }

  timestamps.push(now);
  store.set(key, { timestamps });

  const reset = timestamps[0] + windowMs;
  return {
    success: true,
    limit: maxRequests,
    remaining: maxRequests - timestamps.length,
    reset,
  };
}

// --- IP helper ---

/**
 * Extract the client IP from a Next.js request.
 * Uses x-forwarded-for, falls back to x-real-ip, then 'anonymous'.
 */
export function getIp(request: NextRequest): string {
  return getClientIp(request);
}

// --- Higher-order wrapper ---

type RouteHandler = (
  request: NextRequest,
  context?: unknown
) => Promise<NextResponse> | NextResponse;

/**
 * Wrap a Next.js route handler with rate limiting.
 * Returns a 429 JSON response with Retry-After header when the limit is hit.
 *
 * @example
 * ```ts
 * import { withRateLimit } from '@/lib/rate-limit';
 *
 * // 10 requests per 30 seconds
 * export const POST = withRateLimit(
 *   async (req) => {
 *     const body = await req.json();
 *     return NextResponse.json({ ok: true });
 *   },
 *   { maxRequests: 10, windowMs: 30_000, keyPrefix: 'my-route' }
 * );
 * ```
 */
export function withRateLimit(
  handler: RouteHandler,
  config: RateLimitConfig = {}
): RouteHandler {
  return async (request: NextRequest, context?: unknown) => {
    const ip = getIp(request);
    const result = rateLimit(ip, config);

    const headers: Record<string, string> = {
      'X-RateLimit-Limit': String(result.limit),
      'X-RateLimit-Remaining': String(result.remaining),
      'X-RateLimit-Reset': String(Math.ceil(result.reset / 1000)),
    };

    if (!result.success) {
      const retryAfter = Math.max(1, Math.ceil((result.reset - Date.now()) / 1000));
      return NextResponse.json(
        { error: 'Too many requests', retryAfter },
        {
          status: 429,
          headers: { ...headers, 'Retry-After': String(retryAfter) },
        }
      );
    }

    const response = await handler(request, context);

    for (const [key, value] of Object.entries(headers)) {
      response.headers.set(key, value);
    }

    return response;
  };
}
