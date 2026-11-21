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
    ['instagram-bio-optimization-guide', 'guides'],
    ['how-to-grow-instagram-followers-organically', 'guides'],
    ['instagram-content-calendar-template', 'creators'],
    ['public-instagram-profile-analysis-tutorial', 'research'],
    ['instagram-creator-vs-business-account', 'guides'],
    ['instagram-engagement-rate-guide', 'research'],
    ['instagram-algorithm-explained-2026', 'guides'],
    ['instagram-carousel-strategy-guide', 'creators'],
    ['instagram-influencer-collaborations-guide', 'creators'],
    ['instagram-seo-ranking-factors', 'research'],
    ['instagram-monetization-guide-2026', 'creators'],
    ['instagram-analytics-key-metrics-guide', 'research'],
];

const articleImages: Record<string, string> = {
    'analyze-competitors-instagram-profiles-safely': 'https://pwpuvjqyyvqwudxotamj.supabase.co/storage/v1/object/public/images/uploads/n00es5xxbji_1775431863054.png',
    'view-instagram-stories-anonymously': 'https://pwpuvjqyyvqwudxotamj.supabase.co/storage/v1/object/public/images/uploads/068dmpenin1k_1776866272220.webp',
    'how-to-set-fair-rates-for-sponsored-content-in-2026': 'https://pwpuvjqyyvqwudxotamj.supabase.co/storage/v1/object/public/images/uploads/6gr3nxeohz7_1776990812313.png',
    'social-media-burnout-2026': 'https://pwpuvjqyyvqwudxotamj.supabase.co/storage/v1/object/public/images/uploads/j1xtk0ik9es_1777002040654.png',
    'instagram-reels-downloader-guide': '/images/blog/instagram-reels-downloader-guide.png',
    'instagram-hashtag-strategy-guide': '/images/blog/instagram-hashtag-strategy-guide.png',
    'instagram-bio-optimization-guide': '/images/blog/instagram-bio-optimization-guide.png',
    'how-to-grow-instagram-followers-organically': '/images/blog/how-to-grow-instagram-followers-organically.png',
    'instagram-content-calendar-template': '/images/blog/instagram-content-calendar-template.png',
    'public-instagram-profile-analysis-tutorial': '/images/blog/public-instagram-profile-analysis-tutorial.png',
    'instagram-creator-vs-business-account': '/images/blog/instagram-creator-vs-business-account.png',
    'instagram-engagement-rate-guide': '/images/blog/instagram-engagement-rate-guide.png',
    'instagram-algorithm-explained-2026': '/images/blog/instagram-algorithm-explained-2026.png',
    'instagram-carousel-strategy-guide': '/images/blog/instagram-carousel-strategy-guide.png',
    'instagram-influencer-collaborations-guide': '/images/blog/instagram-influencer-collaborations-guide.png',
    'instagram-seo-ranking-factors': '/images/blog/instagram-seo-ranking-factors.png',
    'instagram-monetization-guide-2026': '/images/blog/instagram-monetization-guide-2026.png',
    'instagram-analytics-key-metrics-guide': '/images/blog/instagram-analytics-key-metrics-guide.png',
};

export const STATIC_BLOG_POSTS: StaticPost[] = articles.map(([slug, category]) => {
    const article = reviewedPosts[slug];
    if (!article?.content.trim()) throw new Error(`Missing static article content: ${slug}`);
    return {
        ...article,
        id: `static-${slug}`,
        slug,
        featured_image: articleImages[slug] || `/images/blog/${slug}.svg`,
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
