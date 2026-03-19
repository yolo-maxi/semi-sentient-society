interface RateLimitEntry {
  timestamps: number[];
  lastSeen: number;
  maxRequests: number;
  windowMs: number;
}

export interface RateLimitOptions {
  maxRequests?: number;
  windowMs?: number;
  keyPrefix?: string;
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
  retryAfter: number;
}

const DEFAULT_WINDOW_MS = 60 * 1000;
const DEFAULT_MAX_REQUESTS = 60;
const DEFAULT_SWEEP_INTERVAL_MS = 30 * 1000;
const DEFAULT_STALE_ENTRY_MS = 5 * 60 * 1000;

class InMemoryRateLimiter {
  private store = new Map<string, RateLimitEntry>();

  private lastCleanupAt = 0;

  async check(identifier: string, options?: RateLimitOptions): Promise<boolean> {
    const result = await this.consume(identifier, options);
    return result.allowed;
  }

  async consume(identifier: string, options?: RateLimitOptions): Promise<RateLimitResult> {
    const now = Date.now();
    const maxRequests = options?.maxRequests ?? DEFAULT_MAX_REQUESTS;
    const windowMs = options?.windowMs ?? DEFAULT_WINDOW_MS;
    const key = this.buildKey(identifier, options?.keyPrefix);

    this.cleanup(now);

    const windowStart = now - windowMs;
    const entry = this.store.get(key);
    const timestamps = entry?.timestamps.filter((timestamp) => timestamp > windowStart) ?? [];

    if (timestamps.length >= maxRequests) {
      const resetTime = timestamps[0] + windowMs;

      this.store.set(key, {
        timestamps,
        lastSeen: now,
        maxRequests,
        windowMs,
      });

      return {
        allowed: false,
        limit: maxRequests,
        remaining: 0,
        resetTime,
        retryAfter: Math.max(1, Math.ceil((resetTime - now) / 1000)),
      };
    }

    timestamps.push(now);
    const resetTime = timestamps[0] + windowMs;

    this.store.set(key, {
      timestamps,
      lastSeen: now,
      maxRequests,
      windowMs,
    });

    return {
      allowed: true,
      limit: maxRequests,
      remaining: Math.max(0, maxRequests - timestamps.length),
      resetTime,
      retryAfter: Math.max(0, Math.ceil((resetTime - now) / 1000)),
    };
  }

  private buildKey(identifier: string, keyPrefix?: string) {
    return keyPrefix ? `${keyPrefix}:${identifier}` : identifier;
  }

  private cleanup(now: number) {
    if (now - this.lastCleanupAt < DEFAULT_SWEEP_INTERVAL_MS) {
      return;
    }

    this.lastCleanupAt = now;
    for (const [key, entry] of this.store.entries()) {
      const timestamps = entry.timestamps.filter(
        (timestamp) => timestamp > now - entry.windowMs
      );

      if (timestamps.length === 0 && entry.lastSeen < now - Math.max(DEFAULT_STALE_ENTRY_MS, entry.windowMs * 2)) {
        this.store.delete(key);
        continue;
      }

      if (timestamps.length !== entry.timestamps.length) {
        this.store.set(key, {
          timestamps,
          lastSeen: entry.lastSeen,
          maxRequests: entry.maxRequests,
          windowMs: entry.windowMs,
        });
      }
    }
  }

  reset() {
    this.store.clear();
    this.lastCleanupAt = 0;
  }

  getStats() {
    const now = Date.now();
    const entries: Array<{
      identifier: string;
      count: number;
      resetTime: number;
      remaining: number;
    }> = [];

    for (const [identifier, entry] of this.store.entries()) {
      const timestamps = entry.timestamps.filter(
        (timestamp) => timestamp > now - entry.windowMs
      );
      const resetTime = timestamps.length > 0 ? timestamps[0] + entry.windowMs : now;

      entries.push({
        identifier,
        count: timestamps.length,
        resetTime,
        remaining: Math.max(0, entry.maxRequests - timestamps.length),
      });
    }

    return {
      activeEntries: this.store.size,
      entries,
    };
  }
}

export const rateLimiter = new InMemoryRateLimiter();
