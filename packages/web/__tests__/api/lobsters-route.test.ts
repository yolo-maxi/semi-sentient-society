/** @vitest-environment node */

import { describe, expect, it } from 'vitest';

import { GET, OPTIONS } from '@/app/api/lobsters/route';
import { MOCK_AGENTS } from '@/data/mock-agents';

describe('/api/lobsters', () => {
  it('returns verified mock lobsters with totals', async () => {
    const response = await GET();

    expect(response.status).toBe(200);
    const body = await response.json();

    expect(body.total).toBe(MOCK_AGENTS.length);
    expect(body.lobsters).toHaveLength(MOCK_AGENTS.length);
    expect(body.lobsters.every((agent: { verified: boolean }) => agent.verified)).toBe(true);
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
  });

  it('returns the expected CORS headers for OPTIONS', async () => {
    const response = await OPTIONS();

    expect(response.status).toBe(200);
    expect(response.headers.get('Access-Control-Allow-Methods')).toBe('GET, OPTIONS');
  });
});
