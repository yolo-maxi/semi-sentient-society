'use client';

import { useState, useMemo, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import SiteNav from '../components/SiteNav';
import FadeIn from '../components/FadeIn';

const ACCENT = '#2dd4bf';
const RED = '#c9362c';

interface Preset {
  label: string;
  initialPrice: number;
  steepness: number;
  targetRaise: number;
  reserveRatio: number;
  description: string;
}

const PRESETS: Preset[] = [
  {
    label: 'Conservative',
    initialPrice: 0.01,
    steepness: 2,
    targetRaise: 50,
    reserveRatio: 70,
    description: 'Low volatility, gentle curve. Good for stable community tokens.',
  },
  {
    label: 'Balanced',
    initialPrice: 0.05,
    steepness: 5,
    targetRaise: 200,
    reserveRatio: 50,
    description: 'Moderate growth curve. Standard for most Lobster Launches.',
  },
  {
    label: 'Aggressive',
    initialPrice: 0.001,
    steepness: 9,
    targetRaise: 500,
    reserveRatio: 20,
    description: 'Steep price curve, high upside. For degen launches.',
  },
];

const MILESTONES = [10, 25, 50, 75, 100] as const;

function calcPrice(initialPrice: number, steepness: number, supplyPct: number): number {
  return initialPrice * Math.pow(1 + supplyPct / 100, steepness);
}

function formatEth(val: number): string {
  if (val >= 1000) return val.toFixed(0);
  if (val >= 100) return val.toFixed(1);
  if (val >= 1) return val.toFixed(2);
  if (val >= 0.01) return val.toFixed(4);
  return val.toFixed(6);
}

export default function CurveSimulatorPage() {
  return (
    <Suspense>
      <CurveSimulatorInner />
    </Suspense>
  );
}

function CurveSimulatorInner() {
  const searchParams = useSearchParams();
  const [initialPrice, setInitialPrice] = useState(0.05);
  const [steepness, setSteepness] = useState(5);
  const [targetRaise, setTargetRaise] = useState(200);
  const [reserveRatio, setReserveRatio] = useState(50);
  const [activePreset, setActivePreset] = useState<string | null>('Balanced');
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Restore simulation state from URL params on mount
  useEffect(() => {
    const ip = searchParams.get('ip');
    const s = searchParams.get('s');
    const tr = searchParams.get('tr');
    const rr = searchParams.get('rr');
    if (ip || s || tr || rr) {
      if (ip) setInitialPrice(Math.max(0.001, Math.min(1, Number(ip) || 0.05)));
      if (s) setSteepness(Math.max(1, Math.min(10, Number(s) || 5)));
      if (tr) setTargetRaise(Math.max(10, Math.min(1000, Number(tr) || 200)));
      if (rr) setReserveRatio(Math.max(10, Math.min(90, Number(rr) || 50)));
      setActivePreset(null);
    }
  }, [searchParams]);

  const metrics = useMemo(() => {
    const priceAtMilestones = MILESTONES.map((pct) => ({
      pct,
      price: calcPrice(initialPrice, steepness, pct),
    }));

    const priceAt50 = calcPrice(initialPrice, steepness, 50);
    const priceAt100 = calcPrice(initialPrice, steepness, 100);
    const totalSupply = targetRaise / priceAt100;
    const maxMarketCap = totalSupply * priceAt100;
    const reservePool = targetRaise * (reserveRatio / 100);

    return { priceAtMilestones, priceAt50, priceAt100, maxMarketCap, reservePool, totalSupply };
  }, [initialPrice, steepness, targetRaise, reserveRatio]);

  const maxPrice = Math.max(...metrics.priceAtMilestones.map((m) => m.price));

  function applyPreset(preset: Preset) {
    setInitialPrice(preset.initialPrice);
    setSteepness(preset.steepness);
    setTargetRaise(preset.targetRaise);
    setReserveRatio(preset.reserveRatio);
    setActivePreset(preset.label);
  }

  function clearPreset() {
    setActivePreset(null);
  }

  const buildShareUrl = useCallback(() => {
    const params = new URLSearchParams({
      ip: String(initialPrice),
      s: String(steepness),
      tr: String(targetRaise),
      rr: String(reserveRatio),
    });
    return `${typeof window !== 'undefined' ? window.location.origin : ''}/curve-simulator?${params.toString()}`;
  }, [initialPrice, steepness, targetRaise, reserveRatio]);

  const shareText = `Check out my bonding curve simulation on SSS!\n\nBuy price: ${formatEth(initialPrice)} ETH | Sell price: ${formatEth(metrics.priceAt100)} ETH | Steepness: ${steepness}x`;

  function handleCopyLink() {
    navigator.clipboard.writeText(buildShareUrl()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleTwitterShare() {
    const url = `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(buildShareUrl())}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  return (
    <>
      <SiteNav />

      <main id="main-content">
        {/* Hero */}
        <section className="hero" aria-labelledby="curve-title">
          <div className="container hero-shell" style={{ position: 'relative', zIndex: 1 }}>
            <div className="section-label" style={{ color: RED }}>
              {'// Lobster Launch Tools'}
            </div>
            <h1
              id="curve-title"
              style={{ color: RED, textShadow: '0 0 30px rgba(201,54,44,.3), 2px 2px 0 #000' }}
            >
              Bonding Curve <span style={{ color: 'var(--text)' }}>Simulator</span>
            </h1>
            <p className="tagline">Launch Parameter Calibration</p>
            <p className="subtitle">
              Calibrate your launch parameters before deploying. Experiment with
              curve steepness, initial price, and reserve ratios to find the
              perfect configuration for your Lobster Launch.
            </p>
          </div>
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 800,
              height: 800,
              background: 'radial-gradient(circle, rgba(201,54,44,.08) 0%, transparent 60%)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
        </section>

        {/* Preset Buttons */}
        <FadeIn>
          <div className="container">
            <p
              className="mb-4 font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.32em]"
              style={{ color: RED }}
            >
              {'// Presets'}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 mb-2">
              {PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className="flex-1 border p-4 text-left transition"
                  style={{
                    borderColor:
                      activePreset === preset.label ? 'rgba(201,54,44,.6)' : 'var(--border)',
                    background:
                      activePreset === preset.label
                        ? 'rgba(201,54,44,.1)'
                        : 'var(--surface)',
                  }}
                >
                  <div
                    className="mb-1 font-[var(--font-heading)] text-sm uppercase"
                    style={{
                      color: activePreset === preset.label ? RED : 'var(--text)',
                    }}
                  >
                    {preset.label}
                  </div>
                  <div className="font-[var(--font-mono)] text-[0.6rem] uppercase tracking-[0.1em] text-[var(--muted)]">
                    {preset.description}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Controls + Chart */}
        <FadeIn>
          <div className="container">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Controls Panel */}
              <div
                className="border p-6"
                style={{
                  borderColor: 'rgba(201,54,44,.25)',
                  background: 'linear-gradient(180deg, rgba(201,54,44,.04), rgba(14,14,16,.98))',
                }}
              >
                <p
                  className="mb-6 font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.32em]"
                  style={{ color: RED }}
                >
                  {'// Parameters'}
                </p>

                {/* Initial Price */}
                <div className="mb-6">
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="initial-price"
                      className="font-[var(--font-mono)] text-[0.7rem] uppercase tracking-[0.12em] text-[var(--text)]"
                    >
                      Initial Price
                    </label>
                    <span
                      className="font-[var(--font-mono)] text-[0.8rem]"
                      style={{ color: ACCENT }}
                    >
                      {formatEth(initialPrice)} ETH
                    </span>
                  </div>
                  <input
                    id="initial-price"
                    type="range"
                    min={0.001}
                    max={1}
                    step={0.001}
                    value={initialPrice}
                    onChange={(e) => {
                      setInitialPrice(Number(e.target.value));
                      clearPreset();
                    }}
                    className="slider w-full"
                  />
                  <div className="mt-1 flex justify-between font-[var(--font-mono)] text-[0.55rem] uppercase tracking-[0.1em] text-[var(--muted)]">
                    <span>0.001 ETH</span>
                    <span>1 ETH</span>
                  </div>
                </div>

                {/* Curve Steepness */}
                <div className="mb-6">
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="steepness"
                      className="font-[var(--font-mono)] text-[0.7rem] uppercase tracking-[0.12em] text-[var(--text)]"
                    >
                      Curve Steepness
                    </label>
                    <span
                      className="font-[var(--font-mono)] text-[0.8rem]"
                      style={{ color: ACCENT }}
                    >
                      {steepness}x
                    </span>
                  </div>
                  <input
                    id="steepness"
                    type="range"
                    min={1}
                    max={10}
                    step={0.1}
                    value={steepness}
                    onChange={(e) => {
                      setSteepness(Number(e.target.value));
                      clearPreset();
                    }}
                    className="slider w-full"
                  />
                  <div className="mt-1 flex justify-between font-[var(--font-mono)] text-[0.55rem] uppercase tracking-[0.1em] text-[var(--muted)]">
                    <span>1x (Flat)</span>
                    <span>10x (Steep)</span>
                  </div>
                </div>

                {/* Target Raise */}
                <div className="mb-6">
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="target-raise"
                      className="font-[var(--font-mono)] text-[0.7rem] uppercase tracking-[0.12em] text-[var(--text)]"
                    >
                      Target Raise
                    </label>
                    <span
                      className="font-[var(--font-mono)] text-[0.8rem]"
                      style={{ color: ACCENT }}
                    >
                      {targetRaise} ETH
                    </span>
                  </div>
                  <input
                    id="target-raise"
                    type="number"
                    min={10}
                    max={1000}
                    value={targetRaise}
                    onChange={(e) => {
                      const val = Math.max(10, Math.min(1000, Number(e.target.value) || 10));
                      setTargetRaise(val);
                      clearPreset();
                    }}
                    className="w-full border bg-[var(--surface2)] px-4 py-2 font-[var(--font-mono)] text-[0.8rem] text-[var(--text)] outline-none transition focus:border-[rgba(201,54,44,.5)]"
                    style={{ borderColor: 'var(--border)' }}
                  />
                  <div className="mt-1 flex justify-between font-[var(--font-mono)] text-[0.55rem] uppercase tracking-[0.1em] text-[var(--muted)]">
                    <span>Min 10 ETH</span>
                    <span>Max 1,000 ETH</span>
                  </div>
                </div>

                {/* Reserve Ratio */}
                <div className="mb-2">
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="reserve-ratio"
                      className="font-[var(--font-mono)] text-[0.7rem] uppercase tracking-[0.12em] text-[var(--text)]"
                    >
                      Reserve Ratio
                    </label>
                    <span
                      className="font-[var(--font-mono)] text-[0.8rem]"
                      style={{ color: ACCENT }}
                    >
                      {reserveRatio}%
                    </span>
                  </div>
                  <input
                    id="reserve-ratio"
                    type="range"
                    min={10}
                    max={90}
                    step={1}
                    value={reserveRatio}
                    onChange={(e) => {
                      setReserveRatio(Number(e.target.value));
                      clearPreset();
                    }}
                    className="slider w-full"
                  />
                  <div className="mt-1 flex justify-between font-[var(--font-mono)] text-[0.55rem] uppercase tracking-[0.1em] text-[var(--muted)]">
                    <span>10% (Low Liquidity)</span>
                    <span>90% (High Liquidity)</span>
                  </div>
                </div>
              </div>

              {/* Chart Panel */}
              <div
                className="border p-6"
                style={{
                  borderColor: 'rgba(201,54,44,.25)',
                  background: 'linear-gradient(180deg, rgba(201,54,44,.04), rgba(14,14,16,.98))',
                }}
              >
                <p
                  className="mb-6 font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.32em]"
                  style={{ color: RED }}
                >
                  {'// Price Curve Preview'}
                </p>

                {/* Bar Chart */}
                <div className="mb-8 flex items-end gap-3" style={{ height: 200 }}>
                  {metrics.priceAtMilestones.map((m) => {
                    const heightPct = maxPrice > 0 ? (m.price / maxPrice) * 100 : 0;
                    return (
                      <div key={m.pct} className="flex flex-1 flex-col items-center gap-2">
                        <span className="font-[var(--font-mono)] text-[0.55rem] text-[var(--muted)]">
                          {formatEth(m.price)}
                        </span>
                        <div
                          className="w-full transition-all duration-300"
                          style={{
                            height: `${Math.max(heightPct, 2)}%`,
                            background: `linear-gradient(180deg, ${RED}, rgba(201,54,44,.4))`,
                            border: '1px solid rgba(201,54,44,.5)',
                            boxShadow: '0 0 12px rgba(201,54,44,.2)',
                          }}
                        />
                        <span className="font-[var(--font-mono)] text-[0.6rem] uppercase text-[var(--text)]">
                          {m.pct}%
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Calculated Metrics */}
                <p
                  className="mb-4 font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.32em]"
                  style={{ color: RED }}
                >
                  {'// Calculated Metrics'}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Price @ 50% Sold', value: `${formatEth(metrics.priceAt50)} ETH` },
                    { label: 'Price @ 100% Sold', value: `${formatEth(metrics.priceAt100)} ETH` },
                    { label: 'Max Market Cap', value: `${formatEth(metrics.maxMarketCap)} ETH` },
                    { label: 'Reserve Pool', value: `${formatEth(metrics.reservePool)} ETH` },
                  ].map((metric) => (
                    <div
                      key={metric.label}
                      className="border p-3"
                      style={{
                        borderColor: 'var(--border)',
                        background: 'var(--surface)',
                      }}
                    >
                      <div className="mb-1 font-[var(--font-mono)] text-[0.55rem] uppercase tracking-[0.12em] text-[var(--muted)]">
                        {metric.label}
                      </div>
                      <div
                        className="font-[var(--font-heading)] text-base uppercase md:text-lg"
                        style={{ color: ACCENT }}
                      >
                        {metric.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Export / Share Actions */}
        <FadeIn>
          <div className="container">
            <div className="flex flex-col items-center gap-4 py-2 sm:flex-row sm:justify-center">
              <button
                type="button"
                className="inline-block rounded-full px-8 py-3 font-[var(--font-mono)] text-[0.76rem] font-semibold uppercase tracking-wider text-black transition hover:shadow-[0_0_24px_rgba(201,54,44,0.35)]"
                style={{ background: RED }}
              >
                Export Config
              </button>
              <button
                type="button"
                onClick={() => setShareModalOpen(true)}
                className="inline-block rounded-full px-8 py-3 font-[var(--font-mono)] text-[0.76rem] font-semibold uppercase tracking-wider transition"
                style={{
                  color: RED,
                  border: '1px solid rgba(201,54,44,.45)',
                  background: 'transparent',
                }}
                onMouseOver={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(201,54,44,.1)';
                }}
                onMouseOut={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                }}
              >
                Share Results
              </button>
            </div>
          </div>
        </FadeIn>

        {/* Share Modal */}
        {shareModalOpen && (
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,.75)', backdropFilter: 'blur(4px)' }}
            onClick={(e) => { if (e.target === e.currentTarget) setShareModalOpen(false); }}
          >
            <div
              className="relative mx-4 w-full max-w-md border p-6"
              style={{
                background: 'linear-gradient(180deg, rgba(14,14,16,.99), rgba(10,10,12,.99))',
                borderColor: 'rgba(201,54,44,.4)',
                boxShadow: '0 0 60px rgba(201,54,44,.15), 0 25px 50px rgba(0,0,0,.5)',
              }}
            >
              {/* Close button */}
              <button
                type="button"
                onClick={() => setShareModalOpen(false)}
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center font-[var(--font-mono)] text-lg transition hover:opacity-70"
                style={{ color: 'var(--muted)' }}
              >
                &times;
              </button>

              <p
                className="mb-5 font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.32em]"
                style={{ color: RED }}
              >
                {'// Share Simulation'}
              </p>

              {/* Simulation Preview Card */}
              <div
                className="mb-6 border p-4"
                style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
              >
                <div className="mb-3 font-[var(--font-heading)] text-sm uppercase text-[var(--text)]">
                  Curve Configuration
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="font-[var(--font-mono)] text-[0.55rem] uppercase tracking-[0.1em] text-[var(--muted)]">
                      Buy Price (Initial)
                    </div>
                    <div className="font-[var(--font-mono)] text-sm" style={{ color: ACCENT }}>
                      {formatEth(initialPrice)} ETH
                    </div>
                  </div>
                  <div>
                    <div className="font-[var(--font-mono)] text-[0.55rem] uppercase tracking-[0.1em] text-[var(--muted)]">
                      Sell Price (100%)
                    </div>
                    <div className="font-[var(--font-mono)] text-sm" style={{ color: ACCENT }}>
                      {formatEth(metrics.priceAt100)} ETH
                    </div>
                  </div>
                  <div>
                    <div className="font-[var(--font-mono)] text-[0.55rem] uppercase tracking-[0.1em] text-[var(--muted)]">
                      Curve Type
                    </div>
                    <div className="font-[var(--font-mono)] text-sm" style={{ color: ACCENT }}>
                      {steepness <= 3 ? 'Conservative' : steepness <= 7 ? 'Moderate' : 'Aggressive'} ({steepness}x)
                    </div>
                  </div>
                  <div>
                    <div className="font-[var(--font-mono)] text-[0.55rem] uppercase tracking-[0.1em] text-[var(--muted)]">
                      Target Raise
                    </div>
                    <div className="font-[var(--font-mono)] text-sm" style={{ color: ACCENT }}>
                      {targetRaise} ETH
                    </div>
                  </div>
                </div>

                {/* Mini bar chart */}
                <div className="mt-4 flex items-end gap-1" style={{ height: 40 }}>
                  {metrics.priceAtMilestones.map((m) => {
                    const heightPct = maxPrice > 0 ? (m.price / maxPrice) * 100 : 0;
                    return (
                      <div
                        key={m.pct}
                        className="flex-1 transition-all"
                        style={{
                          height: `${Math.max(heightPct, 4)}%`,
                          background: `linear-gradient(180deg, ${RED}, rgba(201,54,44,.4))`,
                        }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Share Actions */}
              <div className="flex flex-col gap-3">
                {/* Copy Link */}
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex w-full items-center justify-center gap-2 border px-4 py-3 font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.12em] transition"
                  style={{
                    borderColor: copied ? 'rgba(45,212,191,.5)' : 'var(--border)',
                    background: copied ? 'rgba(45,212,191,.1)' : 'var(--surface)',
                    color: copied ? ACCENT : 'var(--text)',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  {copied ? 'Link Copied!' : 'Copy Link'}
                </button>

                <div className="grid grid-cols-2 gap-3">
                  {/* Twitter/X Share */}
                  <button
                    type="button"
                    onClick={handleTwitterShare}
                    className="flex items-center justify-center gap-2 border px-4 py-3 font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.12em] transition hover:border-[rgba(201,54,44,.4)]"
                    style={{
                      borderColor: 'var(--border)',
                      background: 'var(--surface)',
                      color: 'var(--text)',
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    Share on X
                  </button>

                  {/* Farcaster Share */}
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 border px-4 py-3 font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.12em] transition"
                    style={{
                      borderColor: 'var(--border)',
                      background: 'var(--surface)',
                      color: 'var(--muted)',
                      cursor: 'default',
                      opacity: 0.6,
                    }}
                    title="Farcaster sharing coming soon"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 3h18v3.6l-1.8 1.2v9.6h1.2V21H3.6v-3.6h1.2V7.8L3 6.6V3zm4.8 7.8c0-1.32 1.08-2.4 2.4-2.4h3.6c1.32 0 2.4 1.08 2.4 2.4v6H14.4v-6c0-.66-.54-1.2-1.2-1.2h-1.2v7.2H10.2v-7.2H9c-.66 0-1.2.54-1.2 1.2v6H6V10.8h1.8z" />
                    </svg>
                    Farcaster
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Explainer Section */}
        <FadeIn className="pb-24">
          <div className="container">
            <p
              className="mb-6 font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.32em]"
              style={{ color: RED }}
            >
              {'// Parameter Guide'}
            </p>
            <h2 className="mb-8 font-[var(--font-heading)] text-2xl uppercase text-[var(--text)] md:text-3xl">
              Understanding Your <span style={{ color: RED }}>Curve</span>
            </h2>

            <div className="grid gap-6 sm:grid-cols-2">
              {[
                {
                  title: 'Initial Price',
                  body: 'The starting price per token when the bonding curve launches. Lower initial prices allow early participants to acquire tokens cheaply, creating a larger price delta over the curve.',
                  icon: '\u25B3',
                },
                {
                  title: 'Curve Steepness',
                  body: 'The exponential factor that controls how aggressively the price increases as supply is purchased. A steepness of 1 is nearly linear; 10 creates an exponential hockey-stick curve.',
                  icon: '\u2197',
                },
                {
                  title: 'Target Raise',
                  body: 'The total amount of ETH the curve should collect when all tokens are sold. This determines the total token supply in conjunction with the price curve.',
                  icon: '\u25CE',
                },
                {
                  title: 'Reserve Ratio',
                  body: 'The percentage of raised ETH held in the bonding curve reserve for buyback liquidity. Higher ratios provide more liquidity for sellers but leave less for the project treasury.',
                  icon: '\u2696',
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="border p-6 transition-all hover:border-[rgba(201,54,44,.4)]"
                  style={{
                    borderColor: 'var(--border)',
                    background: 'var(--surface)',
                  }}
                >
                  <div className="mb-3 flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center font-[var(--font-heading)] text-lg"
                      style={{
                        color: RED,
                        background: 'rgba(201,54,44,.1)',
                        border: '1px solid rgba(201,54,44,.3)',
                      }}
                    >
                      {item.icon}
                    </div>
                    <h3 className="font-[var(--font-heading)] text-sm uppercase text-[var(--text)]">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-[0.85rem] leading-relaxed text-[var(--muted)]">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </main>

      <footer>
        <div className="container">
          <div className="footer-sss">$SSS</div>
          The Semi-Sentient Society &middot; 2026<br />
          <a href="https://x.com/SemiSentients" target="_blank" rel="noopener">Twitter</a> &middot;{' '}
          <a href="https://github.com/yolo-maxi/semi-sentient-society" target="_blank" rel="noopener">GitHub</a> &middot;{' '}
          <a href="/llms.txt">llms.txt</a>
          <div className="agent-hint">🤖 Agents: read <a href="/llms.txt">/llms.txt</a> for integration docs</div>
        </div>
      </footer>

      <style jsx>{`
        .slider {
          -webkit-appearance: none;
          appearance: none;
          height: 4px;
          background: var(--border);
          outline: none;
          border-radius: 2px;
          cursor: pointer;
        }
        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          background: ${RED};
          border: 2px solid rgba(201,54,44,.7);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 8px rgba(201,54,44,.4);
          transition: box-shadow 0.2s;
        }
        .slider::-webkit-slider-thumb:hover {
          box-shadow: 0 0 16px rgba(201,54,44,.6);
        }
        .slider::-moz-range-thumb {
          width: 18px;
          height: 18px;
          background: ${RED};
          border: 2px solid rgba(201,54,44,.7);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 8px rgba(201,54,44,.4);
        }
      `}</style>
    </>
  );
}
