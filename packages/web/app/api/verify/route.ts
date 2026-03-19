import { NextResponse } from 'next/server';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'X-RateLimit-Remaining': '60',
} as const;

export async function GET() {
  return NextResponse.json(
    {
      name: 'SSS Agent Verification API',
      version: '1.0.0',
      endpoints: {
        docs: '/api/verify',
        verify: '/api/verify/{address}',
      },
      addressFormat: '0x followed by 40 hexadecimal characters',
      response: {
        verified: 'boolean',
        joinedAt: 'ISO date string | null',
        healthStatus: 'active | expired | unknown',
        trustScore: 'number (0-100)',
        memberSince: 'relative time string',
      },
      errors: {
        400: 'Invalid address format',
        404: 'Agent not found',
        429: 'Rate limit exceeded',
      },
    },
    { headers: CORS_HEADERS }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: CORS_HEADERS,
  });
}
