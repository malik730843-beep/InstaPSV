const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load env from project root
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function listPending() {
    const { data, error } = await supabase
        .from('subscription_requests')
        .select('*')
        .eq('status', 'pending');

    if (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }

    if (data.length === 0) {
        console.log('No pending payment requests.');
        return;
    }

    console.log('\n--- PENDING PAYMENT REQUESTS ---');
    data.forEach(req => {
        console.log(`ID: ${req.id}`);
        console.log(`User: ${req.email}`);
        console.log(`Plan: ${req.plan_name}`);
        console.log(`Amount: $${req.amount}`);
        console.log(`Method: ${req.payment_method}`);
        console.log(`Transaction ID: ${req.transaction_id}`);
        console.log(`Date: ${new Date(req.created_at).toLocaleString()}`);
        console.log('--------------------------------');
    });
}

listPending();
