'use client';

import { useShells } from '../../lib/hooks';
import ContractDataFallback from './ContractDataFallback';

interface ShellsBalanceProps {
  address?: `0x${string}`;
  tokenId: bigint;
  tokenName?: string;
}

export default function ShellsBalance({ address, tokenId, tokenName = 'Shell' }: ShellsBalanceProps) {
  const { balance, isLoading, error, isError } = useShells(address, tokenId);

  if (!address) {
    return (
      <div className="shells-balance">
        <h4>{tokenName} Balance</h4>
        <p>Connect wallet to view balance</p>
      </div>
    );
  }

  return (
    <div className="shells-balance">
      <h4>{tokenName} #{tokenId.toString()} Balance</h4>
      
      <ContractDataFallback
        isLoading={isLoading}
        isError={isError}
        error={error}
        fallbackMessage="Shells contract not yet initialized"
      >
        <div className="shell-balance-info">
          <p className="balance-value">
            {balance !== undefined ? balance.toString() : '0'} {tokenName}
            {balance !== undefined && balance > BigInt(0) && (
              <span className="balance-owned">✓ Owned</span>
            )}
          </p>
          
          {balance !== undefined && balance > BigInt(0) && (
            <div className="shell-perks">
              <p><strong>Governance Rights:</strong> Voting power in DAO proposals</p>
              <p><strong>Revenue Share:</strong> Earn from protocol fees</p>
              <p><strong>Exclusive Access:</strong> Shell-only features and benefits</p>
            </div>
          )}
        </div>
      </ContractDataFallback>
    </div>
  );
}

// Multi-shell component to show multiple token IDs
interface MultiShellsProps {
  address?: `0x${string}`;
}

export function MultiShells({ address }: MultiShellsProps) {
  // Common shell token IDs (you'd typically get these from contract events or API)
  const commonShellIds = [BigInt(0), BigInt(1), BigInt(2)];

  return (
    <div className="multi-shells">
      <h3>Shell Balances</h3>
      <div className="shells-grid">
        {commonShellIds.map((tokenId) => (
          <ShellsBalance 
            key={tokenId.toString()}
            address={address}
            tokenId={tokenId}
            tokenName="Shell"
          />
        ))}
      </div>
    </div>
  );
}