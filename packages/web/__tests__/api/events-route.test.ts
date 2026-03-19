/** @vitest-environment node */

import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('fs', () => ({
  readFileSync: vi.fn(),
}));

import { GET } from '@/app/api/events/route';
import { readFileSync } from 'fs';

const mockedReadFileSync = vi.mocked(readFileSync);

describe('/api/events', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('parses, sorts, and limits JSONL events', async () => {
    mockedReadFileSync.mockReturnValue(
      [
        JSON.stringify({
          event: 'Joined',
          contract: 'Society',
          contractAddress: '0x1',
          args: {},
          blockNumber: '10',
          timestamp: 100,
          txHash: '0xa',
          logIndex: 0,
        }),
        '{invalid json',
        JSON.stringify({
          event: 'CheckedIn',
          contract: 'Health',
          contractAddress: '0x2',
          args: {},
          blockNumber: '11',
          timestamp: 200,
          txHash: '0xb',
          logIndex: 1,
        }),
      ].join('\n')
    );

    const response = await GET(new NextRequest('http://localhost/api/events?limit=1'));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      events: [
        {
          event: 'CheckedIn',
          contract: 'Health',
          contractAddress: '0x2',
          args: {},
          blockNumber: '11',
          timestamp: 200,
          txHash: '0xb',
          logIndex: 1,
        },
      ],
      count: 1,
      limit: 1,
    });
  });

  it('returns an empty list when the events file is unavailable', async () => {
    mockedReadFileSync.mockImplementation(() => {
      throw new Error('missing file');
    });

    const response = await GET(new NextRequest('http://localhost/api/events'));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      events: [],
      count: 0,
      limit: 50,
    });
  });
});
