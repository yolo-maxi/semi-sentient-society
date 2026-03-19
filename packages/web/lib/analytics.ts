import { promises as fs } from 'node:fs';
import path from 'node:path';

export const ANALYTICS_EVENT_TYPES = [
  'page_view',
  'wallet_connect',
  'verification_start',
  'verification_complete',
  'guide_view',
] as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENT_TYPES)[number];

export interface AnalyticsEvent {
  id: string;
  event: AnalyticsEventName;
  data: Record<string, unknown>;
  timestamp: string;
  userAgent: string;
}

export interface FunnelStats {
  totalEvents: number;
  counts: Record<AnalyticsEventName, number>;
  conversionRates: Record<string, number>;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const ANALYTICS_FILE = path.join(DATA_DIR, 'analytics-events.json');
const FUNNEL_STEPS: AnalyticsEventName[] = [
  'page_view',
  'wallet_connect',
  'verification_start',
  'verification_complete',
];

export function isAnalyticsEventName(value: string): value is AnalyticsEventName {
  return ANALYTICS_EVENT_TYPES.includes(value as AnalyticsEventName);
}

async function ensureAnalyticsFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(ANALYTICS_FILE);
  } catch {
    await fs.writeFile(ANALYTICS_FILE, '[]\n');
  }
}

async function readEvents(): Promise<AnalyticsEvent[]> {
  await ensureAnalyticsFile();

  try {
    const raw = await fs.readFile(ANALYTICS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as AnalyticsEvent[]) : [];
  } catch {
    return [];
  }
}

async function writeEvents(events: AnalyticsEvent[]) {
  await ensureAnalyticsFile();
  await fs.writeFile(ANALYTICS_FILE, `${JSON.stringify(events, null, 2)}\n`);
}

function normalizeEventData(
  data?: Record<string, unknown>,
): { payload: Record<string, unknown>; userAgent: string } {
  if (!data) {
    return { payload: {}, userAgent: 'unknown' };
  }

  const { userAgent, ...payload } = data;

  return {
    payload,
    userAgent: typeof userAgent === 'string' && userAgent.trim() ? userAgent : 'unknown',
  };
}

export async function trackEvent(name: string, data?: Record<string, unknown>): Promise<AnalyticsEvent> {
  if (!isAnalyticsEventName(name)) {
    throw new Error(`Unsupported analytics event: ${name}`);
  }

  const events = await readEvents();
  const { payload, userAgent } = normalizeEventData(data);

  const event: AnalyticsEvent = {
    id: crypto.randomUUID(),
    event: name,
    data: payload,
    timestamp: new Date().toISOString(),
    userAgent,
  };

  events.push(event);
  await writeEvents(events);

  return event;
}

export async function getEventsByType(type?: AnalyticsEventName): Promise<AnalyticsEvent[]> {
  const events = await readEvents();

  if (!type) {
    return events;
  }

  return events.filter((event) => event.event === type);
}

export async function getFunnelStats(): Promise<FunnelStats> {
  const events = await readEvents();

  const counts = ANALYTICS_EVENT_TYPES.reduce(
    (acc, eventName) => {
      acc[eventName] = events.filter((event) => event.event === eventName).length;
      return acc;
    },
    {} as Record<AnalyticsEventName, number>,
  );

  const conversionRates = FUNNEL_STEPS.slice(1).reduce(
    (acc, eventName, index) => {
      const previousStep = FUNNEL_STEPS[index];
      const previousCount = counts[previousStep];
      acc[`${previousStep}_to_${eventName}`] =
        previousCount > 0 ? Number(((counts[eventName] / previousCount) * 100).toFixed(2)) : 0;
      return acc;
    },
    {} as Record<string, number>,
  );

  return {
    totalEvents: events.length,
    counts,
    conversionRates,
  };
}
