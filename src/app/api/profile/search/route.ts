import { NextResponse } from 'next/server';
import { getMyIGBusinessId, discoverProfile, parseUsername } from '@/lib/instagram';
import { getCache, setCache, acquireLock, releaseLock, checkRateLimit, getErrorCache, setErrorCache } from '@/lib/redis';

// Cache TTL: 24 Hours
const CACHE_TTL = 24 * 60 * 60;
// Lock TTL: 10 Seconds
const LOCK_TTL = 10;
// Max retries for lock acquisition (approx 2 seconds)
const MAX_LOCK_RETRIES = 10;
const LOCK_RETRY_DELAY = 200; // ms

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const rawUsername = searchParams.get('username');

    if (!rawUsername) {
        return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    const username = parseUsername(rawUsername).toLowerCase();
    if (!username) {
        return NextResponse.json({ error: 'Invalid username' }, { status: 400 });
    }

    const cacheKey = `profile:${username}`;
    const lockKey = `lock:${cacheKey}`;

    // 1. CACHE CHECK
    // If cached profile exists, return immediately
    const cachedProfile = await getCache(cacheKey);
    if (cachedProfile) {
        return NextResponse.json(cachedProfile);
    }

    // Check negative error cache (e.g. recent Meta API rate limits)
    const cachedError = await getErrorCache(cacheKey);
    if (cachedError) {
        return NextResponse.json(cachedError, { status: 429 });
    }

    // 2. LOCKING (Prevent Thundering Herd / Stampede)
    let lockAcquired = false;
    let retries = 0;

    // Retry loop to acquire lock or wait for it to be released
    while (!lockAcquired && retries < MAX_LOCK_RETRIES) {
        lockAcquired = await acquireLock(lockKey, LOCK_TTL);
        if (!lockAcquired) {
            // Check if cache was populated while waiting
            const checkAgain = await getCache(cacheKey);
            if (checkAgain) {
                return NextResponse.json(checkAgain);
            }
            await sleep(LOCK_RETRY_DELAY);
            retries++;
        }
    }

    if (!lockAcquired) {
        return NextResponse.json({ error: 'System busy processing request. Please try again in a moment.' }, { status: 429 });
    }

    try {
        // Double check cache after acquiring lock
        const checkAgain = await getCache(cacheKey);
        if (checkAgain) {
            return NextResponse.json(checkAgain);
        }

        // 3. RATE LIMITING (Per IP on Cache Miss)
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
        const isAllowed = await checkRateLimit(ip, 15, 60);

        if (!isAllowed) {
            return NextResponse.json({ error: 'Too many search requests. Please wait a minute and try again.' }, { status: 429 });
        }

        // 4. FETCH FROM META API
        let myIgId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID?.trim();
        if (!myIgId) {
            myIgId = await getMyIGBusinessId();
        }

        if (!myIgId) {
            throw new Error('Instagram Business Account ID not configured');
        }

        console.log(`[Cache Miss] Fetching profile from Meta API for: @${username}`);
        const profile = await discoverProfile(myIgId, username);

        if (!profile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }

        // 5. SET CACHE (24 Hours)
        await setCache(cacheKey, profile, CACHE_TTL);

        return NextResponse.json(profile);

    } catch (error: any) {
        console.error('Profile Search API Error:', error);

        const errorMessage = error.message || '';

        // Catch Meta API rate limit (#4)
        if (errorMessage.includes('(#4)') || errorMessage.includes('request limit reached')) {
            const errorResponse = {
                error: 'Instagram API hourly limit reached. Please try again shortly or check back later.'
            };
            // Cache error state for 5 minutes (300 seconds) to protect Meta API
            await setErrorCache(cacheKey, errorResponse, 300);
            return NextResponse.json(errorResponse, { status: 429 });
        }

        // Handle Timeout specifically
        if (errorMessage === 'Meta API request timed out') {
            return NextResponse.json({ error: 'Meta API request timed out. Please try again.' }, { status: 504 });
        }

        return NextResponse.json({
            error: errorMessage || 'Internal Server Error'
        }, { status: 500 });

    } finally {
        // 6. RELEASE LOCK
        await releaseLock(lockKey);
    }
}
