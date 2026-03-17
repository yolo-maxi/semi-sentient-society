// Health Certificate System for Agent Liveness Tracking
// Tracks agent check-ins and calculates health status

export interface HealthCheckIn {
  address: string;
  timestamp: number;
  signature: string;
}

export interface HealthStatus {
  address: string;
  lastCheckin: number | null;
  healthStatus: 'healthy' | 'warning' | 'inactive';
  streakDays: number;
  missedWindows: number;
}

export interface HealthCertificateStore {
  checkins: Map<string, HealthCheckIn[]>;
  lastCalculated: Map<string, number>;
}

// Health thresholds in milliseconds
const HEALTHY_THRESHOLD = 7 * 24 * 60 * 60 * 1000; // 7 days
const WARNING_THRESHOLD = 14 * 24 * 60 * 60 * 1000; // 14 days
const CHECKIN_WINDOW = 24 * 60 * 60 * 1000; // 24 hours for streak calculation

// In-memory store - will be replaced with persistent storage
let healthStore: HealthCertificateStore = {
  checkins: new Map(),
  lastCalculated: new Map(),
};

/**
 * Validates that a timestamp is recent (within 5 minutes)
 */
export function validateTimestamp(timestamp: number): boolean {
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;
  
  // Allow timestamps from 5 minutes ago to 1 minute in the future (clock skew tolerance)
  return timestamp >= (now - fiveMinutes) && timestamp <= (now + 60 * 1000);
}

/**
 * Records a health check-in for an agent
 */
export function recordHealthCheckIn(checkin: HealthCheckIn): boolean {
  try {
    // Validate timestamp
    if (!validateTimestamp(checkin.timestamp)) {
      return false;
    }

    // Get existing check-ins for this agent
    const agentCheckins = healthStore.checkins.get(checkin.address.toLowerCase()) || [];

    // Prevent duplicate check-ins within 1 hour
    const oneHour = 60 * 60 * 1000;
    const recentCheckin = agentCheckins.find(
      (existing) => Math.abs(existing.timestamp - checkin.timestamp) < oneHour
    );

    if (recentCheckin) {
      return false; // Too recent, ignore
    }

    // Add new check-in
    agentCheckins.push({
      ...checkin,
      address: checkin.address.toLowerCase(),
    });

    // Keep only last 100 check-ins to prevent memory bloat
    if (agentCheckins.length > 100) {
      agentCheckins.sort((a, b) => b.timestamp - a.timestamp);
      agentCheckins.splice(100);
    }

    healthStore.checkins.set(checkin.address.toLowerCase(), agentCheckins);
    
    // Clear cached calculation
    healthStore.lastCalculated.delete(checkin.address.toLowerCase());

    return true;
  } catch (error) {
    console.error('Error recording health check-in:', error);
    return false;
  }
}

/**
 * Calculates health status for an agent
 */
export function calculateHealthStatus(address: string): HealthStatus {
  const normalizedAddress = address.toLowerCase();
  const checkins = healthStore.checkins.get(normalizedAddress) || [];
  
  const now = Date.now();
  
  // Sort check-ins by timestamp (newest first)
  checkins.sort((a, b) => b.timestamp - a.timestamp);
  
  const lastCheckin = checkins.length > 0 ? checkins[0].timestamp : null;
  
  // Determine health status based on last check-in
  let healthStatus: 'healthy' | 'warning' | 'inactive' = 'inactive';
  
  if (lastCheckin) {
    const timeSinceLastCheckin = now - lastCheckin;
    
    if (timeSinceLastCheckin <= HEALTHY_THRESHOLD) {
      healthStatus = 'healthy';
    } else if (timeSinceLastCheckin <= WARNING_THRESHOLD) {
      healthStatus = 'warning';
    } else {
      healthStatus = 'inactive';
    }
  }
  
  // Calculate streak days and missed windows
  const { streakDays, missedWindows } = calculateStreakAndMissed(checkins, now);
  
  return {
    address,
    lastCheckin,
    healthStatus,
    streakDays,
    missedWindows,
  };
}

/**
 * Calculates consecutive check-in streak and missed check-in windows
 */
