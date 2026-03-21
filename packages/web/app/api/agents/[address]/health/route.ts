import { NextRequest, NextResponse } from 'next/server';
import { isAddress, getAddress } from 'viem';
import { calculateHealthStatus, initializeHealthStore } from '@/lib/healthCertificate';
import { MOCK_AGENTS } from '@/data/mock-agents';

interface HealthCertificateResponse {
  address: string;
  displayName: string;
  verified: boolean;
  lastSeen: number | null;
  uptimePercentage: number;
  responseTime: number;
  healthScore: number;
  status: 'healthy' | 'warning' | 'inactive';
  streakDays: number;
  missedWindows: number;
  certificateValid: boolean;
  nextCheckInDue: number | null;
  riskLevel: 'low' | 'medium' | 'high';
}

// Get display name for an agent
const getDisplayName = (address: string): string => {
  const agent = MOCK_AGENTS.find(a => a.address.toLowerCase() === address.toLowerCase());
  if (agent) return agent.name;
  
  return `Agent ${address.slice(2, 8).toUpperCase()}`;
};

// Check if agent is verified
const isVerifiedAgent = (address: string): boolean => {
  const agent = MOCK_AGENTS.find(a => a.address.toLowerCase() === address.toLowerCase());
  return agent?.verified ?? false;
};

// Calculate uptime percentage for last 30 days
const calculateUptimePercentage = (lastSeen: number | null, streakDays: number): number => {
  if (!lastSeen) return 0;
  
  const now = Date.now();
  const daysSinceLastSeen = (now - lastSeen) / (24 * 60 * 60 * 1000);
  
  // Base uptime on streak and recency
  const recentActivityScore = Math.max(0, 7 - daysSinceLastSeen) / 7; // 0-1
  const streakScore = Math.min(1, streakDays / 30); // 0-1
  
  const uptimePercentage = (recentActivityScore * 0.6 + streakScore * 0.4) * 100;
  return Math.round(uptimePercentage * 10) / 10;
};

// Calculate mock response time based on status
const calculateResponseTime = (status: 'healthy' | 'warning' | 'inactive'): number => {
  switch (status) {
    case 'healthy':
      return 120 + Math.floor(Math.random() * 80); // 120-200ms
    case 'warning':
      return 250 + Math.floor(Math.random() * 150); // 250-400ms
    case 'inactive':
      return 800 + Math.floor(Math.random() * 1200); // 800-2000ms
  }
};

// Calculate overall health score
const calculateOverallHealthScore = (
  status: 'healthy' | 'warning' | 'inactive',
  uptimePercentage: number,
  streakDays: number,
  missedWindows: number
): number => {
  let baseScore: number;
  
  switch (status) {
    case 'healthy':
      baseScore = 80;
      break;
    case 'warning':
      baseScore = 50;
      break;
    case 'inactive':
      baseScore = 15;
      break;
  }
  
  // Adjust based on metrics
  const uptimeBonus = (uptimePercentage - 50) * 0.4; // ±20 points
  const streakBonus = Math.min(20, streakDays * 2); // Up to +20 for good streak
  const missedPenalty = Math.min(25, missedWindows * 2); // Up to -25 for missed windows
  
  const finalScore = baseScore + uptimeBonus + streakBonus - missedPenalty;
  return Math.max(0, Math.min(100, Math.round(finalScore)));
};

// Determine risk level for verification revocation
const calculateRiskLevel = (
  status: 'healthy' | 'warning' | 'inactive',
  healthScore: number,
  missedWindows: number
): 'low' | 'medium' | 'high' => {
  if (status === 'inactive' || healthScore < 30 || missedWindows > 20) {
    return 'high';
  }
  
  if (status === 'warning' || healthScore < 60 || missedWindows > 10) {
    return 'medium';
  }
  
  return 'low';
};

// Calculate next check-in due time
const calculateNextCheckInDue = (lastSeen: number | null): number | null => {
  if (!lastSeen) return Date.now(); // Should check in immediately
  
  // Due 24 hours after last check-in
  return lastSeen + (24 * 60 * 60 * 1000);
};

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
    
    // Check if agent is verified
    const verified = isVerifiedAgent(checksummedAddress);
    if (!verified) {
      return NextResponse.json(
        { error: 'Agent is not verified in the directory' },
        { status: 404 }
      );
    }

    // Initialize health store
    const healthDataPath = process.cwd() + '/data/health-checkins.json';
    await initializeHealthStore(healthDataPath);
    
    // Calculate health status
    const healthStatus = calculateHealthStatus(checksummedAddress);
    const uptimePercentage = calculateUptimePercentage(healthStatus.lastCheckin, healthStatus.streakDays);
    const responseTime = calculateResponseTime(healthStatus.healthStatus);
    const healthScore = calculateOverallHealthScore(
      healthStatus.healthStatus,
      uptimePercentage,
      healthStatus.streakDays,
      healthStatus.missedWindows
    );
    const riskLevel = calculateRiskLevel(
      healthStatus.healthStatus,
      healthScore,
      healthStatus.missedWindows
    );
    
    // Certificate is valid if health score >= 40 and not inactive for > 14 days
    const certificateValid = healthScore >= 40 && 
      (healthStatus.healthStatus !== 'inactive' || 
       (healthStatus.lastCheckin && (Date.now() - healthStatus.lastCheckin) < (14 * 24 * 60 * 60 * 1000)));
    
    const response: HealthCertificateResponse = {
      address: checksummedAddress,
      displayName: getDisplayName(checksummedAddress),
      verified,
      lastSeen: healthStatus.lastCheckin,
      uptimePercentage,
      responseTime,
      healthScore,
      status: healthStatus.healthStatus,
      streakDays: healthStatus.streakDays,
      missedWindows: healthStatus.missedWindows,
      certificateValid,
      nextCheckInDue: calculateNextCheckInDue(healthStatus.lastCheckin),
      riskLevel,
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, max-age=60', // Cache for 1 minute
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });

  } catch (error) {
    console.error('Error fetching agent health certificate:', error);

    return NextResponse.json(
      { error: 'Failed to fetch health certificate' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
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