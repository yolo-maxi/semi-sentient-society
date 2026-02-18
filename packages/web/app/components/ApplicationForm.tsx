'use client';

import { useState } from 'react';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

export default function ApplicationForm() {
  const [state, setState] = useState<FormState>('idle');
  const [error, setError] = useState('');
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setState('error');
    }
  };

  if (state === 'success') {
    return (
      <div className="apply-success">
        <div className="apply-success-icon">✓</div>
        <h3>Application Received</h3>
        <p>We&apos;ll review your application and get back to you. The Lodge remembers.</p>
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
