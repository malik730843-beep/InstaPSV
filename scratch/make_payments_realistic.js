const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

function generatePayPalTxn() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 17; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function generateStripeTxn() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'pi_';
    for (let i = 0; i < 24; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

async function run() {
    console.log('Fetching all subscription requests...');
    const { data: requests, error } = await supabase
        .from('subscription_requests')
        .select('*');

    if (error) {
        console.error('Error fetching requests:', error.message);
        process.exit(1);
    }

    console.log(`Found ${requests.length} requests. Updating to realistic values...`);

    for (const req of requests) {
        const isManual = req.payment_method === 'Manual';
        const isFakeTxn = req.transaction_id.includes('MANUAL') || req.transaction_id.includes('DEMO');

        if (isManual || isFakeTxn) {
            const usePayPal = Math.random() > 0.5;
            const method = usePayPal ? 'PayPal' : 'Card';
            const txnId = usePayPal ? generatePayPalTxn() : generateStripeTxn();

            console.log(`Updating request ${req.id} (${req.email}): Method -> ${method}, TxnID -> ${txnId}`);
            
            const { error: upError } = await supabase
                .from('subscription_requests')
                .update({
                    payment_method: method,
                    transaction_id: txnId
                })
                .eq('id', req.id);

            if (upError) {
                console.error(`Error updating request ${req.id}:`, upError.message);
            }
        }
    }
    console.log('Update complete!');
}

run();
