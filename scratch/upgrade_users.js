const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const emails = [
    'dell68752@gmail.com',
    'kouk20020703@gmail.com',
    'rafikov.s0077@gmail.com',
    'hamzaiqbal1327@gmail.com',
    'kaifsiddiqui8586@gmail.com'
];

async function run() {
    for (const email of emails) {
        console.log(`Processing: ${email}...`);
        
        // 1. Check if user subscription exists
        const { data: sub, error: getError } = await supabase
            .from('user_subscriptions')
            .select('*')
            .eq('email', email)
            .maybeSingle();
            
        if (getError) {
            console.error(`Error fetching user ${email}:`, getError.message);
            continue;
        }

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);
        const isoExpires = expiresAt.toISOString();
        const isoNow = new Date().toISOString();

        if (sub) {
            // Update existing
            const { error: upError } = await supabase
                .from('user_subscriptions')
                .update({
                    plan: 'monthly',
                    credits_remaining: -1,
                    credits_total: -1,
                    plan_expires_at: isoExpires,
                    updated_at: isoNow
                })
                .eq('email', email);
            if (upError) {
                console.error(`Error updating user ${email}:`, upError.message);
                continue;
            }
            console.log(`Updated user ${email} to Pro.`);
        } else {
            // Insert new
            const { error: inError } = await supabase
                .from('user_subscriptions')
                .insert({
                    email,
                    plan: 'monthly',
                    credits_remaining: -1,
                    credits_total: -1,
                    plan_expires_at: isoExpires,
                    created_at: isoNow,
                    updated_at: isoNow
                });
            if (inError) {
                console.error(`Error inserting user ${email}:`, inError.message);
                continue;
            }
            console.log(`Created user ${email} and set to Pro.`);
        }

        // 2. Add subscription request record
        const transactionId = 'MANUAL_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5).toUpperCase();
        const { error: reqError } = await supabase
            .from('subscription_requests')
            .insert({
                email,
                plan_name: 'monthly',
                amount: 5.00,
                payment_method: 'Manual',
                transaction_id: transactionId,
                status: 'approved',
                created_at: isoNow,
                processed_at: isoNow
            });
            
        if (reqError) {
            console.error(`Error inserting subscription request for ${email}:`, reqError.message);
        } else {
            console.log(`Inserted approved subscription request for ${email} ($5.00).`);
        }
        console.log('---');
    }
}

run();
