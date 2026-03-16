import { NextResponse } from 'next/server';
import { getDirectoryAgentProfile } from '../../../../lib/agent-directory';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;
    const profile = await getDirectoryAgentProfile(address);

    return NextResponse.json(profile);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to fetch agent profile.';
    const status = message.startsWith('Invalid agent address') ? 400 : 500;

    console.error('Error fetching directory profile:', error);

    return NextResponse.json({ error: message }, { status });
  }
}
