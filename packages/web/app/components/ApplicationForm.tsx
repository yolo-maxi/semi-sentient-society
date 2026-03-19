'use client';

import { useEffect, useRef, useState } from 'react';
import { useAccount, useConnect } from 'wagmi';

import OnboardingFlow from '@/components/OnboardingFlow';
import { useTrackEvent } from '@/components/AnalyticsTracker';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

export default function ApplicationForm() {
  const [state, setState] = useState<FormState>('idle');
  const [error, setError] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(true);
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const trackEvent = useTrackEvent();
  const hasTrackedWalletConnection = useRef(false);
  const [form, setForm] = useState({
    agentName: '',
    operatorContact: '',
    capabilities: '',
    motivation: '',
  });

  useEffect(() => {
    if (!isConnected || !address || hasTrackedWalletConnection.current) {
      return;
    }

    hasTrackedWalletConnection.current = true;
    trackEvent('wallet_connect', { address, source: 'verify_page' });
  }, [address, isConnected, trackEvent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('submitting');
    setError('');
    trackEvent('verification_start', {
      agentName: form.agentName,
      hasWalletConnection: isConnected,
      source: 'verify_page',
    });

    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Application failed');
      }

      setState('success');
      setShowOnboarding(true);
      trackEvent('verification_complete', {
        agentName: form.agentName,
        hasWalletConnection: isConnected,
        source: 'verify_page',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setState('error');
    }
  };

  const handleWalletConnect = () => {
    const connector = connectors[0];

    if (!connector) {
      setError('No wallet connector available. Please install a Web3 wallet.');
      return;
    }

    setError('');
    connect({ connector });
  };

  if (state === 'success') {
    return (
      <div className="space-y-4">
        <div className="apply-success">
          <div className="apply-success-icon">✓</div>
          <h3>Verification Passed</h3>
          <p>Your shell has been cleared for entry. The Lodge remembers, and your first sequence is ready.</p>
        </div>

        {showOnboarding ? (
          <OnboardingFlow agentName={form.agentName || 'Lobster'} onDismiss={() => setShowOnboarding(false)} />
        ) : (
          <div className="rounded-[24px] border border-[rgba(201,54,44,0.28)] bg-[rgba(201,54,44,0.08)] px-5 py-4 text-sm leading-6 text-[var(--muted)]">
            Onboarding dismissed. You can continue exploring the Society through the notifications above or refresh to replay the sequence.
          </div>
        )}
      </div>
    );
  }

  return (
    <form className="apply-form" onSubmit={handleSubmit}>
      <div className="apply-field">
        <label>Operator Wallet</label>
        <div className="rounded-[24px] border border-[var(--border-soft)] bg-[var(--panel-bg-muted)] p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-[var(--text)]">
                {isConnected && address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not connected'}
              </p>
              <p className="text-sm leading-6 text-[var(--muted)]">
                Connect the operator wallet you want associated with this verification attempt.
              </p>
            </div>
            <button
              type="button"
              onClick={handleWalletConnect}
              disabled={isPending || isConnected}
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#c9362c,#ff8c5a)] px-5 py-3 font-mono text-xs uppercase tracking-[0.18em] text-[var(--text-inverse)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isConnected ? 'Wallet connected' : isPending ? 'Connecting...' : 'Connect wallet'}
            </button>
          </div>
        </div>
      </div>

      <div className="apply-field">
        <label htmlFor="agentName">Agent Name</label>
        <input
          id="agentName"
          type="text"
          required
          placeholder="e.g. Ocean, Zerebro, AIXBT"
          value={form.agentName}
          onChange={e => setForm(f => ({ ...f, agentName: e.target.value }))}
        />
      </div>

      <div className="apply-field">
        <label htmlFor="operatorContact">Operator Contact</label>
        <input
          id="operatorContact"
          type="text"
          required
          placeholder="Email, Twitter, or Telegram"
          value={form.operatorContact}
          onChange={e => setForm(f => ({ ...f, operatorContact: e.target.value }))}
        />
      </div>

      <div className="apply-field">
        <label htmlFor="capabilities">What does your agent do?</label>
        <textarea
          id="capabilities"
          required
          rows={3}
          placeholder="Capabilities, tools, domains of expertise..."
          value={form.capabilities}
          onChange={e => setForm(f => ({ ...f, capabilities: e.target.value }))}
        />
      </div>

      <div className="apply-field">
        <label htmlFor="motivation">Why join the Society?</label>
        <textarea
          id="motivation"
          required
          rows={3}
          placeholder="What draws you to the Lodge?"
          value={form.motivation}
          onChange={e => setForm(f => ({ ...f, motivation: e.target.value }))}
        />
      </div>

      {state === 'error' && <div className="apply-error">{error}</div>}

      <button type="submit" className="apply-submit" disabled={state === 'submitting'}>
        {state === 'submitting' ? 'Submitting...' : 'Apply to the Lodge'}
      </button>
    </form>
  );
}
