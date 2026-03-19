import { NextResponse } from 'next/server';
import { rateLimiter } from '../../../../lib/rate-limiter';
import {
  buildMockVerificationRecord,
  isVerificationAddress,
} from '../../../../lib/verification-api';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
} as const;

function jsonResponse(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: CORS_HEADERS,
  });
}

function getRateLimitIdentifier(request: Request, address: string) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const clientIp = forwardedFor?.split(',')[0]?.trim();

  return clientIp ? `verify:${clientIp}` : `verify:${address.toLowerCase()}`;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;
    const isAllowed = await rateLimiter.check(
      getRateLimitIdentifier(request, address)
    );

    if (!isAllowed) {
      return jsonResponse(
        { error: 'Rate limit exceeded. Please try again later.' },
        429
      );
    }

    if (!isVerificationAddress(address)) {
      return jsonResponse({ error: 'Invalid address format' }, 400);
    }

    return jsonResponse(buildMockVerificationRecord(address));
  } catch (error) {
    console.error('Error fetching verification record:', error);
    return jsonResponse({ error: 'Failed to fetch verification record' }, 500);
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: CORS_HEADERS,
  });
}
