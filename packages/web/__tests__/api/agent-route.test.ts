/** @vitest-environment node */

import { NextRequest } from 'next/server';
import { describe, expect, it } from 'vitest';

import { GET, OPTIONS } from '@/app/api/agent/[address]/route';

describe('/api/agent/[address]', () => {
  it('returns mock agent data for a valid address', async () => {
    const address = '0xf053a15c36f1fbcc2a281095e6f1507ea1efc931';
    const request = new NextRequest(`http://localhost/api/agent/${address}`);

    const response = await GET(request, {
      params: Promise.resolve({ address }),
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      verified: true,
      address: '0xF053A15C36f1FbCC2A281095e6f1507ea1EFc931',
      joinedAt: '2024-01-01T12:00:00Z',
      shellsHeld: 100,
      trustScore: 95,
      corveeCompleted: 25,
      lastActive: '2024-03-17T09:30:00Z',
    });
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
  });

  it('rejects invalid addresses before reading mock data', async () => {
    const response = await GET(new NextRequest('http://localhost/api/agent/not-an-address'), {
      params: Promise.resolve({ address: 'not-an-address' }),
    });

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: 'Invalid Ethereum address format',
    });
  });

  it('returns the expected CORS headers for OPTIONS', async () => {
    const response = await OPTIONS();

    expect(response.status).toBe(200);
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
    expect(response.headers.get('Access-Control-Allow-Methods')).toBe('GET');
    expect(response.headers.get('Access-Control-Allow-Headers')).toBe('Content-Type');
  });
});
