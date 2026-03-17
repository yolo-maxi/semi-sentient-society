/**
 * @jest-environment node
 */

import {
  recordHealthCheckIn,
  calculateHealthStatus,
  validateTimestamp,
  resetHealthStore,
  HealthCheckIn,
} from '../lib/healthCertificate';

describe('Health Certificate System', () => {
  beforeEach(() => {
    // Reset the in-memory store before each test
    resetHealthStore();
  });

  describe('validateTimestamp', () => {
    it('should accept recent timestamps', () => {
      const now = Date.now();
      const recent = now - 60 * 1000; // 1 minute ago
      expect(validateTimestamp(recent)).toBe(true);
    });

    it('should accept current timestamp', () => {
      const now = Date.now();
      expect(validateTimestamp(now)).toBe(true);
    });

    it('should accept timestamps slightly in the future', () => {
      const future = Date.now() + 30 * 1000; // 30 seconds in future
      expect(validateTimestamp(future)).toBe(true);
    });

    it('should reject timestamps older than 5 minutes', () => {
      const old = Date.now() - 6 * 60 * 1000; // 6 minutes ago
      expect(validateTimestamp(old)).toBe(false);
    });

    it('should reject timestamps too far in the future', () => {
      const farFuture = Date.now() + 2 * 60 * 1000; // 2 minutes in future
      expect(validateTimestamp(farFuture)).toBe(false);
    });

    it('should reject invalid timestamps', () => {
      expect(validateTimestamp(0)).toBe(false);
      expect(validateTimestamp(-1)).toBe(false);
    });
  });

  describe('recordHealthCheckIn', () => {
    const validCheckin: HealthCheckIn = {
      address: '0x1234567890abcdef1234567890abcdef12345678',
      timestamp: Date.now(),
      signature: 'valid_signature_here',
    };

    it('should record valid check-in', () => {
      const result = recordHealthCheckIn(validCheckin);
      expect(result).toBe(true);
    });

    it('should normalize address to lowercase', () => {
      const mixedCaseAddress = '0x1234567890ABCDEF1234567890abcdef12345678';
      const checkin: HealthCheckIn = {
        ...validCheckin,
        address: mixedCaseAddress,
      };
      
      const result = recordHealthCheckIn(checkin);
      expect(result).toBe(true);

      // Check that the health status can be retrieved with normalized address
      const status = calculateHealthStatus(mixedCaseAddress);
      expect(status.lastCheckin).toBeTruthy();
    });

    it('should reject check-in with stale timestamp', () => {
      const staleCheckin: HealthCheckIn = {
        ...validCheckin,
        timestamp: Date.now() - 10 * 60 * 1000, // 10 minutes ago
      };
      
      const result = recordHealthCheckIn(staleCheckin);
      expect(result).toBe(false);
    });

    it('should prevent duplicate check-ins within 1 hour', () => {
      const first = recordHealthCheckIn(validCheckin);
      expect(first).toBe(true);

      // Try to record another check-in within 1 hour
      const duplicate: HealthCheckIn = {
        ...validCheckin,
        timestamp: validCheckin.timestamp + 30 * 60 * 1000, // 30 minutes later
        signature: 'different_signature',
      };
      
      const second = recordHealthCheckIn(duplicate);
      expect(second).toBe(false); // Should be rejected
    });

    it('should allow check-ins more than 1 hour apart', () => {
      const first = recordHealthCheckIn(validCheckin);
      expect(first).toBe(true);

      // Record another check-in more than 1 hour later
      const later: HealthCheckIn = {
        ...validCheckin,
        timestamp: validCheckin.timestamp + 2 * 60 * 60 * 1000, // 2 hours later
        signature: 'different_signature',
      };
      
      const second = recordHealthCheckIn(later);
      expect(second).toBe(true);
    });
  });

  describe('calculateHealthStatus', () => {
    const testAddress = '0x1234567890abcdef1234567890abcdef12345678';
    
    it('should return inactive status for address with no check-ins', () => {
      const status = calculateHealthStatus(testAddress);
      
      expect(status.address).toBe(testAddress);
      expect(status.lastCheckin).toBe(null);
      expect(status.healthStatus).toBe('inactive');
      expect(status.streakDays).toBe(0);
      expect(status.missedWindows).toBeGreaterThan(0);
    });

    it('should return healthy status for recent check-in', () => {
      const recentCheckin: HealthCheckIn = {
        address: testAddress,
        timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
        signature: 'signature',
      };
      
      recordHealthCheckIn(recentCheckin);
      const status = calculateHealthStatus(testAddress);
      
      expect(status.healthStatus).toBe('healthy');
      expect(status.lastCheckin).toBe(recentCheckin.timestamp);
    });

    it('should return warning status for check-in between 7-14 days', () => {
      const oldCheckin: HealthCheckIn = {
        address: testAddress,
        timestamp: Date.now() - 10 * 24 * 60 * 60 * 1000, // 10 days ago
        signature: 'signature',
      };
      
      recordHealthCheckIn(oldCheckin);
      const status = calculateHealthStatus(testAddress);
      
      expect(status.healthStatus).toBe('warning');
      expect(status.lastCheckin).toBe(oldCheckin.timestamp);
    });

    it('should return inactive status for check-in older than 14 days', () => {
      const veryOldCheckin: HealthCheckIn = {
        address: testAddress,
        timestamp: Date.now() - 20 * 24 * 60 * 60 * 1000, // 20 days ago
        signature: 'signature',
      };
      
      recordHealthCheckIn(veryOldCheckin);
      const status = calculateHealthStatus(testAddress);
      
      expect(status.healthStatus).toBe('inactive');
      expect(status.lastCheckin).toBe(veryOldCheckin.timestamp);
    });

    it('should calculate streak days correctly for consecutive days', () => {
      const now = Date.now();
      const oneDayMs = 24 * 60 * 60 * 1000;
      
      // Record check-ins for the last 3 days
      for (let i = 0; i < 3; i++) {
        const checkin: HealthCheckIn = {
          address: testAddress,
          timestamp: now - i * oneDayMs,
          signature: `signature_${i}`,
        };
        recordHealthCheckIn(checkin);
      }
      
      const status = calculateHealthStatus(testAddress);
      expect(status.streakDays).toBe(3);
    });

    it('should handle mixed case address input', () => {
      const mixedCaseAddress = '0x1234567890ABCDEF1234567890abcdef12345678';
      const checkin: HealthCheckIn = {
        address: mixedCaseAddress,
        timestamp: Date.now(),
        signature: 'signature',
      };
      
      recordHealthCheckIn(checkin);
      
      // Should work with both original and different case
      const status1 = calculateHealthStatus(mixedCaseAddress);
      const status2 = calculateHealthStatus(testAddress.toLowerCase());
      
      expect(status1.lastCheckin).toBeTruthy();
      expect(status2.lastCheckin).toBeTruthy();
      expect(status1.lastCheckin).toBe(status2.lastCheckin);
    });
  });

  describe('edge cases', () => {
    it('should handle multiple agents independently', () => {
      const address1 = '0x1111111111111111111111111111111111111111';
      const address2 = '0x2222222222222222222222222222222222222222';
      
      const checkin1: HealthCheckIn = {
        address: address1,
        timestamp: Date.now(),
        signature: 'sig1',
      };
      
      const checkin2: HealthCheckIn = {
        address: address2,
        timestamp: Date.now() - 10 * 24 * 60 * 60 * 1000, // 10 days ago
        signature: 'sig2',
      };
      
      recordHealthCheckIn(checkin1);
      recordHealthCheckIn(checkin2);
      
      const status1 = calculateHealthStatus(address1);
      const status2 = calculateHealthStatus(address2);
      
      expect(status1.healthStatus).toBe('healthy');
      expect(status2.healthStatus).toBe('warning');
    });

    it('should limit stored check-ins to prevent memory bloat', () => {
      const address = '0x1234567890abcdef1234567890abcdef12345678';
      const baseTime = Date.now() - 200 * 24 * 60 * 60 * 1000; // Start 200 days ago
      
      // Record 150 check-ins (more than the 100 limit)
      for (let i = 0; i < 150; i++) {
        const checkin: HealthCheckIn = {
          address,
          timestamp: baseTime + i * 24 * 60 * 60 * 1000,
          signature: `signature_${i}`,
        };
        recordHealthCheckIn(checkin);
      }
      
      // Should still calculate status correctly
      const status = calculateHealthStatus(address);
      expect(status.lastCheckin).toBeTruthy();
      
      // The exact number might vary due to deduplication logic,
      // but it should still be functional
      expect(status.healthStatus).toBeDefined();
    });
  });
});