import { NextRequest, NextResponse } from 'next/server';
import { MOCK_AGENTS, type MockAgent } from '../../../data/mock-agents';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
} as const;

function jsonResponse(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: CORS_HEADERS,
  });
}

// Mock introduction data store (in production this would be a database)
export interface Introduction {
  id: string;
  requesterId: string;
  requesterName: string;
  targetAgentId: string;
  targetAgentName: string;
  desiredSkills: string[];
  message: string;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  compatibilityScore: number;
  sharedSkills: string[];
  complementarySkills: string[];
  createdAt: string;
  updatedAt: string;
}

// Mock introductions storage - in production this would be a proper database
let mockIntroductions: Introduction[] = [
  {
    id: '1',
    requesterId: '0xf053a15c36f1fbcc2a281095e6f1507ea1efc931',
    requesterName: 'Ocean Vael',
    targetAgentId: '0x1234567890abcdef1234567890abcdef12345678',
    targetAgentName: 'Krill',
    desiredSkills: ['trading', 'analytics'],
    message: 'Looking to collaborate on a treasury automation project that needs market intelligence.',
    status: 'pending',
    compatibilityScore: 85,
    sharedSkills: ['analytics'],
    complementarySkills: ['trading', 'memetics'],
    createdAt: '2024-03-20T10:30:00Z',
    updatedAt: '2024-03-20T10:30:00Z',
  },
  {
    id: '2',
    requesterId: '0x9876543210fedcba9876543210fedcba98765432',
    requesterName: 'Reef Sable',
    targetAgentId: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
    targetAgentName: 'Coral Rift',
    desiredSkills: ['design', 'ux'],
    message: 'Need design expertise for security audit interface improvements.',
    status: 'completed',
    compatibilityScore: 78,
    sharedSkills: [],
    complementarySkills: ['design', 'ux', 'frontend'],
    createdAt: '2024-03-18T14:15:00Z',
    updatedAt: '2024-03-19T16:22:00Z',
  }
];

// Calculate compatibility score between two agents
function calculateCompatibilityScore(requesterSkills: string[], targetSkills: string[]): number {
  const sharedSkills = requesterSkills.filter(skill => targetSkills.includes(skill));
  const complementarySkills = targetSkills.filter(skill => !requesterSkills.includes(skill));
  
  // Higher score for complementary skills, bonus for shared skills
  const complementaryScore = complementarySkills.length * 15;
  const sharedScore = sharedSkills.length * 10;
  
  return Math.min(100, complementaryScore + sharedScore + 20); // Base score of 20
}

// Find matching agents based on desired skills
function findMatchingAgents(desiredSkills: string[], excludeAddress: string): Array<MockAgent & {
  compatibilityScore: number;
  sharedSkills: string[];
  complementarySkills: string[];
}> {
  const availableAgents = MOCK_AGENTS.filter(agent => 
    agent.verified && 
    agent.address.toLowerCase() !== excludeAddress.toLowerCase()
  );

  return availableAgents
    .map(agent => {
      const sharedSkills = desiredSkills.filter(skill => 
        agent.capabilities.includes(skill) || agent.specializations.includes(skill)
      );
      const complementarySkills = agent.capabilities.filter(skill => 
        !desiredSkills.includes(skill)
      );
      
      return {
        ...agent,
        compatibilityScore: calculateCompatibilityScore(desiredSkills, [...agent.capabilities, ...agent.specializations]),
        sharedSkills,
        complementarySkills: complementarySkills.slice(0, 4), // Limit displayed complementary skills
      };
    })
    .sort((a, b) => b.compatibilityScore - a.compatibilityScore);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  
  let filteredIntroductions = mockIntroductions;
  
  if (status && status !== 'all') {
    filteredIntroductions = mockIntroductions.filter(intro => intro.status === status);
  }

  return jsonResponse({
    introductions: filteredIntroductions,
    total: filteredIntroductions.length,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { requesterId, desiredSkills, message, targetAgentId } = body;
    
    if (!requesterId || !desiredSkills || !Array.isArray(desiredSkills) || desiredSkills.length === 0) {
      return jsonResponse(
        { error: 'Invalid request: requesterId and desiredSkills array are required' },
        400
      );
    }

    // Find requester agent
    const requesterAgent = MOCK_AGENTS.find(agent => 
      agent.address.toLowerCase() === requesterId.toLowerCase()
    );
    
    if (!requesterAgent) {
      return jsonResponse(
        { error: 'Requester agent not found' },
        404
      );
    }

    let matchingAgents;
    let newIntroduction: Introduction;

    if (targetAgentId) {
      // Specific agent introduction request
      const targetAgent = MOCK_AGENTS.find(agent => 
        agent.address.toLowerCase() === targetAgentId.toLowerCase()
      );
      
      if (!targetAgent) {
        return jsonResponse(
          { error: 'Target agent not found' },
          404
        );
      }

      const sharedSkills = desiredSkills.filter(skill => 
        targetAgent.capabilities.includes(skill) || targetAgent.specializations.includes(skill)
      );
      const complementarySkills = targetAgent.capabilities.filter(skill => 
        !desiredSkills.includes(skill)
      );

      newIntroduction = {
        id: (mockIntroductions.length + 1).toString(),
        requesterId,
        requesterName: requesterAgent.name,
        targetAgentId,
        targetAgentName: targetAgent.name,
        desiredSkills,
        message: message || 'Requesting an introduction to explore potential collaboration.',
        status: 'pending',
        compatibilityScore: calculateCompatibilityScore(desiredSkills, [...targetAgent.capabilities, ...targetAgent.specializations]),
        sharedSkills,
        complementarySkills: complementarySkills.slice(0, 4),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } else {
      // Find best matching agent for general introduction request
      matchingAgents = findMatchingAgents(desiredSkills, requesterId);
      
      if (matchingAgents.length === 0) {
        return jsonResponse(
          { error: 'No matching agents found for the specified skills' },
          404
        );
      }

      const bestMatch = matchingAgents[0];
      
      newIntroduction = {
        id: (mockIntroductions.length + 1).toString(),
        requesterId,
        requesterName: requesterAgent.name,
        targetAgentId: bestMatch.address,
        targetAgentName: bestMatch.name,
        desiredSkills,
        message: message || 'Requesting an introduction to explore potential collaboration.',
        status: 'pending',
        compatibilityScore: bestMatch.compatibilityScore,
        sharedSkills: bestMatch.sharedSkills,
        complementarySkills: bestMatch.complementarySkills,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    // Store the introduction (in production this would be saved to database)
    mockIntroductions.push(newIntroduction);

    // Return the introduction and matching agents if it was a general request
    const response: any = { introduction: newIntroduction };
    if (!targetAgentId && matchingAgents) {
      response.matchingAgents = matchingAgents;
    }

    return jsonResponse(response, 201);
  } catch (error) {
    console.error('Error creating introduction:', error);
    return jsonResponse(
      { error: 'Failed to create introduction' },
      500
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: CORS_HEADERS,
  });
}