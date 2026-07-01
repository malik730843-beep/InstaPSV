import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

const MOCK_CATEGORIES = [
    { id: 'mock-cat-1', name: 'Instagram Tips', slug: 'instagram-tips', sort_order: 1 },
    { id: 'mock-cat-2', name: 'Guides & Tutorials', slug: 'guides-tutorials', sort_order: 2 }
];

// GET - List categories
export async function GET() {
    try {
        const { data: categories, error } = await supabase
            .from('categories')
            .select('*')
            .order('sort_order', { ascending: true });

        if (error) throw error;

        return NextResponse.json({ categories });
    } catch (error: any) {
        if (error.message?.includes('fetch failed') || error.message?.includes('fetch') || error.message?.includes('network')) {
            console.warn("Supabase offline - returning mock categories");
            return NextResponse.json({ categories: MOCK_CATEGORIES });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST - Create or update category
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, ...data } = body;

        if (id) {
            // Update
            const { error } = await supabase
                .from('categories')
                .update(data)
                .eq('id', id);

            if (error) throw error;

            return NextResponse.json({ success: true });
        } else {
            // Create
            const { data: newCategory, error } = await supabase
                .from('categories')
                .insert([data])
                .select()
                .single();

            if (error) throw error;

            return NextResponse.json({ category: newCategory });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE - Delete category
export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID required' }, { status: 400 });
        }

        const { error } = await supabase.from('categories').delete().eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
