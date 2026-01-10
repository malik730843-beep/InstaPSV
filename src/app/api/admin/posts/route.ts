import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyAdmin, unauthorizedResponse } from '@/lib/adminAuth';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// GET - Get single post by id or list all posts
export async function GET(req: NextRequest) {
    const authResult = await verifyAdmin(req);
    if ('error' in authResult) return unauthorizedResponse(authResult.error);
    const adminUser = authResult;

    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (id) {
            const { data: post, error } = await supabase
                .from('posts')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;

            return NextResponse.json({ post });
        } else {
            const { data: posts, error } = await supabase
                .from('posts')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            return NextResponse.json({ posts });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Helper to strip unknown fields
function sanitizePostData(body: any) {
    const { id, categories, savedAt, ...data } = body; // Explicitly remove savedAt
    return { id, categories, data };
}

// POST - Create or update post
export async function POST(req: NextRequest) {
    const authResult = await verifyAdmin(req);
    if ('error' in authResult) return unauthorizedResponse(authResult.error);
    const adminUser = authResult;

    try {
        const body = await req.json();
        const { id, categories, data } = sanitizePostData(body);

        if (id) {
            // Update existing post
            const { error } = await supabase
                .from('posts')
                .update({
                    ...data,
                    updated_at: new Date().toISOString(),
                    published_at: data.status === 'published' ? new Date().toISOString() : null,
                })
                .eq('id', id);

            if (error) throw error;

            return NextResponse.json({ success: true });
        } else {
            // Create new post
            const { data: newPost, error } = await supabase
                .from('posts')
                .insert([{
                    ...data,
                    published_at: data.status === 'published' ? new Date().toISOString() : null,
                }])
                .select()
                .single();

            if (error) throw error;

            return NextResponse.json({ post: newPost });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE - Delete post
export async function DELETE(req: NextRequest) {
    const authResult = await verifyAdmin(req);
    if ('error' in authResult) return unauthorizedResponse(authResult.error);
    const adminUser = authResult;

    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID required' }, { status: 400 });
        }

        const { error } = await supabase.from('posts').delete().eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
