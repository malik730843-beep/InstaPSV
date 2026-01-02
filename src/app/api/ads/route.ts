import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export const revalidate = 60; // Cache for 1 minute to improve speed

export async function GET() {
    try {
        const { data: ads, error } = await supabase
            .from('ads')
            .select('*')
            .eq('enabled', true);

        if (error) throw error;

        return NextResponse.json({ ads });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
