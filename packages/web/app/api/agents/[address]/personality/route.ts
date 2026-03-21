import { NextRequest, NextResponse } from 'next/server';
import { isAddress, getAddress } from 'viem';
import { 
  getPersonalityProfile,
  createSelfAttestation,
  confirmTrait,
  challengeTrait,
  canAgentConfirmOrChallenge,
  isValidTraitValue,
  type PersonalityProfile,
  type PersonalityTrait,
  TRAIT_DEFINITIONS
} from '@/data/mock-personality';

interface PersonalityResponse {
  address: string;
  profile: PersonalityProfile | null;
}

interface SelfAttestRequest {
  trait: PersonalityTrait['trait'];
  value: string | string[];
  agentAddress?: string; // Should come from auth in real system
}

interface ConfirmChallengeRequest {
  trait: PersonalityTrait['trait'];
  action: 'confirm' | 'challenge';
  agentAddress?: string; // Should come from auth in real system
}

interface SelfAttestResponse {
  success: boolean;
  trait?: PersonalityTrait;
  error?: string;
}

interface ConfirmChallengeResponse {
  success: boolean;
  profile?: PersonalityProfile;
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
      // Get personality profile
      const profile = getPersonalityProfile(checksummedAddress);

      const response: PersonalityResponse = {
        address: checksummedAddress,
        profile
      };

      // Return response with CORS headers
      const jsonResponse = NextResponse.json(response);
      jsonResponse.headers.set('Access-Control-Allow-Origin', '*');
      jsonResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      jsonResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');
      jsonResponse.headers.set('Cache-Control', 'public, max-age=300'); // 5 min cache

