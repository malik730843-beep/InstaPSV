const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
    // 1. Remove demo user from user_subscriptions and subscription_requests
    console.log('Removing demo user...');
    const { error: delSubError } = await supabase
        .from('user_subscriptions')
        .delete()
        .eq('email', 'demo_user@example.com');
    if (delSubError) {
        console.error('Error deleting demo user sub:', delSubError.message);
    } else {
        console.log('Deleted demo user subscription.');
    }

    const { error: delReqError } = await supabase
        .from('subscription_requests')
        .delete()
        .eq('email', 'demo_user@example.com');
    if (delReqError) {
        console.error('Error deleting demo user requests:', delReqError.message);
    } else {
        console.log('Deleted demo user subscription requests.');
    }

    // 2. Add these expired users
    const expiredUsers = [
        {
            email: 'dhmfawzi@gmail.com',
            expiresAt: '2026-05-10T11:09:00Z',
            paidAt: '2026-04-10T11:09:00Z',
            credits_remaining: 0,
            credits_total: 6
        },
        {
            email: 'mahdenofel75@gmail.com',
            expiresAt: '2026-05-05T03:48:00Z',
            paidAt: '2026-04-05T03:48:00Z',
            credits_remaining: 0,
            credits_total: 6
        },
        {
            email: 'lanashmale@gmail.com',
            expiresAt: '2026-04-25T03:04:00Z',
            paidAt: '2026-03-26T03:04:00Z',
            credits_remaining: 0,
            credits_total: 6
        },
        {
            email: 'jalloalexandra@gmail.com',
            expiresAt: '2026-04-20T02:23:00Z',
            paidAt: '2026-03-21T02:23:00Z',
            credits_remaining: 0,
            credits_total: 2
        },
        {
            email: 'rithu8410@gmail.com',
            expiresAt: '2026-04-15T09:02:00Z',
            paidAt: '2026-03-16T09:02:00Z',
            credits_remaining: 0,
            credits_total: 2
        }
    ];

    console.log('\nProcessing expired users...');
    for (const u of expiredUsers) {
        console.log(`Processing: ${u.email}...`);

        // Check if user exists in user_subscriptions
        const { data: sub, error: getError } = await supabase
            .from('user_subscriptions')
            .select('*')
            .eq('email', u.email)
            .maybeSingle();

        if (getError) {
            console.error(`Error fetching user ${u.email}:`, getError.message);
            continue;
        }

        if (sub) {
            // Update
            const { error: upError } = await supabase
                .from('user_subscriptions')
                .update({
                    plan: 'monthly',
                    credits_remaining: u.credits_remaining,
                    credits_total: u.credits_total,
                    plan_expires_at: u.expiresAt,
                    updated_at: new Date().toISOString()
                })
                .eq('email', u.email);
            if (upError) {
                console.error(`Error updating user ${u.email}:`, upError.message);
                continue;
            }
            console.log(`Updated user ${u.email} to expired Pro.`);
        } else {
            // Insert
            const { error: inError } = await supabase
                .from('user_subscriptions')
                .insert({
                    email: u.email,
                    plan: 'monthly',
                    credits_remaining: u.credits_remaining,
                    credits_total: u.credits_total,
                    plan_expires_at: u.expiresAt,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                });
            if (inError) {
                console.error(`Error inserting user ${u.email}:`, inError.message);
                continue;
            }
            console.log(`Created user ${u.email} as expired Pro.`);
        }

        // Add payment record in subscription_requests
        const transactionId = 'MANUAL_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5).toUpperCase();
        const { error: reqError } = await supabase
            .from('subscription_requests')
            .insert({
                email: u.email,
                plan_name: 'monthly',
                amount: 5.00,
                payment_method: 'Manual',
                transaction_id: transactionId,
                status: 'approved',
                created_at: u.paidAt,
                processed_at: u.paidAt
            });

        if (reqError) {
            console.error(`Error inserting payment request for ${u.email}:`, reqError.message);
        } else {
            console.log(`Recorded payment of $5.00 for ${u.email} paid at ${u.paidAt}`);
        }
        console.log('---');
    }
    console.log('Done!');
}

run();
