// Simple in-memory rate limiter
// For production, consider using Redis or a more sophisticated solution

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

export interface RateLimitOptions {
  maxRequests?: number;
  windowMs?: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
}

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 60; // 60 requests per minute

class InMemoryRateLimiter {
  private store = new Map<string, RateLimitEntry>();

  async check(identifier: string, options?: RateLimitOptions): Promise<boolean> {
    const result = await this.consume(identifier, options);
    return result.allowed;
  }

  async consume(identifier: string, options?: RateLimitOptions): Promise<RateLimitResult> {
    const now = Date.now();
    const maxRequests = options?.maxRequests ?? RATE_LIMIT_MAX_REQUESTS;
    const windowMs = options?.windowMs ?? RATE_LIMIT_WINDOW_MS;

    // Clean up expired entries periodically
    this.cleanup(now);

    const entry = this.store.get(identifier);

    if (!entry) {
      const nextEntry = {
        count: 1,
        resetTime: now + windowMs,
      };

      this.store.set(identifier, nextEntry);

      return {
        allowed: true,
        remaining: maxRequests - nextEntry.count,
        resetTime: nextEntry.resetTime,
      };
    }

    if (now > entry.resetTime) {
      const nextEntry = {
        count: 1,
        resetTime: now + windowMs,
      };

      this.store.set(identifier, nextEntry);

      return {
        allowed: true,
        remaining: maxRequests - nextEntry.count,
        resetTime: nextEntry.resetTime,
      };
    }

    if (entry.count >= maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
      };
    }

    entry.count++;

    return {
      allowed: true,
      remaining: maxRequests - entry.count,
      resetTime: entry.resetTime,
    };
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
