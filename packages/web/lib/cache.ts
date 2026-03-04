// Simple in-memory cache utility
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

const cache = new Map<string, CacheEntry<any>>();

/**
 * Get cached data or fetch fresh data using the provided fetcher function
 * @param key - Cache key
 * @param ttlMs - Time to live in milliseconds (default: 60 seconds)
 * @param fetcher - Function to fetch fresh data
 * @returns Promise that resolves to cached or fresh data
 */
export async function getCached<T>(
  key: string,
  ttlMs: number = 60 * 1000, // Default TTL: 60 seconds
  fetcher: () => Promise<T>
): Promise<{ data: T; fresh: boolean; cachedAt: number }> {
  const now = Date.now();
  const cached = cache.get(key);

  // Check if we have fresh cached data
  if (cached && (now - cached.timestamp) < cached.ttl) {
    return {
      data: cached.data,
      fresh: false,
      cachedAt: cached.timestamp
    };
  }

  // Try to fetch fresh data
  try {
    const freshData = await fetcher();
    
    // Store in cache
    cache.set(key, {
      data: freshData,
      timestamp: now,
      ttl: ttlMs
    });

    return {
      data: freshData,
      fresh: true,
      cachedAt: now
    };
  } catch (error) {
    // If we have stale data, return it
    if (cached) {
      console.warn(`Failed to fetch fresh data for ${key}, returning stale data:`, error);
      return {
        data: cached.data,
        fresh: false,
        cachedAt: cached.timestamp
      };
    }
    
    // No fallback data, re-throw error
    throw error;
  }
}

/**
 * Clear cache entries
 * @param keyPrefix - Optional prefix to match keys for partial clearing
 */
export function clearCache(keyPrefix?: string): void {
  if (keyPrefix) {
    for (const key of cache.keys()) {
      if (key.startsWith(keyPrefix)) {
        cache.delete(key);
      }
    }
  } else {
    cache.clear();
  }
}

/**
 * Get cache statistics for debugging
 */
export function getCacheStats() {
  const now = Date.now();
  const entries = Array.from(cache.entries());
  
  return {
    totalEntries: entries.length,
    entries: entries.map(([key, entry]) => ({
      key,
      cachedAt: entry.timestamp,
      ttl: entry.ttl,
      isExpired: (now - entry.timestamp) >= entry.ttl,
      age: now - entry.timestamp
    }))
  };
}
