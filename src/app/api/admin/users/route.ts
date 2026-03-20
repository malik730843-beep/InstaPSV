import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET: List all users
export async function GET() {
    const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}

// PUT: Update a user's plan
export async function PUT(request: Request) {
    const body = await request.json();
    const { id, plan, credits_remaining, credits_total, plan_expires_at } = body;

    if (!id) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const updateData: any = { updated_at: new Date().toISOString() };
    if (plan !== undefined) updateData.plan = plan;
    if (credits_remaining !== undefined) updateData.credits_remaining = credits_remaining;
    if (credits_total !== undefined) updateData.credits_total = credits_total;
    if (plan_expires_at !== undefined) updateData.plan_expires_at = plan_expires_at;

    const { data, error } = await supabase
        .from('user_subscriptions')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}
