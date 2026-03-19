import { NextRequest, NextResponse } from 'next/server';

import { hasConfiguredApiKeys, isValidApiKey } from '@/config/api-keys';
import { buildCorsHeaders, errorResponse, getClientIp } from '@/lib/api/v1';
import { rateLimiter, type RateLimitResult } from '@/lib/rate-limiter';

const ONE_MINUTE_MS = 60 * 1000;

const RATE_LIMIT_RULES = [
  { prefix: '/api/agent', maxRequests: 60, windowMs: ONE_MINUTE_MS, keyPrefix: 'api-agent' },
  { prefix: '/api/verify', maxRequests: 30, windowMs: ONE_MINUTE_MS, keyPrefix: 'api-verify' },
  {
    prefix: '/api/recommend',
    maxRequests: 20,
    windowMs: ONE_MINUTE_MS,
    keyPrefix: 'api-recommend',
  },
  { prefix: '/api/events', maxRequests: 60, windowMs: ONE_MINUTE_MS, keyPrefix: 'api-events' },
  { prefix: '/api', maxRequests: 100, windowMs: ONE_MINUTE_MS, keyPrefix: 'api-default' },
] as const;

function getRateLimitRule(pathname: string) {
  return RATE_LIMIT_RULES.find(
    (rule) => pathname === rule.prefix || pathname.startsWith(`${rule.prefix}/`)
  );
}

function applyRateLimitHeaders(response: NextResponse, rateLimit: RateLimitResult) {
  response.headers.set('X-RateLimit-Limit', String(rateLimit.limit));
  response.headers.set('X-RateLimit-Remaining', String(Math.max(0, rateLimit.remaining)));
  response.headers.set('X-RateLimit-Reset', String(Math.ceil(rateLimit.resetTime / 1000)));
}

function buildTooManyRequestsResponse(rateLimit: RateLimitResult) {
  const response = NextResponse.json(
    {
      error: 'Too many requests',
      retryAfter: rateLimit.retryAfter,
    },
    { status: 429 }
  );

  response.headers.set('Retry-After', String(rateLimit.retryAfter));
  applyRateLimitHeaders(response, rateLimit);

  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/api/v1')) {
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 204,
        headers: buildCorsHeaders(),
      });
    }

    const apiKey = request.headers.get('x-api-key');

    if (apiKey && (!hasConfiguredApiKeys() || !isValidApiKey(apiKey))) {
      return errorResponse(401, 'Invalid API key');
    }
  }

  if (request.method === 'OPTIONS') {
    return NextResponse.next();
  }

  const rule = getRateLimitRule(pathname);

  if (!rule) {
    return NextResponse.next();
  }

  const rateLimit = await rateLimiter.consume(getClientIp(request), {
    maxRequests: rule.maxRequests,
    windowMs: rule.windowMs,
    keyPrefix: rule.keyPrefix,
  });

  if (!rateLimit.allowed) {
    return buildTooManyRequestsResponse(rateLimit);
  }

  const response = pathname.startsWith('/api/v1')
    ? NextResponse.next({
        headers: buildCorsHeaders(),
      })
    : NextResponse.next();

  applyRateLimitHeaders(response, rateLimit);

  return response;
}

export const config = {
  matcher: ['/api/:path*'],
};
