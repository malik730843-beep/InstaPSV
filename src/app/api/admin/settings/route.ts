import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// GET - Get settings by type (site or seo)
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type') || 'site';
        const table = type === 'seo' ? 'seo_settings' : 'site_settings';

        const { data: settings, error } = await supabase
            .from(table)
            .select('*');

        if (error) throw error;

        return NextResponse.json({ settings });
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
