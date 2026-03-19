/** @vitest-environment node */

import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/agent-directory', () => ({
  listDirectoryAgents: vi.fn(),
}));

import { GET } from '@/app/api/directory/route';
import { listDirectoryAgents } from '@/lib/agent-directory';

const mockedListDirectoryAgents = vi.mocked(listDirectoryAgents);

describe('/api/directory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedListDirectoryAgents.mockResolvedValue([
      {
        address: '0xccc',
        verified: true,
        trustScore: 60,
        lastActive: 30,
        capabilities: ['research'],
      },
      {
        address: '0xbbb',
        verified: true,
        trustScore: 90,
        lastActive: 20,
        capabilities: ['coding', 'research'],
      },
      {
        address: '0xaaa',
        verified: true,
        trustScore: 90,
        lastActive: 10,
        capabilities: ['design'],
      },
    ]);
  });

  it('filters, sorts, and paginates directory agents', async () => {
    const request = new NextRequest(
      'http://localhost/api/directory?capability=research&minTrustScore=70&limit=1&offset=0&sort=trustScore'
    );

    const response = await GET(request);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      agents: [
        {
          address: '0xbbb',
          verified: true,
          trustScore: 90,
          lastActive: 20,
          capabilities: ['coding', 'research'],
        },
      ],
      total: 1,
      page: 1,
    });
  });

  it('sorts by recent activity when requested', async () => {
    const response = await GET(
      new NextRequest('http://localhost/api/directory?sort=lastActive&limit=3')
    );

    expect(response.status).toBe(200);
    const body = await response.json();

    expect(body.agents.map((agent: { address: string }) => agent.address)).toEqual([
      '0xccc',
      '0xbbb',
      '0xaaa',
    ]);
  });

  it('returns 400 for an invalid sort parameter', async () => {
    const response = await GET(new NextRequest('http://localhost/api/directory?sort=name'));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: 'Invalid sort query parameter.',
    });
  });
});
