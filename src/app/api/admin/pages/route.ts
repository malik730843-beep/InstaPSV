import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

const MOCK_PAGES = [
    {
        id: 'mock-page-1',
        title: 'About Us',
        slug: 'about',
        content: '<p>About InstaPSV</p>',
        status: 'published',
        created_at: new Date().toISOString()
    },
    {
        id: 'mock-page-2',
        title: 'Privacy Policy',
        slug: 'privacy',
        content: '<p>Privacy Policy guidelines</p>',
        status: 'published',
        created_at: new Date().toISOString()
    }
];

// GET - Get single page by id or list all pages
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (id) {
            try {
                const { data: page, error } = await supabase
                    .from('pages')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;

                return NextResponse.json({ page });
            } catch (err: any) {
                if (err.message?.includes('fetch failed') || err.message?.includes('fetch') || err.message?.includes('network')) {
                    console.warn(`Supabase offline - returning mock page by id ${id}`);
                    const mockPage = MOCK_PAGES.find(p => p.id === id) || MOCK_PAGES[0];
                    return NextResponse.json({ page: mockPage });
                }
                throw err;
            }
        } else {
            try {
                const { data: pages, error } = await supabase
                    .from('pages')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;

                return NextResponse.json({ pages });
            } catch (err: any) {
                if (err.message?.includes('fetch failed') || err.message?.includes('fetch') || err.message?.includes('network')) {
                    console.warn("Supabase offline - returning mock pages list");
                    return NextResponse.json({ pages: MOCK_PAGES });
                }
                throw err;
            }
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST - Create or update page
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, ...data } = body;

        console.log(`[AdminAPI] Update Page Request. ID: ${id || 'NEW'}, Slug: ${data.slug}`);

        if (id) {
            // Update existing page
            const { error } = await supabase
                .from('pages')
                .update({
                    ...data,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', id);

            if (error) {
                console.error('[AdminAPI] Update Error:', error);
                throw error;
            }

            console.log('[AdminAPI] Update Success');
            return NextResponse.json({ success: true });
        } else {
            // Create new page
            const { data: newPage, error } = await supabase
                .from('pages')
                .insert([data])
                .select()
                .single();

            if (error) {
                console.error('[AdminAPI] Create Error:', error);
                throw error;
            }

            console.log('[AdminAPI] Create Success:', newPage.id);
            return NextResponse.json({ page: newPage });
        }
    } catch (error: any) {
        console.error('[AdminAPI] Handler Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE - Delete page
export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID required' }, { status: 400 });
        }

        const { error } = await supabase.from('pages').delete().eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
