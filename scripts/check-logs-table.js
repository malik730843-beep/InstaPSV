const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkTable() {
    console.log('Checking for search_logs table...');
    const { data, error } = await supabase
        .from('search_logs')
        .select('*', { count: 'exact', head: true });
    
    if (error) {
        console.error('Error or table missing:', error.message);
        if (error.message.includes('does not exist')) {
            console.log('TABLE_MISSING');
        }
    } else {
        console.log('Table exists. Row count:', data);
    }
}

checkTable();
