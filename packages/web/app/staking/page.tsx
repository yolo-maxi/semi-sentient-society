'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import SiteNav from '../components/SiteNav';
import { useSSS, useStaking } from '../../lib/hooks';

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
              {/* Stats Overview */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 16,
              }}>
                <div style={{
                  background: '#12121a',
                  border: '1px solid #1e1e2e',
                  borderRadius: 12,
                  padding: 20,
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ff6b35' }}>
                    {isLoading ? '...' : sssBalance ? Number(sssBalance / BigInt(10 ** 18)).toLocaleString() : '0'}
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
                    {isLoading ? '...' : Number(userStakeAmount / BigInt(10 ** 18)).toLocaleString()}
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
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ff6b35' }}>
                    {isLoading ? '...' : pendingRewards ? Number(pendingRewards / BigInt(10 ** 18)).toLocaleString() : '0'}
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
                    {isLoading ? '...' : totalStaked ? Number(totalStaked / BigInt(10 ** 18)).toLocaleString() : '0'}
                  </div>
                  <div style={{ fontSize: 12, color: '#6b6b7e', marginTop: 4 }}>
                    Total Staked
                  </div>
                </div>
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
    </>
  );
}
