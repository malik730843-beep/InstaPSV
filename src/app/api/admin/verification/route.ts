import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// GET - List verifications
export async function GET() {
    try {
        const { data: verifications, error } = await supabase
            .from('site_verification')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json({ verifications });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST - Create or update verification
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, ...data } = body;

        if (id) {
            // Update
            const { error } = await supabase
                .from('site_verification')
                .update({ ...data, updated_at: new Date().toISOString() })
                .eq('id', id);

            if (error) throw error;

            return NextResponse.json({ success: true });
        } else {
            // Create
            const { data: newItem, error } = await supabase
                .from('site_verification')
                .insert([data])
                .select()
                .single();

            if (error) throw error;

            return NextResponse.json({ verification: newItem });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE - Delete verification
export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID required' }, { status: 400 });
        }

        const { error } = await supabase.from('site_verification').delete().eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
