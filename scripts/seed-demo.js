const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function seedDemo() {
    console.log('--- SEEDING DEMO DATA ---');

    // 1. Create a mock user subscription if it doesn't exist
    const testEmail = 'demo_user@example.com';
    const { data: user, error: userError } = await supabase
        .from('user_subscriptions')
        .upsert({
            email: testEmail,
            plan: 'free',
            credits_remaining: 1,
            credits_total: 2,
            updated_at: new Date().toISOString()
        })
        .select()
        .single();

    if (userError) {
        console.error('Error creating test user:', userError.message);
        process.exit(1);
    }
    console.log(`- Created/Updated Test User: ${testEmail}`);

    // 2. Create a mock payment request
    const { data: req, error: reqError } = await supabase
        .from('subscription_requests')
        .insert({
            email: testEmail,
            plan_name: 'pro',
            amount: 5,
            payment_method: 'paypal',
            transaction_id: 'DEMO_TXN_123456789',
            status: 'pending',
            created_at: new Date().toISOString()
        })
        .select()
        .single();

    if (reqError) {
        console.error('Error creating payment request:', reqError.message);
        if (reqError.code === '42P01') {
            console.error('⚠️ TABLE NOT FOUND. Make sure you ran the SQL in schema_update.sql first!');
        }
        process.exit(1);
    }
    console.log(`- Created Mock Payment Request: ${req.transaction_id}`);
    console.log('\n--- SUCCESS ---');
    console.log('You can now see this request in http://localhost:3000/admin/payments');
}

seedDemo();
