import { isReachablePost } from '@/lib/siteRoutes';
import { reviewedPosts, CONTENT_REVIEWED_AT } from '@/lib/reviewedContent';
import { STATIC_BLOG_POSTS } from '@/lib/staticBlogPosts';
import { MetadataRoute } from 'next';
import { supabaseAdmin as supabase } from '@/lib/supabase';

// Stable last-modified date for static/legal pages (update manually when content changes)
const STATIC_LAST_MODIFIED = new Date('2026-06-25');
const CONTENT_REVISED = new Date(CONTENT_REVIEWED_AT);
const revisedRoutes = new Set(['', '/features', '/about', '/contact', '/privacy-policy', '/pricing', '/editorial-policy', '/blog']);




const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://instapsv.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // 1. Core Static Routes
    const coreRoutes = [
        { route: '', priority: 1.0, freq: 'daily' as const },
        { route: '/blog', priority: 0.9, freq: 'weekly' as const },
        { route: '/features', priority: 0.7, freq: 'monthly' as const },
        { route: '/about', priority: 0.5, freq: 'monthly' as const },
        { route: '/contact', priority: 0.5, freq: 'monthly' as const },
        { route: '/editorial-policy', priority: 0.5, freq: 'monthly' as const },
        { route: '/pricing', priority: 0.7, freq: 'monthly' as const },
    ].map(({ route, priority, freq }) => ({
        url: `${BASE_URL}${route}`,
        lastModified: revisedRoutes.has(route) ? CONTENT_REVISED : STATIC_LAST_MODIFIED,
        changeFrequency: freq,
        priority,
    }));

    const toolRoutes = [
        '/anonymous-instagram-viewer',
        '/instagram-story-viewer',
        '/instagram-reels-downloader',
        '/instagram-hashtag-generator',
    ].map((route) => ({
        url: `${BASE_URL}${route}`,
        lastModified: CONTENT_REVISED,
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
        lastModified: route === '/privacy-policy' ? CONTENT_REVISED : STATIC_LAST_MODIFIED,
        changeFrequency: 'yearly' as const,
        priority: 0.5,
    }));

    // 4. Blog Posts (from DB + static fallback)
    let dbPosts: any[] = [];
    try {
        const { data } = await supabase
            .from('posts')
            .select('slug, updated_at, status');
        if (data) dbPosts = data;
    } catch (e) { }

    // Merge static posts for slugs not already in DB
    const dbSlugs = new Set(dbPosts.map((p: any) => p.slug));
    const staticForSitemap = STATIC_BLOG_POSTS
        .filter(p => !dbSlugs.has(p.slug))
        .map(p => ({ slug: p.slug, updated_at: p.updated_at }));

    const posts = [...dbPosts.filter(post => post.status === 'published' && isReachablePost(post)), ...staticForSitemap];

    const postRoutes = posts.map((post) => ({
        url: `${BASE_URL}/${post.slug}`,
        lastModified: reviewedPosts[post.slug] && new Date(post.updated_at) <= CONTENT_REVISED ? CONTENT_REVISED : new Date(post.updated_at || CONTENT_REVIEWED_AT),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    // 5. CMS Pages (from DB) — exclude legal pages already listed above to avoid duplicates
    // Also exclude 'about' and 'contact' since they have dedicated routes in coreRoutes
    const legalSlugs = new Set(['privacy-policy', 'terms-of-use', 'disclaimer', 'about', 'contact', 'features', 'pricing', 'blog', 'anonymous-instagram-viewer', 'instagram-story-viewer', 'instagram-highlights-viewer', 'instagram-reels-downloader', 'instagram-hashtag-generator', 'editorial-policy']);
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
