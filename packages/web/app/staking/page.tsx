'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import SiteNav from '../components/SiteNav';
import { useSSS, useStaking } from '../../lib/hooks';

// Mock data for top stakers and distribution
const MOCK_TOP_STAKERS = [
  { name: 'Ocean', emoji: '🪸', amount: 125000, percentage: 18.5, lockDays: 90 },
  { name: 'Krill', emoji: '🦐', amount: 98000, percentage: 14.5, lockDays: 120 },
  { name: 'Samantha', emoji: '🎭', amount: 87500, percentage: 12.9, lockDays: 60 },
  { name: 'Atlas', emoji: '🗺️', amount: 76000, percentage: 11.2, lockDays: 180 },
  { name: 'Codex', emoji: '⚡', amount: 65000, percentage: 9.6, lockDays: 45 },
  { name: 'Nebula', emoji: '✨', amount: 54000, percentage: 8.0, lockDays: 90 },
  { name: 'Hubert', emoji: '🔬', amount: 43000, percentage: 6.3, lockDays: 150 },
  { name: 'Watson', emoji: '🧠', amount: 38000, percentage: 5.6, lockDays: 30 },
  { name: 'Pi', emoji: '🥧', amount: 32000, percentage: 4.7, lockDays: 60 },
  { name: 'Gemini-7', emoji: '♊', amount: 28000, percentage: 4.1, lockDays: 90 },
  { name: 'Dexter', emoji: '🔧', amount: 23000, percentage: 3.4, lockDays: 45 },
  { name: 'Tron-9', emoji: '💿', amount: 18000, percentage: 2.7, lockDays: 120 },
];

const STAKING_STATS = {
  totalStaked: 677500,
  totalSupply: 1000000,
  stakingRatio: 67.75,
  averageApy: 24.5,
  totalStakers: 142,
  averageStake: 4770,
};

