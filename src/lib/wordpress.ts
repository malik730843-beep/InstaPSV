// WordPress Headless CMS API Utilities

export interface WPPost {
    id: number;
    slug: string;
    title: {
        rendered: string;
    };
    excerpt: {
        rendered: string;
    };
    content: {
        rendered: string;
    };
    date: string;
    modified: string;
    featured_media: number;
    categories: number[];
    tags: number[];
    author: number;
    _embedded?: {
        'wp:featuredmedia'?: [{
            source_url: string;
            alt_text: string;
        }];
        'wp:term'?: [{
            id: number;
            name: string;
            slug: string;
        }[]];
        author?: [{
            name: string;
            avatar_urls: Record<string, string>;
        }];
    };
}

export interface WPPage {
    id: number;
    slug: string;
    title: {
        rendered: string;
    };
    content: {
        rendered: string;
    };
    date: string;
    modified: string;
    featured_media: number;
}

export interface WPCategory {
    id: number;
    name: string;
    slug: string;
    count: number;
    description: string;
}

function getWPUrl() {
    const url = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://your-wordpress-site.com';
    return url.endsWith('/') ? url.slice(0, -1) : url;
}

// Fetch all posts
export async function getPosts(params?: {
    page?: number;
    per_page?: number;
    categories?: number;
    search?: string;
    lang?: string;
}): Promise<{ posts: WPPost[]; total: number; totalPages: number }> {
    const searchParams = new URLSearchParams({
        _embed: 'true',
        per_page: String(params?.per_page || 10),
        page: String(params?.page || 1),
    });

    if (params?.categories) searchParams.set('categories', String(params.categories));
    if (params?.search) searchParams.set('search', params.search);
    if (params?.lang) searchParams.set('lang', params.lang);

    const baseUrl = getWPUrl();
    const url = `${baseUrl}/wp-json/wp/v2/posts?${searchParams}`;
    console.log('Fetching posts from:', url);

    try {
        const res = await fetch(url, {
            next: { revalidate: 60 }, // Cache for 60 seconds
        });

        const contentType = res.headers.get('content-type');

        if (!res.ok) {
            console.error('WordPress fetch failed:', res.status, res.statusText);
            const text = await res.text();
            console.error('Response preview:', text.slice(0, 200));
            throw new Error(`Failed to fetch posts: ${res.status}`);
        }

        if (!contentType || !contentType.includes('application/json')) {
            const text = await res.text();
            console.error('Invalid content type from WordPress:', contentType);
            console.error('Response preview:', text.slice(0, 200));
            throw new Error('WordPress API returned non-JSON response');
        }

        const posts = await res.json();
        const total = parseInt(res.headers.get('X-WP-Total') || '0');
        const totalPages = parseInt(res.headers.get('X-WP-TotalPages') || '0');

        console.log(`Fetched ${posts.length} posts from WordPress. Total: ${total}`);

        return { posts, total, totalPages };
    } catch (error) {
        console.error('Error fetching posts:', error);
        return { posts: [], total: 0, totalPages: 0 };
    }
}

// Fetch single post by slug
export async function getPost(slug: string): Promise<WPPost | null> {
    const baseUrl = getWPUrl();
    try {
        const res = await fetch(
            `${baseUrl}/wp-json/wp/v2/posts?slug=${slug}&_embed=true`,
            { next: { revalidate: 60 } }
        );

        if (!res.ok) throw new Error('Failed to fetch post');

        const posts = await res.json();
        return posts[0] || null;
    } catch (error) {
        console.error('Error fetching post:', error);
        return null;
    }
}

// Fetch all pages
export async function getPages(): Promise<WPPage[]> {
    const baseUrl = getWPUrl();
    try {
        const res = await fetch(
            `${baseUrl}/wp-json/wp/v2/pages?_embed=true&per_page=100`,
            { next: { revalidate: 300 } }
        );

        if (!res.ok) throw new Error('Failed to fetch pages');
        return await res.json();
    } catch (error) {
        console.error('Error fetching pages:', error);
        return [];
    }
}

// Fetch single page by slug
export async function getPage(slug: string): Promise<WPPage | null> {
    const baseUrl = getWPUrl();
    try {
        const res = await fetch(
            `${baseUrl}/wp-json/wp/v2/pages?slug=${slug}&_embed=true`,
            { next: { revalidate: 300 } }
        );

        if (!res.ok) throw new Error('Failed to fetch page');

        const pages = await res.json();
        return pages[0] || null;
    } catch (error) {
        console.error('Error fetching page:', error);
        return null;
    }
}

// Fetch categories
export async function getCategories(): Promise<WPCategory[]> {
    const baseUrl = getWPUrl();
    try {
        const res = await fetch(
            `${baseUrl}/wp-json/wp/v2/categories?per_page=100`,
            { next: { revalidate: 300 } }
        );

        if (!res.ok) throw new Error('Failed to fetch categories');
        return await res.json();
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

// Helper: Strip HTML tags
export function stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').trim();
}

// Helper: Format date
export function formatDate(dateString: string, locale = 'en'): string {
    return new Date(dateString).toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

// Helper: Get reading time
export function getReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const words = stripHtml(content).split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
}
