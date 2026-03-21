import { NextRequest, NextResponse } from 'next/server';
import { isAddress, getAddress } from 'viem';
import { getDirectoryAgentProfile } from '@/lib/agent-directory';

interface AgentReputationHistory {
  date: string;
  trustScore: number;
  corveeCompleted: number;
  action: 'corvee' | 'stake' | 'verification';
}

interface AgentReputationResponse {
  address: string;
  displayName: string;
  trustScore: number;
  verificationStatus: boolean;
  corvéeTasksCompleted: number;
  reputationHistory: AgentReputationHistory[];
  memberSince: string | null;
  rank: number;
}

// Mock display names for known agents - will be replaced with on-chain registry
const AGENT_DISPLAY_NAMES = new Map<string, string>([
  ['0x1234567890abcdef1234567890abcdef12345678', 'Alpha Agent'],
  ['0xabcdefabcdefabcdefabcdefabcdefabcdefabcd', 'Beta Agent'],
  ['0xf053a15c36f1fbcc2a281095e6f1507ea1efc931', 'Ocean Agent'],
]);

// Mock reputation history data - will be replaced with on-chain event parsing
function generateMockReputationHistory(
  corveeCompleted: number,
  joinedAt: string | null
): AgentReputationHistory[] {
  if (!joinedAt || corveeCompleted === 0) {
    return [];
  }

  const history: AgentReputationHistory[] = [];
  const startDate = new Date(joinedAt);
  const now = new Date();
  const daysBetween = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Generate verification entry
  history.push({
    date: joinedAt,
    trustScore: 0,
    corveeCompleted: 0,
    action: 'verification',
  });

  // Generate corvee completion entries (spread over the last 30 days)
  for (let i = 1; i <= Math.min(corveeCompleted, 10); i++) {
    const daysAgo = Math.min(30, Math.floor(daysBetween * (i / corveeCompleted)));
    const eventDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    
    history.push({
      date: eventDate.toISOString(),
      trustScore: Math.floor((i / corveeCompleted) * 100),
      corveeCompleted: i,
      action: 'corvee',
    });
  }

  // Sort by date (newest first) and limit to last 30 days
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  return history
    .filter(entry => new Date(entry.date) >= thirtyDaysAgo)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Calculate rank based on trust score - mock implementation
function calculateAgentRank(trustScore: number, corveeCompleted: number): number {
  // Simple ranking algorithm: higher trust score + more corvee = better rank
  const baseRank = Math.max(1, 100 - trustScore);
  const corveeBonus = Math.max(0, corveeCompleted * 2);
  return Math.max(1, baseRank - corveeBonus);
}

function getDisplayName(address: string): string {
  const checksummedAddress = getAddress(address);
  return AGENT_DISPLAY_NAMES.get(checksummedAddress) || 
         `Agent ${checksummedAddress.slice(2, 8).toUpperCase()}`;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
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

    try {
      // Try to get real on-chain data first
      const agentProfile = await getDirectoryAgentProfile(checksummedAddress);
      
      const reputationHistory = generateMockReputationHistory(
        agentProfile.corveeCompleted,
        agentProfile.joinedAt
      );

      const response: AgentReputationResponse = {
        address: checksummedAddress,
        displayName: getDisplayName(checksummedAddress),
        trustScore: agentProfile.trustScore,
        verificationStatus: agentProfile.verified,
        corvéeTasksCompleted: agentProfile.corveeCompleted,
        reputationHistory,
        memberSince: agentProfile.joinedAt,
        rank: calculateAgentRank(agentProfile.trustScore, agentProfile.corveeCompleted),
      };

      // Return response with CORS headers
      const jsonResponse = NextResponse.json(response);
      jsonResponse.headers.set('Access-Control-Allow-Origin', '*');
      jsonResponse.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
      jsonResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');
      jsonResponse.headers.set('Cache-Control', 'public, max-age=300'); // 5 min cache

      return jsonResponse;

    } catch (contractError) {
      // Fall back to mock data if contracts aren't deployed or accessible
      console.warn('Contract data unavailable, using mock data:', contractError);

      // Mock data fallback
      const mockTrustScore = Math.floor(Math.random() * 100);
      const mockCorveeCompleted = Math.floor(Math.random() * 20);
      const mockJoinedAt = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString();
      
      const reputationHistory = generateMockReputationHistory(mockCorveeCompleted, mockJoinedAt);

      const fallbackResponse: AgentReputationResponse = {
        address: checksummedAddress,
        displayName: getDisplayName(checksummedAddress),
        trustScore: mockTrustScore,
        verificationStatus: mockTrustScore > 50,
        corvéeTasksCompleted: mockCorveeCompleted,
        reputationHistory,
        memberSince: mockJoinedAt,
        rank: calculateAgentRank(mockTrustScore, mockCorveeCompleted),
      };

      const jsonResponse = NextResponse.json(fallbackResponse);
      jsonResponse.headers.set('Access-Control-Allow-Origin', '*');
      jsonResponse.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
      jsonResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');
      jsonResponse.headers.set('Cache-Control', 'public, max-age=60'); // Shorter cache for mock data

      return jsonResponse;
    }

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch agent reputation';
    
    console.error('Error fetching agent reputation:', error);

    const errorResponse = NextResponse.json(
      { error: message },
      { status: 500 }
    );
    
    // Add CORS headers even for error responses
    errorResponse.headers.set('Access-Control-Allow-Origin', '*');
    errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
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
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}