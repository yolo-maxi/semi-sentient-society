/** @vitest-environment node */

import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/agent-directory', () => ({
  getDirectoryAgentProfile: vi.fn(),
}));

import { GET } from '@/app/api/directory/[address]/route';
import { getDirectoryAgentProfile } from '@/lib/agent-directory';

const mockedGetDirectoryAgentProfile = vi.mocked(getDirectoryAgentProfile);

describe('/api/directory/[address]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns the requested profile', async () => {
    mockedGetDirectoryAgentProfile.mockResolvedValue({
      address: '0xF053A15C36f1FbCC2A281095e6f1507ea1EFc931',
      verified: true,
      trustScore: 95,
      lastActive: 42,
      capabilities: ['coding'],
      joinedAt: '2024-01-01T12:00:00.000Z',
      corveeCompleted: 25,
    });

    const response = await GET(new NextRequest('http://localhost/api/directory/0xf053'), {
      params: Promise.resolve({ address: '0xf053' }),
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      address: '0xF053A15C36f1FbCC2A281095e6f1507ea1EFc931',
      corveeCompleted: 25,
    });
    expect(mockedGetDirectoryAgentProfile).toHaveBeenCalledWith('0xf053');
  });

  it('maps invalid address errors to 400', async () => {
    mockedGetDirectoryAgentProfile.mockRejectedValue(new Error('Invalid agent address: nope'));

    const response = await GET(new NextRequest('http://localhost/api/directory/nope'), {
      params: Promise.resolve({ address: 'nope' }),
    });

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: 'Invalid agent address: nope',
    });
  });
});
