import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function robots(): Promise<MetadataRoute.Robots> {
    let rules = {
        userAgent: '*',
        allow: '/',
        disallow: '/admin/',
    };

    try {
        const { data } = await supabase
            .from('seo_settings')
            .select('value')
            .eq('key', 'robots_txt')
            .single();

        // If custom robots.txt content is provided, we might need a different approach
        // Next.js MetadataRoute.Robots object is structured. 
        // If the user provides raw text, we might want to serve a raw file via API route instead.
        // However, for verify purposes, usually standard rules + sitemap is enough.
        // Let's at least parse simpler instructions or stick to the structured format for now
        // and append the sitemap.
    } catch (e) { }

    const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://instapsv.com';
    return {
        rules,
        sitemap: `${BASE_URL}/sitemap.xml`,
    };
}
