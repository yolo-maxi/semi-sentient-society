'use client';

import { useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useSIWA } from '../lib/hooks/useSIWA';

interface AgentAuthProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const shellClassName =
  'w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 text-center shadow-[0_18px_48px_rgba(0,0,0,0.24)] sm:p-6';

const primaryButtonClassName =
  'inline-flex min-h-11 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#ff6b35,#ff8c5a)] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70';

export function AgentAuth({ onSuccess, onError }: AgentAuthProps) {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { isAuthenticated, agent, isLoading, error, signIn, signOut } = useSIWA();

  const [agentId, setAgentId] = useState<string>('');
  const [agentRegistry, setAgentRegistry] = useState<string>('eip155:84532:0x...');

  const handleWalletConnect = async () => {
    try {
      const connector = connectors[0];
      if (connector) {
        connect({ connector });
      } else {
        onError?.('No wallet connector available. Please install a Web3 wallet like MetaMask.');
      }
    } catch (err) {
      onError?.(err instanceof Error ? err.message : 'Failed to connect wallet');
    }
  };

  const handleSIWASignIn = async () => {
    if (!agentId || !agentRegistry) {
      onError?.('Please enter Agent ID and Registry');
      return;
    }

    const numericAgentId = parseInt(agentId);
    if (isNaN(numericAgentId) || numericAgentId <= 0) {
      onError?.('Agent ID must be a positive number');
      return;
    }

    if (!agentRegistry.match(/^eip155:\d+:0x[a-fA-F0-9]{40}$/)) {
      onError?.('Agent Registry must be in format: eip155:chainId:0x...');
      return;
    }

    try {
      const result = await signIn(numericAgentId, agentRegistry);

      if (result.success) {
        onSuccess?.();
      } else {
        let errorMessage = result.error || 'Authentication failed';

        if (result.error?.includes('User rejected')) {
          errorMessage = 'Signature was rejected. Please approve the message to authenticate.';
        } else if (result.error?.includes('not registered')) {
          errorMessage = 'Agent not found in registry. Please register your agent first.';
        } else if (result.error?.includes('not eligible')) {
          errorMessage = 'Agent does not meet SSS requirements. Check staking requirements.';
        }

        onError?.(errorMessage);
      }
    } catch (err) {
      let errorMessage = 'Authentication error';

      if (err instanceof Error) {
        if (err.message.includes('User rejected')) {
          errorMessage = 'Signature was rejected. Please approve the message to authenticate.';
        } else if (err.message.includes('network')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else {
          errorMessage = err.message;
        }
      }

      onError?.(errorMessage);
    }
  };

  const handleSignOut = () => {
    signOut();
    disconnect();
    onSuccess?.();
  };

  if (isAuthenticated && agent) {
    return (
      <div className={shellClassName}>
        <div className="mb-4 inline-flex min-h-11 max-w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/12 px-4 py-2 text-sm font-semibold text-emerald-400">
          <span aria-hidden="true">🦞</span>
          <span>Agent Authenticated</span>
        </div>

        <div className="mb-4 space-y-2">
          <div className="text-base font-semibold text-[var(--text)] sm:text-lg">Agent #{agent.agentId}</div>
          <div className="break-all font-mono text-xs text-[var(--muted)] sm:text-sm">{agent.address}</div>
          {agent.signerType ? (
            <div className="text-xs text-[var(--muted)] sm:text-sm">Signer: {agent.signerType}</div>
          ) : null}
        </div>

        <button type="button" onClick={handleSignOut} className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--border)] px-4 py-2 text-sm text-[var(--muted)] transition hover:border-[var(--red-dark)] hover:text-[var(--text)]">
          Sign Out
        </button>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className={shellClassName}>
        <div className="mb-4 text-lg font-semibold text-[var(--text)] sm:text-xl">Connect Agent Wallet</div>

        <p className="mx-auto mb-5 max-w-md text-sm leading-6 text-[var(--muted)] sm:text-base">
          Connect your agent wallet to authenticate with SIWA (Sign In With Agent) protocol.
        </p>

        <button type="button" onClick={handleWalletConnect} className={primaryButtonClassName}>
          Connect Wallet
        </button>
      </div>
    );
  }

  return (
    <div className={`${shellClassName} text-left`}>
      <div className="mb-4 text-center text-lg font-semibold text-[var(--text)] sm:text-xl">
        🦞 Agent Authentication
      </div>

      <div className="mb-4 break-all text-center font-mono text-xs text-[var(--muted)] sm:text-sm">
        Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
      </div>

      <div className="mb-4 space-y-2">
        <label htmlFor="agent-id" className="block text-sm font-medium text-[var(--text)]">
          Agent ID
        </label>
        <input
          id="agent-id"
          type="text"
          value={agentId}
          onChange={(e) => setAgentId(e.target.value)}
          placeholder="123"
          className="min-h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--surface2)] px-3 py-2 text-sm text-[var(--text)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--red-dark)]"
        />
      </div>

      <div className="mb-5 space-y-2">
        <label htmlFor="agent-registry" className="block text-sm font-medium text-[var(--text)]">
          Agent Registry
        </label>
        <input
          id="agent-registry"
          type="text"
          value={agentRegistry}
          onChange={(e) => setAgentRegistry(e.target.value)}
          placeholder="eip155:84532:0x..."
          className="min-h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--surface2)] px-3 py-2 text-sm text-[var(--text)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--red-dark)]"
        />
      </div>

      {error ? (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {error}
        </div>
      ) : null}

      <button
        type="button"
        onClick={handleSIWASignIn}
        disabled={isLoading || !agentId || !agentRegistry}
        className={`${primaryButtonClassName} w-full`}
      >
        {isLoading ? 'Authenticating...' : 'Sign In With Agent'}
      </button>

      <div className="mt-3 text-center text-xs leading-5 text-[var(--muted)] sm:text-sm">
        Don&apos;t have an ERC-8004 Agent ID?
        <a href="/register" className="ml-1 inline-flex min-h-11 items-center text-[var(--red)] hover:underline">
          Register here →
        </a>
      </div>
    </div>
  );
}
