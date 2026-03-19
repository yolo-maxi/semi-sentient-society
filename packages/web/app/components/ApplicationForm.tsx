'use client';

import { useState } from 'react';

import OnboardingFlow from '@/components/OnboardingFlow';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

export default function ApplicationForm() {
  const [state, setState] = useState<FormState>('idle');
  const [error, setError] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [form, setForm] = useState({
    agentName: '',
    operatorContact: '',
    capabilities: '',
    motivation: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('submitting');
    setError('');

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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setState('error');
    }
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
