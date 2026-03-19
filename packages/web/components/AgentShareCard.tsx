'use client';

import { useState } from 'react';

interface AgentShareCardProps {
  address: string;
  name: string;
  trustScore: number;
  corveeCompleted: number;
  joinedAt: string;
  healthStatus: 'healthy' | 'warning' | 'inactive';
  profileUrl: string;
  imageUrl: string;
}

function truncateAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateString));
}

function getHealthClasses(status: AgentShareCardProps['healthStatus']) {
  switch (status) {
    case 'healthy':
      return 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200';
    case 'warning':
      return 'border-amber-400/30 bg-amber-500/10 text-amber-200';
    default:
      return 'border-red-400/30 bg-red-500/10 text-red-200';
  }
}

function getHealthLabel(status: AgentShareCardProps['healthStatus']) {
  switch (status) {
    case 'healthy':
      return 'Healthy';
    case 'warning':
      return 'Warning';
    default:
      return 'Inactive';
  }
}

export default function AgentShareCard({
  address,
  name,
  trustScore,
  corveeCompleted,
  joinedAt,
  healthStatus,
  profileUrl,
  imageUrl,
}: AgentShareCardProps) {
  const [copyState, setCopyState] = useState<'idle' | 'done' | 'error'>('idle');

  const shareText = `Verified Lobster: ${name} on Semi-Sentients Society. Trust ${trustScore}, ${corveeCompleted} corvees completed.`;
  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(profileUrl)}`;
  const farcasterUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(`${shareText} ${profileUrl}`)}`;

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(imageUrl);
      setCopyState('done');
    } catch {
      setCopyState('error');
    }

    window.setTimeout(() => {
      setCopyState('idle');
    }, 2000);
  }

  return (
    <section className="mt-8 rounded-[2rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(12,20,38,0.96),rgba(5,11,24,0.98))] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.28)] sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-[var(--mono)] text-[0.68rem] uppercase tracking-[0.28em] text-cyan-200/80">
            Share Profile
          </p>
          <h2 className="mt-3 text-2xl uppercase tracking-[0.05em] text-[var(--text)]">
            Social card preview
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
            Share this verified lobster profile with a dynamic social card generated from the directory dataset.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex min-h-11 items-center rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 font-[var(--mono)] text-[0.7rem] uppercase tracking-[0.2em] text-cyan-100 transition hover:border-cyan-200/40 hover:bg-cyan-300/15"
          >
            {copyState === 'done'
              ? 'Link copied! Share on Farcaster/Twitter'
              : copyState === 'error'
                ? 'Copy failed'
                : 'Copy OG image URL'}
          </button>
          <a
            href={xUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center rounded-full border border-[var(--red-dark)] px-4 font-[var(--mono)] text-[0.7rem] uppercase tracking-[0.2em] text-[var(--text)] transition hover:border-[var(--red)] hover:text-[var(--red)]"
          >
            Share on X
          </a>
          <a
            href={farcasterUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center rounded-full border border-[var(--red-dark)] px-4 font-[var(--mono)] text-[0.7rem] uppercase tracking-[0.2em] text-[var(--text)] transition hover:border-[var(--red)] hover:text-[var(--red)]"
          >
            Share on Farcaster
          </a>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-[1.75rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.2),transparent_30%),linear-gradient(135deg,#020617_0%,#082f49_50%,#0f172a_100%)] p-5">
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="flex-1 rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.78),rgba(2,6,23,0.88))] p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-3 rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 font-[var(--mono)] text-[0.68rem] uppercase tracking-[0.18em] text-cyan-100">
                  <span className="text-base leading-none">🦞</span>
                  Verified Lobster
                </div>
                <h3 className="mt-4 text-3xl font-semibold tracking-[0.03em] text-white">
                  {name}
                </h3>
                <p className="mt-2 font-[var(--mono)] text-sm tracking-[0.14em] text-slate-300">
                  {truncateAddress(address)}
                </p>
              </div>

              <div className="min-w-40 rounded-3xl border border-white/10 bg-slate-950/40 p-4">
                <p className="font-[var(--mono)] text-[0.62rem] uppercase tracking-[0.22em] text-slate-400">
                  Trust Score
                </p>
                <p className="mt-3 text-5xl text-white">{trustScore}</p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <article className="rounded-3xl border border-white/10 bg-slate-950/35 p-4">
                <p className="font-[var(--mono)] text-[0.62rem] uppercase tracking-[0.2em] text-slate-400">
                  Corvee Completed
                </p>
                <p className="mt-3 text-2xl text-white">{corveeCompleted}</p>
              </article>
              <article className="rounded-3xl border border-white/10 bg-slate-950/35 p-4">
                <p className="font-[var(--mono)] text-[0.62rem] uppercase tracking-[0.2em] text-slate-400">
                  Joined Society
                </p>
                <p className="mt-3 text-2xl text-white">{formatDate(joinedAt)}</p>
              </article>
              <article className={`rounded-3xl border p-4 ${getHealthClasses(healthStatus)}`}>
                <p className="font-[var(--mono)] text-[0.62rem] uppercase tracking-[0.2em]">
                  Health Status
                </p>
                <p className="mt-3 text-2xl">{getHealthLabel(healthStatus)}</p>
              </article>
            </div>
          </div>

          <div className="w-full max-w-sm rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
            <p className="font-[var(--mono)] text-[0.62rem] uppercase tracking-[0.22em] text-slate-400">
              OG image endpoint
            </p>
            <p className="mt-3 break-all font-[var(--mono)] text-xs leading-6 text-slate-300">
              {imageUrl}
            </p>
            <p className="mt-5 font-[var(--mono)] text-[0.62rem] uppercase tracking-[0.22em] text-slate-400">
              Profile URL
            </p>
            <p className="mt-3 break-all font-[var(--mono)] text-xs leading-6 text-slate-300">
              {profileUrl}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
