'use client';

import { useStaking } from '../../lib/hooks';
import { formatUnits } from 'viem';
import ContractDataFallback from './ContractDataFallback';

interface StakingInfoProps {
  address?: `0x${string}`;
}

export default function StakingInfo({ address }: StakingInfoProps) {
  const { stakeInfo, pendingRewards, totalStaked, isLoading, error, isError } = useStaking(address);

  if (!address) {
    return (
      <div className="staking-info">
        <h3>Staking Information</h3>
        <p>Connect wallet to view staking details</p>
      </div>
    );
  }

  return (
    <div className="staking-info">
      <h3>Staking Information</h3>
      
      <ContractDataFallback
        isLoading={isLoading}
        isError={isError}
        error={error}
        fallbackMessage="Staking contract not yet initialized"
      >
        <div className="staking-details">
          {stakeInfo && (
            <div className="stake-info-card">
              <h4>Your Stake</h4>
              <p><strong>Amount:</strong> {formatUnits(stakeInfo[0], 18)} SSS</p>
              <p><strong>Lockup End:</strong> {new Date(Number(stakeInfo[1]) * 1000).toLocaleDateString()}</p>
              <p><strong>Reward Debt:</strong> {formatUnits(stakeInfo[2], 18)} SSS</p>
            </div>
          )}
          
          {pendingRewards && (
            <div className="pending-rewards-card">
              <h4>Pending Rewards</h4>
              <p>{formatUnits(pendingRewards, 18)} SSS</p>
            </div>
          )}
          
          {totalStaked && (
            <div className="total-staked-card">
              <h4>Total Staked (Network)</h4>
              <p>{formatUnits(totalStaked, 18)} SSS</p>
            </div>
          )}
        </div>
      </ContractDataFallback>
    </div>
  );
}