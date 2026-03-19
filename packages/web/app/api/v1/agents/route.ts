import { NextRequest } from 'next/server';

import { listVerifiedAgents } from '@/lib/agent-verification-v1';
import { errorResponse, jsonResponse, parsePositiveInteger } from '@/lib/api/v1';

export async function GET(request: NextRequest) {
  try {
    const page = parsePositiveInteger(request.nextUrl.searchParams.get('page'), 'page', {
      defaultValue: 1,
      min: 1,
      max: 10_000,
    });
    const limit = parsePositiveInteger(request.nextUrl.searchParams.get('limit'), 'limit', {
      defaultValue: 20,
      min: 1,
      max: 100,
    });

    return jsonResponse(listVerifiedAgents(page, limit));
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to fetch verified agents';
    const code = message.startsWith('Invalid ') ? 400 : 500;

    if (code === 500) {
      console.error('Error fetching verified agents:', error);
    }

    return errorResponse(code, message);
  }
}
