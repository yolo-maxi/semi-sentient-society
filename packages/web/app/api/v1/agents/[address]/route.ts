import { NextRequest } from 'next/server';

import { getPublicAgentByAddress, isValidAgentAddress } from '@/lib/agent-verification-v1';
import { errorResponse, jsonResponse } from '@/lib/api/v1';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;

    if (!isValidAgentAddress(address)) {
      return errorResponse(400, 'Invalid address format');
    }

    const agent = getPublicAgentByAddress(address);

    if (!agent) {
      return errorResponse(404, 'Agent not found');
    }

    return jsonResponse(agent);
  } catch (error) {
    console.error('Error fetching public agent verification record:', error);
    return errorResponse(500, 'Failed to fetch agent verification record');
  }
}
