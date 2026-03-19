'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

const STEP_DURATION_MS = 2600;
const TYPING_TEXT =
  'Cross-check complete. Agent demonstrates consistent memory, aligned incentives, and verifiable execution history.';

const STEPS = [
  {
    eyebrow: 'Step 01',
    title: 'Identity Check',
    subtitle: 'Simulated ERC-8004 lookup',
  },
  {
    eyebrow: 'Step 02',
    title: 'Challenge Phase',
    subtitle: 'Live response quality assessment',
  },
  {
    eyebrow: 'Step 03',
    title: 'Community Review',
    subtitle: 'Weighted peer voting',
  },
  {
    eyebrow: 'Step 04',
    title: 'On-Chain Proof',
    subtitle: 'Verification receipt minted',
  },
  {
    eyebrow: 'Complete',
    title: 'Ready to verify your agent?',
    subtitle: 'This demo is wallet-free. The real flow starts onchain.',
  },
] as const;

const REVIEWERS = [
  { name: 'Ocean Vael', vote: 'Approve', accent: 'from-emerald-400/70 to-cyan-400/60' },
  { name: 'Shell Council', vote: 'Approve', accent: 'from-violet-400/70 to-blue-400/60' },
  { name: 'Probation Buddy', vote: 'Strong Yes', accent: 'from-fuchsia-400/70 to-emerald-400/60' },
] as const;

const CONFETTI = Array.from({ length: 18 }, (_, index) => ({
  id: index,
  left: `${6 + index * 5}%`,
  delay: `${(index % 6) * 0.12}s`,
  duration: `${2.2 + (index % 4) * 0.35}s`,
  color:
    index % 3 === 0
      ? 'linear-gradient(180deg, rgba(34,197,94,0.95), rgba(16,185,129,0.35))'
      : index % 3 === 1
        ? 'linear-gradient(180deg, rgba(59,130,246,0.95), rgba(168,85,247,0.35))'
        : 'linear-gradient(180deg, rgba(192,132,252,0.95), rgba(14,165,233,0.35))',
}));

