import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// GET - Preview sitemap URLs
export async function GET() {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
        const urls: string[] = [];

        // Add homepage
        urls.push(baseUrl);

        // Get published posts
        const { data: posts } = await supabase
            .from('posts')
            .select('slug, robots')
            .eq('status', 'published');

        if (posts) {
            posts.forEach(post => {
                if (!post.robots?.includes('noindex')) {
                    urls.push(`${baseUrl}/blog/${post.slug}`);
                }
            });
        }

        // Get published pages
        const { data: pages } = await supabase
            .from('pages')
            .select('slug, robots')
            .eq('status', 'published');

        if (pages) {
            pages.forEach(page => {
                if (!page.robots?.includes('noindex')) {
                    urls.push(`${baseUrl}/${page.slug}`);
                }
            });
        }

        return NextResponse.json({ urls });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
