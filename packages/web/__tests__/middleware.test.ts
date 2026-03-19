/** @vitest-environment node */

import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/config/api-keys', () => ({
  hasConfiguredApiKeys: vi.fn(() => false),
  isValidApiKey: vi.fn(() => false),
}));

vi.mock('@/lib/rate-limiter', () => ({
  rateLimiter: {
    consume: vi.fn(),
  },
}));

import { middleware } from '@/middleware';
import { hasConfiguredApiKeys, isValidApiKey } from '@/config/api-keys';
import { rateLimiter } from '@/lib/rate-limiter';

const mockedHasConfiguredApiKeys = vi.mocked(hasConfiguredApiKeys);
const mockedIsValidApiKey = vi.mocked(isValidApiKey);
const mockedRateLimiter = vi.mocked(rateLimiter);

describe('API middleware rate limiting', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedHasConfiguredApiKeys.mockReturnValue(false);
    mockedIsValidApiKey.mockReturnValue(false);
    mockedRateLimiter.consume.mockResolvedValue({
      allowed: true,
      limit: 100,
      remaining: 99,
      resetTime: Date.now() + 60_000,
      retryAfter: 60,
    });
  });

  it('applies the agent route limit', async () => {
    await middleware(
      new NextRequest('http://localhost/api/agent/0xf053a15c36f1fbcc2a281095e6f1507ea1efc931', {
        headers: { 'x-forwarded-for': '203.0.113.10' },
      })
    );

    expect(mockedRateLimiter.consume).toHaveBeenCalledWith('203.0.113.10', {
      maxRequests: 60,
      windowMs: 60_000,
      keyPrefix: 'api-agent',
    });
  });

  it('applies the verify route limit', async () => {
    await middleware(
      new NextRequest('http://localhost/api/verify/0xf053a15c36f1fbcc2a281095e6f1507ea1efc931')
    );

    expect(mockedRateLimiter.consume).toHaveBeenCalledWith('anonymous', {
      maxRequests: 30,
      windowMs: 60_000,
      keyPrefix: 'api-verify',
    });
  });

  it('applies the recommend route limit to the base route', async () => {
    await middleware(new NextRequest('http://localhost/api/recommend'));

    expect(mockedRateLimiter.consume).toHaveBeenCalledWith('anonymous', {
      maxRequests: 20,
      windowMs: 60_000,
      keyPrefix: 'api-recommend',
    });
  });

  it('returns a 429 body and Retry-After header when blocked', async () => {
    mockedRateLimiter.consume.mockResolvedValueOnce({
      allowed: false,
      limit: 20,
      remaining: 0,
      resetTime: Date.now() + 17_000,
      retryAfter: 17,
    });

    const response = await middleware(new NextRequest('http://localhost/api/recommend'));

    expect(response.status).toBe(429);
    await expect(response.json()).resolves.toEqual({
      error: 'Too many requests',
      retryAfter: 17,
    });
    expect(response.headers.get('Retry-After')).toBe('17');
    expect(response.headers.get('X-RateLimit-Limit')).toBe('20');
    expect(response.headers.get('X-RateLimit-Remaining')).toBe('0');
  });

  it('preserves api v1 key validation', async () => {
    mockedHasConfiguredApiKeys.mockReturnValue(true);
    mockedIsValidApiKey.mockReturnValue(false);

    const response = await middleware(
      new NextRequest('http://localhost/api/v1/agents', {
        headers: { 'x-api-key': 'invalid' },
      })
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      error: 'Invalid API key',
      code: 401,
    });
    expect(mockedRateLimiter.consume).not.toHaveBeenCalled();
  });
});