      return jsonResponse;

    } catch (error) {
      console.error('Error fetching personality profile:', error);
      
      // Return empty profile if there's an error
      const fallbackResponse: PersonalityResponse = {
        address: checksummedAddress,
        profile: null
      };

      const jsonResponse = NextResponse.json(fallbackResponse);
      jsonResponse.headers.set('Access-Control-Allow-Origin', '*');
      jsonResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      jsonResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');
      jsonResponse.headers.set('Cache-Control', 'public, max-age=60'); // Shorter cache for fallback

      return jsonResponse;
    }

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch personality profile';
    
    console.error('Error in personality API:', error);

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
    const targetAddress = getAddress(address);

    // Parse request body
    let body: SelfAttestRequest | ConfirmChallengeRequest;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    // Check if this is a self-attestation request
    if ('value' in body) {
      const selfAttestBody = body as SelfAttestRequest;
      
      // Validate required fields for self-attestation
      if (!selfAttestBody.trait || !selfAttestBody.value) {
        return NextResponse.json(
          { error: 'Missing required fields: trait, value' },
          { status: 400 }
        );
      }

      // In a real system, agentAddress would come from authenticated session
      const agentAddress = selfAttestBody.agentAddress || targetAddress;

      // Validate agent address
      if (!isAddress(agentAddress)) {
        return NextResponse.json(
          { error: 'Invalid agent address format' },
          { status: 400 }
        );
      }

      const checksummedAgentAddress = getAddress(agentAddress);

      // Check if agent is self-attesting (can only attest for themselves)
      if (checksummedAgentAddress.toLowerCase() !== targetAddress.toLowerCase()) {
        return NextResponse.json(
          { error: 'Can only self-attest your own traits' },
          { status: 403 }
        );
      }

      // Validate trait type and value
      if (!TRAIT_DEFINITIONS[selfAttestBody.trait]) {
        return NextResponse.json(
          { error: `Invalid trait type: ${selfAttestBody.trait}` },
          { status: 400 }
        );
      }

      if (!isValidTraitValue(selfAttestBody.trait, selfAttestBody.value)) {
        return NextResponse.json(
          { error: `Invalid value for trait ${selfAttestBody.trait}` },
          { status: 400 }
        );
      }

      // Create the self-attestation
      const newTrait = createSelfAttestation(
        targetAddress,
        selfAttestBody.trait,
        selfAttestBody.value
      );

      // In a real system, this would be stored to blockchain/database
      // For now, we just return the created trait object

      const response: SelfAttestResponse = {
        success: true,
        trait: newTrait
      };

      const jsonResponse = NextResponse.json(response, { status: 201 });
      jsonResponse.headers.set('Access-Control-Allow-Origin', '*');
      jsonResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      jsonResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');

      return jsonResponse;

    } else {
      // This is a confirm/challenge request
      const actionBody = body as ConfirmChallengeRequest;

      // Validate required fields for confirm/challenge
      if (!actionBody.trait || !actionBody.action) {
        return NextResponse.json(
          { error: 'Missing required fields: trait, action' },
          { status: 400 }
        );
      }

      if (!['confirm', 'challenge'].includes(actionBody.action)) {
        return NextResponse.json(
          { error: 'Action must be either "confirm" or "challenge"' },
          { status: 400 }
        );
      }

      // In a real system, agentAddress would come from authenticated session
      const agentAddress = actionBody.agentAddress || '0xf053a15c36f1fbcc2a281095e6f1507ea1efc931'; // Mock for demo

      // Validate agent address
      if (!isAddress(agentAddress)) {
        return NextResponse.json(
          { error: 'Invalid agent address format' },
          { status: 400 }
        );
      }

      const checksummedAgentAddress = getAddress(agentAddress);

      // Check if agent can confirm/challenge (must be verified)
      if (!canAgentConfirmOrChallenge(checksummedAgentAddress)) {
        return NextResponse.json(
          { error: 'Agent is not verified and cannot confirm or challenge traits' },
          { status: 403 }
        );
      }

      // Check if trying to confirm/challenge own traits
      if (checksummedAgentAddress.toLowerCase() === targetAddress.toLowerCase()) {
        return NextResponse.json(
          { error: 'Cannot confirm or challenge your own traits' },
          { status: 400 }
        );
      }

      // Get current profile
      const currentProfile = getPersonalityProfile(targetAddress);
      if (!currentProfile) {
        return NextResponse.json(
          { error: 'Target agent has no personality profile to confirm/challenge' },
          { status: 404 }
        );
      }

      // Check if trait exists
      const targetTrait = currentProfile.traits.find(t => t.trait === actionBody.trait);
      if (!targetTrait) {
        return NextResponse.json(
          { error: `Agent has not attested trait: ${actionBody.trait}` },
          { status: 404 }
        );
      }

      // Check if agent has already confirmed/challenged this trait
      const hasAlreadyConfirmed = targetTrait.confirmedBy.includes(checksummedAgentAddress);
      const hasAlreadyChallenged = targetTrait.challengedBy.includes(checksummedAgentAddress);

      if (actionBody.action === 'confirm' && hasAlreadyConfirmed) {
        return NextResponse.json(
          { error: 'You have already confirmed this trait' },
          { status: 409 }
        );
      }

      if (actionBody.action === 'challenge' && hasAlreadyChallenged) {
        return NextResponse.json(
          { error: 'You have already challenged this trait' },
          { status: 409 }
        );
      }

      // Update the profile
      let updatedProfile: PersonalityProfile;
      if (actionBody.action === 'confirm') {
        updatedProfile = confirmTrait(currentProfile, actionBody.trait, checksummedAgentAddress);
      } else {
        updatedProfile = challengeTrait(currentProfile, actionBody.trait, checksummedAgentAddress);
      }

      // In a real system, this would be stored to blockchain/database
      // For now, we just return the updated profile object

      const response: ConfirmChallengeResponse = {
        success: true,
        profile: updatedProfile
      };

      const jsonResponse = NextResponse.json(response, { status: 200 });
      jsonResponse.headers.set('Access-Control-Allow-Origin', '*');
      jsonResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      jsonResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');

      return jsonResponse;
    }

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to process personality request';
    
    console.error('Error in personality POST:', error);

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