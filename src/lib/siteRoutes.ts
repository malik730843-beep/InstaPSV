// A CMS post at one of these slugs would be shadowed by an explicit app route.
export const reservedPageSlugs = new Set([
    'about', 'contact', 'features', 'pricing', 'blog', 'posts', 'pages', 'faq',
    'privacy-policy', 'terms-of-use', 'disclaimer', 'editorial-policy',
    'anonymous-instagram-viewer', 'instagram-story-viewer',
    'instagram-highlights-viewer', 'instagram-reels-downloader',
    'instagram-hashtag-generator', 'checkout', 'admin', 'api',
]);

export function isReachablePost(post: { slug: string }): boolean {
    return !reservedPageSlugs.has(post.slug);
}
