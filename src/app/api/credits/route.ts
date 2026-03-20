import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET: Check credits for a user by email (query param)
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
        // Anonymous user — use localStorage credits on client side
        return NextResponse.json({ plan: 'free', credits_remaining: 2, credits_total: 2 });
    }

    const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('email', email)
        .single();

    if (error || !data) {
        // New user — create entry with free plan
        const { data: newUser, error: createError } = await supabase
            .from('user_subscriptions')
            .insert({ email, plan: 'free', credits_remaining: 2, credits_total: 2 })
            .select()
            .single();

        if (createError) {
            return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
        }
        return NextResponse.json(newUser);
    }

    // Check if plan has expired
    if (data.plan !== 'free' && data.plan_expires_at) {
        const now = new Date();
        const expires = new Date(data.plan_expires_at);
        if (now > expires) {
            // Plan expired — revert to free with 0 credits
            const { data: updated } = await supabase
                .from('user_subscriptions')
                .update({ plan: 'free', credits_remaining: 0, credits_total: 2, plan_expires_at: null, updated_at: new Date().toISOString() })
                .eq('email', email)
                .select()
                .single();
            return NextResponse.json(updated);
        }
    }

    return NextResponse.json(data);
}

// POST: Deduct credits after a search
export async function POST(request: Request) {
    const body = await request.json();
    const { email, username_searched } = body;

    if (!email) {
        return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Get user subscription
    const { data: user, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('email', email)
        .single();

    if (error || !user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check plan expiry
    if (user.plan !== 'free' && user.plan_expires_at) {
        const now = new Date();
        const expires = new Date(user.plan_expires_at);
        if (now > expires) {
            await supabase
                .from('user_subscriptions')
                .update({ plan: 'free', credits_remaining: 0, credits_total: 2, plan_expires_at: null, updated_at: new Date().toISOString() })
                .eq('email', email);
            return NextResponse.json({ error: 'Plan expired. Please upgrade.', credits_remaining: 0 }, { status: 402 });
        }
    }

    // Monthly = unlimited
    if (user.plan === 'monthly') {
        // Log the search but don't deduct
        await supabase.from('search_logs').insert({ user_email: email, username_searched, credits_used: 0 });
        return NextResponse.json({ credits_remaining: -1, plan: 'monthly', message: 'Unlimited' });
    }

    // Free and Weekly: deduct 2 credits
    if (user.credits_remaining < 2) {
        return NextResponse.json({
            error: 'Not enough credits. Please upgrade your plan.',
            credits_remaining: user.credits_remaining,
        }, { status: 402 });
    }

    const newCredits = user.credits_remaining - 2;

    const { data: updated, error: updateError } = await supabase
        .from('user_subscriptions')
        .update({ credits_remaining: newCredits, updated_at: new Date().toISOString() })
        .eq('email', email)
        .select()
        .single();

    if (updateError) {
        return NextResponse.json({ error: 'Failed to update credits' }, { status: 500 });
    }

    // Log the search
    await supabase.from('search_logs').insert({ user_email: email, username_searched, credits_used: 2 });

    return NextResponse.json(updated);
}
