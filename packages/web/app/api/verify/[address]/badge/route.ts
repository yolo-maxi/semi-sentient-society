import { NextRequest, NextResponse } from 'next/server';
import { isAddress, getAddress } from 'viem';
import { getDirectoryAgentProfile } from '@/lib/agent-directory';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Cache-Control': 'public, max-age=300', // 5 min cache for embedding
} as const;

// Rate limiting: 120 req/min per IP (same as verify endpoint since this is for embedding)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 120;
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

function getRateLimitKey(request: NextRequest): string {
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
    rateLimitStore.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (entry.count >= RATE_LIMIT) {
    return false;
  }
  
  entry.count++;
  return true;
}

function createVerifiedBadge(): string {
  return `
<svg width="140" height="32" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="verified-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#10b981;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#059669;stop-opacity:1" />
    </linearGradient>
    <filter id="shadow">
      <feDropShadow dx="0" dy="1" stdDeviation="2" flood-color="#000000" flood-opacity="0.25"/>
    </filter>
  </defs>
  
  <!-- Background -->
  <rect width="140" height="32" rx="6" fill="url(#verified-gradient)" filter="url(#shadow)"/>
  
  <!-- Lobster emoji icon -->
  <text x="12" y="22" font-family="system-ui, -apple-system, sans-serif" font-size="14" fill="white">🦞</text>
  
  <!-- Text -->
  <text x="32" y="22" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="600" fill="white">Verified Lobster</text>
</svg>`.trim();
}

function createUnverifiedBadge(): string {
  return `
<svg width="120" height="32" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="shadow">
      <feDropShadow dx="0" dy="1" stdDeviation="2" flood-color="#000000" flood-opacity="0.15"/>
    </filter>
  </defs>
  
  <!-- Background -->
  <rect width="120" height="32" rx="6" fill="#6b7280" filter="url(#shadow)"/>
  
  <!-- Question mark icon -->
  <circle cx="16" cy="16" r="8" fill="#9ca3af"/>
  <text x="16" y="21" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="700" fill="white" text-anchor="middle">?</text>
  
  <!-- Text -->
  <text x="32" y="22" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="600" fill="white">Unverified</text>
</svg>`.trim();
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    // Rate limiting check
    if (!checkRateLimit(request)) {
      // Return a simple SVG error for rate limiting
      const errorSvg = `
<svg width="120" height="32" xmlns="http://www.w3.org/2000/svg">
  <rect width="120" height="32" rx="6" fill="#ef4444"/>
  <text x="60" y="22" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="white" text-anchor="middle">Rate Limited</text>
</svg>`.trim();

      return new NextResponse(errorSvg, {
        status: 429,
        headers: {
          ...CORS_HEADERS,
          'Content-Type': 'image/svg+xml',
          'Retry-After': '60',
        },
      });
    }

    const { address } = await params;

    // Validate Ethereum address format
    if (!isAddress(address)) {
      const errorSvg = `
<svg width="120" height="32" xmlns="http://www.w3.org/2000/svg">
  <rect width="120" height="32" rx="6" fill="#ef4444"/>
  <text x="60" y="22" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="white" text-anchor="middle">Invalid Address</text>
</svg>`.trim();

      return new NextResponse(errorSvg, {
        status: 400,
        headers: {
          ...CORS_HEADERS,
          'Content-Type': 'image/svg+xml',
        },
      });
    }

    // Normalize address to checksummed format
    const checksummedAddress = getAddress(address);

    try {
      // Get real on-chain data
      const agentProfile = await getDirectoryAgentProfile(checksummedAddress);
      
      const badgeSvg = agentProfile.verified 
        ? createVerifiedBadge()
        : createUnverifiedBadge();

      return new NextResponse(badgeSvg, {
        status: 200,
        headers: {
          ...CORS_HEADERS,
          'Content-Type': 'image/svg+xml',
        },
      });

    } catch (contractError) {
      // Fall back to unverified badge
      console.warn('Contract data unavailable for badge, showing unverified:', contractError);

      const badgeSvg = createUnverifiedBadge();

      return new NextResponse(badgeSvg, {
        status: 200,
        headers: {
          ...CORS_HEADERS,
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=60', // Shorter cache for fallback
        },
      });
    }

  } catch (error) {
    console.error('Error generating verification badge:', error);

    // Return error badge
    const errorSvg = `
<svg width="120" height="32" xmlns="http://www.w3.org/2000/svg">
  <rect width="120" height="32" rx="6" fill="#ef4444"/>
  <text x="60" y="22" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="white" text-anchor="middle">Error</text>
</svg>`.trim();

    return new NextResponse(errorSvg, {
      status: 500,
      headers: {
        ...CORS_HEADERS,
        'Content-Type': 'image/svg+xml',
      },
    });
  }
}

// Handle CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: CORS_HEADERS,
  });
}