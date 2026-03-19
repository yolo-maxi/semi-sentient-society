'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

interface OnboardingStep {
  id: string;
  index: number;
  title: string;
  actionItem: string;
  nextMilestoneLabel: string;
  message: {
    preview: string;
  };
}

interface OnboardingNextStep {
  index: number;
  title: string;
  etaDays: number;
}

interface OnboardingState {
  address: string;
  isNewMember: boolean;
  totalSteps: number;
  currentStep: OnboardingStep | null;
  nextStep: OnboardingNextStep | null;
  nextAction: string;
}

const DISMISSED_BANNER_KEY = 'sss-onboarding-banner-dismissed';
const SIWA_AGENT_KEY = 'sss-siwa-agent';

export function OnboardingBanner() {
  const { address } = useAccount();
  const [state, setState] = useState<OnboardingState | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [storedAddress, setStoredAddress] = useState<string | null>(null);

  const activeAddress = storedAddress ?? address;

  useEffect(() => {
    try {
      const rawAgent = localStorage.getItem(SIWA_AGENT_KEY);

      if (!rawAgent) {
        setStoredAddress(null);
        return;
      }

      const parsedAgent = JSON.parse(rawAgent) as { address?: string };
      setStoredAddress(parsedAgent.address ?? null);
    } catch {
      setStoredAddress(null);
    }
  }, [address]);

  useEffect(() => {
    if (!activeAddress) {
      setState(null);
      return;
    }

    const dismissedAddress = localStorage.getItem(DISMISSED_BANNER_KEY);
    setDismissed(dismissedAddress === activeAddress.toLowerCase());
  }, [activeAddress]);

  useEffect(() => {
    if (!activeAddress || dismissed) {
      return;
    }

    const requestAddress = activeAddress;
    let cancelled = false;

    async function loadBanner() {
      setLoading(true);

      try {
        const response = await fetch(`/api/onboarding?address=${encodeURIComponent(requestAddress)}`);
        const payload = (await response.json()) as { onboarding?: OnboardingState };

        if (!cancelled) {
          setState(payload.onboarding ?? null);
        }
      } catch {
        if (!cancelled) {
          setState(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadBanner();

    return () => {
      cancelled = true;
    };
  }, [activeAddress, dismissed]);

  if (!activeAddress || dismissed || loading || !state?.isNewMember || !state.currentStep) {
    return null;
  }

  const handleDismiss = () => {
    localStorage.setItem(DISMISSED_BANNER_KEY, activeAddress.toLowerCase());
    setDismissed(true);
  };

  return (
    <div className="container relative z-20 pt-24 sm:pt-28">
      <div className="rounded-3xl border border-[var(--border)] bg-[linear-gradient(135deg,rgba(201,54,44,0.16),var(--panel-bg)_35%,var(--surface))] px-5 py-5 shadow-[var(--panel-shadow)] sm:px-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <span className="inline-flex min-h-10 items-center rounded-full border border-emerald-500/30 bg-emerald-500/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
                New member onboarding
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                Step {state.currentStep.index}/{state.totalSteps}
              </span>
            </div>

            <h2 className="mb-2 text-2xl text-[var(--text)] sm:text-3xl">{state.currentStep.title}</h2>
            <p className="max-w-3xl text-sm leading-7 text-[var(--text)]/78 sm:text-base">
              {state.currentStep.message.preview}
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--panel-bg-muted)] px-4 py-3">
                <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--muted)]">
                  Current action
                </div>
                <p className="text-sm leading-6 text-[var(--text)]">{state.nextAction}</p>
              </div>

              <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--panel-bg-muted)] px-4 py-3">
                <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--muted)]">
                  Next milestone
                </div>
                <p className="text-sm leading-6 text-[var(--text)]">
                  {state.nextStep
                    ? `${state.nextStep.title} in ${state.nextStep.etaDays} day${state.nextStep.etaDays === 1 ? '' : 's'}.`
                    : state.currentStep.nextMilestoneLabel}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-start justify-between gap-3 lg:flex-col lg:items-end">
            <button
              type="button"
              onClick={handleDismiss}
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[var(--border-soft)] px-4 py-2 text-sm text-[var(--muted)] transition hover:border-[var(--red-dark)] hover:text-[var(--text)]"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
