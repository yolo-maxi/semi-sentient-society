import { NextResponse } from 'next/server';
import { calculateHealthStatus, initializeHealthStore } from '@/lib/healthCertificate';
import { MOCK_AGENTS } from '@/data/mock-agents';

interface HealthStatusResponse {
  address: string;
  displayName: string;
  lastSeen: number | null;
  uptimePercentage: number;
  responseTime: number;
  healthScore: number;
  status: 'healthy' | 'warning' | 'inactive';
}

interface HealthStatusAPI {
  agents: HealthStatusResponse[];
  totalAgents: number;
  healthyCount: number;
  warningCount: number;
  inactiveCount: number;
  lastUpdated: number;
}

// Mock display names for agents
const getDisplayName = (address: string): string => {
  const agent = MOCK_AGENTS.find(a => a.address.toLowerCase() === address.toLowerCase());
  if (agent) return agent.name;
  
  // Fallback to formatted address
  return `Agent ${address.slice(2, 8).toUpperCase()}`;
};

// Calculate uptime percentage for last 30 days
const calculateUptimePercentage = (lastSeen: number | null): number => {
  if (!lastSeen) return 0;
  
  const now = Date.now();
  
  // Mock calculation - in real implementation, this would use check-in history
  const recentActivity = Math.max(0, 7 - (now - lastSeen) / (24 * 60 * 60 * 1000));
  const uptimeScore = Math.min(100, (recentActivity / 7) * 100);
  
  return Math.round(uptimeScore * 10) / 10; // Round to 1 decimal
};

// Calculate mock response time
const calculateResponseTime = (status: 'healthy' | 'warning' | 'inactive'): number => {
  switch (status) {
    case 'healthy':
      return 150 + Math.floor(Math.random() * 100); // 150-250ms
    case 'warning':
      return 300 + Math.floor(Math.random() * 200); // 300-500ms
    case 'inactive':
      return 1000 + Math.floor(Math.random() * 2000); // 1-3s (timeout)
  }
};

// Calculate overall health score (0-100)
const calculateOverallHealthScore = (
  status: 'healthy' | 'warning' | 'inactive',
  uptimePercentage: number,
  responseTime: number
): number => {
  let baseScore: number;
  
  switch (status) {
    case 'healthy':
      baseScore = 85 + Math.floor(Math.random() * 15); // 85-100
      break;
    case 'warning':
      baseScore = 45 + Math.floor(Math.random() * 30); // 45-75
      break;
    case 'inactive':
      baseScore = Math.floor(Math.random() * 30); // 0-30
      break;
  }
  
  // Adjust based on uptime and response time
  const uptimeAdjustment = (uptimePercentage - 50) * 0.5; // ±25 points max
  const responseTimeAdjustment = Math.max(-20, (500 - responseTime) * 0.04); // ±20 points max
  
  const finalScore = baseScore + uptimeAdjustment + responseTimeAdjustment;
  return Math.max(0, Math.min(100, Math.round(finalScore)));
};

export async function GET() {
  try {
    // Initialize health store
    const healthDataPath = process.cwd() + '/data/health-checkins.json';
    await initializeHealthStore(healthDataPath);
    
    // Get all verified agents from mock data for now
    const verifiedAgents = MOCK_AGENTS.filter(agent => agent.verified);
    
    // Calculate health status for each agent
    const agentsHealth: HealthStatusResponse[] = [];
    
    for (const agent of verifiedAgents) {
      const healthStatus = calculateHealthStatus(agent.address);
      const uptimePercentage = calculateUptimePercentage(healthStatus.lastCheckin);
      const responseTime = calculateResponseTime(healthStatus.healthStatus);
      const healthScore = calculateOverallHealthScore(
        healthStatus.healthStatus,
        uptimePercentage,
        responseTime
      );
      
      agentsHealth.push({
        address: agent.address,
        displayName: getDisplayName(agent.address),
        lastSeen: healthStatus.lastCheckin,
        uptimePercentage,
        responseTime,
        healthScore,
        status: healthStatus.healthStatus,
      });
    }
    
    // Sort by health score (descending), then by last seen (most recent first)
    agentsHealth.sort((a, b) => {
      if (a.healthScore !== b.healthScore) {
        return b.healthScore - a.healthScore;
      }
      
      if (a.lastSeen === null && b.lastSeen === null) return 0;
      if (a.lastSeen === null) return 1;
      if (b.lastSeen === null) return -1;
      return b.lastSeen - a.lastSeen;
    });
    
    // Calculate summary counts
    const healthyCount = agentsHealth.filter(a => a.status === 'healthy').length;
    const warningCount = agentsHealth.filter(a => a.status === 'warning').length;
    const inactiveCount = agentsHealth.filter(a => a.status === 'inactive').length;
    
    const response: HealthStatusAPI = {
      agents: agentsHealth,
      totalAgents: agentsHealth.length,
      healthyCount,
      warningCount,
      inactiveCount,
      lastUpdated: Date.now(),
    };
    
    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, max-age=30', // Cache for 30 seconds
        'Access-Control-Allow-Origin': '*',
      },
    });
    
  } catch (error) {
    console.error('Error fetching health status:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch health status' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}

// Handle CORS preflight
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