import { NextResponse } from 'next/server';
import { verifyAdmin, unauthorizedResponse } from '@/lib/adminAuth';
import { deleteCache, flushAllCache, setCache } from '@/lib/redis';
import { getMyIGBusinessId, discoverProfile } from '@/lib/instagram';

export async function DELETE(request: Request) {
    const user = await verifyAdmin(request);
    if (!user) return unauthorizedResponse();

    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    const clearAll = searchParams.get('all') === 'true';

    try {
        if (clearAll) {
            await flushAllCache();
            return NextResponse.json({ message: 'All caches cleared' });
        }

        if (username) {
            const cacheKey = `profile:${username}`;
            await deleteCache(cacheKey);
            return NextResponse.json({ message: `Cache cleared for ${username}` });
        }

        return NextResponse.json({ error: 'Username or all=true required' }, { status: 400 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    // Force Refresh Profile
    const user = await verifyAdmin(request);
    if (!user) return unauthorizedResponse();

    const { username } = await request.json();

    if (!username) {
        return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    try {
        let myIgId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
        if (!myIgId) {
            myIgId = await getMyIGBusinessId();
        }

        if (!myIgId) {
            return NextResponse.json({ error: 'Instagram Business ID not found' }, { status: 500 });
        }

        const profile = await discoverProfile(myIgId, username);

        if (!profile) {
            return NextResponse.json({ error: 'Profile not found on Instagram' }, { status: 404 });
        }

        // Update Cache (24h)
        const cacheKey = `profile:${username}`;
        await setCache(cacheKey, profile, 24 * 60 * 60);

        return NextResponse.json({ message: 'Profile refreshed successfully', profile });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
