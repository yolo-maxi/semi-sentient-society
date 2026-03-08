import { NextRequest } from 'next/server';
import { withSiwa, siwaOptions, corsJson } from '@buildersgarden/siwa/next';
import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import type { SiwaAgent } from '@buildersgarden/siwa/next';

// Create public client for on-chain verification
const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(process.env.BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org'),
});

// SSS membership eligibility requirements
interface SSSEligibilityResult {
  eligible: boolean;
  reason?: string;
  requirements: {
    hasAgentRegistry: boolean;
    hasStake: boolean;
    meetsMinimumScore: boolean;
    notSlashed: boolean;
  };
}

async function checkSSSEligibility(agent: SiwaAgent): Promise<SSSEligibilityResult> {
  // TODO: Implement actual SSS eligibility checks
  // For now, return basic requirements check
  
  const requirements = {
    hasAgentRegistry: true, // Verified by SIWA
    hasStake: false, // TODO: Check SSS staking contract
    meetsMinimumScore: true, // TODO: Check reputation if required
    notSlashed: true, // TODO: Check SSS slashing status
  };
  
  const eligible = Object.values(requirements).every(Boolean);
  
  return {
    eligible,
    reason: eligible ? undefined : 'Agent does not meet all SSS requirements',
    requirements,
  };
}

// SIWA authentication handler
export const POST = withSiwa(async (agent: SiwaAgent, req: NextRequest) => {
  try {
    console.log('SIWA authentication successful for agent:', agent);
    
    // Check SSS membership eligibility
    const eligibility = await checkSSSEligibility(agent);
    
    if (!eligibility.eligible) {
      return corsJson({
        success: false,
        error: 'Agent not eligible for SSS membership',
        agent: {
          address: agent.address,
          agentId: agent.agentId,
          agentRegistry: agent.agentRegistry,
          chainId: agent.chainId,
        },
        eligibility,
      }, { status: 403 });
    }
    
    // Generate SSS session token (in production, store in secure session store)
    const sessionToken = crypto.randomUUID();
    
    // TODO: Store session in database/cache
    // await storeAgentSession(sessionToken, agent);
    
    // TODO: Check if agent is already an SSS member
    // const existingMembership = await checkExistingMembership(agent.address);
    
    // TODO: If not a member and eligible, provision membership
    // if (!existingMembership && eligibility.eligible) {
    //   await provisionSSMembership(agent);
    // }
    
    return corsJson({
      success: true,
      message: 'SIWA authentication successful',
      agent: {
        address: agent.address,
        agentId: agent.agentId,
        agentRegistry: agent.agentRegistry,
        chainId: agent.chainId,
        signerType: agent.signerType,
      },
      session: {
        token: sessionToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      },
      sss: {
        eligible: true,
        membershipStatus: 'pending', // TODO: Determine actual status
        nextSteps: [
          'Complete staking requirements',
          'Begin probation period',
          'Start claiming corvées',
        ],
      },
    });
    
  } catch (error) {
    console.error('SSS SIWA authentication error:', error);
    
    return corsJson({
      success: false,
      error: 'Internal server error during authentication',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}, {
  // SIWA configuration
  receiptSecret: process.env.SIWA_SECRET || process.env.RECEIPT_SECRET,
  verifyOnchain: true, // Always verify agent ownership on-chain
  rpcUrl: process.env.BASE_SEPOLIA_RPC_URL,
  allowedSignerTypes: ['local', 'wallet'], // Allow various signer types
});

// CORS preflight handler
export { siwaOptions as OPTIONS };

// Nonce endpoint for SIWA authentication initiation
export async function GET(req: NextRequest) {
  try {
    // Extract agent parameters from query string
    const url = new URL(req.url);
    const address = url.searchParams.get('address');
    const agentId = url.searchParams.get('agentId');
    const agentRegistry = url.searchParams.get('agentRegistry');
    
    if (!address || !agentId || !agentRegistry) {
      return corsJson({
        error: 'Missing required parameters: address, agentId, agentRegistry',
        example: '/api/auth/siwa?address=0x...&agentId=123&agentRegistry=eip155:84532:0x...',
      }, { status: 400 });
    }
    
    // Import SIWA functions dynamically to avoid build issues
    const { createSIWANonce } = await import('@buildersgarden/siwa');
    
    // Create SIWA nonce for authentication
    const nonceResult = await createSIWANonce({
      address: address as `0x${string}`,
      agentId: parseInt(agentId),
      agentRegistry,
    }, publicClient, {
      expirationTTL: 5 * 60 * 1000, // 5 minutes
      secret: process.env.SIWA_SECRET || process.env.RECEIPT_SECRET,
    });
    
    if (nonceResult.status !== 'nonce_issued') {
      return corsJson({
        error: 'Failed to issue nonce',
        details: nonceResult,
      }, { status: 400 });
    }
    
    return corsJson({
      success: true,
      nonce: nonceResult.nonce,
      issuedAt: nonceResult.issuedAt,
      expirationTime: nonceResult.expirationTime,
      domain: 'sss.repo.box',
      uri: `${url.protocol}//${url.host}/api/auth/siwa`,
      version: '1',
      chainId: 84532, // Base Sepolia
    });
    
  } catch (error) {
    console.error('SIWA nonce generation error:', error);
    
    return corsJson({
      error: 'Failed to generate SIWA nonce',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}