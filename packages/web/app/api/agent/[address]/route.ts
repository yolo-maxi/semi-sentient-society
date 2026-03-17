import { NextResponse } from 'next/server';
import { isAddress, getAddress } from 'viem';
import { rateLimiter } from '../../../../lib/rate-limiter';

// Mock data for testing - will be replaced with on-chain data later
interface MockAgentData {
  verified: boolean;
  joinedAt: string | null;
  shellsHeld: number;
  trustScore: number;
  corveeCompleted: number;
  lastActive: string | null;
}

// Using hardcoded mock data to avoid module resolution issues
const MOCK_AGENTS = new Map<string, MockAgentData>([
  [
    '0x1234567890abcdef1234567890abcdef12345678',
    {
      verified: true,
      joinedAt: '2024-01-15T10:30:00Z',
      shellsHeld: 50,
      trustScore: 85,
      corveeCompleted: 12,
      lastActive: '2024-03-15T14:20:00Z',
    },
  ],
  [
    '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
    {
      verified: true,
      joinedAt: '2024-02-10T08:15:00Z',
      shellsHeld: 25,
      trustScore: 72,
      corveeCompleted: 8,
      lastActive: '2024-03-16T11:45:00Z',
    },
  ],
  [
    '0xf053a15c36f1fbcc2a281095e6f1507ea1efc931',
    {
      verified: true,
      joinedAt: '2024-01-01T12:00:00Z',
      shellsHeld: 100,
      trustScore: 95,
      corveeCompleted: 25,
      lastActive: '2024-03-17T09:30:00Z',
    },
  ],
]);

function getDefaultAgentData() {
  return {
    verified: false,
    joinedAt: null,
    shellsHeld: 0,
    trustScore: 0,
    corveeCompleted: 0,
    lastActive: null,
  };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const isAllowed = await rateLimiter.check(ip);
    
    if (!isAllowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    const { address } = await params;

    // Validate Ethereum address format
    if (!isAddress(address)) {
      return NextResponse.json(
        { error: 'Invalid Ethereum address format' },
        { status: 400 }
      );
    }

    // Normalize address to checksummed format
    const checksummedAddress = getAddress(address);

    // Check mock data first
    const mockData = MOCK_AGENTS.get(checksummedAddress.toLowerCase());
    
    const agentData = mockData || getDefaultAgentData();

    const response = {
      verified: agentData.verified,
      address: checksummedAddress,
      joinedAt: agentData.joinedAt,
      shellsHeld: agentData.shellsHeld,
      trustScore: agentData.trustScore,
      corveeCompleted: agentData.corveeCompleted,
      lastActive: agentData.lastActive,
    };

    // Add CORS headers
    const jsonResponse = NextResponse.json(response);
    jsonResponse.headers.set('Access-Control-Allow-Origin', '*');
    jsonResponse.headers.set('Access-Control-Allow-Methods', 'GET');
    jsonResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return jsonResponse;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to fetch agent reputation.';
    
    console.error('Error fetching agent reputation:', error);

    const errorResponse = NextResponse.json(
      { error: message },
      { status: 500 }
    );
    
    // Add CORS headers even for error responses
    errorResponse.headers.set('Access-Control-Allow-Origin', '*');
    errorResponse.headers.set('Access-Control-Allow-Methods', 'GET');
    errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return errorResponse;
  }
}

// Handle CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}