import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';

// In-memory cache with expiry
const cache = new Map<string, { data: any, expiry: number }>();

// Viem client for Base Sepolia
export const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http('https://sepolia.base.org'),
});

/**
 * Generic cache utility with stale-while-revalidate pattern
 */
export async function getCached<T>(
  key: string, 
  ttlMs: number, 
  fetcher: () => Promise<T>
): Promise<T> {
  const now = Date.now();
  const cached = cache.get(key);
  
  // If cache hit and not expired, return cached data
  if (cached && now < cached.expiry) {
    return cached.data;
  }
  
  // Cache miss or expired - fetch fresh data
  try {
    const freshData = await fetcher();
    cache.set(key, { data: freshData, expiry: now + ttlMs });
    return freshData;
  } catch (error) {
    // If we have stale data, return it on fetch error
    if (cached) {
      console.warn(`Failed to refresh cache for ${key}, returning stale data:`, error);
      return cached.data;
    }
    // No fallback data, re-throw error
    throw error;
  }
}

/**
 * Clear cache entries (useful for testing or manual invalidation)
 */
export function clearCache(keyPattern?: string): void {
  if (keyPattern) {
    for (const key of cache.keys()) {
      if (key.includes(keyPattern)) {
        cache.delete(key);
      }
    }
  } else {
    cache.clear();
  }
}

/**
 * Get cache stats for debugging
 */
export function getCacheStats() {
  const now = Date.now();
  const entries = Array.from(cache.entries());
  
  return {
    totalEntries: entries.length,
    expiredEntries: entries.filter(([, { expiry }]) => now >= expiry).length,
    validEntries: entries.filter(([, { expiry }]) => now < expiry).length,
    entries: entries.map(([key, { expiry }]) => ({
      key,
      expiry,
      expired: now >= expiry,
    })),
  };
}
