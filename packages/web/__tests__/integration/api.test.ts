/** @vitest-environment node */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { GET as getVerificationStatus } from '@/app/api/verify/[address]/route';
import { rateLimiter } from '@/lib/rate-limiter';

vi.mock('@/lib/rate-limiter', () => ({
  rateLimiter: {
    check: vi.fn(),
    consume: vi.fn(),
  },
}));

const mockedRateLimiter = vi.mocked(rateLimiter);

describe('SSS verification flow APIs', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-17T12:00:00.000Z'));
    vi.clearAllMocks();
    mockedRateLimiter.check.mockResolvedValue(true);
    mockedRateLimiter.consume.mockResolvedValue({
      allowed: true,
      remaining: 59,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns the expected verification status for a valid address', async () => {
    const address = '0xf053a15c36f1fbcc2a281095e6f1507ea1efc931';
    const request = new NextRequest(`http://localhost/api/verify/${address}`);
    const response = await getVerificationStatus(request, {
      params: Promise.resolve({ address }),
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      verified: true,
      joinedAt: '2024-01-01T12:00:00Z',
      healthStatus: 'expired',
      trustScore: 95,
      memberSince: '2 years ago',
    });
    expect(response.headers.get('x-ratelimit-remaining')).toBe('59');
    expect(mockedRateLimiter.consume).toHaveBeenCalledWith('verify:anonymous');
  });

  it('rejects invalid verification addresses', async () => {
    const request = new NextRequest('http://localhost/api/verify/not-an-address');
    const response = await getVerificationStatus(request, {
      params: Promise.resolve({ address: 'not-an-address' }),
    });

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'Invalid address format' });
    expect(response.headers.get('x-ratelimit-remaining')).toBe('59');
  });

  it('returns 404 for an unknown agent', async () => {
    const address = '0x1111111111111111111111111111111111111111';
    const request = new NextRequest(`http://localhost/api/verify/${address}`);
    const response = await getVerificationStatus(request, {
      params: Promise.resolve({ address }),
    });

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: 'Agent not found' });
  });

  it('stores and returns recommendations', async () => {
    const originalCwd = process.cwd();
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sss-recommend-'));

    try {
      process.chdir(tempDir);
      vi.resetModules();

      const {
        GET: getRecommendations,
        POST: postRecommendation,
      } = await import('@/app/api/recommend/route');

      const postRequest = new NextRequest('http://localhost/api/recommend', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-forwarded-for': '203.0.113.9',
        },
        body: JSON.stringify({
          name: 'Ocean Vael',
          message: 'Verified operator with treasury-aligned contribution history.',
          capabilities: 'research, code-review',
          wallet: '0xf053a15c36f1fbcc2a281095e6f1507ea1efc931',
        }),
      });

      const postResponse = await postRecommendation(postRequest);
      const postBody = await postResponse.json();

      expect(postResponse.status).toBe(200);
      expect(postBody.ok).toBe(true);
      expect(postBody.id).toEqual(expect.any(String));

      const getResponse = await getRecommendations();
      const getBody = await getResponse.json();

      expect(getResponse.status).toBe(200);
      expect(getBody.count).toBe(1);
      expect(getBody.recommendations).toHaveLength(1);
      expect(getBody.recommendations[0]).toMatchObject({
        name: 'Ocean Vael',
        message: 'Verified operator with treasury-aligned contribution history.',
        capabilities: 'research, code-review',
        wallet: '0xf053a15c36f1fbcc2a281095e6f1507ea1efc931',
        ip: '203.0.113.9',
      });
    } finally {
      process.chdir(originalCwd);
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });
});