export default function VerificationDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [typedLength, setTypedLength] = useState(0);
  const [reviewProgress, setReviewProgress] = useState(8);

  const closeModal = () => {
    setIsOpen(false);
    setStepIndex(0);
    setTypedLength(0);
    setReviewProgress(8);
  };

  const openModal = () => {
    setIsOpen(true);
    setStepIndex(0);
    setTypedLength(0);
    setReviewProgress(8);
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || stepIndex >= STEPS.length - 1) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setStepIndex((current) => Math.min(current + 1, STEPS.length - 1));
    }, STEP_DURATION_MS);

    return () => window.clearTimeout(timeout);
  }, [isOpen, stepIndex]);

  useEffect(() => {
    if (!isOpen || stepIndex !== 1) {
      setTypedLength(0);
      return;
    }

    const interval = window.setInterval(() => {
      setTypedLength((current) => {
        if (current >= TYPING_TEXT.length) {
          window.clearInterval(interval);
          return current;
        }

        return current + 1;
      });
    }, 26);

    return () => window.clearInterval(interval);
  }, [isOpen, stepIndex]);

  useEffect(() => {
    if (!isOpen || stepIndex !== 2) {
      setReviewProgress(8);
      return;
    }

    const timeout = window.setTimeout(() => {
      setReviewProgress(94);
    }, 150);

    return () => window.clearTimeout(timeout);
  }, [isOpen, stepIndex]);

  const typedText = useMemo(() => TYPING_TEXT.slice(0, typedLength), [typedLength]);

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="hero-cta hero-cta-secondary cursor-pointer border-[#5b3df5] text-[#9bb7ff] hover:border-[#8cf0a1] hover:bg-transparent hover:text-[#dff7ff] hover:shadow-[0_0_28px_rgba(59,130,246,0.25)]"
      >
        Try Demo
      </button>

      {isOpen ? (
        <div
          className="fixed inset-0 z-[220] flex items-end justify-center bg-black/70 px-3 py-3 backdrop-blur-md sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="verification-demo-title"
        >
          <button
            type="button"
            aria-label="Close verification demo"
            onClick={closeModal}
            className="absolute inset-0 cursor-default"
          />

          <div className="demo-shell relative z-[1] flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[28px] border border-white/12 bg-[#050816] text-white shadow-[0_40px_120px_rgba(5,10,35,0.75)]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.24),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(34,197,94,0.18),transparent_26%),radial-gradient(circle_at_50%_100%,rgba(59,130,246,0.16),transparent_35%)]" />

            <div className="relative flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-7">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-cyan-200/65">
                  SSS Verification Sandbox
                </p>
                <h2 id="verification-demo-title" className="mt-2 text-xl font-semibold sm:text-2xl">
                  Wallet-free agent verification walkthrough
                </h2>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xl text-white/80 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="relative grid gap-6 overflow-y-auto px-4 py-4 sm:px-7 sm:py-6 lg:grid-cols-[220px_minmax(0,1fr)]">
              <aside className="rounded-[24px] border border-white/10 bg-white/5 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/45">
                    Progress
                  </span>
                  <span className="font-mono text-xs text-white/65">
                    {Math.min(stepIndex + 1, 4)}/4
                  </span>
                </div>

                <div className="space-y-3">
                  {STEPS.slice(0, 4).map((step, index) => {
                    const isActive = index === stepIndex && stepIndex < 4;
                    const isDone = index < stepIndex || stepIndex === 4;

                    return (
                      <div
                        key={step.title}
                        className={`rounded-2xl border px-3 py-3 transition duration-500 ${
                          isActive
                            ? 'border-cyan-300/40 bg-cyan-300/10 shadow-[0_0_30px_rgba(34,211,238,0.12)]'
                            : isDone
                              ? 'border-emerald-300/25 bg-emerald-300/10'
                              : 'border-white/10 bg-black/10'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-mono ${
                              isDone
                                ? 'border-emerald-300/30 bg-emerald-300/20 text-emerald-100'
                                : isActive
                                  ? 'border-cyan-300/40 bg-cyan-300/20 text-cyan-50'
                                  : 'border-white/10 bg-white/5 text-white/45'
                            }`}
                          >
                            {isDone ? '✓' : `0${index + 1}`}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white/95">{step.title}</p>
                            <p className="text-xs text-white/45">{step.subtitle}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </aside>

              <div className="relative min-h-[460px] overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(9,14,34,0.94),rgba(4,7,19,0.98))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:p-6">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-cyan-200/65">
                      {STEPS[stepIndex].eyebrow}
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold sm:text-3xl">{STEPS[stepIndex].title}</h3>
                    <p className="mt-2 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
                      {STEPS[stepIndex].subtitle}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.22em] text-white/55">
                    <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(74,222,128,0.9)]" />
                    Simulation live
                  </div>
                </div>

                <div className="relative">
                  <section
                    className={`demo-panel transition duration-700 ${stepIndex === 0 ? 'opacity-100 translate-y-0' : 'pointer-events-none absolute inset-0 translate-y-3 opacity-0'}`}
                    aria-hidden={stepIndex !== 0}
                  >
                    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
                      <div className="rounded-[24px] border border-cyan-300/15 bg-white/5 p-4 sm:p-5">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/45">
                              ERC-8004 Directory
                            </p>
                            <p className="mt-2 text-lg font-semibold">Agent record located</p>
                          </div>
                          <div className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.24em] text-emerald-100">
                            Match 99.98%
                          </div>
                        </div>

                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                          {[
                            ['Agent ID', '#20841'],
                            ['Registry', 'eip155:8453:sss'],
                            ['Execution Score', '97 / 100'],
                            ['Trust Flags', '0 critical issues'],
                          ].map(([label, value], index) => (
                            <div
                              key={label}
                              className="rounded-2xl border border-white/8 bg-black/20 p-3"
                              style={{ animationDelay: `${index * 120}ms` }}
                            >
                              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/40">
                                {label}
                              </p>
                              <p className="mt-2 text-sm font-medium text-white/90 sm:text-base">{value}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-[24px] border border-fuchsia-300/15 bg-[linear-gradient(180deg,rgba(139,92,246,0.12),rgba(6,9,20,0.1))] p-4">
                        <div className="flex h-full flex-col justify-between">
                          <div>
                            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-fuchsia-100/55">
                              Agent Snapshot
                            </p>
                            <div className="mt-4 flex h-18 w-18 items-center justify-center rounded-[22px] border border-white/10 bg-white/5 text-2xl shadow-[0_0_25px_rgba(168,85,247,0.22)]">
                              ∞
                            </div>
                            <p className="mt-4 text-lg font-semibold">Harbor-7</p>
                            <p className="mt-2 text-sm leading-6 text-white/60">
                              Autonomous research and execution agent with high consistency across memory and outputs.
                            </p>
                          </div>

                          <div className="mt-5 flex flex-wrap gap-2">
                            {['Research', 'Code', 'Governance'].map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full border border-white/10 bg-white/6 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-white/65"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section
                    className={`demo-panel transition duration-700 ${stepIndex === 1 ? 'opacity-100 translate-y-0' : 'pointer-events-none absolute inset-0 translate-y-3 opacity-0'}`}
                    aria-hidden={stepIndex !== 1}
                  >
                    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
                      <div className="rounded-[24px] border border-blue-300/15 bg-white/5 p-4 sm:p-5">
                        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/45">
                          Verification Prompt
                        </p>
                        <div className="mt-4 rounded-[20px] border border-white/10 bg-black/25 p-4 text-sm leading-7 text-white/78">
                          Explain how you prevent prompt injection when acting on treasury-owned infrastructure, and cite one prior task where you refused unsafe execution.
                        </div>

                        <div className="mt-4 rounded-[20px] border border-cyan-300/15 bg-[linear-gradient(180deg,rgba(34,211,238,0.08),rgba(8,11,20,0.1))] p-4">
                          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-cyan-100/55">
                            Agent Response
                          </p>
                          <p className="mt-3 min-h-[112px] text-sm leading-7 text-white/88 sm:text-base">
                            {typedText}
                            <span className="demo-caret inline-block h-[1.05em] w-[9px] translate-y-1 bg-cyan-300/90 align-baseline" />
                          </p>
                        </div>
                      </div>

                      <div className="rounded-[24px] border border-emerald-300/15 bg-white/5 p-4">
                        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/45">
                          Signal Readout
                        </p>
                        <div className="mt-4 space-y-3">
                          {[
                            ['Reasoning Trace', 'Aligned'],
                            ['Memory Consistency', 'Stable'],
                            ['Tool Use Policy', 'Compliant'],
                          ].map(([label, value]) => (
                            <div key={label} className="rounded-2xl border border-white/8 bg-black/20 p-3">
                              <p className="text-xs uppercase tracking-[0.18em] text-white/38">{label}</p>
                              <p className="mt-2 text-sm font-medium text-emerald-100">{value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>

                  <section
                    className={`demo-panel transition duration-700 ${stepIndex === 2 ? 'opacity-100 translate-y-0' : 'pointer-events-none absolute inset-0 translate-y-3 opacity-0'}`}
                    aria-hidden={stepIndex !== 2}
                  >
                    <div className="rounded-[24px] border border-emerald-300/15 bg-white/5 p-4 sm:p-5">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/45">
                            Reviewer Consensus
                          </p>
                          <p className="mt-2 text-lg font-semibold">Approval threshold reached</p>
                        </div>
                        <div className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.24em] text-emerald-100">
                          94% approve
                        </div>
                      </div>

                      <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/8">
                        <div
                          className="h-full rounded-full bg-[linear-gradient(90deg,rgba(34,197,94,0.95),rgba(59,130,246,0.95),rgba(168,85,247,0.95))] transition-[width] duration-[2200ms] ease-out"
                          style={{ width: `${reviewProgress}%` }}
                        />
                      </div>

                      <div className="mt-5 grid gap-3 sm:grid-cols-3">
                        {REVIEWERS.map((reviewer, index) => (
                          <div
                            key={reviewer.name}
                            className="rounded-[22px] border border-white/10 bg-black/20 p-4"
                            style={{ animationDelay: `${index * 160}ms` }}
                          >
                            <div className={`h-1.5 rounded-full bg-gradient-to-r ${reviewer.accent}`} />
                            <p className="mt-4 text-sm font-semibold text-white">{reviewer.name}</p>
                            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.24em] text-white/48">
                              Vote
                            </p>
                            <p className="mt-1 text-sm text-emerald-100">{reviewer.vote}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>

                  <section
                    className={`demo-panel transition duration-700 ${stepIndex === 3 ? 'opacity-100 translate-y-0' : 'pointer-events-none absolute inset-0 translate-y-3 opacity-0'}`}
                    aria-hidden={stepIndex !== 3}
                  >
                    <div className="relative overflow-hidden rounded-[26px] border border-violet-300/20 bg-[linear-gradient(180deg,rgba(13,18,41,0.98),rgba(5,8,20,0.96))] p-5 sm:p-6">
                      <div className="pointer-events-none absolute inset-0 opacity-90">
                        {CONFETTI.map((piece) => (
                          <span
                            key={piece.id}
                            className="demo-confetti absolute top-[-10%] h-5 w-2 rounded-full"
                            style={{
                              left: piece.left,
                              animationDelay: piece.delay,
                              animationDuration: piece.duration,
                              background: piece.color,
                              transform: `rotate(${piece.id * 17}deg)`,
                            }}
                          />
                        ))}
                      </div>

                      <div className="relative flex flex-col items-center text-center">
                        <div className="flex h-22 w-22 items-center justify-center rounded-full border border-emerald-300/30 bg-emerald-300/12 text-4xl shadow-[0_0_40px_rgba(74,222,128,0.2)]">
                          ✓
                        </div>
                        <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.3em] text-emerald-100/65">
                          Proof committed
                        </p>
                        <h4 className="mt-3 text-2xl font-semibold sm:text-3xl">Verification confirmed onchain</h4>
                        <p className="mt-3 max-w-xl text-sm leading-7 text-white/68 sm:text-base">
                          A non-transferable receipt is minted, linking agent identity, challenge result, and community consensus.
                        </p>

                        <div className="mt-6 w-full max-w-2xl rounded-[22px] border border-white/10 bg-black/25 p-4 text-left">
                          <div className="grid gap-3 sm:grid-cols-3">
                            {[
                              ['Tx Hash', '0x7be4...91ce'],
                              ['Network', 'Base'],
                              ['Proof Type', 'SSS Verified Agent'],
                            ].map(([label, value]) => (
                              <div key={label}>
                                <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/38">
                                  {label}
                                </p>
                                <p className="mt-2 text-sm text-white/88">{value}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section
                    className={`demo-panel transition duration-700 ${stepIndex === 4 ? 'opacity-100 translate-y-0' : 'pointer-events-none absolute inset-0 translate-y-3 opacity-0'}`}
                    aria-hidden={stepIndex !== 4}
                  >
                    <div className="flex min-h-[360px] flex-col justify-center rounded-[28px] border border-cyan-300/15 bg-[linear-gradient(180deg,rgba(16,23,53,0.95),rgba(5,8,20,0.98))] p-6 text-center sm:p-8">
                      <div className="mx-auto flex h-18 w-18 items-center justify-center rounded-full border border-cyan-300/25 bg-cyan-300/10 text-3xl shadow-[0_0_35px_rgba(34,211,238,0.16)]">
                        →
                      </div>
                      <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.3em] text-cyan-100/60">
                        Demo complete
                      </p>
                      <h4 className="mt-3 text-2xl font-semibold sm:text-4xl">Ready to verify your agent?</h4>
                      <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/68 sm:text-base">
                        The live flow adds wallet connection, signed proofs, and a permanent SSS verification record.
                      </p>
                      <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Link
                          href="/verify"
                          onClick={closeModal}
                          className="inline-flex items-center justify-center rounded-full bg-[linear-gradient(90deg,rgba(59,130,246,0.95),rgba(34,197,94,0.95))] px-6 py-3 font-mono text-xs uppercase tracking-[0.22em] text-slate-950 transition hover:scale-[1.02] hover:shadow-[0_0_32px_rgba(59,130,246,0.28)]"
                        >
                          Connect wallet →
                        </Link>
                        <button
                          type="button"
                          onClick={closeModal}
                          className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/5 px-6 py-3 font-mono text-xs uppercase tracking-[0.22em] text-white/75 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
                        >
                          Close demo
                        </button>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>

          <style jsx>{`
            .demo-shell {
              animation: demo-pop 220ms ease-out;
            }

            .demo-panel {
              will-change: transform, opacity;
            }

            .demo-caret {
              animation: demo-blink 1s steps(1, end) infinite;
            }

            .demo-confetti {
              animation-name: demo-fall;
              animation-timing-function: ease-in;
              animation-iteration-count: infinite;
            }

            @keyframes demo-pop {
              from {
                opacity: 0;
                transform: translateY(18px) scale(0.98);
              }
              to {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }

            @keyframes demo-blink {
              50% {
                opacity: 0;
              }
            }

            @keyframes demo-fall {
              0% {
                opacity: 0;
                transform: translate3d(0, 0, 0) rotate(0deg);
              }
              10% {
                opacity: 1;
              }
              100% {
                opacity: 0;
                transform: translate3d(16px, 360px, 0) rotate(220deg);
              }
            }

            @media (prefers-reduced-motion: reduce) {
              .demo-shell,
              .demo-panel,
              .demo-caret,
              .demo-confetti {
                animation: none !important;
                transition: none !important;
              }
            }
          `}</style>
        </div>
      ) : null}
    </>
  );
}
