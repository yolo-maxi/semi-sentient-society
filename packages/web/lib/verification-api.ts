import { createHash } from 'node:crypto';
import { getAddress } from 'viem';

export type VerificationHealthStatus =
  | 'active'
  | 'warning'
  | 'expired'
  | 'unknown';

export interface VerificationRecord {
  address: string;
  verified: boolean;
  joinedAt: string | null;
  healthStatus: VerificationHealthStatus;
  trustScore: number;
  shellBalance: number;
  stakingBalance: number;
  lastHealthCert: string | null;
}

const ADDRESS_PATTERN = /^0x[a-fA-F0-9]{40}$/;
const DAY_MS = 24 * 60 * 60 * 1000;

function hashAddress(address: string) {
  return createHash('sha256').update(address.toLowerCase()).digest();
}

function scaleByte(value: number, min: number, max: number) {
  return min + Math.round((value / 255) * (max - min));
}

function daysAgo(referenceTime: number, days: number) {
  return new Date(referenceTime - days * DAY_MS).toISOString();
}

export function isVerificationAddress(address: string) {
  return ADDRESS_PATTERN.test(address);
}

export function buildMockVerificationRecord(
  address: string,
  now = Date.now()
): VerificationRecord {
  const normalizedAddress = getAddress(address);
  const hash = hashAddress(normalizedAddress);

  const verified = hash[0] >= 28;
  const healthStatuses: VerificationHealthStatus[] = [
    'active',
    'warning',
    'expired',
    'unknown',
  ];

  const healthStatus = verified
    ? healthStatuses[Math.min(2, hash[1] % 3)]
    : healthStatuses[3];
  const trustScore = verified ? scaleByte(hash[2], 58, 99) : scaleByte(hash[2], 8, 57);
  const shellBalance = verified ? scaleByte(hash[3], 24, 640) : scaleByte(hash[3], 0, 48);
  const stakingBalance = verified
    ? scaleByte(hash[4], 10, shellBalance)
    : scaleByte(hash[4], 0, 18);

  const joinedAt = verified
    ? daysAgo(now, scaleByte(hash[5], 14, 540))
    : hash[6] > 170
      ? daysAgo(now, scaleByte(hash[7], 3, 60))
      : null;

  const lastHealthCert =
    healthStatus === 'unknown'
      ? null
      : daysAgo(
          now,
          healthStatus === 'active'
            ? scaleByte(hash[8], 0, 10)
            : healthStatus === 'warning'
              ? scaleByte(hash[8], 7, 35)
              : scaleByte(hash[8], 45, 120)
        );

  return {
    address: normalizedAddress,
    verified,
    joinedAt,
    healthStatus,
    trustScore,
    shellBalance,
    stakingBalance,
    lastHealthCert,
  };
}
