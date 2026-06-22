import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET: List all users
export async function GET() {
    // 1. Fetch user subscriptions
    const { data: subscriptions, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 2. Fetch auth users to get names from user_metadata
    try {
        const { data: { users: authUsers }, error: authError } = await supabase.auth.admin.listUsers();
        
        if (!authError && authUsers) {
            // Map auth users by email for easy lookup
            const userMetadataMap = new Map();
            authUsers.forEach(u => {
                if (u.email) {
                    const name = u.user_metadata?.full_name || u.user_metadata?.name || '';
                    userMetadataMap.set(u.email.toLowerCase(), name);
                }
            });

            // Merge name into subscription data
            const mergedData = subscriptions.map(sub => {
                const emailKey = sub.email ? sub.email.toLowerCase() : '';
                let name = userMetadataMap.get(emailKey) || '';
                
                // Fallback: if no name in metadata, format the email prefix
                if (!name && sub.email) {
                    const prefix = sub.email.split('@')[0];
                    name = prefix
                        .split(/[\._-]/)
                        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ');
                }

                return {
                    ...sub,
                    name: name
                };
            });

            return NextResponse.json(mergedData);
        }
    } catch (e) {
        console.error('Failed to fetch auth users list:', e);
    }

    // Fallback: if listUsers fails, map names from emails only
    const fallbackData = subscriptions.map(sub => {
        let name = '';
        if (sub.email) {
            const prefix = sub.email.split('@')[0];
            name = prefix
                .split(/[\._-]/)
                .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        }
        return {
            ...sub,
            name
        };
    });

    return NextResponse.json(fallbackData);
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
