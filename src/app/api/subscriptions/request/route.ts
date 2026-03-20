import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// POST: Create a new subscription upgrade request
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, plan_name, amount, payment_method, transaction_id } = body;

        if (!email || !plan_name) {
            return NextResponse.json({ error: 'Email and plan are required' }, { status: 400 });
        }

        // 1. Check if user already has a pending request
        const { data: existing } = await supabase
            .from('subscription_requests')
            .select('*')
            .eq('email', email)
            .eq('status', 'pending')
            .single();

        if (existing) {
            return NextResponse.json({ 
                error: 'You already have a pending request. Please wait for admin approval.' 
            }, { status: 400 });
        }

        // 2. Create the request
        const { data, error } = await supabase
            .from('subscription_requests')
            .insert({
                email,
                plan_name,
                amount,
                payment_method,
                transaction_id,
                status: 'pending',
                created_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) {
            console.error('Insert Request Error:', error);
            return NextResponse.json({ error: 'Failed to submit request' }, { status: 500 });
        }

        return NextResponse.json({ 
            success: true, 
            message: 'Subscription request submitted successfully. Please wait for admin approval.',
            data 
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
