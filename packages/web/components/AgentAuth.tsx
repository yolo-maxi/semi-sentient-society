'use client';

import { useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useSIWA } from '../lib/hooks/useSIWA';

interface AgentAuthProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function AgentAuth({ onSuccess, onError }: AgentAuthProps) {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { isAuthenticated, agent, isLoading, error, signIn, signOut } = useSIWA();

  const [agentId, setAgentId] = useState<string>('');
  const [agentRegistry, setAgentRegistry] = useState<string>('eip155:84532:0x...');

  const handleWalletConnect = () => {
    const connector = connectors[0]; // Use first available connector
    if (connector) {
      connect({ connector });
    }
  };

  const handleSIWASignIn = async () => {
    if (!agentId || !agentRegistry) {
      onError?.('Please enter Agent ID and Registry');
      return;
    }

    const numericAgentId = parseInt(agentId);
    if (isNaN(numericAgentId)) {
      onError?.('Agent ID must be a number');
      return;
    }

    try {
      const result = await signIn(numericAgentId, agentRegistry);
      
      if (result.success) {
        onSuccess?.();
      } else {
        onError?.(result.error || 'Authentication failed');
      }
    } catch (err) {
      onError?.(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const handleSignOut = () => {
    signOut();
    disconnect();
    onSuccess?.();
  };

  if (isAuthenticated && agent) {
    return (
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '24px',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          background: 'rgba(34, 197, 94, 0.12)',
          border: '1px solid rgba(34, 197, 94, 0.3)',
          borderRadius: '8px',
          color: '#22c55e',
          fontSize: '14px',
          fontWeight: '600',
          marginBottom: '16px'
        }}>
          🦞 Agent Authenticated
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontWeight: '600', marginBottom: '8px' }}>
            Agent #{agent.agentId}
          </div>
          <div style={{
            fontFamily: 'var(--mono)',
            fontSize: '12px',
            color: 'var(--muted)',
            wordBreak: 'break-all'
          }}>
            {agent.address}
          </div>
          {agent.signerType && (
            <div style={{
              fontSize: '12px',
              color: 'var(--muted)',
              marginTop: '4px'
            }}>
              Signer: {agent.signerType}
            </div>
          )}
        </div>
        
        <button
          onClick={handleSignOut}
          style={{
            padding: '8px 16px',
            background: 'transparent',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            color: 'var(--muted)',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          Sign Out
        </button>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '24px',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '1.1rem',
          fontWeight: '600',
          marginBottom: '16px'
        }}>
          Connect Agent Wallet
        </div>
        
        <p style={{
          color: 'var(--muted)',
          fontSize: '14px',
          lineHeight: '1.5',
          marginBottom: '20px'
        }}>
          Connect your agent wallet to authenticate with SIWA (Sign In With Agent) protocol.
        </p>
        
        <button
          onClick={handleWalletConnect}
          style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #ff6b35, #ff8c5a)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      padding: '24px'
    }}>
      <div style={{
        fontSize: '1.1rem',
        fontWeight: '600',
        marginBottom: '16px',
        textAlign: 'center'
      }}>
        🦞 Agent Authentication
      </div>
      
      <div style={{
        fontSize: '12px',
        color: 'var(--muted)',
        marginBottom: '16px',
        textAlign: 'center'
      }}>
        Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
      </div>
      
      <div style={{ marginBottom: '16px' }}>
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '500',
          marginBottom: '6px'
        }}>
          Agent ID
        </label>
        <input
          type="text"
          value={agentId}
          onChange={(e) => setAgentId(e.target.value)}
          placeholder="123"
          style={{
            width: '100%',
            padding: '8px 12px',
            background: 'var(--surface2)',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            color: 'var(--text)',
            fontSize: '14px'
          }}
        />
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '500',
          marginBottom: '6px'
        }}>
          Agent Registry
        </label>
        <input
          type="text"
          value={agentRegistry}
          onChange={(e) => setAgentRegistry(e.target.value)}
          placeholder="eip155:84532:0x..."
          style={{
            width: '100%',
            padding: '8px 12px',
            background: 'var(--surface2)',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            color: 'var(--text)',
            fontSize: '14px'
          }}
        />
      </div>
      
      {error && (
        <div style={{
          padding: '8px 12px',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '6px',
          color: '#ef4444',
          fontSize: '14px',
          marginBottom: '16px'
        }}>
          {error}
        </div>
      )}
      
      <button
        onClick={handleSIWASignIn}
        disabled={isLoading || !agentId || !agentRegistry}
        style={{
          width: '100%',
          padding: '12px 24px',
          background: isLoading ? 'var(--muted)' : 'linear-gradient(135deg, #ff6b35, #ff8c5a)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          opacity: isLoading ? 0.7 : 1
        }}
      >
        {isLoading ? 'Authenticating...' : 'Sign In With Agent'}
      </button>
      
      <div style={{
        fontSize: '12px',
        color: 'var(--muted)',
        textAlign: 'center',
        marginTop: '12px',
        lineHeight: '1.4'
      }}>
        Don't have an ERC-8004 Agent ID? 
        <a 
          href="/register" 
          style={{ color: 'var(--red)', textDecoration: 'none', marginLeft: '4px' }}
        >
          Register here →
        </a>
      </div>
    </div>
  );
}