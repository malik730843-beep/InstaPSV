import type { MetadataRoute } from 'next';

// Crawling must not depend on database availability or admin-entered rules.
export default function robots(): MetadataRoute.Robots {
    const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://instapsv.com').origin;
    return {
        rules: [{
            userAgent: '*',
            allow: ['/', '/ads.txt'],
            disallow: ['/admin', '/checkout', '/api/', '/site.webmanifest'],
        }],
        sitemap: `${siteUrl}/sitemap.xml`,
    };
}
