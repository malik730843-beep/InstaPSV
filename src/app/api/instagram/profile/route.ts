import { NextResponse } from 'next/server';
import { getMyIGBusinessId, discoverProfile, parseUsername } from '@/lib/instagram';
import { getCache, setCache, acquireLock, releaseLock, getErrorCache, setErrorCache } from '@/lib/redis';

const CACHE_TTL = 24 * 60 * 60; // 24 Hours

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
    const cachedProfile = await getCache(cacheKey);
    if (cachedProfile) {
        return NextResponse.json(cachedProfile);
    }

    // Check negative error cache
    const cachedError = await getErrorCache(cacheKey);
    if (cachedError) {
        return NextResponse.json(cachedError, { status: 429 });
    }

    // Acquire lock to avoid thundering herd
    const lockAcquired = await acquireLock(lockKey, 10);

    try {
        // Double check cache after lock
        const checkAgain = await getCache(cacheKey);
        if (checkAgain) {
            return NextResponse.json(checkAgain);
        }

        let myIgId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID?.trim();
        if (!myIgId) {
            myIgId = await getMyIGBusinessId();
        }

        if (!myIgId) {
            return NextResponse.json({ error: 'Could not find a linked Instagram Business Account.' }, { status: 500 });
        }

        const profile = await discoverProfile(myIgId, username);
        if (!profile) {
            return NextResponse.json({ error: 'Could not find profile.' }, { status: 404 });
        }

        // Set cache for 24h
        await setCache(cacheKey, profile, CACHE_TTL);
        return NextResponse.json(profile);

    } catch (error: any) {
        console.error("API Route Error:", error.message);
        const errorMessage = error.message || '';

        if (errorMessage.includes('(#4)') || errorMessage.includes('request limit reached')) {
            const errorResponse = {
                error: 'Instagram API hourly limit reached. Please try again shortly.'
            };
            await setErrorCache(cacheKey, errorResponse, 300);
            return NextResponse.json(errorResponse, { status: 429 });
        }

        return NextResponse.json({
            error: errorMessage || 'Internal Server Error'
        }, { status: 500 });

    } finally {
        if (lockAcquired) {
            await releaseLock(lockKey);
        }
    }
}
