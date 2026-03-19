/** @vitest-environment node */

import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/healthCertificate', () => ({
  initializeHealthStore: vi.fn(),
  saveHealthStore: vi.fn(),
  recordHealthCheckIn: vi.fn(),
  calculateHealthStatus: vi.fn(),
}));

import { GET, OPTIONS, POST } from '@/app/api/agent/[address]/health/route';
import {
  calculateHealthStatus,
  initializeHealthStore,
  recordHealthCheckIn,
  saveHealthStore,
} from '@/lib/healthCertificate';

const mockedInitializeHealthStore = vi.mocked(initializeHealthStore);
const mockedSaveHealthStore = vi.mocked(saveHealthStore);
const mockedRecordHealthCheckIn = vi.mocked(recordHealthCheckIn);
const mockedCalculateHealthStatus = vi.mocked(calculateHealthStatus);

describe('/api/agent/[address]/health', () => {
  const address = '0xf053a15c36f1fbcc2a281095e6f1507ea1efc931';
  const checksummedAddress = '0xF053A15C36f1FbCC2A281095e6f1507ea1EFc931';

  beforeEach(() => {
    vi.clearAllMocks();
    mockedInitializeHealthStore.mockResolvedValue(undefined);
    mockedSaveHealthStore.mockResolvedValue(true);
    mockedRecordHealthCheckIn.mockReturnValue(true);
    mockedCalculateHealthStatus.mockReturnValue({
      address: checksummedAddress,
      lastCheckin: 1_700_000_000_000,
      healthStatus: 'healthy',
      streakDays: 4,
      missedWindows: 0,
    });
  });

  it('records a valid health check-in', async () => {
    const request = new NextRequest(`http://localhost/api/agent/${address}/health`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        address,
        timestamp: 1_700_000_000_000,
        signature: '0x1234567890abcdef',
      }),
    });

    const response = await POST(request, {
      params: Promise.resolve({ address }),
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      success: true,
      address: checksummedAddress,
      timestamp: 1_700_000_000_000,
      message: 'Health check-in recorded successfully',
    });
    expect(mockedRecordHealthCheckIn).toHaveBeenCalledWith({
      address: checksummedAddress,
      timestamp: 1_700_000_000_000,
      signature: '0x1234567890abcdef',
    });
    expect(mockedSaveHealthStore).toHaveBeenCalledOnce();
  });

  it('rejects mismatched body and route addresses', async () => {
    const response = await POST(
      new NextRequest(`http://localhost/api/agent/${address}/health`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          address: '0x1234567890abcdef1234567890abcdef12345678',
          timestamp: 1_700_000_000_000,
          signature: '0x1234567890abcdef',
        }),
      }),
      {
        params: Promise.resolve({ address }),
      }
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: 'Address in URL does not match address in request body',
    });
  });

  it('returns current health state for a valid GET request', async () => {
    const response = await GET(new NextRequest(`http://localhost/api/agent/${address}/health`), {
      params: Promise.resolve({ address }),
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      address: checksummedAddress,
      lastCheckin: 1_700_000_000_000,
      healthStatus: 'healthy',
      streakDays: 4,
      missedWindows: 0,
    });
    expect(mockedCalculateHealthStatus).toHaveBeenCalledWith(checksummedAddress);
  });

  it('returns the expected CORS headers for OPTIONS', async () => {
    const response = await OPTIONS();

    expect(response.status).toBe(200);
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
    expect(response.headers.get('Access-Control-Allow-Methods')).toBe('GET, POST');
  });
});
