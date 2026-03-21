import { NextRequest, NextResponse } from 'next/server';
import { isAddress, getAddress } from 'viem';
import { getDirectoryAgentProfile } from '@/lib/agent-directory';

interface VerificationResponse {
  verified: boolean;
  trustScore: number;
  memberSince: string | null;
  displayName: string;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Cache-Control': 'public, max-age=300', // 5 min cache for third-party integrations
} as const;

// Rate limiting: 120 req/min per IP (higher than reputation API since this is for embedding)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 120;
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

function getRateLimitKey(request: NextRequest): string {
  // Use Vercel's IP detection or fallback to CF-Connecting-IP
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

function checkRateLimit(request: NextRequest): boolean {
  const key = getRateLimitKey(request);
  const now = Date.now();
  
  const entry = rateLimitStore.get(key);
  
  if (!entry || now > entry.resetTime) {
    // Reset window
    rateLimitStore.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (entry.count >= RATE_LIMIT) {
    return false;
  }
  
  entry.count++;
  return true;
}

function getDisplayName(address: string): string {
  // Simple display name - can be expanded with on-chain registry later
  const checksummedAddress = getAddress(address);
  return `Agent ${checksummedAddress.slice(2, 8).toUpperCase()}`;
}

function jsonResponse(body: unknown, status = 200, additionalHeaders = {}) {
  return NextResponse.json(body, {
    status,
    headers: {
      ...CORS_HEADERS,
      ...additionalHeaders,
    },
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    // Rate limiting check
    if (!checkRateLimit(request)) {
      return jsonResponse(
        { error: 'Rate limit exceeded. Maximum 120 requests per minute.' },
        429,
        { 'Retry-After': '60' }
      );
    }

    const { address } = await params;

    // Validate Ethereum address format
    if (!isAddress(address)) {
      return jsonResponse(
        { error: 'Invalid Ethereum address format' },
        400
      );
    }

    // Normalize address to checksummed format
    const checksummedAddress = getAddress(address);

    try {
      // Get real on-chain data
      const agentProfile = await getDirectoryAgentProfile(checksummedAddress);
      
      const response: VerificationResponse = {
        verified: agentProfile.verified,
        trustScore: agentProfile.trustScore,
        memberSince: agentProfile.joinedAt,
        displayName: getDisplayName(checksummedAddress),
      };

      return jsonResponse(response);

    } catch (contractError) {
      // Fall back to simplified mock data for unverified/unknown agents
      console.warn('Contract data unavailable, using mock response:', contractError);

      const fallbackResponse: VerificationResponse = {
        verified: false,
        trustScore: 0,
        memberSince: null,
        displayName: getDisplayName(checksummedAddress),
      };

      return jsonResponse(fallbackResponse, 200, {
        'Cache-Control': 'public, max-age=60', // Shorter cache for fallback data
      });
    }

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch verification status';
    
    console.error('Error fetching verification status:', error);

    return jsonResponse(
      { error: message },
      500
    );
  }
}

// Handle CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: CORS_HEADERS,
  });
}