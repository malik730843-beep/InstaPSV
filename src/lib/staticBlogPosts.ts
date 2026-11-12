import { CONTENT_REVIEWED_AT, reviewedPosts } from './reviewedContent';

export interface StaticPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featured_image: string;
    created_at: string;
    updated_at: string;
    categories: string[];
    author_name: string;
    status: 'published';
}

export const STATIC_BLOG_CATEGORIES = [
    { id: 'research', name: 'Research' },
    { id: 'guides', name: 'Guides' },
    { id: 'creators', name: 'Creators' },
];

// Full, versioned articles are useful even when the CMS is unavailable.
// The fallback publication date is the actual release date, not a backdated history.
const articles = [
    ['analyze-competitors-instagram-profiles-safely', 'research'],
    ['view-instagram-stories-anonymously', 'guides'],
    ['how-to-set-fair-rates-for-sponsored-content-in-2026', 'creators'],
    ['social-media-burnout-2026', 'creators'],
    ['instagram-reels-downloader-guide', 'guides'],
    ['instagram-hashtag-strategy-guide', 'creators'],
];

export const STATIC_BLOG_POSTS: StaticPost[] = articles.map(([slug, category]) => {
    const article = reviewedPosts[slug];
    if (!article?.content.trim()) throw new Error(`Missing static article content: ${slug}`);
    return {
        ...article,
        id: `static-${slug}`,
        slug,
        featured_image: '',
        created_at: CONTENT_REVIEWED_AT,
        updated_at: CONTENT_REVIEWED_AT,
        categories: [category],
        author_name: 'InstaPSV Editorial',
        status: 'published',
    };
});

/** CMS records win; fill only missing slugs with fully populated static articles. */
export function mergeStaticPosts<T extends { slug: string; updated_at?: string }>(cmsPosts: T[], excludedSlugs: ReadonlySet<string> = new Set()): Array<T | StaticPost> {
    const existingSlugs = new Set(cmsPosts.map(post => post.slug));
    return [...cmsPosts.map(withEditorialCategory), ...STATIC_BLOG_POSTS.filter(post => !existingSlugs.has(post.slug) && !excludedSlugs.has(post.slug))];
}

// Use the revised article's taxonomy while that exact revision is active.
// A subsequent CMS save keeps its own category selection.
export function withEditorialCategory<T extends { slug: string; updated_at?: string }>(post: T): T {
    const article = STATIC_BLOG_POSTS.find(article => article.slug === post.slug);
    return article && post.updated_at === CONTENT_REVIEWED_AT ? { ...post, categories: article.categories } : post;
}
