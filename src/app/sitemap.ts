import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

// Stable last-modified date for static/legal pages (update manually when content changes)
const STATIC_LAST_MODIFIED = new Date('2026-06-25');


const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://instapsv.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // 1. Core Static Routes
    const coreRoutes = [
        { route: '', priority: 1.0, freq: 'daily' as const },
        { route: '/blog', priority: 0.9, freq: 'weekly' as const },
        { route: '/features', priority: 0.7, freq: 'monthly' as const },
        { route: '/about', priority: 0.5, freq: 'monthly' as const },
        { route: '/contact', priority: 0.5, freq: 'monthly' as const },
        { route: '/pricing', priority: 0.7, freq: 'monthly' as const },
    ].map(({ route, priority, freq }) => ({
        url: `${BASE_URL}${route}`,
        lastModified: STATIC_LAST_MODIFIED,
        changeFrequency: freq,
        priority,
    }));

    const toolRoutes = [
        '/anonymous-instagram-viewer',
        '/instagram-story-viewer',
        '/instagram-highlights-viewer',
        '/instagram-reels-downloader',
        '/instagram-hashtag-generator',
    ].map((route) => ({
        url: `${BASE_URL}${route}`,
        lastModified: STATIC_LAST_MODIFIED,
        changeFrequency: 'weekly' as const,
        priority: 1.0,
    }));

    // 3. Legal / Policy Pages — explicit dedicated routes, required for AdSense
    const legalRoutes = [
        '/privacy-policy',
        '/terms-of-use',
        '/disclaimer',
    ].map((route) => ({
        url: `${BASE_URL}${route}`,
        lastModified: STATIC_LAST_MODIFIED,
        changeFrequency: 'yearly' as const,
        priority: 0.5,
    }));

    // 4. Blog Posts (from DB)
    let posts: any[] = [];
    try {
        const { data } = await supabase
            .from('posts')
            .select('slug, updated_at')
            .eq('status', 'published');
        if (data) posts = data;
    } catch (e) { }

    const postRoutes = posts.map((post) => ({
        url: `${BASE_URL}/${post.slug}`,
        lastModified: new Date(post.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    // 5. CMS Pages (from DB) — exclude legal pages already listed above to avoid duplicates
    // Also exclude 'about' and 'contact' since they have dedicated routes in coreRoutes
    const legalSlugs = new Set(['privacy-policy', 'terms-of-use', 'disclaimer', 'about', 'contact']);
    let pages: any[] = [];
    try {
        const { data } = await supabase
            .from('pages')
            .select('slug, updated_at')
            .eq('status', 'published');
        if (data) pages = data.filter((p: any) => !legalSlugs.has(p.slug));
    } catch (e) { }

    const pageRoutes = pages.map((page) => ({
        url: `${BASE_URL}/${page.slug}`,
        lastModified: new Date(page.updated_at),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }));

    // Deduplicate by URL (last-wins)
    const allRoutes = [...coreRoutes, ...toolRoutes, ...legalRoutes, ...postRoutes, ...pageRoutes];
    const seen = new Map<string, (typeof allRoutes)[number]>();
    for (const r of allRoutes) {
        seen.set(r.url, r);
    }

    return Array.from(seen.values());
}
