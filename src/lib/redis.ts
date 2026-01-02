import { Redis } from '@upstash/redis';

// Initialize Upstash Redis client
// Uses environment variables: UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

// Only initialize if credentials exist
export const redis = (redisUrl && redisToken)
    ? new Redis({ url: redisUrl, token: redisToken })
    : null;

if (!redis) {
    console.warn("⚠️ Redis credentials not found. Caching and rate limiting will be disabled.");
}

/**
 * CACHE HELPERS
 */

export async function getCache<T>(key: string): Promise<T | null> {
    if (!redis) return null;
    try {
        const data = await redis.get<T>(key);
        return data;
    } catch (error) {
        console.error(`Redis Get Error (${key}):`, error);
        return null;
    }
}

export async function setCache(key: string, value: any, ttlSeconds: number): Promise<void> {
    if (!redis) return;
    try {
        await redis.set(key, value, { ex: ttlSeconds });
    } catch (error) {
        console.error(`Redis Set Error (${key}):`, error);
    }
}

export async function deleteCache(key: string): Promise<void> {
    if (!redis) return;
    try {
        await redis.del(key);
    } catch (error) {
        console.error(`Redis Delete Error (${key}):`, error);
    }
}

export async function flushAllCache(): Promise<void> {
    if (!redis) return;
    try {
        await redis.flushall();
    } catch (error) {
        console.error('Redis Flush Error:', error);
    }
}

/**
 * LOCKING MECHANISM
 * Prevents race conditions and stampedes on the Meta API.
 */

export async function acquireLock(key: string, ttlSeconds: number = 10): Promise<boolean> {
    if (!redis) {
        // If no Redis, simulate delay to avoid hammering API if multiple requests come in at once
        await new Promise(resolve => setTimeout(resolve, 100));
        return true;
    }
    try {
        // SET key value NX EX ttl
        // NX: Only set if not exists
        // EX: Expire in seconds
        const result = await redis.set(key, 'locked', { nx: true, ex: ttlSeconds });
        return result === 'OK';
    } catch (error) {
        console.error(`Redis Lock Error (${key}):`, error);
        // Fail open if Redis errors
        return true;
    }
}

export async function releaseLock(key: string): Promise<void> {
    await deleteCache(key);
}

/**
 * RATE LIMITING
 * IP-based sliding window or fixed window counter.
 * Using a simple fixed window for efficiency.
 */

export async function checkRateLimit(ip: string, limit: number = 10, windowSeconds: number = 60): Promise<boolean> {
    if (!redis) return true; // No rate limiting without Redis
    const key = `ratelimit:${ip}`;
    try {
        const current = await redis.incr(key);
        if (current === 1) {
            await redis.expire(key, windowSeconds);
        }
        return current <= limit;
    } catch (error) {
        console.error(`Redis Rate Limit Error (${ip}):`, error);
        // Fail open (allow request) if Redis fails, to not block users due to infra issues
        return true;
    }
}
