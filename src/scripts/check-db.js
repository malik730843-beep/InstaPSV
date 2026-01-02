const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Manual .env loading
try {
    const envPath = path.join(__dirname, '../../.env.local');
    if (fs.existsSync(envPath)) {
        const env = fs.readFileSync(envPath, 'utf8');
        env.split('\n').forEach(line => {
            const parts = line.split('=');
            if (parts.length >= 2) {
                const key = parts[0].trim();
                const value = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, '');
                if (key && !key.startsWith('#')) process.env[key] = value;
            }
        });
    } else {
        console.log(".env.local not found at", envPath);
    }
} catch (e) {
    console.log("Could not read .env.local", e.message);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials. URL:", !!supabaseUrl, "Key:", !!supabaseKey);
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAbout() {
    console.log("Checking Supabase for slug 'about'...");

    // Check pages table
    const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', 'about');

    if (error) {
        console.error("Supabase Error:", error);
    } else {
        console.log(`Found ${data.length} rows for slug 'about':`);
        data.forEach(page => {
            console.log('--------------------------------------------------');
            console.log(`ID: ${page.id}`);
            console.log(`Title: ${page.title}`);
            console.log(`Status: ${page.status}`);
            console.log(`Updated At: ${page.updated_at}`);
            console.log(`Content Preview: ${page.content ? page.content.substring(0, 100).replace(/\n/g, ' ') : 'null'}...`);
        });
        console.log('--------------------------------------------------');
    }

    // Check legal pages (privacy-policy, terms-of-service)
    const legalSlugs = ['privacy-policy', 'terms-of-service', 'terms', 'privacy'];
    const { data: legalData, error: legalError } = await supabase
        .from('pages')
        .select('*')
        .in('slug', legalSlugs);

    if (legalError) {
        console.error("Supabase Error (Legal):", legalError);
    } else {
        console.log(`Found ${legalData.length} legal pages:`);
        legalData.forEach(page => {
            console.log(`[${page.slug}] ID: ${page.id} | Title: ${page.title} | Status: ${page.status}`);
        });
    }
}

checkAbout();
