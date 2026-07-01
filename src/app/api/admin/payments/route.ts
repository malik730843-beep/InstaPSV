import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const MOCK_PAYMENTS = [
    {
        id: 'mock-payment-1',
        email: 'malik730843@gmail.com',
        plan_name: 'Premium Monthly',
        amount: 35.00,
        status: 'approved',
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'mock-payment-2',
        email: 'john@example.com',
        plan_name: 'Premium Monthly',
        amount: 35.00,
        status: 'pending',
        created_at: new Date().toISOString()
    }
];

// GET: List all subscription requests
export async function GET() {
    try {
        const { data, error } = await supabase
            .from('subscription_requests')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            throw error;
        }

        return NextResponse.json(data);
    } catch (error: any) {
        if (error.message?.includes('fetch failed') || error.message?.includes('fetch') || error.message?.includes('network')) {
            console.warn("Supabase offline - returning mock payments list");
            return NextResponse.json(MOCK_PAYMENTS);
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT: Approve or Reject a request
export async function PUT(request: Request) {
    const body = await request.json();
    const { requestId, status, reason } = body;

    if (!requestId || !status) {
        return NextResponse.json({ error: 'Request ID and status are required' }, { status: 400 });
    }

    // 1. Get the request
    const { data: subRequest, error: getError } = await supabase
        .from('subscription_requests')
        .select('*')
        .eq('id', requestId)
        .single();

    if (getError || !subRequest) {
        return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    if (subRequest.status !== 'pending') {
        return NextResponse.json({ error: 'Request is already processed' }, { status: 400 });
    }

    // 2. Update Request Status
    const { error: updateError } = await supabase
        .from('subscription_requests')
        .update({ 
            status, 
            processed_at: new Date().toISOString(),
            rejection_reason: reason || null
        })
        .eq('id', requestId);

    if (updateError) {
        return NextResponse.json({ error: 'Failed to update request' }, { status: 500 });
    }

    // 3. If Approved, Upgrade the User
    if (status === 'approved') {
        const { email, plan_name } = subRequest;
        
        // Calculate expiry (30 days for monthly)
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);

        const { error: upgradeError } = await supabase
            .from('user_subscriptions')
            .upsert({
                email,
                plan: 'monthly', // We only have 'monthly' as paid right now
                credits_remaining: -1,
                credits_total: -1,
                plan_expires_at: expiresAt.toISOString(),
                updated_at: new Date().toISOString()
            }, { onConflict: 'email' });

        if (upgradeError) {
            console.error('Upgrade Error:', upgradeError);
            return NextResponse.json({ error: 'Request approved but failed to upgrade user' }, { status: 500 });
        }
    }

    return NextResponse.json({ success: true, message: `Request ${status} successfully` });
}