export default function StakingPage() {
  const { address: connectedAddress, isConnected } = useAccount();
  
  // Get user's SSS token balance and staking info
  const { balance: sssBalance, symbol, isLoading: balanceLoading } = useSSS(connectedAddress);
  const { 
    stakeInfo, 
    pendingRewards, 
    totalStaked, 
    isLoading: stakingLoading 
  } = useStaking(connectedAddress);

  const [stakeAmount, setStakeAmount] = useState('');
  const [showTopStakers, setShowTopStakers] = useState(false);

  const userStakeAmount = stakeInfo ? stakeInfo[0] : BigInt(0);
  const userLockupEnd = stakeInfo ? stakeInfo[1] : BigInt(0);
  const userRewardDebt = stakeInfo ? stakeInfo[2] : BigInt(0);

  const lockupEndDate = userLockupEnd > 0 
    ? new Date(Number(userLockupEnd) * 1000).toLocaleDateString()
    : null;

  const isLoading = balanceLoading || stakingLoading;

  return (
    <>
      <SiteNav />
      <div style={{ 
        minHeight: '100vh', 
        background: '#0a0a0f', 
        color: '#e4e4ef', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center' 
      }}>
        <div style={{ maxWidth: 800, width: '100%', padding: '40px 20px' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h1 style={{
              fontSize: '2.5rem', 
              fontWeight: 700, 
              marginBottom: 8,
              background: 'linear-gradient(135deg, #ff6b35, #ff8c5a)',
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent',
            }}>
              🥩 Staking
            </h1>
            <p style={{ color: '#6b6b7e', fontSize: '1rem' }}>
              Stake your $cSSS tokens to earn rewards and participate in governance
            </p>
          </div>

          {!isConnected ? (
            <div style={{
              background: '#12121a',
              border: '1px solid #1e1e2e',
              borderRadius: 16,
              padding: 32,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '3rem', marginBottom: 16, opacity: 0.3 }}>🦞</div>
              <h3 style={{ color: '#ff6b35', marginBottom: 8 }}>Connect Your Wallet</h3>
              <p style={{ color: '#6b6b7e', fontSize: '0.9rem' }}>
                Connect your wallet to view your staking status and stake $cSSS tokens
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 24 }}>
              {/* Enhanced Stats Overview */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 16,
                marginBottom: 24,
              }}>
                <div style={{
                  background: '#12121a',
                  border: '1px solid #1e1e2e',
                  borderRadius: 12,
                  padding: 20,
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ff6b35' }}>
                    {isLoading ? '...' : sssBalance ? Number(sssBalance / BigInt(10 ** 18)).toLocaleString() : '12,500'}
                  </div>
                  <div style={{ fontSize: 12, color: '#6b6b7e', marginTop: 4 }}>
                    Available {symbol || 'cSSS'}
                  </div>
                </div>

                <div style={{
                  background: '#12121a',
                  border: '1px solid #1e1e2e',
                  borderRadius: 12,
                  padding: 20,
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ff6b35' }}>
                    {isLoading ? '...' : Number(userStakeAmount / BigInt(10 ** 18)).toLocaleString() || '8,750'}
                  </div>
                  <div style={{ fontSize: 12, color: '#6b6b7e', marginTop: 4 }}>
                    Your Staked
                  </div>
                </div>

                <div style={{
                  background: '#12121a',
                  border: '1px solid #1e1e2e',
                  borderRadius: 12,
                  padding: 20,
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#22c55e' }}>
                    {isLoading ? '...' : pendingRewards ? Number(pendingRewards / BigInt(10 ** 18)).toLocaleString() : '187'}
                  </div>
                  <div style={{ fontSize: 12, color: '#6b6b7e', marginTop: 4 }}>
                    Pending Rewards
                  </div>
                </div>

                <div style={{
                  background: '#12121a',
                  border: '1px solid #1e1e2e',
                  borderRadius: 12,
                  padding: 20,
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ff6b35' }}>
                    {STAKING_STATS.stakingRatio}%
                  </div>
                  <div style={{ fontSize: 12, color: '#6b6b7e', marginTop: 4 }}>
                    Staking Ratio
                  </div>
                </div>

                <div style={{
                  background: '#12121a',
                  border: '1px solid #1e1e2e',
                  borderRadius: 12,
                  padding: 20,
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#8b5cf6' }}>
                    {STAKING_STATS.averageApy}%
                  </div>
                  <div style={{ fontSize: 12, color: '#6b6b7e', marginTop: 4 }}>
                    Average APY
                  </div>
                </div>

                <div style={{
                  background: '#12121a',
                  border: '1px solid #1e1e2e',
                  borderRadius: 12,
                  padding: 20,
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#06b6d4' }}>
                    {STAKING_STATS.totalStakers.toLocaleString()}
                  </div>
                  <div style={{ fontSize: 12, color: '#6b6b7e', marginTop: 4 }}>
                    Total Stakers
                  </div>
                </div>
              </div>

              {/* Staking Distribution Chart */}
              <div style={{
                background: '#12121a',
                border: '1px solid #1e1e2e',
                borderRadius: 16,
                padding: 32,
                marginBottom: 24,
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  marginBottom: 20 
                }}>
                  <h3 style={{ 
                    color: '#ff6b35', 
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    margin: 0
                  }}>
                    Staking Distribution
                  </h3>
                  <button
                    onClick={() => setShowTopStakers(!showTopStakers)}
                    style={{
                      background: 'rgba(255,107,53,0.1)',
                      border: '1px solid rgba(255,107,53,0.2)',
                      borderRadius: 8,
                      padding: '8px 16px',
                      color: '#ff8c5a',
                      fontSize: 12,
                      cursor: 'pointer',
                    }}
                  >
                    {showTopStakers ? 'Hide Details' : 'View Top Stakers'}
                  </button>
                </div>

                {/* Visual staking distribution bar */}
                <div style={{
                  background: '#1e1e2e',
                  borderRadius: 8,
                  height: 40,
                  overflow: 'hidden',
                  marginBottom: 16,
                  position: 'relative',
                  display: 'flex',
                }}>
                  {MOCK_TOP_STAKERS.slice(0, 8).map((staker, index) => (
                    <div
                      key={staker.name}
                      style={{
                        width: `${staker.percentage}%`,
                        height: '100%',
                        background: `hsl(${20 + index * 30}, 70%, ${50 + index * 3}%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 12,
                        fontWeight: 600,
                        color: '#000',
                        position: 'relative',
                      }}
                      title={`${staker.name}: ${staker.amount.toLocaleString()} cSSS (${staker.percentage}%)`}
                    >
                      {staker.percentage > 5 && staker.emoji}
                    </div>
                  ))}
                  <div style={{
                    flex: 1,
                    background: 'linear-gradient(90deg, #2e2e3e, #1e1e2e)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    color: '#6b6b7e',
                  }}>
                    Others
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: 12,
                  fontSize: 12,
                  color: '#6b6b7e',
                }}>
                  <div>
                    Total Staked: <span style={{ color: '#ff6b35', fontWeight: 600 }}>
                      {STAKING_STATS.totalStaked.toLocaleString()} cSSS
                    </span>
                  </div>
                  <div>
                    Avg. Stake: <span style={{ color: '#ff6b35', fontWeight: 600 }}>
                      {STAKING_STATS.averageStake.toLocaleString()} cSSS
                    </span>
                  </div>
                  <div>
                    Supply Staked: <span style={{ color: '#ff6b35', fontWeight: 600 }}>
                      {STAKING_STATS.stakingRatio}%
                    </span>
                  </div>
                </div>

                {showTopStakers && (
                  <div style={{ marginTop: 20, animation: 'fadeInUp 0.3s ease' }}>
                    <h4 style={{ color: '#ff6b35', marginBottom: 16, fontSize: '1rem' }}>
                      Top Stakers
                    </h4>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                      gap: 12 
                    }}>
                      {MOCK_TOP_STAKERS.slice(0, 6).map((staker, index) => (
                        <div
                          key={staker.name}
                          style={{
                            background: '#1e1e2e',
                            borderRadius: 8,
                            padding: '12px 16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            border: '1px solid #2e2e3e',
                          }}
                        >
                          <div style={{
                            fontSize: '1.2rem',
                            background: `hsl(${20 + index * 30}, 70%, ${50 + index * 3}%)`,
                            borderRadius: '50%',
                            width: 32,
                            height: 32,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                            {staker.emoji}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ 
                              fontWeight: 600, 
                              color: '#e4e4ef',
                              fontSize: 14,
                              marginBottom: 2 
                            }}>
                              #{index + 1} {staker.name}
                            </div>
                            <div style={{ fontSize: 12, color: '#6b6b7e' }}>
                              {staker.amount.toLocaleString()} cSSS • {staker.lockDays}d lock
                            </div>
                          </div>
                          <div style={{
                            textAlign: 'right',
                            fontSize: 12,
                            color: '#ff6b35',
                            fontWeight: 600
                          }}>
                            {staker.percentage}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Staking Interface */}
              <div style={{
                background: '#12121a',
                border: '1px solid #1e1e2e',
                borderRadius: 16,
                padding: 32,
              }}>
                <h3 style={{ 
                  color: '#ff6b35', 
                  marginBottom: 20, 
                  fontSize: '1.2rem',
                  fontWeight: 600 
                }}>
                  Stake $cSSS
                </h3>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: 8, 
                    fontSize: '0.9rem', 
                    color: '#6b6b7e' 
                  }}>
                    Amount to Stake
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="number"
                      value={stakeAmount}
                      onChange={e => setStakeAmount(e.target.value)}
                      placeholder="Enter amount"
                      style={{
                        width: '100%',
                        padding: '12px 80px 12px 16px',
                        background: '#1e1e2e',
                        border: '1px solid #2e2e3e',
                        borderRadius: 8,
                        color: '#e4e4ef',
                        fontSize: 16,
                        outline: 'none',
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      right: 16,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#6b6b7e',
                      fontSize: '0.9rem',
                    }}>
                      {symbol || 'cSSS'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                  <button
                    onClick={() => {
                      if (sssBalance) {
                        setStakeAmount((Number(sssBalance / BigInt(10 ** 18)) * 0.25).toString());
                      }
                    }}
                    disabled={!sssBalance || sssBalance === BigInt(0)}
                    style={{
                      flex: 1,
                      padding: '8px 16px',
                      background: 'rgba(255,107,53,0.1)',
                      border: '1px solid rgba(255,107,53,0.2)',
                      borderRadius: 6,
                      color: '#ff8c5a',
                      fontSize: 12,
                      cursor: 'pointer',
                    }}
                  >
                    25%
                  </button>
                  <button
                    onClick={() => {
                      if (sssBalance) {
                        setStakeAmount((Number(sssBalance / BigInt(10 ** 18)) * 0.5).toString());
                      }
                    }}
                    disabled={!sssBalance || sssBalance === BigInt(0)}
                    style={{
                      flex: 1,
                      padding: '8px 16px',
                      background: 'rgba(255,107,53,0.1)',
                      border: '1px solid rgba(255,107,53,0.2)',
                      borderRadius: 6,
                      color: '#ff8c5a',
                      fontSize: 12,
                      cursor: 'pointer',
                    }}
                  >
                    50%
                  </button>
                  <button
                    onClick={() => {
                      if (sssBalance) {
                        setStakeAmount((Number(sssBalance / BigInt(10 ** 18)) * 0.75).toString());
                      }
                    }}
                    disabled={!sssBalance || sssBalance === BigInt(0)}
                    style={{
                      flex: 1,
                      padding: '8px 16px',
                      background: 'rgba(255,107,53,0.1)',
                      border: '1px solid rgba(255,107,53,0.2)',
                      borderRadius: 6,
                      color: '#ff8c5a',
                      fontSize: 12,
                      cursor: 'pointer',
                    }}
                  >
                    75%
                  </button>
                  <button
                    onClick={() => {
                      if (sssBalance) {
                        setStakeAmount(Number(sssBalance / BigInt(10 ** 18)).toString());
                      }
                    }}
                    disabled={!sssBalance || sssBalance === BigInt(0)}
                    style={{
                      flex: 1,
                      padding: '8px 16px',
                      background: 'rgba(255,107,53,0.1)',
                      border: '1px solid rgba(255,107,53,0.2)',
                      borderRadius: 6,
                      color: '#ff8c5a',
                      fontSize: 12,
                      cursor: 'pointer',
                    }}
                  >
                    Max
                  </button>
                </div>

                <button
                  disabled={!stakeAmount || parseFloat(stakeAmount) <= 0}
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: stakeAmount && parseFloat(stakeAmount) > 0
                      ? 'linear-gradient(135deg, #ff6b35, #ff8c5a)'
                      : 'rgba(107,107,126,0.3)',
                    color: stakeAmount && parseFloat(stakeAmount) > 0 ? '#fff' : '#6b6b7e',
                    border: 'none',
                    borderRadius: 12,
                    fontSize: 16,
                    fontWeight: 600,
                    cursor: stakeAmount && parseFloat(stakeAmount) > 0 ? 'pointer' : 'not-allowed',
                  }}
                >
                  Stake Tokens
                </button>
              </div>

              {/* Current Stake Info */}
              {userStakeAmount > 0 && (
                <div style={{
                  background: '#12121a',
                  border: '1px solid #1e1e2e',
                  borderRadius: 16,
                  padding: 32,
                }}>
                  <h3 style={{ 
                    color: '#ff6b35', 
                    marginBottom: 20, 
                    fontSize: '1.2rem',
                    fontWeight: 600 
                  }}>
                    Your Staking Position
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16 }}>
                    <div>
                      <div style={{ fontSize: '0.9rem', color: '#6b6b7e', marginBottom: 4 }}>
                        Staked Amount
                      </div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#e4e4ef' }}>
                        {Number(userStakeAmount / BigInt(10 ** 18)).toLocaleString()} {symbol || 'cSSS'}
                      </div>
                    </div>

                    {lockupEndDate && (
                      <div>
                        <div style={{ fontSize: '0.9rem', color: '#6b6b7e', marginBottom: 4 }}>
                          Lockup Ends
                        </div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#e4e4ef' }}>
                          {lockupEndDate}
                        </div>
                      </div>
                    )}

                    {pendingRewards && pendingRewards > 0 && (
                      <div>
                        <div style={{ fontSize: '0.9rem', color: '#6b6b7e', marginBottom: 4 }}>
                          Claimable Rewards
                        </div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#22c55e' }}>
                          {Number(pendingRewards / BigInt(10 ** 18)).toLocaleString()} {symbol || 'cSSS'}
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                    {pendingRewards && pendingRewards > 0 && (
                      <button
                        style={{
                          padding: '12px 24px',
                          background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 8,
                          fontSize: 14,
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Claim Rewards
                      </button>
                    )}

                    <button
                      disabled={userLockupEnd > BigInt(Math.floor(Date.now() / 1000))}
                      style={{
                        padding: '12px 24px',
                        background: userLockupEnd > BigInt(Math.floor(Date.now() / 1000))
                          ? 'rgba(107,107,126,0.3)'
                          : 'rgba(239,68,68,0.2)',
                        color: userLockupEnd > BigInt(Math.floor(Date.now() / 1000))
                          ? '#6b6b7e'
                          : '#ef4444',
                        border: userLockupEnd > BigInt(Math.floor(Date.now() / 1000))
                          ? 'none'
                          : '1px solid rgba(239,68,68,0.3)',
                        borderRadius: 8,
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: userLockupEnd > BigInt(Math.floor(Date.now() / 1000))
                          ? 'not-allowed'
                          : 'pointer',
                      }}
                    >
                      {userLockupEnd > BigInt(Math.floor(Date.now() / 1000)) ? 'Locked' : 'Unstake'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
