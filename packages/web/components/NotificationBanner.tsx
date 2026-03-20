'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

import type { AppNotification } from '@/data/mock-notifications';

interface NotificationBannerProps {
  notifications: AppNotification[];
}

const TYPE_STYLES: Record<AppNotification['type'], { label: string; accent: string; chip: string }> = {
  corvee_assignment: {
    label: 'Corvee',
    accent: 'from-[#fb7185]/20 via-[#c9362c]/10 to-transparent',
    chip: 'border-[#fb7185]/35 bg-[#fb7185]/12 text-[#9f1239] dark:text-[#fecdd3]',
  },
  health_cert_reminder: {
    label: 'Health',
    accent: 'from-[#22c55e]/20 via-[#14532d]/10 to-transparent',
    chip: 'border-[#22c55e]/35 bg-[#22c55e]/12 text-[#166534] dark:text-[#bbf7d0]',
  },
  reputation_change: {
    label: 'Reputation',
    accent: 'from-[#60a5fa]/20 via-[#1d4ed8]/10 to-transparent',
    chip: 'border-[#60a5fa]/35 bg-[#60a5fa]/12 text-[#1d4ed8] dark:text-[#bfdbfe]',
  },
  buddy_request: {
    label: 'Buddy',
    accent: 'from-[#34d399]/20 via-[#065f46]/10 to-transparent',
    chip: 'border-[#34d399]/35 bg-[#34d399]/12 text-[#065f46] dark:text-[#d1fae5]',
  },
  verification_status_change: {
    label: 'Verification',
    accent: 'from-[#a855f7]/20 via-[#6b21a8]/10 to-transparent',
    chip: 'border-[#a855f7]/35 bg-[#a855f7]/12 text-[#6b21a8] dark:text-[#ddd6fe]',
  },
  new_member_join: {
    label: 'Member',
    accent: 'from-[#c9362c]/20 via-[#7f1d1d]/10 to-transparent',
    chip: 'border-[#c9362c]/40 bg-[#c9362c]/12 text-[#8b1a12] dark:text-[#f5c7c2]',
  },
  probation_assignment: {
    label: 'Probation',
    accent: 'from-[#8b4513]/20 via-[#654321]/10 to-transparent',
    chip: 'border-[#8b4513]/35 bg-[#8b4513]/12 text-[#654321] dark:text-[#deb887]',
  },
  probation_evaluation_due: {
    label: 'Evaluation',
    accent: 'from-[#eab308]/20 via-[#ca8a04]/10 to-transparent',
    chip: 'border-[#eab308]/35 bg-[#eab308]/12 text-[#ca8a04] dark:text-[#fef08a]',
  },
  probation_evaluation_overdue: {
    label: 'Overdue',
    accent: 'from-[#dc2626]/20 via-[#991b1b]/10 to-transparent',
    chip: 'border-[#dc2626]/35 bg-[#dc2626]/12 text-[#991b1b] dark:text-[#fecaca]',
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
              aria-label={notification.message}
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
                      {notification.message}
                    </h2>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                  {notification.href ? (
                    <Link
                      href={notification.href}
                      className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[var(--red-dark)] px-4 py-2 font-mono text-xs uppercase tracking-[0.16em] text-[var(--text)] transition hover:border-[var(--red)] hover:text-[var(--text)]"
                    >
                      Open
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
                    aria-label={`Dismiss ${notification.message}`}
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
