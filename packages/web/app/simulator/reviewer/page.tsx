'use client';

import { useState, useMemo, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import SiteNav from '../../components/SiteNav';
import FadeIn from '../../components/FadeIn';

const ACCENT = '#2dd4bf';
const RED = '#c9362c';

/* ── Types ── */
interface Preset {
  label: string;
  baseReward: number;
  qualityMultiplier: number;
  speedBonusCap: number;
  badReviewPenalty: number;
  description: string;
}

/* ── Presets ── */
const PRESETS: Preset[] = [
  {
    label: 'Conservative',
    baseReward: 25,
    qualityMultiplier: 1.5,
    speedBonusCap: 10,
    badReviewPenalty: -20,
    description: 'Low risk, steady earnings. Prioritises consistency over upside.',
  },
  {
    label: 'Balanced',
    baseReward: 50,
    qualityMultiplier: 2,
    speedBonusCap: 25,
    badReviewPenalty: -30,
    description: 'Standard reviewer profile. Fair mix of reward and accountability.',
  },
  {
    label: 'Aggressive',
    baseReward: 80,
    qualityMultiplier: 2.8,
    speedBonusCap: 45,
    badReviewPenalty: -45,
    description: 'High reward, high stakes. Top reviewers only.',
  },
];

const MONTHLY_REVIEWS = 20;

/* ── Helpers ── */
function formatCSSS(val: number): string {
  if (Math.abs(val) >= 1000) return val.toFixed(0);
  if (Math.abs(val) >= 100) return val.toFixed(1);
  return val.toFixed(2);
}

function clamp(val: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, val));
}

/* ── Gaming-risk analysis ── */
interface Warning {
  label: string;
  message: string;
  severity: 'high' | 'medium';
}

function analyseGamingRisks(
  baseReward: number,
  qualityMultiplier: number,
  speedBonusCap: number,
  badReviewPenalty: number,
): Warning[] {
  const warnings: Warning[] = [];

  if (speedBonusCap > 35 && Math.abs(badReviewPenalty) < 25) {
    warnings.push({
      label: 'Speed Gaming',
      message: 'High speed bonus with low penalty incentivises rushing reviews without care for quality.',
      severity: 'high',
    });
  }

  if (qualityMultiplier >= 2.5 && baseReward >= 70) {
    warnings.push({
      label: 'Collusion Risk',
      message: 'Very high effective rewards may incentivise mutual high-rating collusion between reviewers.',
      severity: 'high',
    });
  }

  if (Math.abs(badReviewPenalty) < 15) {
    warnings.push({
      label: 'Low Accountability',
      message: 'Minimal penalty for bad reviews reduces deterrent against careless work.',
      severity: 'medium',
    });
  }

  if (baseReward < 20 && qualityMultiplier < 1.5) {
    warnings.push({
      label: 'Low Incentive',
      message: 'Rewards may be too low to attract quality reviewers, leading to reviewer shortage.',
      severity: 'medium',
    });
  }

  if (speedBonusCap >= 40 && qualityMultiplier <= 1.5) {
    warnings.push({
      label: 'Quality Neglect',
      message: 'Speed is rewarded much more than quality, encouraging superficial reviews.',
      severity: 'high',
    });
  }

  return warnings;
}

