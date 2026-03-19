import { NextResponse } from 'next/server';

export const V1_RATE_LIMIT_MAX_REQUESTS = 100;
export const V1_RATE_LIMIT_WINDOW_MS = 60 * 1000;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
} as const;

export function buildCorsHeaders(extraHeaders?: HeadersInit): HeadersInit {
  return {
    ...CORS_HEADERS,
    ...extraHeaders,
  };
}

export function jsonResponse(body: unknown, init?: ResponseInit) {
  return NextResponse.json(body, {
    ...init,
    headers: buildCorsHeaders(init?.headers),
  });
}

export function errorResponse(code: number, error: string, init?: ResponseInit) {
  return jsonResponse(
    { error, code },
    {
      ...init,
      status: code,
    }
  );
}

export function parsePositiveInteger(
  value: string | null,
  field: string,
  options: { defaultValue: number; min: number; max: number }
): number {
  if (value === null) {
    return options.defaultValue;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < options.min || parsed > options.max) {
    throw new Error(`Invalid ${field} query parameter.`);
  }

  return parsed;
}

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');

  return forwardedFor?.split(',')[0]?.trim() || realIp || 'anonymous';
}