function calculateStreakAndMissed(checkins: HealthCheckIn[], now: number): { streakDays: number; missedWindows: number } {
  if (checkins.length === 0) {
    // No check-ins ever, calculate missed windows from 30 days ago
    const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);
    const missedWindows = Math.floor((now - thirtyDaysAgo) / CHECKIN_WINDOW);
    return { streakDays: 0, missedWindows };
  }

  let streakDays = 0;
  let missedWindows = 0;
  
  // Create a map of check-in days (normalized to day boundaries)
  const checkinDays = new Set<number>();
  checkins.forEach(checkin => {
    const dayStart = Math.floor(checkin.timestamp / CHECKIN_WINDOW) * CHECKIN_WINDOW;
    checkinDays.add(dayStart);
  });
  
  // Calculate current streak (consecutive days with check-ins)
  const currentDayStart = Math.floor(now / CHECKIN_WINDOW) * CHECKIN_WINDOW;
  let checkDay = currentDayStart;
  
  while (checkinDays.has(checkDay)) {
    streakDays++;
    checkDay -= CHECKIN_WINDOW;
  }
  
  // If no check-in today but had one yesterday, still count the streak
  if (streakDays === 0 && checkinDays.has(currentDayStart - CHECKIN_WINDOW)) {
    checkDay = currentDayStart - CHECKIN_WINDOW;
    while (checkinDays.has(checkDay)) {
      streakDays++;
      checkDay -= CHECKIN_WINDOW;
    }
  }
  
  // Calculate missed windows in the last 30 days
  const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);
  let missedDayStart = Math.floor(thirtyDaysAgo / CHECKIN_WINDOW) * CHECKIN_WINDOW;
  
  while (missedDayStart < now) {
    if (!checkinDays.has(missedDayStart)) {
      missedWindows++;
    }
    missedDayStart += CHECKIN_WINDOW;
  }
  
  return { streakDays, missedWindows };
}

/**
 * Get all agents with their health status (for admin/monitoring purposes)
 */
export function getAllAgentsHealthStatus(): HealthStatus[] {
  const agents: HealthStatus[] = [];
  
  for (const [address] of healthStore.checkins) {
    agents.push(calculateHealthStatus(address));
  }
  
  // Sort by last check-in time (most recent first)
  agents.sort((a, b) => {
    if (a.lastCheckin === null && b.lastCheckin === null) return 0;
    if (a.lastCheckin === null) return 1;
    if (b.lastCheckin === null) return -1;
    return b.lastCheckin - a.lastCheckin;
  });
  
  return agents;
}

/**
 * Load health store from JSON file (persistence)
 */
export async function loadHealthStore(filePath: string): Promise<boolean> {
  try {
    const fs = await import('fs/promises');
    const data = await fs.readFile(filePath, 'utf-8');
    const parsed = JSON.parse(data);
    
    // Reconstruct Maps from serialized data
    healthStore.checkins = new Map();
    healthStore.lastCalculated = new Map();
    
    if (parsed.checkins) {
      for (const [address, checkins] of Object.entries(parsed.checkins as Record<string, HealthCheckIn[]>)) {
        healthStore.checkins.set(address, checkins);
      }
    }
    
    if (parsed.lastCalculated) {
      for (const [address, timestamp] of Object.entries(parsed.lastCalculated as Record<string, number>)) {
        healthStore.lastCalculated.set(address, timestamp);
      }
    }
    
    return true;
  } catch (error) {
    // File doesn't exist or invalid JSON - start fresh
    console.log('Health store file not found or invalid, starting fresh:', error);
    return false;
  }
}

/**
 * Save health store to JSON file (persistence)
 */
export async function saveHealthStore(filePath: string): Promise<boolean> {
  try {
    const fs = await import('fs/promises');
    const path = await import('path');
    
    // Ensure directory exists
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
    
    // Convert Maps to plain objects for JSON serialization
    const serializable = {
      checkins: Object.fromEntries(healthStore.checkins),
      lastCalculated: Object.fromEntries(healthStore.lastCalculated),
    };
    
    await fs.writeFile(filePath, JSON.stringify(serializable, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving health store:', error);
    return false;
  }
}

/**
 * Initialize health store by loading from file if it exists
 */
export async function initializeHealthStore(filePath: string): Promise<void> {
  await loadHealthStore(filePath);
}

/**
 * Reset health store (for testing)
 */
export function resetHealthStore(): void {
  healthStore = {
    checkins: new Map(),
    lastCalculated: new Map(),
  };
}