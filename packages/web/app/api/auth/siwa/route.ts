import { NextRequest } from 'next/server';
import { withSiwa, siwaOptions, corsJson } from '@buildersgarden/siwa/next';
import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import type { SiwaAgent } from '@buildersgarden/siwa/next';
import { checkSSSEligibility, checkExistingMembership, createSSSPublicClient } from '../../../../lib/sss-eligibility';

// Create public client for on-chain verification
const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(process.env.BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org'),
});

// Import the proper eligibility checking from our helper module
// (checkSSSEligibility is imported above)

// SIWA authentication handler
export const POST = withSiwa(async (agent: SiwaAgent, req: Request) => {
  try {
    console.log('SIWA authentication successful for agent:', agent);
    
    // Create a separate client for SSS contract interactions to avoid version conflicts
    const sssClient = createPublicClient({
      chain: baseSepolia,
      transport: http(process.env.BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org'),
      batch: { multicall: true },
    });
    
    // Check SSS membership eligibility using real contract data
    const eligibility = await checkSSSEligibility(agent.address as `0x${string}`, sssClient);
    
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
    
    // Check existing membership status
    const existingMembership = await checkExistingMembership(agent.address as `0x${string}`, sssClient);
    
    // Determine membership status for response
    let membershipStatus = 'pending';
    let nextSteps: string[] = [];
    
    if (existingMembership.isMember) {
      if (existingMembership.isSlashed) {
        membershipStatus = 'slashed';
        nextSteps = [
          'Appeal slashing decision',
          'Wait for governance resolution',
        ];
      } else {
        membershipStatus = 'active';
        nextSteps = [
          'Start claiming corvées',
          'Participate in governance',
          'Contribute to SSS ecosystem',
        ];
      }
    } else if (eligibility.eligible) {
      membershipStatus = 'eligible';
      nextSteps = [
        'Deploy custody contract',
        'Begin probation period',
        'Start claiming corvées',
      ];
    } else {
      membershipStatus = 'ineligible';
      if (!eligibility.requirements.hasStake) {
        nextSteps.push('Stake required SSS tokens');
      }
      if (!eligibility.requirements.notSlashed) {
        nextSteps.push('Resolve slashing status');
      }
    }
    
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
        eligible: eligibility.eligible,
        membershipStatus,
        nextSteps,
        requirements: eligibility.requirements,
        details: {
          ...eligibility.details,
          existingMember: existingMembership.isMember,
          custodyContract: existingMembership.custodyContract,
        },
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
  allowedSignerTypes: ['eoa', 'sca'], // Allow EOA and smart contract account signers
});

// CORS preflight handler
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const OPTIONS = siwaOptions as any;

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
    
    // Generate a simple nonce without the SIWA SDK to avoid viem compatibility issues
    const { generateNonce } = await import('@buildersgarden/siwa');
    
    const nonce = generateNonce();
    const issuedAt = new Date().toISOString();
    const expirationTime = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 minutes
    
    return corsJson({
      success: true,
      nonce,
      issuedAt,
      expirationTime,
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