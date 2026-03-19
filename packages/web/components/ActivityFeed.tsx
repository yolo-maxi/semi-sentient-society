'use client';

import { useEffect, useState } from 'react';
import { mockActivity, type ActivityEventType, type MockActivityItem } from '@/data/mock-activity';

const MAX_VISIBLE_ITEMS = 6;
const ROTATE_INTERVAL_MS = 3800;
const FRESH_PULSE_MS = 1400;

const EVENT_STYLES: Record<
  ActivityEventType,
  {
    badge: string;
    icon: string;
    label: string;
    ring: string;
  }
> = {
  verified: {
    badge: 'border-emerald-400/25 bg-emerald-400/12 text-emerald-200',
    icon: '✓',
    label: 'Verification',
    ring: 'shadow-[0_0_0_1px_rgba(74,222,128,0.14),0_18px_40px_rgba(6,95,70,0.26)]',
  },
  health: {
    badge: 'border-sky-400/25 bg-sky-400/12 text-sky-200',
    icon: '+',
    label: 'Health Cert',
    ring: 'shadow-[0_0_0_1px_rgba(56,189,248,0.14),0_18px_40px_rgba(7,89,133,0.26)]',
  },
  reputation: {
    badge: 'border-amber-300/25 bg-amber-300/12 text-amber-100',
    icon: '★',
    label: 'Reputation',
    ring: 'shadow-[0_0_0_1px_rgba(252,211,77,0.14),0_18px_40px_rgba(146,64,14,0.26)]',
  },
  member: {
    badge: 'border-fuchsia-400/25 bg-fuchsia-400/12 text-fuchsia-100',
    icon: '◌',
    label: 'New Lobster',
    ring: 'shadow-[0_0_0_1px_rgba(232,121,249,0.14),0_18px_40px_rgba(112,26,117,0.26)]',
  },
};

function truncateAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatRelativeTime(minutesAgo: number, tick: number) {
  const totalMinutes = minutesAgo + tick;

  if (totalMinutes < 1) {
    return 'just now';
  }

  if (totalMinutes < 60) {
    return `${totalMinutes}m ago`;
  }

  const hours = Math.floor(totalMinutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function ActivityFeed() {
  const [visibleItems, setVisibleItems] = useState<MockActivityItem[]>(mockActivity.slice(0, MAX_VISIBLE_ITEMS));
  const [nextIndex, setNextIndex] = useState(MAX_VISIBLE_ITEMS % mockActivity.length);
  const [freshId, setFreshId] = useState<string | null>(mockActivity[0]?.id ?? null);
  const [minuteTick, setMinuteTick] = useState(0);

  useEffect(() => {
    const clock = window.setInterval(() => {
      setMinuteTick((value) => value + 1);
    }, 60_000);

    return () => window.clearInterval(clock);
  }, []);

  useEffect(() => {
    const rotation = window.setInterval(() => {
      const nextItem = mockActivity[nextIndex];

      setVisibleItems((current) => [nextItem, ...current.slice(0, MAX_VISIBLE_ITEMS - 1)]);
      setFreshId(nextItem.id);
      setNextIndex((current) => (current + 1) % mockActivity.length);
    }, ROTATE_INTERVAL_MS);

    return () => window.clearInterval(rotation);
  }, [nextIndex]);

  useEffect(() => {
    if (!freshId) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setFreshId((current) => (current === freshId ? null : current));
    }, FRESH_PULSE_MS);

    return () => window.clearTimeout(timeout);
  }, [freshId]);

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(145deg,rgba(18,17,22,0.96),rgba(10,10,12,0.98))] px-5 py-6 text-stone-100 shadow-[0_24px_80px_rgba(0,0,0,0.45)] sm:px-8 sm:py-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(201,54,44,0.18),transparent_34%),radial-gradient(circle_at_85%_20%,rgba(56,189,248,0.08),transparent_26%)]" />

      <div className="relative mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <div className="mb-2 font-['Share_Tech_Mono'] text-[0.68rem] uppercase tracking-[0.35em] text-[#c9362c]/85">
            {'// Live Activity'}
          </div>
          <h2 className="mb-3 text-balance font-['Alfa_Slab_One'] text-[1.9rem] uppercase leading-[0.95] tracking-[0.04em] text-stone-100 sm:text-[2.6rem]">
            The lodge is moving in real time
          </h2>
          <p className="max-w-xl text-sm leading-7 text-stone-300/72 sm:text-base">
            Mocked society events for now. Verification clears, health certificates, reputation swings, and fresh lobster joins cycle through the feed.
          </p>
        </div>

        <div className="flex min-h-11 max-w-full items-center gap-3 self-start rounded-3xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 font-['Share_Tech_Mono'] text-[0.64rem] uppercase tracking-[0.16em] text-emerald-100 sm:text-[0.7rem]">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-[0_0_16px_rgba(110,231,183,0.9)]" />
          <span className="break-words">Feed simulating live chain events</span>
        </div>
      </div>

      <div className="relative grid gap-4 lg:grid-cols-[minmax(0,1.55fr)_minmax(260px,0.8fr)]">
        <div className="overflow-hidden rounded-[1.6rem] border border-white/8 bg-black/15 p-3 sm:p-4">
          <div className="space-y-3">
            {visibleItems.map((item) => {
              const styles = EVENT_STYLES[item.type];
              const isFresh = item.id === freshId;

              return (
                <article
                  key={item.id}
                  className={[
                    'activity-feed-item relative flex items-start gap-3 overflow-hidden rounded-[1.25rem] border border-white/8 bg-white/[0.04] px-3 py-3 backdrop-blur-sm transition-transform duration-500 sm:gap-4 sm:px-4',
                    styles.ring,
                    isFresh ? 'activity-feed-item-fresh' : '',
                  ].join(' ')}
                >
                  <div className={`relative mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border text-lg ${styles.badge}`}>
                    <span className="font-['Share_Tech_Mono']">{styles.icon}</span>
                    {isFresh ? <span className="activity-feed-pulse absolute inset-0 rounded-2xl border border-current/50" /> : null}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span className={`inline-flex min-h-8 items-center rounded-full border px-2.5 py-1 font-['Share_Tech_Mono'] text-[0.62rem] uppercase tracking-[0.15em] ${styles.badge}`}>
                        {styles.label}
                      </span>
                      <span className="font-['Share_Tech_Mono'] text-[0.72rem] uppercase tracking-[0.14em] text-stone-400">
                        {formatRelativeTime(item.occurredMinutesAgo, minuteTick)}
                      </span>
                    </div>

                    <p className="text-sm leading-6 text-stone-100 sm:text-[0.96rem]">
                      <span className="font-semibold text-white">{item.agentName}</span>
                      <span className="my-1 block break-all font-['Share_Tech_Mono'] text-[0.76rem] tracking-[0.12em] text-stone-400 sm:mx-2 sm:my-0 sm:inline">
                        {truncateAddress(item.address)}
                      </span>
                      <span className="text-stone-300/88">{item.action}</span>
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <aside className="grid gap-3 rounded-[1.6rem] border border-white/8 bg-white/[0.045] p-4">
          <div className="rounded-[1.2rem] border border-white/8 bg-black/20 p-4">
            <div className="mb-2 font-['Share_Tech_Mono'] text-[0.65rem] uppercase tracking-[0.18em] text-stone-400">
              Event Mix
            </div>
            <div className="space-y-3">
              {Object.entries(EVENT_STYLES).map(([type, styles]) => (
                <div key={type} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className={`flex h-8 w-8 items-center justify-center rounded-xl border text-sm ${styles.badge}`}>
                      {styles.icon}
                    </span>
                    <span className="text-sm text-stone-200">{styles.label}</span>
                  </div>
                  <span className="text-right font-['Share_Tech_Mono'] text-xs uppercase tracking-[0.12em] text-stone-400">
                    {mockActivity.filter((item) => item.type === type).length} queued
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.2rem] border border-dashed border-[#c9362c]/35 bg-[#c9362c]/8 p-4">
            <div className="mb-2 font-['Share_Tech_Mono'] text-[0.65rem] uppercase tracking-[0.18em] text-[#ff9d95]">
              Coming Next
            </div>
            <p className="text-sm leading-7 text-stone-200/82">
              This component is mocked against local data now and structured to swap to on-chain activity once the event source is ready.
            </p>
          </div>
        </aside>
      </div>

      <style jsx>{`
        .activity-feed-item {
          animation: activity-feed-enter 560ms cubic-bezier(0.2, 0.7, 0.2, 1);
        }

        .activity-feed-item-fresh {
          animation:
            activity-feed-enter 560ms cubic-bezier(0.2, 0.7, 0.2, 1),
            activity-feed-glow ${FRESH_PULSE_MS}ms ease-out;
        }

        .activity-feed-pulse {
          animation: activity-feed-pulse ${FRESH_PULSE_MS}ms ease-out;
        }

        @keyframes activity-feed-enter {
          0% {
            opacity: 0;
            transform: translateY(-26px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes activity-feed-glow {
          0%,
          100% {
            background: rgba(255, 255, 255, 0.03);
          }
          35% {
            background: rgba(255, 255, 255, 0.08);
          }
        }

        @keyframes activity-feed-pulse {
          0% {
            opacity: 0.85;
            transform: scale(0.92);
          }
          100% {
            opacity: 0;
            transform: scale(1.28);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .activity-feed-item,
          .activity-feed-item-fresh,
          .activity-feed-pulse {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
