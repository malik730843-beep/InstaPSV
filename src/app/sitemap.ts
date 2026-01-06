import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://instapsv.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // 1. Static Routes
    const routes = [
        '',
        '/blog',
        '/features',
        '/about',
        '/contact',
        '/privacy-policy',
        '/terms-of-use',
    ].map((route) => ({
        url: `${BASE_URL}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // 2. Blog Posts
    /*
    let posts: any[] = [];
    try {
        const { data } = await supabase
            .from('posts')
            .select('slug, updated_at')
            .eq('status', 'published');
        if (data) posts = data;
    } catch (e) { }
    
    const postRoutes = posts.map((post) => ({
        url: `${BASE_URL}/blog/${post.slug}`,
        lastModified: new Date(post.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));
    */
    const postRoutes: any[] = [];

    // 3. Pages (Dynamic)
    let pages: any[] = [];
    try {
        const { data } = await supabase
            .from('pages')
            .select('slug, updated_at')
            .eq('status', 'published');
        if (data) pages = data;
    } catch (e) { }

    const pageRoutes = pages.map((page) => ({
        url: `${BASE_URL}/${page.slug}`,
        lastModified: new Date(page.updated_at),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }));

    return [...routes, ...postRoutes, ...pageRoutes];
}
