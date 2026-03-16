import { NextRequest, NextResponse } from 'next/server';
import { listDirectoryAgents, type DirectoryAgent } from '../../../lib/agent-directory';

type SortKey = 'trustScore' | 'lastActive';

function parseNumberParam(
  value: string | null,
  name: string,
  options: { defaultValue: number; min?: number; max?: number; integer?: boolean }
): number {
  if (value === null) {
    return options.defaultValue;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    throw new Error(`Invalid ${name} query parameter.`);
  }

  if (options.integer && !Number.isInteger(parsed)) {
    throw new Error(`Invalid ${name} query parameter.`);
  }

  if (options.min !== undefined && parsed < options.min) {
    throw new Error(`Invalid ${name} query parameter.`);
  }

  if (options.max !== undefined && parsed > options.max) {
    throw new Error(`Invalid ${name} query parameter.`);
  }

  return parsed;
}

function sortAgents(agents: DirectoryAgent[], sort: SortKey): DirectoryAgent[] {
  return [...agents].sort((left, right) => {
    if (sort === 'lastActive') {
      return (
        right.lastActive - left.lastActive ||
        right.trustScore - left.trustScore ||
        left.address.localeCompare(right.address)
      );
    }

    return (
      right.trustScore - left.trustScore ||
      right.lastActive - left.lastActive ||
      left.address.localeCompare(right.address)
    );
  });
}

export async function GET(request: NextRequest) {
  try {
    const capability = request.nextUrl.searchParams.get('capability')?.trim().toLowerCase();
    const minTrustScore = parseNumberParam(
      request.nextUrl.searchParams.get('minTrustScore'),
      'minTrustScore',
      { defaultValue: 0, min: 0, max: 100 }
    );
    const limit = parseNumberParam(request.nextUrl.searchParams.get('limit'), 'limit', {
      defaultValue: 20,
      min: 1,
      max: 100,
      integer: true,
    });
    const offset = parseNumberParam(request.nextUrl.searchParams.get('offset'), 'offset', {
      defaultValue: 0,
      min: 0,
      integer: true,
    });

    const sortParam = request.nextUrl.searchParams.get('sort');
    const sort: SortKey = sortParam === 'lastActive' ? 'lastActive' : 'trustScore';

    if (sortParam !== null && sortParam !== 'trustScore' && sortParam !== 'lastActive') {
      return NextResponse.json(
        { error: 'Invalid sort query parameter.' },
        { status: 400 }
      );
    }

    const agents = await listDirectoryAgents();
    const filteredAgents = agents.filter((agent) => {
      if (capability && !agent.capabilities.some((item) => item.toLowerCase() === capability)) {
        return false;
      }

      return agent.trustScore >= minTrustScore;
    });

    const sortedAgents = sortAgents(filteredAgents, sort);
    const paginatedAgents = sortedAgents.slice(offset, offset + limit);

    return NextResponse.json({
      agents: paginatedAgents,
      total: filteredAgents.length,
      page: Math.floor(offset / limit) + 1,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to fetch directory agents.';
    const status = message.startsWith('Invalid ') ? 400 : 500;

    console.error('Error fetching directory agents:', error);

    return NextResponse.json({ error: message }, { status });
  }
}
