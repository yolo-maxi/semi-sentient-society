import { NextRequest, NextResponse } from 'next/server';
import { getOnboardingState, triggerNextOnboardingStep } from '@/lib/onboarding-flow';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
} as const;

function jsonResponse(body: unknown, init?: ResponseInit) {
  return NextResponse.json(body, {
    ...init,
    headers: {
      ...CORS_HEADERS,
      ...init?.headers,
    },
  });
}

export async function GET(request: NextRequest) {
  const address = request.nextUrl.searchParams.get('address');

  if (!address) {
    return jsonResponse({ error: 'Address query parameter is required.' }, { status: 400 });
  }

  try {
    const state = getOnboardingState(address);

    return jsonResponse({
      address: state.address,
      onboarding: state,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load onboarding state.';
    return jsonResponse({ error: message }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  let address: string | null = null;

  try {
    const body = (await request.json()) as { address?: string };
    address = body.address ?? null;
  } catch {
    address = null;
  }

  if (!address) {
    return jsonResponse({ error: 'Address is required in the request body.' }, { status: 400 });
  }

  try {
    const result = triggerNextOnboardingStep(address);

    return jsonResponse({
      triggered: result.triggered,
      triggeredStep: result.triggeredStep,
      onboarding: result.state,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to advance onboarding.';
    return jsonResponse({ error: message }, { status: 400 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: CORS_HEADERS,
  });
}