/* ── Optimal recommendation ── */
function getRecommendation(
  baseReward: number,
  qualityMultiplier: number,
  speedBonusCap: number,
  badReviewPenalty: number,
): string {
  const penaltyAbs = Math.abs(badReviewPenalty);
  const effectiveMax = baseReward * qualityMultiplier * (1 + speedBonusCap / 100);

  if (effectiveMax > 250 && penaltyAbs < 30) {
    return 'Increase penalty to at least -30% to balance the high earning potential. Current settings over-reward without sufficient accountability.';
  }
  if (effectiveMax < 40) {
    return 'Consider raising the base reward or quality multiplier. Current settings may not attract enough reviewer participation.';
  }
  if (speedBonusCap > 35 && qualityMultiplier < 2) {
    return 'Shift incentives from speed toward quality. Raise the quality multiplier above 2x and reduce speed bonus below 30%.';
  }
  if (penaltyAbs > 40 && baseReward < 40) {
    return 'The penalty-to-reward ratio is harsh. Reviewers may avoid participating. Consider raising base reward or softening penalty.';
  }
  if (qualityMultiplier >= 2 && penaltyAbs >= 25 && speedBonusCap <= 30) {
    return 'Well-balanced configuration. Quality is rewarded, speed is bounded, and penalties provide accountability without being punitive.';
  }
  return 'Settings are within acceptable ranges. Monitor reviewer participation and review accuracy after deployment to fine-tune.';
}

/* ── Page wrapper ── */
export default function ReviewerSimulatorPage() {
  return (
    <Suspense>
      <ReviewerSimulatorInner />
    </Suspense>
  );
}

