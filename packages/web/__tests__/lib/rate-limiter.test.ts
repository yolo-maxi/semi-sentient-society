/** @vitest-environment node */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { rateLimiter } from '@/lib/rate-limiter';

describe('rateLimiter', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-17T12:00:00.000Z'));
    rateLimiter.reset();
  });

  afterEach(() => {
    rateLimiter.reset();
    vi.useRealTimers();
  });

  it('enforces a sliding window per key prefix', async () => {
    const options = {
      maxRequests: 2,
      windowMs: 60_000,
      keyPrefix: 'verify',
    };

    const first = await rateLimiter.consume('203.0.113.5', options);
    const second = await rateLimiter.consume('203.0.113.5', options);
    const third = await rateLimiter.consume('203.0.113.5', options);

    expect(first.allowed).toBe(true);
    expect(second.allowed).toBe(true);
    expect(third.allowed).toBe(false);
    expect(third.retryAfter).toBe(60);

    vi.advanceTimersByTime(30_000);
    const stillBlocked = await rateLimiter.consume('203.0.113.5', options);
    expect(stillBlocked.allowed).toBe(false);

    vi.advanceTimersByTime(30_001);
    const unblocked = await rateLimiter.consume('203.0.113.5', options);
    expect(unblocked.allowed).toBe(true);
  });

  it('tracks different route buckets independently', async () => {
    const agent = await rateLimiter.consume('203.0.113.5', {
      maxRequests: 1,
      windowMs: 60_000,
      keyPrefix: 'agent',
    });
    const verify = await rateLimiter.consume('203.0.113.5', {
      maxRequests: 1,
      windowMs: 60_000,
      keyPrefix: 'verify',
    });

    expect(agent.allowed).toBe(true);
    expect(verify.allowed).toBe(true);
  });
});
