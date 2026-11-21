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
    'instagram-reels-downloader-guide': 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80',
    'instagram-hashtag-strategy-guide': 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1200&q=80',
    'instagram-bio-optimization-guide': 'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?auto=format&fit=crop&w=1200&q=80',
    'how-to-grow-instagram-followers-organically': 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
    'instagram-content-calendar-template': 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1200&q=80',
    'public-instagram-profile-analysis-tutorial': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    'instagram-creator-vs-business-account': 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80',
    'instagram-engagement-rate-guide': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    'instagram-algorithm-explained-2026': 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    'instagram-carousel-strategy-guide': 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
    'instagram-influencer-collaborations-guide': 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    'instagram-seo-ranking-factors': 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1200&q=80',
    'instagram-monetization-guide-2026': 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=1200&q=80',
    'instagram-analytics-key-metrics-guide': 'https://images.unsplash.com/photo-1534972195531-a756b1126f24?auto=format&fit=crop&w=1200&q=80',
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
