import { Redis } from '@upstash/redis';

// Initialize Upstash Redis client
// Uses environment variables: UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

export const redis = (redisUrl && redisToken)
    ? new Redis({ url: redisUrl, token: redisToken })
    : null;

if (redis) {
    console.log('⚡ Upstash Redis connected successfully.');
} else {
    console.warn('⚠️ Upstash Redis credentials missing. Falling back to in-memory caching.');
}

/**
 * IN-MEMORY CACHE FALLBACK (L1 Cache)
 * Ensures instant caching even if Redis is network-throttled or unconfigured.
 */
interface CacheEntry<T> {
    value: T;
    expiresAt: number;
}

const memoryCache = new Map<string, CacheEntry<any>>();

function getMemoryCache<T>(key: string): T | null {
    const entry = memoryCache.get(key.toLowerCase());
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
        memoryCache.delete(key.toLowerCase());
        return null;
    }
    return entry.value as T;
}

function setMemoryCache(key: string, value: any, ttlSeconds: number): void {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    memoryCache.set(key.toLowerCase(), { value, expiresAt });
}

function deleteMemoryCache(key: string): void {
    memoryCache.delete(key.toLowerCase());
}

function flushMemoryCache(): void {
    memoryCache.clear();
}

/**
 * CACHE HELPERS
 */

export async function getCache<T>(key: string): Promise<T | null> {
    const normalizedKey = key.toLowerCase();

    // 1. Check L1 Memory Cache first
    const memData = getMemoryCache<T>(normalizedKey);
    if (memData !== null) {
        return memData;
    }

    // 2. Check Upstash Redis
    if (!redis) return null;
    try {
        const data = await redis.get<T>(normalizedKey);
        if (data !== null) {
            // Populate L1 cache for subsequent fast reads (default 1 hour L1 TTL)
            setMemoryCache(normalizedKey, data, 3600);
            return data;
        }
        return null;
    } catch (error) {
        console.error(`Redis Get Error (${normalizedKey}):`, error);
        return null;
    }
}

export async function setCache(key: string, value: any, ttlSeconds: number): Promise<void> {
    const normalizedKey = key.toLowerCase();

    // Write to L1 Memory Cache
    setMemoryCache(normalizedKey, value, ttlSeconds);

    // Write to Upstash Redis
    if (!redis) return;
    try {
        await redis.set(normalizedKey, value, { ex: ttlSeconds });
    } catch (error) {
        console.error(`Redis Set Error (${normalizedKey}):`, error);
    }
}

export async function deleteCache(key: string): Promise<void> {
    const normalizedKey = key.toLowerCase();
    deleteMemoryCache(normalizedKey);

    if (!redis) return;
    try {
        await redis.del(normalizedKey);
    } catch (error) {
        console.error(`Redis Delete Error (${normalizedKey}):`, error);
    }
}

export async function flushAllCache(): Promise<void> {
    flushMemoryCache();
    if (!redis) return;
    try {
        await redis.flushall();
    } catch (error) {
        console.error('Redis Flush Error:', error);
    }
}

/**
 * NEGATIVE & RATE LIMIT ERROR CACHING
 * Caches Meta API rate limit errors (e.g. #4 Application request limit reached)
 * to avoid pounding Meta API when rate limited.
 */
export async function setErrorCache(key: string, errorPayload: any, ttlSeconds: number = 300): Promise<void> {
    const errorKey = `err:${key.toLowerCase()}`;
    await setCache(errorKey, errorPayload, ttlSeconds);
}

export async function getErrorCache(key: string): Promise<any | null> {
    const errorKey = `err:${key.toLowerCase()}`;
    return await getCache(errorKey);
}

/**
 * LOCKING MECHANISM
 * Prevents race conditions and stampedes on the Meta API.
 */

export async function acquireLock(key: string, ttlSeconds: number = 10): Promise<boolean> {
    const normalizedKey = key.toLowerCase();
    if (!redis) {
        // If no Redis, simulate delay to avoid hammering API if multiple requests come in at once
        await new Promise(resolve => setTimeout(resolve, 100));
        return true;
    }
    try {
        const result = await redis.set(normalizedKey, 'locked', { nx: true, ex: ttlSeconds });
        return result === 'OK';
    } catch (error) {
        console.error(`Redis Lock Error (${normalizedKey}):`, error);
        return true;
    }
}

export async function releaseLock(key: string): Promise<void> {
    await deleteCache(key.toLowerCase());
}

/**
 * RATE LIMITING
 * IP-based fixed window counter.
 */

export async function checkRateLimit(ip: string, limit: number = 20, windowSeconds: number = 60): Promise<boolean> {
    if (!redis) return true;
    const key = `ratelimit:${ip}`;
    try {
        const current = await redis.incr(key);
        if (current === 1) {
            await redis.expire(key, windowSeconds);
        }
        return current <= limit;
    } catch (error) {
        console.error(`Redis Rate Limit Error (${ip}):`, error);
        return true;
    }
}
