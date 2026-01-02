import { NextResponse } from 'next/server';
import { getMyIGBusinessId, discoverProfile, parseUsername } from '@/lib/instagram';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const rawUsername = searchParams.get('username');
    console.log(`API Route received raw username: "${rawUsername}"`);

    if (!rawUsername) {
        return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    const username = parseUsername(rawUsername);
    console.log(`API Route using parsed username: "${username}"`);

    try {
        // 1. Get our own Business ID (can be cached in env later)
        let myIgId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;

        if (!myIgId) {
            myIgId = await getMyIGBusinessId();
        }

        if (!myIgId) {
            return NextResponse.json({ error: 'Could not find a linked Instagram Business Account.' }, { status: 500 });
        }

        // 2. Discover the target profile
        const profile = await discoverProfile(myIgId, username);

        if (!profile) {
            return NextResponse.json({ error: 'Could not find profile.' }, { status: 404 });
        }

        console.log("Profile found:", profile.username);
        return NextResponse.json(profile);
    } catch (error: any) {
        console.error("API Route Error:", error.message);

        // Return 500 for auth errors or other unexpected issues
        return NextResponse.json({
            error: error.message || 'Internal Server Error'
        }, { status: 500 });
    }
}
