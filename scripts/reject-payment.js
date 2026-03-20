const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const requestId = process.argv[2];
const reason = process.argv[3] || 'Payment not verified';

async function reject() {
    if (!requestId) {
        console.error('Usage: node reject-payment.js <request_id> "<reason>"');
        process.exit(1);
    }

    const { error } = await supabase
        .from('subscription_requests')
        .update({ 
            status: 'rejected', 
            processed_at: new Date().toISOString(),
            rejection_reason: reason
        })
        .eq('id', requestId);

    if (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }

    console.log(`Successfully rejected request: ${requestId}`);
}

reject();
