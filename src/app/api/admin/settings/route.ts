import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

const MOCK_SITE_SETTINGS = [
    { key: 'site_name', value: 'InstaPSV' },
    { key: 'tagline', value: 'Anonymous Instagram Viewer' },
    { key: 'footer_text', value: '© 2024 InstaPSV. All rights reserved.' },
    { key: 'contact_email', value: 'contact@instapsv.com' },
    { key: 'ads_enabled', value: 'true' },
    { key: 'maintenance_mode', value: 'false' },
    { key: 'google_client_id', value: 'mock-google-client-id' }
];

const MOCK_SEO_SETTINGS = [
    { key: 'meta_title', value: 'InstaPSV — Anonymous Instagram Viewer' },
    { key: 'meta_description', value: 'View Instagram stories and profiles anonymously.' }
];

// GET - Get settings by type (site or seo)
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type') || 'site';
        const table = type === 'seo' ? 'seo_settings' : 'site_settings';

        try {
            const { data: settings, error } = await supabase
                .from(table)
                .select('*');

            if (error) throw error;

            return NextResponse.json({ settings });
        } catch (err: any) {
            if (err.message?.includes('fetch failed') || err.message?.includes('fetch') || err.message?.includes('network')) {
                console.warn(`Supabase offline - returning mock settings for ${type}`);
                const mockSettings = type === 'seo' ? MOCK_SEO_SETTINGS : MOCK_SITE_SETTINGS;
                return NextResponse.json({ settings: mockSettings });
            }
            throw err;
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST - Update settings
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { type = 'site', settings } = body;
        const table = type === 'seo' ? 'seo_settings' : 'site_settings';

        // Upsert each setting
        for (const setting of settings) {
            const { data: existing } = await supabase
                .from(table)
                .select('id')
                .eq('key', setting.key)
                .single();

            if (existing) {
                await supabase
                    .from(table)
                    .update({ value: setting.value, updated_at: new Date().toISOString() })
                    .eq('key', setting.key);
            } else {
                await supabase.from(table).insert([{
                    key: setting.key,
                    value: setting.value,
                }]);
            }
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