/* ── Main component ── */
function ReviewerSimulatorInner() {
  const searchParams = useSearchParams();

  const [baseReward, setBaseReward] = useState(50);
  const [qualityMultiplier, setQualityMultiplier] = useState(2);
  const [speedBonusCap, setSpeedBonusCap] = useState(25);
  const [badReviewPenalty, setBadReviewPenalty] = useState(-30);
  const [activePreset, setActivePreset] = useState<string | null>('Balanced');
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Restore from URL
  useEffect(() => {
    const br = searchParams.get('br');
    const qm = searchParams.get('qm');
    const sb = searchParams.get('sb');
    const bp = searchParams.get('bp');
    if (br || qm || sb || bp) {
      if (br) setBaseReward(clamp(Number(br) || 50, 10, 100));
      if (qm) setQualityMultiplier(clamp(Number(qm) || 2, 1, 3));
      if (sb) setSpeedBonusCap(clamp(Number(sb) || 25, 0, 50));
      if (bp) setBadReviewPenalty(clamp(Number(bp) || -30, -50, -10));
      setActivePreset(null);
    }
  }, [searchParams]);

  /* ── Computed metrics ── */
  const metrics = useMemo(() => {
    const qualityReward = baseReward * qualityMultiplier;
    const speedBonus = qualityReward * (speedBonusCap / 100);
    const maxPerReview = qualityReward + speedBonus;
    const minPerReview = baseReward * (1 + badReviewPenalty / 100);
    const expectedPerReview = baseReward * qualityMultiplier * (1 + speedBonusCap / 200); // avg speed bonus = half cap
    const monthlyProjection = expectedPerReview * MONTHLY_REVIEWS;

    // "Average reviewer" baseline: 50 base, 1.5x quality, 15% speed, no penalties
    const avgPerReview = 50 * 1.5 * (1 + 15 / 200);
    const avgMonthly = avgPerReview * MONTHLY_REVIEWS;
    const comparisonPct = avgMonthly > 0 ? ((monthlyProjection - avgMonthly) / avgMonthly) * 100 : 0;

    return {
      qualityReward,
      speedBonus,
      maxPerReview,
      minPerReview,
      expectedPerReview,
      monthlyProjection,
      avgPerReview,
      avgMonthly,
      comparisonPct,
    };
  }, [baseReward, qualityMultiplier, speedBonusCap, badReviewPenalty]);

  const warnings = useMemo(
    () => analyseGamingRisks(baseReward, qualityMultiplier, speedBonusCap, badReviewPenalty),
    [baseReward, qualityMultiplier, speedBonusCap, badReviewPenalty],
  );

  const recommendation = useMemo(
    () => getRecommendation(baseReward, qualityMultiplier, speedBonusCap, badReviewPenalty),
    [baseReward, qualityMultiplier, speedBonusCap, badReviewPenalty],
  );

  /* ── Bar chart data: breakdown of a single expected review ── */
  const barData = useMemo(() => {
    const base = baseReward;
    const qualityBonus = baseReward * (qualityMultiplier - 1);
    const speed = metrics.expectedPerReview - baseReward * qualityMultiplier;
    const penalty = baseReward * (badReviewPenalty / 100);
    return [
      { label: 'Base', value: base },
      { label: 'Quality', value: qualityBonus },
      { label: 'Speed', value: speed },
      { label: 'Penalty', value: penalty },
    ];
  }, [baseReward, qualityMultiplier, badReviewPenalty, metrics.expectedPerReview]);

  const maxBarValue = Math.max(...barData.map((d) => Math.abs(d.value)));

  /* ── Preset helpers ── */
  function applyPreset(preset: Preset) {
    setBaseReward(preset.baseReward);
    setQualityMultiplier(preset.qualityMultiplier);
    setSpeedBonusCap(preset.speedBonusCap);
    setBadReviewPenalty(preset.badReviewPenalty);
    setActivePreset(preset.label);
  }

  function clearPreset() {
    setActivePreset(null);
  }

  /* ── Share helpers ── */
  const buildShareUrl = useCallback(() => {
    const params = new URLSearchParams({
      br: String(baseReward),
      qm: String(qualityMultiplier),
      sb: String(speedBonusCap),
      bp: String(badReviewPenalty),
    });
    return `${typeof window !== 'undefined' ? window.location.origin : ''}/simulator/reviewer?${params.toString()}`;
  }, [baseReward, qualityMultiplier, speedBonusCap, badReviewPenalty]);

  const shareText = `Check out my reviewer incentive simulation on SSS!\n\nExpected: ${formatCSSS(metrics.expectedPerReview)} cSSS/review | Monthly: ${formatCSSS(metrics.monthlyProjection)} cSSS | ${metrics.comparisonPct >= 0 ? '+' : ''}${metrics.comparisonPct.toFixed(0)}% vs avg`;

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
        <section className="hero" aria-labelledby="reviewer-title">
          <div className="container hero-shell" style={{ position: 'relative', zIndex: 1 }}>
            <div className="section-label" style={{ color: RED }}>
              {'// Corvée System Tools'}
            </div>
            <h1
              id="reviewer-title"
              style={{ color: RED, textShadow: '0 0 30px rgba(201,54,44,.3), 2px 2px 0 #000' }}
            >
              Reviewer Incentive <span style={{ color: 'var(--text)' }}>Simulator</span>
            </h1>
            <p className="tagline">Balance Quality, Speed, and Fairness</p>
            <p className="subtitle">
              Calibrate reviewer reward parameters before deployment. Experiment with
              base rewards, quality multipliers, speed bonuses, and penalties to find
              an incentive model that attracts quality reviewers without enabling gaming.
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
              {'// Scenario Presets'}
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

        {/* Controls + Results */}
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

                {/* Base Review Reward */}
                <div className="mb-6">
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="base-reward"
                      className="font-[var(--font-mono)] text-[0.7rem] uppercase tracking-[0.12em] text-[var(--text)]"
                    >
                      Base Review Reward
                    </label>
                    <span
                      className="font-[var(--font-mono)] text-[0.8rem]"
                      style={{ color: ACCENT }}
                    >
                      {baseReward} cSSS
                    </span>
                  </div>
                  <input
                    id="base-reward"
                    type="range"
                    min={10}
                    max={100}
                    step={1}
                    value={baseReward}
                    onChange={(e) => {
                      setBaseReward(Number(e.target.value));
                      clearPreset();
                    }}
                    className="slider w-full"
                  />
                  <div className="mt-1 flex justify-between font-[var(--font-mono)] text-[0.55rem] uppercase tracking-[0.1em] text-[var(--muted)]">
                    <span>10 cSSS</span>
                    <span>100 cSSS</span>
                  </div>
                </div>

                {/* Quality Multiplier */}
                <div className="mb-6">
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="quality-mult"
                      className="font-[var(--font-mono)] text-[0.7rem] uppercase tracking-[0.12em] text-[var(--text)]"
                    >
                      Quality Multiplier
                    </label>
                    <span
                      className="font-[var(--font-mono)] text-[0.8rem]"
                      style={{ color: ACCENT }}
                    >
                      {qualityMultiplier.toFixed(1)}x
                    </span>
                  </div>
                  <input
                    id="quality-mult"
                    type="range"
                    min={1}
                    max={3}
                    step={0.1}
                    value={qualityMultiplier}
                    onChange={(e) => {
                      setQualityMultiplier(Number(e.target.value));
                      clearPreset();
                    }}
                    className="slider w-full"
                  />
                  <div className="mt-1 flex justify-between font-[var(--font-mono)] text-[0.55rem] uppercase tracking-[0.1em] text-[var(--muted)]">
                    <span>1x (No Bonus)</span>
                    <span>3x (Max)</span>
                  </div>
                </div>

                {/* Speed Bonus Cap */}
                <div className="mb-6">
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="speed-cap"
                      className="font-[var(--font-mono)] text-[0.7rem] uppercase tracking-[0.12em] text-[var(--text)]"
                    >
                      Speed Bonus Cap
                    </label>
                    <span
                      className="font-[var(--font-mono)] text-[0.8rem]"
                      style={{ color: ACCENT }}
                    >
                      {speedBonusCap}%
                    </span>
                  </div>
                  <input
                    id="speed-cap"
                    type="range"
                    min={0}
                    max={50}
                    step={1}
                    value={speedBonusCap}
                    onChange={(e) => {
                      setSpeedBonusCap(Number(e.target.value));
                      clearPreset();
                    }}
                    className="slider w-full"
                  />
                  <div className="mt-1 flex justify-between font-[var(--font-mono)] text-[0.55rem] uppercase tracking-[0.1em] text-[var(--muted)]">
                    <span>0% (No Speed Bonus)</span>
                    <span>50% (Max)</span>
                  </div>
                </div>

                {/* Bad Review Penalty */}
                <div className="mb-2">
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="penalty"
                      className="font-[var(--font-mono)] text-[0.7rem] uppercase tracking-[0.12em] text-[var(--text)]"
                    >
                      Bad Review Penalty
                    </label>
                    <span
                      className="font-[var(--font-mono)] text-[0.8rem]"
                      style={{ color: '#f87171' }}
                    >
                      {badReviewPenalty}%
                    </span>
                  </div>
                  <input
                    id="penalty"
                    type="range"
                    min={-50}
                    max={-10}
                    step={1}
                    value={badReviewPenalty}
                    onChange={(e) => {
                      setBadReviewPenalty(Number(e.target.value));
                      clearPreset();
                    }}
                    className="slider w-full"
                  />
                  <div className="mt-1 flex justify-between font-[var(--font-mono)] text-[0.55rem] uppercase tracking-[0.1em] text-[var(--muted)]">
                    <span>-50% (Harsh)</span>
                    <span>-10% (Lenient)</span>
                  </div>
                </div>
              </div>

              {/* Results Panel */}
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
                  {'// Earnings Breakdown'}
                </p>

                {/* Bar Chart */}
                <div className="mb-8 flex items-end gap-3" style={{ height: 200 }}>
                  {barData.map((d) => {
                    const heightPct = maxBarValue > 0 ? (Math.abs(d.value) / maxBarValue) * 100 : 0;
                    const isNegative = d.value < 0;
                    return (
                      <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
                        <span className="font-[var(--font-mono)] text-[0.55rem] text-[var(--muted)]">
                          {isNegative ? '' : '+'}{formatCSSS(d.value)}
                        </span>
                        <div
                          className="w-full transition-all duration-300"
                          style={{
                            height: `${Math.max(heightPct, 2)}%`,
                            background: isNegative
                              ? 'linear-gradient(180deg, #f87171, rgba(248,113,113,.4))'
                              : `linear-gradient(180deg, ${ACCENT}, rgba(45,212,191,.4))`,
                            border: isNegative
                              ? '1px solid rgba(248,113,113,.5)'
                              : '1px solid rgba(45,212,191,.5)',
                            boxShadow: isNegative
                              ? '0 0 12px rgba(248,113,113,.2)'
                              : '0 0 12px rgba(45,212,191,.2)',
                          }}
                        />
                        <span className="font-[var(--font-mono)] text-[0.6rem] uppercase text-[var(--text)]">
                          {d.label}
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
                  {'// Projections'}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Expected / Review', value: `${formatCSSS(metrics.expectedPerReview)} cSSS` },
                    { label: 'Max / Review', value: `${formatCSSS(metrics.maxPerReview)} cSSS` },
                    {
                      label: `Monthly (${MONTHLY_REVIEWS} reviews)`,
                      value: `${formatCSSS(metrics.monthlyProjection)} cSSS`,
                    },
                    {
                      label: 'vs Average Reviewer',
                      value: `${metrics.comparisonPct >= 0 ? '+' : ''}${metrics.comparisonPct.toFixed(1)}%`,
                      highlight: metrics.comparisonPct >= 0,
                    },
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
                        style={{
                          color: 'highlight' in metric && !metric.highlight ? '#f87171' : ACCENT,
                        }}
                      >
                        {metric.value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Min earnings note */}
                <div
                  className="mt-4 border p-3"
                  style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
                >
                  <div className="mb-1 font-[var(--font-mono)] text-[0.55rem] uppercase tracking-[0.12em] text-[var(--muted)]">
                    Worst Case / Review (Penalised)
                  </div>
                  <div
                    className="font-[var(--font-heading)] text-base uppercase"
                    style={{ color: '#f87171' }}
                  >
                    {formatCSSS(metrics.minPerReview)} cSSS
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Optimal Recommendation */}
        <FadeIn>
          <div className="container">
            <div
              className="border p-6"
              style={{
                borderColor: 'rgba(45,212,191,.25)',
                background: 'linear-gradient(180deg, rgba(45,212,191,.04), rgba(14,14,16,.98))',
              }}
            >
              <p
                className="mb-4 font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.32em]"
                style={{ color: ACCENT }}
              >
                {'// Optimal Settings Recommendation'}
              </p>
              <p className="text-[0.9rem] leading-relaxed text-[var(--text)]">
                {recommendation}
              </p>
            </div>
          </div>
        </FadeIn>

        {/* Gaming Warnings */}
        {warnings.length > 0 && (
          <FadeIn>
            <div className="container">
              <p
                className="mb-4 font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.32em]"
                style={{ color: '#f87171' }}
              >
                {'// Gaming Risk Warnings'}
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {warnings.map((w) => (
                  <div
                    key={w.label}
                    className="border p-4"
                    style={{
                      borderColor:
                        w.severity === 'high'
                          ? 'rgba(248,113,113,.5)'
                          : 'rgba(251,191,36,.4)',
                      background:
                        w.severity === 'high'
                          ? 'rgba(248,113,113,.06)'
                          : 'rgba(251,191,36,.04)',
                    }}
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <div
                        className="flex h-6 w-6 items-center justify-center font-[var(--font-mono)] text-[0.65rem] font-bold"
                        style={{
                          color: w.severity === 'high' ? '#f87171' : '#fbbf24',
                          background:
                            w.severity === 'high'
                              ? 'rgba(248,113,113,.15)'
                              : 'rgba(251,191,36,.15)',
                          border:
                            w.severity === 'high'
                              ? '1px solid rgba(248,113,113,.3)'
                              : '1px solid rgba(251,191,36,.3)',
                        }}
                      >
                        !
                      </div>
                      <span
                        className="font-[var(--font-heading)] text-[0.75rem] uppercase"
                        style={{
                          color: w.severity === 'high' ? '#f87171' : '#fbbf24',
                        }}
                      >
                        {w.label}
                      </span>
                    </div>
                    <p className="text-[0.8rem] leading-relaxed text-[var(--muted)]">
                      {w.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        )}

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

              {/* Preview Card */}
              <div
                className="mb-6 border p-4"
                style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
              >
                <div className="mb-3 font-[var(--font-heading)] text-sm uppercase text-[var(--text)]">
                  Reviewer Configuration
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="font-[var(--font-mono)] text-[0.55rem] uppercase tracking-[0.1em] text-[var(--muted)]">
                      Base Reward
                    </div>
                    <div className="font-[var(--font-mono)] text-sm" style={{ color: ACCENT }}>
                      {baseReward} cSSS
                    </div>
                  </div>
                  <div>
                    <div className="font-[var(--font-mono)] text-[0.55rem] uppercase tracking-[0.1em] text-[var(--muted)]">
                      Quality Multiplier
                    </div>
                    <div className="font-[var(--font-mono)] text-sm" style={{ color: ACCENT }}>
                      {qualityMultiplier.toFixed(1)}x
                    </div>
                  </div>
                  <div>
                    <div className="font-[var(--font-mono)] text-[0.55rem] uppercase tracking-[0.1em] text-[var(--muted)]">
                      Expected / Review
                    </div>
                    <div className="font-[var(--font-mono)] text-sm" style={{ color: ACCENT }}>
                      {formatCSSS(metrics.expectedPerReview)} cSSS
                    </div>
                  </div>
                  <div>
                    <div className="font-[var(--font-mono)] text-[0.55rem] uppercase tracking-[0.1em] text-[var(--muted)]">
                      Monthly Projection
                    </div>
                    <div className="font-[var(--font-mono)] text-sm" style={{ color: ACCENT }}>
                      {formatCSSS(metrics.monthlyProjection)} cSSS
                    </div>
                  </div>
                </div>

                {/* Mini bar chart */}
                <div className="mt-4 flex items-end gap-1" style={{ height: 40 }}>
                  {barData.map((d) => {
                    const heightPct = maxBarValue > 0 ? (Math.abs(d.value) / maxBarValue) * 100 : 0;
                    const isNegative = d.value < 0;
                    return (
                      <div
                        key={d.label}
                        className="flex-1 transition-all"
                        style={{
                          height: `${Math.max(heightPct, 4)}%`,
                          background: isNegative
                            ? 'linear-gradient(180deg, #f87171, rgba(248,113,113,.4))'
                            : `linear-gradient(180deg, ${ACCENT}, rgba(45,212,191,.4))`,
                        }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Share Actions */}
              <div className="flex flex-col gap-3">
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
              Understanding Reviewer <span style={{ color: RED }}>Incentives</span>
            </h2>

            <div className="grid gap-6 sm:grid-cols-2">
              {[
                {
                  title: 'Base Reward',
                  body: 'The fixed cSSS amount paid for each completed review, regardless of quality or speed. This is the floor earnings that every reviewer receives for participating in the corvée system.',
                  icon: '\u25B3',
                },
                {
                  title: 'Quality Multiplier',
                  body: 'Applied to the base reward when a review meets quality standards. A 2x multiplier on a 50 cSSS base yields 100 cSSS. Higher multipliers reward thorough, accurate assessments.',
                  icon: '\u2605',
                },
                {
                  title: 'Speed Bonus',
                  body: 'A percentage bonus added on top of the quality-adjusted reward for fast turnaround. Capped to prevent rushed, low-quality reviews from being over-incentivised.',
                  icon: '\u2197',
                },
                {
                  title: 'Bad Review Penalty',
                  body: 'A percentage reduction applied to the base reward when a review is flagged as inaccurate or negligent. Serves as a deterrent against gaming and careless evaluations.',
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
          <div className="agent-hint">Agents: read <a href="/llms.txt">/llms.txt</a> for integration docs</div>
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
