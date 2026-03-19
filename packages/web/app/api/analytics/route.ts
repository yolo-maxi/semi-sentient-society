import { NextRequest, NextResponse } from 'next/server';
import { getEventsByType, getFunnelStats, isAnalyticsEventName, trackEvent } from '@/lib/analytics';

interface AnalyticsRequestBody {
  event?: string;
  data?: Record<string, unknown>;
  userAgent?: string;
}

export async function POST(request: NextRequest) {
  let body: AnalyticsRequestBody;

  try {
    body = (await request.json()) as AnalyticsRequestBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  if (!body.event) {
    return NextResponse.json({ error: 'Event name is required.' }, { status: 400 });
  }

  try {
    const event = await trackEvent(body.event, {
      ...(body.data ?? {}),
      userAgent: body.userAgent ?? request.headers.get('user-agent') ?? 'unknown',
    });

    return NextResponse.json({ success: true, event }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to store analytics event.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  const detailed = request.nextUrl.searchParams.get('detailed');
  const eventType = request.nextUrl.searchParams.get('event');

  if (detailed === 'true') {
    if (eventType && !isAnalyticsEventName(eventType)) {
      return NextResponse.json({ error: 'Unsupported analytics event type.' }, { status: 400 });
    }

    const normalizedEventType = eventType && isAnalyticsEventName(eventType) ? eventType : undefined;
    const events = await getEventsByType(normalizedEventType);
    return NextResponse.json({ events, count: events.length });
  }

  const stats = await getFunnelStats();

  return NextResponse.json(stats);
}
