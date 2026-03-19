'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

type EventPayload = Record<string, unknown>;

async function postAnalyticsEvent(event: string, data?: EventPayload) {
  const payload = JSON.stringify({
    event,
    data,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
  });

  if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
    const blob = new Blob([payload], { type: 'application/json' });
    const queued = navigator.sendBeacon('/api/analytics', blob);

    if (queued) {
      return;
    }
  }

  await fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payload,
    keepalive: true,
  });
}

export function useTrackEvent() {
  return (event: string, data?: EventPayload) => {
    void postAnalyticsEvent(event, data);
  };
}

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    void postAnalyticsEvent('page_view', { pathname });
  }, [pathname]);

  return null;
}
