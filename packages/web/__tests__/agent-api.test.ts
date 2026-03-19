/**
 * @jest-environment node
 */

import { NextRequest } from 'next/server';
import { GET, OPTIONS } from '../app/api/agent/[address]/route';

describe('/api/agent/[address]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should return agent data for valid address with mock data', async () => {
      const request = new NextRequest('http://localhost/api/agent/0xf053a15c36f1fbcc2a281095e6f1507ea1efc931');
      const params = Promise.resolve({ address: '0xf053a15c36f1fbcc2a281095e6f1507ea1efc931' });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        verified: true,
        address: '0xF053A15C36f1FbCC2A281095e6f1507ea1EFc931',
        joinedAt: '2024-01-01T12:00:00Z',
        shellsHeld: 100,
        trustScore: 95,
        corveeCompleted: 25,
        lastActive: '2024-03-17T09:30:00Z',
      });

      // Check CORS headers
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      expect(response.headers.get('Access-Control-Allow-Methods')).toBe('GET');
      expect(response.headers.get('Access-Control-Allow-Headers')).toBe('Content-Type');
    });

    it('should return default data for unknown address', async () => {
      const request = new NextRequest('http://localhost/api/agent/0x1111111111111111111111111111111111111111');
      const params = Promise.resolve({ address: '0x1111111111111111111111111111111111111111' });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        verified: false,
        address: '0x1111111111111111111111111111111111111111',
        joinedAt: null,
        shellsHeld: 0,
        trustScore: 0,
        corveeCompleted: 0,
        lastActive: null,
      });
    });

    it('should return error for invalid address format', async () => {
      const request = new NextRequest('http://localhost/api/agent/invalid-address');
      const params = Promise.resolve({ address: 'invalid-address' });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({
        error: 'Invalid Ethereum address format',
      });

      // Check CORS headers are still present
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
    });

    it('should handle mixed case addresses correctly', async () => {
      const request = new NextRequest('http://localhost/api/agent/0xF053a15C36F1fBcC2a281095E6F1507eA1efC931');
      const params = Promise.resolve({ address: '0xF053a15C36F1fBcC2a281095E6F1507eA1efC931' });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      // Should return checksummed address
      expect(data.address).toBe('0xF053A15C36f1FbCC2A281095e6f1507ea1EFc931');
      expect(data.verified).toBe(true);
    });
  });

  describe('OPTIONS (CORS preflight)', () => {
    it('should return correct CORS headers for preflight requests', async () => {
      const response = await OPTIONS();

      expect(response.status).toBe(200);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      expect(response.headers.get('Access-Control-Allow-Methods')).toBe('GET');
      expect(response.headers.get('Access-Control-Allow-Headers')).toBe('Content-Type');
    });
  });
});
