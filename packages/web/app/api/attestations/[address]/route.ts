import { NextRequest, NextResponse } from 'next/server';
import { isAddress, getAddress } from 'viem';
import { 
  getAttestationsForAgent,
  getAttestationStats,
  createAttestation,
  isValidChainId,
  type Attestation,
  type ChainId
} from '@/data/mock-attestations';

interface AttestationsResponse {
  address: string;
  attestations: Attestation[];
  stats: {
    total: number;
    byChain: Record<string, number>;
    byType: Record<string, number>;
    byVerificationLevel: Record<string, number>;
  };
}

interface CreateAttestationRequest {
  chainId: ChainId;
  attestationType: Attestation['attestationType'];
  metadata: {
    title: string;
    description: string;
    issuer: string;
    issuerAddress?: string;
    expiresAt?: string;
    verificationLevel: 'basic' | 'enhanced' | 'premium';
    score?: number;
    tags?: string[];
    txHash?: string;
    blockNumber?: number;
  };
  issuerAddress?: string; // Should come from auth in real system
}

interface CreateAttestationResponse {
  success: boolean;
  attestation?: Attestation;
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
      // Get attestations for this agent
      const attestations = getAttestationsForAgent(checksummedAddress);
      
      // Calculate stats for this specific agent
      const agentStats = {
        total: attestations.length,
        byChain: {} as Record<string, number>,
        byType: {} as Record<string, number>,
        byVerificationLevel: {
          basic: 0,
          enhanced: 0,
          premium: 0
        }
      };

      for (const attestation of attestations) {
        // Count by chain
        agentStats.byChain[attestation.chainId] = (agentStats.byChain[attestation.chainId] || 0) + 1;
        
        // Count by type
        agentStats.byType[attestation.attestationType] = (agentStats.byType[attestation.attestationType] || 0) + 1;
        
        // Count by verification level
        agentStats.byVerificationLevel[attestation.metadata.verificationLevel]++;
      }

      const response: AttestationsResponse = {
        address: checksummedAddress,
        attestations,
        stats: agentStats,
      };

      // Return response with CORS headers
      const jsonResponse = NextResponse.json(response);
      jsonResponse.headers.set('Access-Control-Allow-Origin', '*');
      jsonResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      jsonResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');
      jsonResponse.headers.set('Cache-Control', 'public, max-age=300'); // 5 min cache

      return jsonResponse;

    } catch (error) {
      console.error('Error fetching attestations:', error);
      
      // Return empty attestations data if there's an error
      const fallbackResponse: AttestationsResponse = {
        address: checksummedAddress,
        attestations: [],
        stats: {
          total: 0,
          byChain: {},
          byType: {},
          byVerificationLevel: {
            basic: 0,
            enhanced: 0,
            premium: 0
          }
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
    const message = error instanceof Error ? error.message : 'Failed to fetch attestations';
    
    console.error('Error in attestations API:', error);

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
    const agentAddress = getAddress(address);

    // Parse request body
    let body: CreateAttestationRequest;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!body.chainId || !body.attestationType || !body.metadata) {
      return NextResponse.json(
        { error: 'Missing required fields: chainId, attestationType, metadata' },
        { status: 400 }
      );
    }

    // Validate chain ID
    if (!isValidChainId(body.chainId)) {
      return NextResponse.json(
        { error: 'Invalid chainId. Supported chains: base, ethereum, arbitrum, optimism' },
        { status: 400 }
      );
    }

    // Validate attestation type
    const validTypes: Attestation['attestationType'][] = ['identity', 'reputation', 'capability', 'verification', 'achievement'];
    if (!validTypes.includes(body.attestationType)) {
      return NextResponse.json(
        { error: `Invalid attestationType. Valid types: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate metadata
    if (!body.metadata.title || !body.metadata.description || !body.metadata.issuer) {
      return NextResponse.json(
        { error: 'Missing required metadata fields: title, description, issuer' },
        { status: 400 }
      );
    }

    // In a real system, you would:
    // 1. Verify the issuer's authority to create attestations
    // 2. Check if the issuer is verified/whitelisted
    // 3. Validate the signature
    // 4. Store to blockchain/database
    
    // For now, we'll just create the attestation
    const newAttestation = createAttestation({
      agentAddress,
      chainId: body.chainId,
      attestationType: body.attestationType,
      metadata: body.metadata
    });

    const response: CreateAttestationResponse = {
      success: true,
      attestation: newAttestation,
    };

    const jsonResponse = NextResponse.json(response, { status: 201 });
    jsonResponse.headers.set('Access-Control-Allow-Origin', '*');
    jsonResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    jsonResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return jsonResponse;

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create attestation';
    
    console.error('Error creating attestation:', error);

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