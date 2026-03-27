"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type ReactElement } from "react";

import { useNotifications } from "@/lib/notifications";
import type { AppNotification, NotificationType } from "@/data/mock-notifications";

type NotificationStyle = {
  icon: ReactElement;
  label: string;
  chipClassName: string;
  iconClassName: string;
};

const RELATIVE_TIME_FORMATTER = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

const TYPE_STYLES: Record<NotificationType, NotificationStyle> = {
  corvee_assignment: {
    label: "Corvee",
    chipClassName: "border-[rgba(251,113,133,0.3)] bg-[rgba(251,113,133,0.12)] text-rose-100",
    iconClassName: "border-[rgba(251,113,133,0.28)] bg-[radial-gradient(circle_at_top,rgba(251,113,133,0.24),rgba(18,18,20,0.95))] text-rose-200",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[1.8]" aria-hidden="true">
        <path d="M7 6h10M7 12h10M7 18h6" strokeLinecap="round" />
        <path d="M5 4h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z" />
      </svg>
    ),
  },
  reputation_change: {
    label: "Reputation",
    chipClassName: "border-[rgba(96,165,250,0.3)] bg-[rgba(96,165,250,0.12)] text-sky-100",
    iconClassName: "border-[rgba(96,165,250,0.28)] bg-[radial-gradient(circle_at_top,rgba(96,165,250,0.24),rgba(18,18,20,0.95))] text-sky-200",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[1.8]" aria-hidden="true">
        <path d="m12 4 2.5 5.1 5.6.8-4.1 4 1 5.6-5-2.6-5 2.6 1-5.6-4.1-4 5.6-.8Z" strokeLinejoin="round" />
      </svg>
    ),
  },
  buddy_request: {
    label: "Buddy",
    chipClassName: "border-[rgba(34,197,94,0.28)] bg-[rgba(34,197,94,0.12)] text-emerald-100",
    iconClassName: "border-[rgba(34,197,94,0.24)] bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.22),rgba(18,18,20,0.95))] text-emerald-200",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[1.8]" aria-hidden="true">
        <path d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8 2a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.5 19a4.5 4.5 0 0 1 9 0M12.5 19a4.5 4.5 0 0 1 8 0" strokeLinecap="round" />
      </svg>
    ),
  },
  verification_status_change: {
    label: "Verification",
    chipClassName: "border-[rgba(168,85,247,0.3)] bg-[rgba(168,85,247,0.12)] text-violet-100",
    iconClassName: "border-[rgba(168,85,247,0.28)] bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.24),rgba(18,18,20,0.95))] text-violet-200",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[1.8]" aria-hidden="true">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
    ),
  },
  health_cert_reminder: {
    label: "Health",
    chipClassName: "border-[rgba(250,204,21,0.3)] bg-[rgba(250,204,21,0.12)] text-amber-100",
    iconClassName: "border-[rgba(250,204,21,0.28)] bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.22),rgba(18,18,20,0.95))] text-amber-200",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[1.8]" aria-hidden="true">
        <path d="M12 21s-6-4.35-6-10a4 4 0 0 1 7-2.65A4 4 0 0 1 20 11c0 5.65-8 10-8 10Z" strokeLinejoin="round" />
        <path d="M10 11h4M12 9v4" strokeLinecap="round" />
      </svg>
    ),
  },
  new_member_join: {
    label: "Member",
    chipClassName: "border-[rgba(201,54,44,0.3)] bg-[rgba(201,54,44,0.12)] text-[var(--text)]",
    iconClassName: "border-[rgba(201,54,44,0.28)] bg-[radial-gradient(circle_at_top,rgba(201,54,44,0.22),rgba(18,18,20,0.95))] text-[var(--red)]",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[1.8]" aria-hidden="true">
        <path d="M12 4v16M4 12h16" strokeLinecap="round" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    ),
  },
  probation_assignment: {
    label: "Probation",
    chipClassName: "border-[rgba(139,69,19,0.3)] bg-[rgba(139,69,19,0.12)] text-orange-100",
    iconClassName: "border-[rgba(139,69,19,0.28)] bg-[radial-gradient(circle_at_top,rgba(139,69,19,0.24),rgba(18,18,20,0.95))] text-orange-200",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[1.8]" aria-hidden="true">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 7a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  probation_evaluation_due: {
    label: "Evaluation",
    chipClassName: "border-[rgba(234,179,8,0.3)] bg-[rgba(234,179,8,0.12)] text-yellow-100",
    iconClassName: "border-[rgba(234,179,8,0.28)] bg-[radial-gradient(circle_at_top,rgba(234,179,8,0.24),rgba(18,18,20,0.95))] text-yellow-200",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[1.8]" aria-hidden="true">
        <path d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  probation_evaluation_overdue: {
    label: "Overdue",
    chipClassName: "border-[rgba(220,38,38,0.3)] bg-[rgba(220,38,38,0.12)] text-red-100",
    iconClassName: "border-[rgba(220,38,38,0.28)] bg-[radial-gradient(circle_at_top,rgba(220,38,38,0.24),rgba(18,18,20,0.95))] text-red-200",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[1.8]" aria-hidden="true">
        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  token_reward: {
    label: "Reward",
    chipClassName: "border-[rgba(52,211,153,0.3)] bg-[rgba(52,211,153,0.12)] text-emerald-100",
    iconClassName: "border-[rgba(52,211,153,0.28)] bg-[radial-gradient(circle_at_top,rgba(52,211,153,0.24),rgba(18,18,20,0.95))] text-emerald-200",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[1.8]" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M14.5 9a2.5 2.5 0 0 0-2.5-2h-1a2.5 2.5 0 0 0 0 5h2a2.5 2.5 0 0 1 0 5h-1a2.5 2.5 0 0 1-2.5-2M12 4v2m0 12v2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  governance_proposal: {
    label: "Governance",
    chipClassName: "border-[rgba(129,140,248,0.3)] bg-[rgba(129,140,248,0.12)] text-indigo-100",
    iconClassName: "border-[rgba(129,140,248,0.28)] bg-[radial-gradient(circle_at_top,rgba(129,140,248,0.24),rgba(18,18,20,0.95))] text-indigo-200",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[1.8]" aria-hidden="true">
        <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
};

function formatRelativeTime(value: string) {
  const timestamp = new Date(value).getTime();
  const deltaSeconds = Math.round((timestamp - Date.now()) / 1000);
  const absoluteSeconds = Math.abs(deltaSeconds);

  if (absoluteSeconds < 60) {
    return RELATIVE_TIME_FORMATTER.format(deltaSeconds, "second");
  }

  const deltaMinutes = Math.round(deltaSeconds / 60);

  if (Math.abs(deltaMinutes) < 60) {
    return RELATIVE_TIME_FORMATTER.format(deltaMinutes, "minute");
  }

  const deltaHours = Math.round(deltaMinutes / 60);

  if (Math.abs(deltaHours) < 24) {
    return RELATIVE_TIME_FORMATTER.format(deltaHours, "hour");
  }

  const deltaDays = Math.round(deltaHours / 24);

  if (Math.abs(deltaDays) < 7) {
    return RELATIVE_TIME_FORMATTER.format(deltaDays, "day");
  }

  const deltaWeeks = Math.round(deltaDays / 7);

  return RELATIVE_TIME_FORMATTER.format(deltaWeeks, "week");
}

function NotificationRow({
  notification,
  onSelect,
}: {
  notification: AppNotification;
  onSelect: (id: string) => void;
}) {
  const styles = TYPE_STYLES[notification.type];
  const content = (
    <>
      <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border ${styles.iconClassName}`}>
        {styles.icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex rounded-full border px-2.5 py-1 font-[var(--mono)] text-[0.58rem] uppercase tracking-[0.18em] ${styles.chipClassName}`}>
                {styles.label}
              </span>
              {!notification.read ? (
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[var(--red)] shadow-[0_0_16px_rgba(201,54,44,0.48)]" aria-label="Unread notification" />
              ) : (
                <span className="font-[var(--mono)] text-[0.6rem] uppercase tracking-[0.16em] text-[var(--muted)]">
                  Read
                </span>
              )}
            </div>
            <p className="text-sm leading-6 text-[var(--text)] sm:text-[0.95rem]">{notification.message}</p>
          </div>
          {!notification.read ? <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--red)]" aria-hidden="true" /> : null}
        </div>
        <time
          dateTime={notification.createdAt}
          className="mt-3 block font-[var(--mono)] text-[0.62rem] uppercase tracking-[0.18em] text-[var(--muted)]"
        >
          {formatRelativeTime(notification.createdAt)}
        </time>
      </div>
    </>
  );

  const className =
    "group flex w-full items-start gap-3 rounded-[1.35rem] border px-4 py-4 text-left transition duration-200 hover:-translate-y-0.5 hover:border-[var(--red-dark)] hover:bg-[rgba(255,255,255,0.04)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--red-dark)] " +
    (notification.read
      ? "border-white/8 bg-[rgba(255,255,255,0.02)]"
      : "border-[rgba(201,54,44,0.22)] bg-[linear-gradient(180deg,rgba(201,54,44,0.08),rgba(255,255,255,0.02))]");

  if (notification.href) {
    return (
      <Link href={notification.href} onClick={() => onSelect(notification.id)} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button 
      type="button" 
      onClick={() => onSelect(notification.id)} 
      className={className}
      aria-describedby={`notification-${notification.id}-content`}
    >
      {content}
    </button>
  );
}

export default function NotificationCenter() {
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const hasNotifications = notifications.length > 0;
  const buttonLabel = unreadCount > 0 ? `Notifications (${unreadCount} unread)` : "Notifications";
  const unreadSummary = useMemo(
    () => (unreadCount === 1 ? "1 unread alert" : `${unreadCount} unread alerts`),
    [unreadCount]
  );

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;

      if (
        open &&
        panelRef.current &&
        buttonRef.current &&
        !panelRef.current.contains(target) &&
        !buttonRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        // Return focus to trigger button
        buttonRef.current?.focus();
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label={buttonLabel}
        aria-expanded={open}
        aria-haspopup="dialog"
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" && !open) {
            setOpen(true);
            event.preventDefault();
          }
        }}
        className="relative inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-[var(--border-soft)] bg-[rgba(255,255,255,0.03)] text-[var(--text)] transition duration-200 hover:-translate-y-0.5 hover:border-[var(--red-dark)] hover:text-[var(--red)]"
      >
        <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-none stroke-current stroke-[1.8]" aria-hidden="true">
          <path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" strokeLinejoin="round" />
          <path d="M10 19a2 2 0 0 0 4 0" strokeLinecap="round" />
        </svg>
        {unreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full border border-[rgba(201,54,44,0.45)] bg-[var(--red)] px-1.5 py-0.5 font-[var(--mono)] text-[0.6rem] leading-none text-[var(--text-inverse)] shadow-[0_0_20px_rgba(201,54,44,0.45)]">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : null}
      </button>

      <div
        ref={panelRef}
        className={`absolute right-0 top-[calc(100%+0.75rem)] z-[140] w-[min(26rem,calc(100vw-2rem))] origin-top-right transition duration-200 ease-out max-sm:fixed max-sm:left-4 max-sm:right-4 max-sm:top-[4.75rem] max-sm:w-auto ${
          open ? "pointer-events-auto translate-y-0 scale-100 opacity-100" : "pointer-events-none -translate-y-2 scale-[0.98] opacity-0"
        }`}
      >
        <section
          role="dialog"
          aria-label="Notification center"
          className="overflow-hidden rounded-[1.8rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(18,18,20,0.96),rgba(9,9,11,0.99))] shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur-xl"
        >
          <header className="border-b border-white/8 bg-[radial-gradient(circle_at_top,rgba(201,54,44,0.12),transparent_55%)] px-5 py-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-[var(--mono)] text-[0.64rem] uppercase tracking-[0.24em] text-[var(--red)]">
                  Lodge Alerts
                </p>
                <h2 className="mt-2 font-[var(--heading)] text-lg uppercase tracking-[0.03em] text-[var(--text)]">
                  Notification Center
                </h2>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {hasNotifications ? unreadSummary : "No alerts waiting for you."}
                </p>
              </div>
              <button
                type="button"
                onClick={markAllRead}
                disabled={unreadCount === 0}
                className="inline-flex min-h-10 shrink-0 items-center rounded-full border border-[var(--border-soft)] px-3.5 font-[var(--mono)] text-[0.62rem] uppercase tracking-[0.18em] text-[var(--text)] transition hover:border-[var(--red-dark)] hover:text-[var(--red)] disabled:cursor-not-allowed disabled:opacity-40"
                aria-describedby="mark-all-read-description"
              >
                Mark all read
              </button>
              <div id="mark-all-read-description" className="sr-only">
                Mark all {unreadCount} unread notifications as read
              </div>
            </div>
          </header>

          {hasNotifications ? (
            <div className="max-h-[26rem] space-y-3 overflow-y-auto px-4 py-4">
              {notifications.map((notification) => (
                <NotificationRow key={notification.id} notification={notification} onSelect={markRead} />
              ))}
            </div>
          ) : (
            <div className="px-6 py-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[var(--border-soft)] bg-[radial-gradient(circle_at_top,rgba(201,54,44,0.15),rgba(18,18,20,0.98))] text-[var(--red)]">
                <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current stroke-[1.8]" aria-hidden="true">
                  <path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" strokeLinejoin="round" />
                  <path d="M10 19a2 2 0 0 0 4 0" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="mt-4 font-[var(--heading)] text-base uppercase tracking-[0.04em] text-[var(--text)]">
                All quiet in the lodge
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                You&apos;re caught up. New corvee, buddy, and reputation updates will land here.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
