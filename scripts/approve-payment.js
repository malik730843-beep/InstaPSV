const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const requestId = process.argv[2];

async function approve() {
    if (!requestId) {
        console.error('Usage: node approve-payment.js <request_id>');
        process.exit(1);
    }

    // 1. Get request
    const { data: req, error: getError } = await supabase
        .from('subscription_requests')
        .select('*')
        .eq('id', requestId)
        .single();

    if (getError || !req) {
        console.error('Request not found');
        process.exit(1);
    }

    // 2. Update request
    const { error: upError } = await supabase
        .from('subscription_requests')
        .update({ status: 'approved', processed_at: new Date().toISOString() })
        .eq('id', requestId);

    if (upError) {
        console.error('Update Request Error:', upError.message);
        process.exit(1);
    }

    // 3. Upgrade user
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const { error: userError } = await supabase
        .from('user_subscriptions')
        .update({
            plan: 'monthly',
            credits_remaining: -1,
            credits_total: -1,
            plan_expires_at: expiresAt.toISOString(),
            updated_at: new Date().toISOString()
        })
        .eq('email', req.email);

    if (userError) {
        console.error('Upgrade User Error:', userError.message);
        process.exit(1);
    }

    console.log(`Successfully approved and upgraded: ${req.email}`);
}

approve();
