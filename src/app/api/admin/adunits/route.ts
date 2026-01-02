import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// GET - List all ads
export async function GET() {
    try {
        const { data: ads, error } = await supabase
            .from('ads')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json({ ads });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST - Create or update ad
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, ...data } = body;

        if (id) {
            // Update existing ad
            const updateData: any = { updated_at: new Date().toISOString() };

            // Only include fields that are present in the request
            if (data.enabled !== undefined) updateData.enabled = data.enabled;
            if (data.name !== undefined) updateData.name = data.name;
            if (data.type !== undefined) updateData.type = data.type;
            if (data.code !== undefined) updateData.code = data.code;
            if (data.device_target !== undefined) updateData.device_target = data.device_target;
            if (data.page_target !== undefined) updateData.page_target = data.page_target;
            if (data.delay_seconds !== undefined) updateData.delay_seconds = data.delay_seconds;
            if (data.start_date !== undefined) updateData.start_date = data.start_date || null;
            if (data.end_date !== undefined) updateData.end_date = data.end_date || null;

            const { error } = await supabase
                .from('ads')
                .update(updateData)
                .eq('id', id);

            if (error) {
                console.error('Supabase update error:', error);
                throw error;
            }

            return NextResponse.json({ success: true });
        } else {
            // Create new ad - only include valid database columns
            const insertData = {
                name: data.name,
                type: data.type,
                code: data.code,
                enabled: data.enabled ?? true,
                device_target: data.device_target || 'all',
                page_target: data.page_target || 'all',
                delay_seconds: data.delay_seconds || 0,
                start_date: data.start_date || null,
                end_date: data.end_date || null,
            };

            const { data: newAd, error } = await supabase
                .from('ads')
                .insert([insertData])
                .select()
                .single();

            if (error) {
                console.error('Supabase insert error:', error);
                throw error;
            }

            return NextResponse.json({ ad: newAd });
        }
    } catch (error: any) {
        console.error('Ad API error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE - Delete ad
export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID required' }, { status: 400 });
        }

        const { error } = await supabase.from('ads').delete().eq('id', id);

        if (error) {
            console.error('Supabase delete error:', error);
            throw error;
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Ad API DELETE error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
