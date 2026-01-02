import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// POST - Generate sitemap
export async function POST() {
    try {
        // Update last_generated timestamp
        const { data: existing } = await supabase
            .from('sitemap_settings')
            .select('id')
            .single();

        if (existing) {
            await supabase
                .from('sitemap_settings')
                .update({ last_generated: new Date().toISOString() })
                .eq('id', existing.id);
        }

        return NextResponse.json({ success: true, message: 'Sitemap generated' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
