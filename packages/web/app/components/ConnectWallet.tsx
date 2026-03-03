'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';

export function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div
          style={{
            padding: '8px 16px',
            background: 'linear-gradient(135deg, #ff6b35, #ff8c5a)',
            color: 'white',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
          }}
        >
          {address.slice(0, 6)}...{address.slice(-4)}
        </div>
        <button
          onClick={() => disconnect()}
          style={{
            padding: '8px 12px',
            background: 'rgba(255, 107, 53, 0.1)',
            border: '1px solid rgba(255, 107, 53, 0.3)',
            borderRadius: '6px',
            color: '#ff8c5a',
            fontSize: '12px',
            cursor: 'pointer',
          }}
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      {connectors.length > 0 && (
        <button
          onClick={() => connect({ connector: connectors[0] })}
          disabled={isPending}
          style={{
            padding: '8px 16px',
            background: isPending 
              ? 'rgba(255, 107, 53, 0.5)' 
              : 'linear-gradient(135deg, #ff6b35, #ff8c5a)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: isPending ? 'not-allowed' : 'pointer',
          }}
        >
          {isPending ? 'Connecting...' : 'Connect Wallet'}
        </button>
      )}
    </div>
  );
}
