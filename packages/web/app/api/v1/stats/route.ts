import { getSocietyStats } from '@/lib/agent-verification-v1';
import { errorResponse, jsonResponse } from '@/lib/api/v1';

export async function GET() {
  try {
    return jsonResponse(getSocietyStats());
  } catch (error) {
    console.error('Error fetching agent verification stats:', error);
    return errorResponse(500, 'Failed to fetch agent verification stats');
  }
}
