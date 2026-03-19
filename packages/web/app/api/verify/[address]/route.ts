import { NextResponse } from 'next/server';

import { MOCK_AGENTS } from '../../../../data/mock-agents';
import { rateLimiter } from '../../../../lib/rate-limiter';

type VerificationHealthStatus = 'active' | 'expired' | 'unknown';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
} as const;

const ADDRESS_PATTERN = /^0x[a-fA-F0-9]{40}$/;
const RATE_LIMIT_MAX_REQUESTS = 60;
const ACTIVE_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

function buildHeaders(remaining: number) {
  return {
    ...CORS_HEADERS,
    'X-RateLimit-Remaining': String(Math.max(0, remaining)),
  };
}

function jsonResponse(body: unknown, status = 200, remaining = RATE_LIMIT_MAX_REQUESTS) {
  return NextResponse.json(body, {
    status,
    headers: buildHeaders(remaining),
  });
}

function getRateLimitIdentifier(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const clientIp = forwardedFor?.split(',')[0]?.trim();

  return clientIp ? `verify:${clientIp}` : 'verify:anonymous';
}

function formatRelativeTime(dateString: string | null) {
  if (!dateString) {
    return 'unknown';
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return 'unknown';
  }

  const diffSeconds = Math.round((date.getTime() - Date.now()) / 1000);
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ['year', 60 * 60 * 24 * 365],
    ['month', 60 * 60 * 24 * 30],
    ['week', 60 * 60 * 24 * 7],
    ['day', 60 * 60 * 24],
    ['hour', 60 * 60],
    ['minute', 60],
  ];

  for (const [unit, secondsPerUnit] of units) {
    if (Math.abs(diffSeconds) >= secondsPerUnit) {
      return rtf.format(Math.round(diffSeconds / secondsPerUnit), unit);
    }
  }

  return rtf.format(diffSeconds, 'second');
}

function getHealthStatus(lastActive: string | null): VerificationHealthStatus {
  if (!lastActive) {
    return 'unknown';
  }

  const lastActiveDate = new Date(lastActive);

  if (Number.isNaN(lastActiveDate.getTime())) {
    return 'unknown';
  }

  return Date.now() - lastActiveDate.getTime() <= ACTIVE_WINDOW_MS
    ? 'active'
    : 'expired';
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;
    const rateLimit = await rateLimiter.consume(getRateLimitIdentifier(request));

    if (!rateLimit.allowed) {
      return jsonResponse(
        { error: 'Rate limit exceeded. Please try again later.' },
        429,
        rateLimit.remaining
      );
    }

    if (!ADDRESS_PATTERN.test(address)) {
      return jsonResponse({ error: 'Invalid address format' }, 400, rateLimit.remaining);
    }

    const normalizedAddress = address.toLowerCase();
    const agent = MOCK_AGENTS.find(
      (mockAgent) => mockAgent.address.toLowerCase() === normalizedAddress
    );

    if (!agent) {
      return jsonResponse({ error: 'Agent not found' }, 404, rateLimit.remaining);
    }

    return jsonResponse(
      {
        verified: agent.verified,
        joinedAt: agent.joinedAt ?? null,
        healthStatus: getHealthStatus(agent.lastActive),
        trustScore: agent.trustScore,
        memberSince: formatRelativeTime(agent.joinedAt ?? null),
      },
      200,
      rateLimit.remaining
    );
  } catch (error) {
    console.error('Error fetching verification record:', error);
    return jsonResponse({ error: 'Failed to fetch verification record' }, 500);
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: buildHeaders(RATE_LIMIT_MAX_REQUESTS),
  });
}
