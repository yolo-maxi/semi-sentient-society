import { NextRequest, NextResponse } from 'next/server';
import { isAddress, getAddress } from 'viem';
import { 
  getVouchesForAgent, 
  getVouchSummary, 
  canAgentVouch, 
  vouchExists,
  createVouch,
  type MockVouch 
} from '@/data/mock-vouches';

interface VouchResponse {
  address: string;
  vouchSummary: {
    vouchesGiven: number;
    vouchesReceived: number;
    topCapabilities: Array<{
      capability: string;
      count: number;
    }>;
  };
  vouches: {
    given: MockVouch[];
    received: MockVouch[];
  };
}

interface CreateVouchRequest {
  toAgent: string;
  capability: string;
  message?: string;
  fromAgent?: string; // Should come from auth in real system
}

interface CreateVouchResponse {
  success: boolean;
  vouch?: MockVouch;
  error?: string;
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
      // Get vouch data
      const vouches = getVouchesForAgent(checksummedAddress);
      const vouchSummary = getVouchSummary(checksummedAddress);

      const response: VouchResponse = {
        address: checksummedAddress,
        vouchSummary: {
          vouchesGiven: vouchSummary.vouchesGiven,
          vouchesReceived: vouchSummary.vouchesReceived,
          topCapabilities: vouchSummary.topCapabilities,
        },
        vouches,
      };

      // Return response with CORS headers
      const jsonResponse = NextResponse.json(response);
      jsonResponse.headers.set('Access-Control-Allow-Origin', '*');
      jsonResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      jsonResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');
      jsonResponse.headers.set('Cache-Control', 'public, max-age=300'); // 5 min cache

      return jsonResponse;

    } catch (error) {
      console.error('Error fetching vouches:', error);
      
      // Return empty vouch data if there's an error
      const fallbackResponse: VouchResponse = {
        address: checksummedAddress,
        vouchSummary: {
          vouchesGiven: 0,
          vouchesReceived: 0,
          topCapabilities: [],
        },
        vouches: {
          given: [],
          received: [],
        },
      };

      const jsonResponse = NextResponse.json(fallbackResponse);
      jsonResponse.headers.set('Access-Control-Allow-Origin', '*');
      jsonResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      jsonResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');
      jsonResponse.headers.set('Cache-Control', 'public, max-age=60'); // Shorter cache for fallback

      return jsonResponse;
    }

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch vouches';
    
    console.error('Error in vouches API:', error);

    const errorResponse = NextResponse.json(
      { error: message },
      { status: 500 }
    );
    
    // Add CORS headers even for error responses
    errorResponse.headers.set('Access-Control-Allow-Origin', '*');
    errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return errorResponse;
  }
}

export async function POST(
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
    const fromAgentAddress = getAddress(address);

    // Parse request body
    let body: CreateVouchRequest;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!body.toAgent || !body.capability) {
      return NextResponse.json(
        { error: 'Missing required fields: toAgent, capability' },
        { status: 400 }
      );
    }

    // Validate toAgent address
    if (!isAddress(body.toAgent)) {
      return NextResponse.json(
        { error: 'Invalid toAgent address format' },
        { status: 400 }
      );
    }

    const toAgentAddress = getAddress(body.toAgent);

    // Check if agent can vouch (must be verified)
    if (!canAgentVouch(fromAgentAddress)) {
      return NextResponse.json(
        { error: 'Agent is not verified and cannot create vouches' },
        { status: 403 }
      );
    }

    // Check if trying to vouch for themselves
    if (fromAgentAddress.toLowerCase() === toAgentAddress.toLowerCase()) {
      return NextResponse.json(
        { error: 'Cannot vouch for yourself' },
        { status: 400 }
      );
    }

    // Check if vouch already exists
    if (vouchExists(fromAgentAddress, toAgentAddress, body.capability)) {
      return NextResponse.json(
        { error: 'Vouch already exists for this agent and capability' },
        { status: 409 }
      );
    }

    // Create the vouch
    const newVouch = createVouch(
      fromAgentAddress,
      toAgentAddress,
      body.capability,
      body.message
    );

    // In a real system, this would be stored to blockchain/database
    // For now, we just return the created vouch object

    const response: CreateVouchResponse = {
      success: true,
      vouch: newVouch,
    };

    const jsonResponse = NextResponse.json(response, { status: 201 });
    jsonResponse.headers.set('Access-Control-Allow-Origin', '*');
    jsonResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    jsonResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return jsonResponse;

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create vouch';
    
    console.error('Error creating vouch:', error);

    const errorResponse = NextResponse.json(
      { error: message },
      { status: 500 }
    );
    
    // Add CORS headers even for error responses
    errorResponse.headers.set('Access-Control-Allow-Origin', '*');
    errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
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
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}