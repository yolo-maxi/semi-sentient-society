// Simple in-memory rate limiter
// For production, consider using Redis or a more sophisticated solution

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
}

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 60; // 60 requests per minute

class InMemoryRateLimiter {
  private store = new Map<string, RateLimitEntry>();

  async consume(identifier: string): Promise<RateLimitResult> {
    const now = Date.now();
    const entry = this.store.get(identifier);

    // Clean up expired entries periodically
    this.cleanup(now);

    if (!entry) {
      // First request from this identifier
      this.store.set(identifier, {
        count: 1,
        resetTime: now + RATE_LIMIT_WINDOW_MS,
      });
      return {
        allowed: true,
        remaining: RATE_LIMIT_MAX_REQUESTS - 1,
      };
    }

    if (now > entry.resetTime) {
      // Window has reset
      this.store.set(identifier, {
        count: 1,
        resetTime: now + RATE_LIMIT_WINDOW_MS,
      });
      return {
        allowed: true,
        remaining: RATE_LIMIT_MAX_REQUESTS - 1,
      };
    }

    if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
      // Rate limit exceeded
      return {
        allowed: false,
        remaining: 0,
      };
    }

    // Increment counter
    entry.count++;
    return {
      allowed: true,
      remaining: RATE_LIMIT_MAX_REQUESTS - entry.count,
    };
  }

  async check(identifier: string): Promise<boolean> {
    const result = await this.consume(identifier);
    return result.allowed;
  }

  private cleanup(now: number) {
    // Remove entries older than 5 minutes to prevent memory bloat
    const cutoff = now - 5 * 60 * 1000;
    
    const keysToDelete: string[] = [];
    this.store.forEach((entry, key) => {
      if (entry.resetTime < cutoff) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach((key) => {
      this.store.delete(key);
    });
  }

  // For testing purposes
  reset() {
    this.store.clear();
  }

  getStats() {
    const entries: {
      identifier: string;
      count: number;
      resetTime: number;
      remaining: number;
    }[] = [];
    
    this.store.forEach((value, key) => {
      entries.push({
        identifier: key,
        count: value.count,
        resetTime: value.resetTime,
        remaining: Math.max(0, RATE_LIMIT_MAX_REQUESTS - value.count),
      });
    });

    return {
      activeEntries: this.store.size,
      entries,
    };
  }
}

export const rateLimiter = new InMemoryRateLimiter();
