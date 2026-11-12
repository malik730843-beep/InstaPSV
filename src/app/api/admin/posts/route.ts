import { reservedPageSlugs } from '@/lib/siteRoutes';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyAdmin, unauthorizedResponse } from '@/lib/adminAuth';
import { applyReviewedPost } from '@/lib/reviewedContent';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

const MOCK_POSTS = [
    {
        id: 'mock-post-1',
        title: 'How to View Instagram Stories Anonymously',
        slug: 'view-instagram-stories-anonymously',
        content: '<p>This is a guide on how to view Instagram stories anonymously.</p>',
        excerpt: 'Learn how to view stories anonymously...',
        status: 'published',
        created_at: new Date().toISOString(),
        published_at: new Date().toISOString()
    },
    {
        id: 'mock-post-2',
        title: 'Instagram Algorithm Secrets for 2026',
        slug: 'instagram-algorithm-secrets-2026',
        content: '<p>Discover the secrets of the Instagram algorithm.</p>',
        excerpt: 'Secrets of the algorithm revealed...',
        status: 'draft',
        created_at: new Date().toISOString(),
        published_at: null
    }
];

// GET - Get single post by id or list all posts
export async function GET(req: NextRequest) {
    const authResult = await verifyAdmin(req);
    if ('error' in authResult) return unauthorizedResponse(authResult.error);
    const adminUser = authResult;

    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (id) {
            try {
                const { data: post, error } = await supabase
                    .from('posts')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;

                return NextResponse.json({ post: post ? applyReviewedPost(post) : post });
            } catch (err: any) {
                if (err.message?.includes('fetch failed') || err.message?.includes('fetch') || err.message?.includes('network')) {
                    console.warn(`Supabase offline - returning mock post by id ${id}`);
                    const mockPost = MOCK_POSTS.find(p => p.id === id) || MOCK_POSTS[0];
                    return NextResponse.json({ post: mockPost });
                }
                throw err;
            }
        } else {
            try {
                const { data: posts, error } = await supabase
                    .from('posts')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;

                return NextResponse.json({ posts: posts?.map(applyReviewedPost) });
            } catch (err: any) {
                if (err.message?.includes('fetch failed') || err.message?.includes('fetch') || err.message?.includes('network')) {
                    console.warn("Supabase offline - returning mock posts list");
                    return NextResponse.json({ posts: MOCK_POSTS });
                }
                throw err;
            }
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Helper to ensure unique slug
async function ensureUniqueSlug(slug: string, existingId?: string) {
    let uniqueSlug = reservedPageSlugs.has(slug) ? `${slug}-guide` : slug;
    let counter = 1;

    while (true) {
        // Check if slug exists
        const query = supabase
            .from('posts')
            .select('id')
            .eq('slug', uniqueSlug);

        // If updating, exclude current post from check
        if (existingId) {
            query.neq('id', existingId);
        }

        const { data: existing } = await query.maybeSingle();

        if (!existing) {
            // Slug is safe to use
            break;
        }

        // Slug collision, append counter and try again
        uniqueSlug = `${slug}-${counter}`;
        counter++;
    }

    return uniqueSlug;
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

        let attempts = 0;
        const maxAttempts = 3;

        while (attempts < maxAttempts) {
            try {
                if (id) {
                    // Ensure unique slug for update
                    if (data.slug) {
                        data.slug = await ensureUniqueSlug(data.slug, id);
                    }

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
                    // Ensure unique slug for new post
                    if (data.slug) {
                        data.slug = await ensureUniqueSlug(data.slug);
                    }

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
                // Check for Postgres unique violation (code 23505)
                if (error.code === '23505' && error.message?.includes('slug')) {
                    console.warn(`Slug collision detected for ${data.slug}. Retrying... (${attempts + 1}/${maxAttempts})`);
                    attempts++;
                    if (attempts >= maxAttempts) throw new Error("Failed to generate unique slug after multiple attempts");
                    continue; // Loop again to generate a new slug
                }
                throw error; // Rethrow other errors
            }
        }
    } catch (error: any) {
        console.error("POST Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
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
