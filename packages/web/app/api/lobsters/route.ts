import { NextResponse } from 'next/server';
import { MOCK_AGENTS } from '../../../data/mock-agents';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
} as const;

function jsonResponse(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: CORS_HEADERS,
  });
}

export async function GET() {
  const lobsters = MOCK_AGENTS.filter((agent) => agent.verified);

  return jsonResponse({
    lobsters,
    total: lobsters.length,
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: CORS_HEADERS,
  });
}
