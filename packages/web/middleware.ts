import { NextRequest, NextResponse } from 'next/server';

import { hasConfiguredApiKeys, isValidApiKey } from '@/config/api-keys';
import {
  buildCorsHeaders,
  errorResponse,
  getClientIp,
  V1_RATE_LIMIT_MAX_REQUESTS,
  V1_RATE_LIMIT_WINDOW_MS,
} from '@/lib/api/v1';
import { rateLimiter } from '@/lib/rate-limiter';

function withRateLimitHeaders(response: NextResponse, remaining: number, resetTime: number) {
  response.headers.set('X-RateLimit-Limit', String(V1_RATE_LIMIT_MAX_REQUESTS));
  response.headers.set('X-RateLimit-Remaining', String(Math.max(0, remaining)));
  response.headers.set('X-RateLimit-Reset', String(Math.ceil(resetTime / 1000)));
}

export async function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith('/api/v1')) {
    return NextResponse.next();
  }

  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: buildCorsHeaders(),
    });
  }

  const apiKey = request.headers.get('x-api-key');

  if (apiKey) {
    if (!hasConfiguredApiKeys() || !isValidApiKey(apiKey)) {
      return errorResponse(401, 'Invalid API key');
    }
  }

  const rateLimit = await rateLimiter.consume(`api-v1:${getClientIp(request)}`, {
    maxRequests: V1_RATE_LIMIT_MAX_REQUESTS,
    windowMs: V1_RATE_LIMIT_WINDOW_MS,
  });

  if (!rateLimit.allowed) {
    const retryAfter = Math.max(1, Math.ceil((rateLimit.resetTime - Date.now()) / 1000));
    const response = errorResponse(429, 'Rate limit exceeded');

    response.headers.set('Retry-After', String(retryAfter));
    withRateLimitHeaders(response, rateLimit.remaining, rateLimit.resetTime);

    return response;
  }

  const response = NextResponse.next({
    headers: buildCorsHeaders(),
  });

  withRateLimitHeaders(response, rateLimit.remaining, rateLimit.resetTime);

  return response;
}

export const config = {
  matcher: ['/api/v1/:path*'],
};
