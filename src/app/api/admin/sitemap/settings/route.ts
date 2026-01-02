import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// GET - Get sitemap settings
export async function GET() {
    try {
        const { data: settings, error } = await supabase
            .from('sitemap_settings')
            .select('*')
            .single();

        if (error && error.code !== 'PGRST116') throw error;

        return NextResponse.json({ settings: settings || {} });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST - Update sitemap settings
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Check if settings exist
        const { data: existing } = await supabase
            .from('sitemap_settings')
            .select('id')
            .single();

        if (existing) {
            // Update
            const { error } = await supabase
                .from('sitemap_settings')
                .update(body)
                .eq('id', existing.id);

            if (error) throw error;
        } else {
            // Insert
            const { error } = await supabase
                .from('sitemap_settings')
                .insert([body]);

            if (error) throw error;
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
