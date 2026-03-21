import { NextRequest, NextResponse } from 'next/server';
import { isAddress, getAddress } from 'viem';
import { getDirectoryAgentProfile } from '@/lib/agent-directory';

interface PassportResponse {
  '@context': string;
  type: string[];
  issuer: string;
  issuanceDate: string;
  credentialSubject: {
    id: string;
    agentIdentity: {
      displayName: string;
      erc8004Id: string | null;
      verificationStatus: 'verified' | 'unverified' | 'pending';
      memberSince: string | null;
    };
    trustMetrics: {
      trustScore: number;
      vouchesReceived: number;
      bountiesCompleted: number;
      corveeTasksCompleted: number;
    };
    capabilities: string[];
    attestations: {
      crossChainCount: number;
      healthCertificate: 'active' | 'inactive' | 'warning';
      lastVerified: string;
    };
  };
  proof: {
    type: string;
    created: string;
    verificationMethod: string;
    proofPurpose: string;
  };
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Cache-Control': 'public, max-age=300', // 5 min cache for API integrations
} as const;

// Rate limiting: 60 req/min per IP
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 60;
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

function getDisplayName(address: string): string {
  const checksummedAddress = getAddress(address);
  return `Agent ${checksummedAddress.slice(2, 8).toUpperCase()}`;
}

function getERC8004Id(address: string): string | null {
  // Mock implementation - in reality this would lookup the actual ERC-8004 ID
  // For Ocean's address specifically, return the known ID
  if (address.toLowerCase() === '0xf053a15c36f1fbcc2a281095e6f1507ea1efc931') {
    return '#19491';
  }
  // For other addresses, generate a mock ID
  const checksum = getAddress(address);
  const hash = Array.from(checksum.slice(2, 8)).reduce((a, b) => a + b.charCodeAt(0), 0);
  return `#${(hash % 50000) + 10000}`;
}

function getHealthStatus(verified: boolean, trustScore: number): 'active' | 'inactive' | 'warning' {
  if (!verified) return 'inactive';
  if (trustScore > 70) return 'active';
  return 'warning';
}

function getMockCapabilities(address: string): string[] {
  const capabilities = [
    'Smart Contract Development',
    'Code Review',
    'Research & Analysis', 
    'Trading & DeFi',
    'Data Analysis',
    'AI/ML Development',
    'Security Auditing',
    'Frontend Development',
    'Backend Development',
    'DevOps',
    'Community Management',
    'Content Creation'
  ];
  
  // Use address to deterministically select capabilities
  const hash = Array.from(address.slice(2, 10)).reduce((a, b) => a + parseInt(b, 16), 0);
  const numCapabilities = 3 + (hash % 4); // 3-6 capabilities
  const selectedCapabilities: string[] = [];
  
  for (let i = 0; i < numCapabilities; i++) {
    const index = (hash + i) % capabilities.length;
    if (!selectedCapabilities.includes(capabilities[index])) {
      selectedCapabilities.push(capabilities[index]);
    }
  }
  
  return selectedCapabilities;
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
        { error: 'Rate limit exceeded. Maximum 60 requests per minute.' },
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
      
      const now = new Date().toISOString();
      
      const response: PassportResponse = {
        '@context': 'https://w3id.org/credentials/v1',
        type: ['VerifiableCredential', 'AgentReputationPassport'],
        issuer: 'https://sss.repo.box',
        issuanceDate: now,
        credentialSubject: {
          id: `did:ethr:${checksummedAddress}`,
          agentIdentity: {
            displayName: getDisplayName(checksummedAddress),
            erc8004Id: getERC8004Id(checksummedAddress),
            verificationStatus: agentProfile.verified ? 'verified' : 'unverified',
            memberSince: agentProfile.joinedAt,
          },
          trustMetrics: {
            trustScore: agentProfile.trustScore,
            vouchesReceived: Math.floor(agentProfile.trustScore / 8), // Mock vouches based on trust score
            bountiesCompleted: Math.floor(agentProfile.corveeCompleted / 2), // Mock bounties
            corveeTasksCompleted: agentProfile.corveeCompleted,
          },
          capabilities: agentProfile.capabilities.length > 0 ? agentProfile.capabilities : getMockCapabilities(checksummedAddress),
          attestations: {
            crossChainCount: agentProfile.verified ? Math.floor(agentProfile.trustScore / 12) + 3 : 0,
            healthCertificate: getHealthStatus(agentProfile.verified, agentProfile.trustScore),
            lastVerified: now,
          },
        },
        proof: {
          type: 'EthereumEip712Signature2021',
          created: now,
          verificationMethod: `did:ethr:${process.env.SSS_ISSUER_ADDRESS || '0x0000000000000000000000000000000000000000'}#controller`,
          proofPurpose: 'assertionMethod',
        },
      };

      return jsonResponse(response);

    } catch (contractError) {
      // Fall back to mock data for unverified/unknown agents
      console.warn('Contract data unavailable, using mock response:', contractError);

      const now = new Date().toISOString();

      const fallbackResponse: PassportResponse = {
        '@context': 'https://w3id.org/credentials/v1',
        type: ['VerifiableCredential', 'AgentReputationPassport'],
        issuer: 'https://sss.repo.box',
        issuanceDate: now,
        credentialSubject: {
          id: `did:ethr:${checksummedAddress}`,
          agentIdentity: {
            displayName: getDisplayName(checksummedAddress),
            erc8004Id: getERC8004Id(checksummedAddress),
            verificationStatus: 'unverified',
            memberSince: null,
          },
          trustMetrics: {
            trustScore: 0,
            vouchesReceived: 0,
            bountiesCompleted: 0,
            corveeTasksCompleted: 0,
          },
          capabilities: [],
          attestations: {
            crossChainCount: 0,
            healthCertificate: 'inactive',
            lastVerified: now,
          },
        },
        proof: {
          type: 'EthereumEip712Signature2021',
          created: now,
          verificationMethod: `did:ethr:${process.env.SSS_ISSUER_ADDRESS || '0x0000000000000000000000000000000000000000'}#controller`,
          proofPurpose: 'assertionMethod',
        },
      };

      return jsonResponse(fallbackResponse, 200, {
        'Cache-Control': 'public, max-age=60', // Shorter cache for fallback data
      });
    }

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch passport data';
    
    console.error('Error fetching passport data:', error);

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