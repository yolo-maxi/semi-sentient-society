'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

import type { MockNotification } from '@/data/mock-notifications';

interface NotificationBannerProps {
  notifications: MockNotification[];
}

const TYPE_STYLES: Record<MockNotification['type'], { label: string; accent: string; chip: string }> = {
  welcome: {
    label: 'Welcome',
    accent: 'from-[#c9362c]/20 via-[#f59e0b]/10 to-transparent',
    chip: 'border-[#c9362c]/40 bg-[#c9362c]/12 text-[#8b1a12] dark:text-[#f5c7c2]',
  },
  corvee: {
    label: 'Corvee',
    accent: 'from-[#fb7185]/20 via-[#c9362c]/10 to-transparent',
    chip: 'border-[#fb7185]/35 bg-[#fb7185]/12 text-[#9f1239] dark:text-[#fecdd3]',
  },
  health: {
    label: 'Health',
    accent: 'from-[#22c55e]/20 via-[#14532d]/10 to-transparent',
    chip: 'border-[#22c55e]/35 bg-[#22c55e]/12 text-[#166534] dark:text-[#bbf7d0]',
  },
  reputation: {
    label: 'Reputation',
    accent: 'from-[#60a5fa]/20 via-[#1d4ed8]/10 to-transparent',
    chip: 'border-[#60a5fa]/35 bg-[#60a5fa]/12 text-[#1d4ed8] dark:text-[#bfdbfe]',
  },
};

export default function NotificationBanner({ notifications }: NotificationBannerProps) {
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  const visibleNotifications = useMemo(
    () => notifications.filter((notification) => !dismissedIds.includes(notification.id)),
    [dismissedIds, notifications]
  );

  if (visibleNotifications.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 top-[72px] z-[110] px-4 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-3">
        {visibleNotifications.map((notification) => {
          const styles = TYPE_STYLES[notification.type];

          return (
            <section
              key={notification.id}
              className="pointer-events-auto relative overflow-hidden rounded-[20px] border border-[var(--panel-border)] bg-[var(--panel-bg)] shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur-md"
              aria-label={notification.title}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${styles.accent}`} aria-hidden="true" />

              <div className="relative flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex min-h-8 items-center rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-[0.24em] ${styles.chip}`}
                    >
                      {styles.label}
                    </span>
                    <h2 className="font-[var(--heading)] text-lg uppercase tracking-[0.03em] text-[var(--text)]">
                      {notification.title}
                    </h2>
                  </div>

                  <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)] sm:text-[15px]">
                    {notification.description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                  {notification.ctaHref && notification.ctaLabel ? (
                    <Link
                      href={notification.ctaHref}
                      className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[var(--red-dark)] px-4 py-2 font-mono text-xs uppercase tracking-[0.16em] text-[var(--text)] transition hover:border-[var(--red)] hover:text-[var(--text)]"
                    >
                      {notification.ctaLabel}
                    </Link>
                  ) : null}

                  <button
                    type="button"
                    onClick={() =>
                      setDismissedIds((current) =>
                        current.includes(notification.id) ? current : [...current, notification.id]
                      )
                    }
                    className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[var(--border-soft)] px-4 py-2 font-mono text-xs uppercase tracking-[0.16em] text-[var(--muted)] transition hover:border-[var(--red-dark)] hover:text-[var(--text)]"
                    aria-label={`Dismiss ${notification.title}`}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
