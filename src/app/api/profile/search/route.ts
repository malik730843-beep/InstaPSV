import { NextResponse } from 'next/server';
import { getMyIGBusinessId, discoverProfile, parseUsername } from '@/lib/instagram';
import { getCache, setCache, acquireLock, releaseLock, checkRateLimit } from '@/lib/redis';

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

    const username = parseUsername(rawUsername);
    const cacheKey = `profile:${username}`;
    const lockKey = `lock:${cacheKey}`;

    // 1. CACHE CHECK
    // If cached, return immediately (Unlimited hits allow)
    const cachedProfile = await getCache(cacheKey);
    if (cachedProfile) {
        return NextResponse.json(cachedProfile);
    }

    // 2. LOCKING (Prevent Thundering Herd / Stampede)
    let lockAcquired = false;
    let retries = 0;

    // Retry loop to acquire lock or wait for it to be released
    while (!lockAcquired && retries < MAX_LOCK_RETRIES) {
        lockAcquired = await acquireLock(lockKey, LOCK_TTL);
        if (!lockAcquired) {
            // Check if cache is now populated by another process
            const checkAgain = await getCache(cacheKey);
            if (checkAgain) {
                return NextResponse.json(checkAgain);
            }
            // Wait and retry
            await sleep(LOCK_RETRY_DELAY);
            retries++;
        }
    }

    if (!lockAcquired) {
        // Could not acquire lock after retries, reject to be safe
        return NextResponse.json({ error: 'System busy, please try again shortly.' }, { status: 429 });
    }

    try {
        // Double check cache after acquiring lock (standard pattern)
        const checkAgain = await getCache(cacheKey);
        if (checkAgain) {
            return NextResponse.json(checkAgain);
        }

        // 3. RATE LIMITING (Only on Cache Miss)
        // Get IP from headers (standard for Next.js / Vercel)
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
        const isAllowed = await checkRateLimit(ip, 10, 60); // 10 req/min per IP on Cache Miss

        if (!isAllowed) {
            return NextResponse.json({ error: 'Rate limit exceeded. Please try again later.' }, { status: 429 });
        }

        // 4. FETCH FROM META API
        let myIgId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
        if (!myIgId) {
            myIgId = await getMyIGBusinessId();
        }

        if (!myIgId) {
            throw new Error('Business Account ID not configured');
        }

        console.log(`Fetching profile from Meta API: ${username}`);
        const profile = await discoverProfile(myIgId, username);

        if (!profile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }

        // 5. SET CACHE (24 Hours)
        // Profile is already normalized by discoverProfile
        await setCache(cacheKey, profile, CACHE_TTL);

        return NextResponse.json(profile);

    } catch (error: any) {
        console.error('Profile Search API Error:', error);

        // Handle Timeout specifically
        if (error.message === 'Meta API request timed out') {
            return NextResponse.json({ error: 'Search timed out. Please try again.' }, { status: 504 });
        }

        return NextResponse.json({
            error: error.message || 'Internal Server Error'
        }, { status: 500 });
    } finally {
        // 6. RELEASE LOCK
        await releaseLock(lockKey);
    }
}
