import { applyReviewedPost, CONTENT_REVIEWED_AT } from '@/lib/reviewedContent';
import { STATIC_BLOG_POSTS, STATIC_BLOG_CATEGORIES, withEditorialCategory } from '@/lib/staticBlogPosts';

import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import { isValidPostPreview } from '@/lib/postPreview';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getTranslations, getLocale } from 'next-intl/server';
import { supabaseAdmin } from '@/lib/supabase';
import TableOfContents from '@/components/blog/TableOfContents';
import styles from './page.module.css';
import blogStyles from './blog-post.module.css';

// Initialize Supabase Client for static pages
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// --- Static Page Helpers ---
async function getPage(slug: string) {
    const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

    if (error) return null;
    return data;
}

// --- Blog Post Helpers ---
interface Post {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    featured_image: string;
    created_at: string;
    author_name?: string;
    updated_at?: string;
    categories?: string[];
}

async function getPost(slug: string, isPreview = false): Promise<{ post: Post | null }> {
    // Check static posts first (always available, no DB needed)
    const staticPost = STATIC_BLOG_POSTS.find(p => p.slug === slug);

    let query = supabaseAdmin.from('posts').select('*').eq('slug', slug);
    const { data: post, error } = await query.single();
    if (error && error.code !== 'PGRST116') {
        console.error('Post lookup failed:', error.code);
        // Return static post as fallback if DB fails
        if (staticPost && !isPreview) return { post: staticPost };
        throw new Error('Content is temporarily unavailable');
    }
    // Honor an explicit CMS unpublish instead of resurrecting a static fallback.
    if (post && !isPreview && post.status !== 'published') return { post: null };
    // If DB returned a post, apply reviewed content; otherwise use static
    if (post) return { post: !isPreview ? withEditorialCategory(applyReviewedPost(post)) : post };
    if (staticPost && !isPreview) return { post: staticPost };
    return { post: null };
}

// Strip editor-injected wrappers (outer blockquote, empty h1 at start)
function sanitizeContent(html: string): string {
    if (!html) return '';
    // Remove leading empty h1 and whitespace
    let clean = html.replace(/^\s*<h1>\s*<\/h1>\s*/i, '');
    // If entire content is wrapped in a single top-level <blockquote>…</blockquote>, unwrap it
    const match = clean.match(/^\s*<blockquote[^>]*>([\s\S]*)<\/blockquote>\s*$/i);
    if (match) {
        clean = match[1];
    }
    // Also strip any remaining leading empty h1 after unwrap
    clean = clean.replace(/^\s*<h1>\s*<\/h1>\s*/i, '');
    return clean.trim();
}

async function getCategoryName(categoryId: string | undefined) {
    if (!categoryId) return null;
    const staticCategory = STATIC_BLOG_CATEGORIES.find(category => category.id === categoryId);
    if (staticCategory) return staticCategory.name;
    try {
        const { data } = await supabaseAdmin
            .from('categories')
            .select('name')
            .eq('id', categoryId)
            .single();
        return data?.name || null;
    } catch (e) {
        return null;
    }
}

// --- Metadata ---
export async function generateMetadata({
    params,
    searchParams
}: {
    params: Promise<{ slug: string }>,
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const { slug } = await params;
    const sParams = await searchParams;
    const isPreview = isValidPostPreview(slug, sParams);
    if (sParams.preview === 'true' && !isPreview) notFound();

    // Try static page first
    const page = await getPage(slug);
    if (page) {
        return {
            title: page.meta_title || `${page.title} - InstaPSV`,
            description: page.meta_description || page.excerpt || '',
            alternates: {
                canonical: `/${slug}`,
            },
        };
    }

    // Try blog post
    const { post } = await getPost(slug, isPreview);
    if (post) {
        return {
            title: `${post.title}${isPreview ? ' [Preview]' : ''}`,
            robots: isPreview ? { index: false, follow: false } : undefined,
            description: post.excerpt || post.content.slice(0, 160),
            alternates: {
                canonical: `/${slug}`,
            },
        };
    }

    return {};
}

// --- Page Component ---
export default async function DynamicPage({
    params,
    searchParams
}: {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { slug } = await params;
    const sParams = await searchParams;
    const isPreview = isValidPostPreview(slug, sParams);
    if (sParams.preview === 'true' && !isPreview) notFound();

    try {
        // ========== 1. Try Static Page First ==========
        const page = await getPage(slug);
        if (page) {
            return (
                <>
                    <Header alwaysDark />
                    <main className={styles.main}>
                        <section className={styles.hero}>
                            <div className={styles.container}>
                                <span className={styles.badge}>{page.title}</span>
                                <h1 className={styles.title}>
                                    {(() => {
                                        const titleText = page.title || '';
                                        const parts = titleText.split(' ');
                                        if (parts.length > 1) {
                                            const last = parts.pop();
                                            return <>{parts.join(' ')} <span className={styles.highlight}>{last}</span></>;
                                        }
                                        return <span className={styles.highlight}>{titleText}</span>;
                                    })()}
                                </h1>
                                <p className={styles.subtitle}>
                                    {page.excerpt || `Information about ${page.title}`}
                                </p>
                            </div>
                        </section>

                        <section className={styles.content}>
                            <div className={styles.container}>
                                <div
                                    className={styles.card}
                                    dangerouslySetInnerHTML={{ __html: page.content }}
                                />
                            </div>
                        </section>
                    </main>
                    <Footer />
                </>
            );
        }

        // ========== 2. Try Blog Post ==========
        const { post } = await getPost(slug, isPreview);
        const t = await getTranslations('blog');
        const locale = await getLocale();

        if (!post) notFound();

        // Render blog post
        const categoryName = (await getCategoryName(post.categories?.[0])) || t('defaultCategory');
        const authorName = post.author_name || t('defaultAuthor');

        return (
            <>
                <Header alwaysDark />
                <main className={blogStyles.main}>
                    <div className={blogStyles.articleContainer}>
                        <header className={blogStyles.postHeader}>
                            {post.featured_image ? (
                                <div className={blogStyles.featuredImage}>
                                    <img src={post.featured_image} alt={post.title} />
                                </div>
                            ) : (
                                <div className={blogStyles.imagePlaceholder}>
                                    <span>📸</span>
                                </div>
                            )}

                            <div className={blogStyles.meta}>
                                <span>{new Date(post.created_at).toLocaleDateString(locale, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}</span>
                                <span className={blogStyles.separator}>•</span>
                                <span className={blogStyles.category}>{categoryName}</span>
                            </div>

                            <h1 className={blogStyles.title}>{post.title}</h1>

                            <div className={blogStyles.author}>
                                <div className={blogStyles.authorAvatar}>
                                    {authorName.charAt(0)}
                                </div>
                                <div className={blogStyles.authorInfo}>
                                    <span className={blogStyles.authorName}>{authorName}</span>
                                    <span className={blogStyles.authorRole}>{t('writer')}</span>
                                </div>
                            </div>
                        </header>

                        <div className={blogStyles.content}>
                            <TableOfContents />
                            {!isPreview && post.updated_at === CONTENT_REVIEWED_AT && <p>Revised November 12, 2026. <a href="/contact">Report a correction</a>.</p>}
                            <div className="blog-post-body" dangerouslySetInnerHTML={{ __html: sanitizeContent(post.content || '') }} />
                        </div>

                        {/* Author Bio — E-E-A-T signal for Google */}
                        <aside style={{
                            margin: '3rem 0 2rem',
                            padding: '1.5rem',
                            borderTop: '2px solid rgba(255,0,128,0.15)',
                            display: 'flex',
                            gap: '1rem',
                            alignItems: 'flex-start',
                        }}>
                            <div style={{
                                width: 48, height: 48, borderRadius: '50%',
                                background: 'linear-gradient(135deg, #ff0080, #7928ca)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '1.25rem', fontWeight: 800, color: '#fff', flexShrink: 0,
                            }}>
                                {authorName.charAt(0)}
                            </div>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 4 }}>{authorName}</div>
                                <div style={{ fontSize: '0.8rem', opacity: 0.6, marginBottom: 8 }}>About this guide</div>
                                <p style={{ fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
                                    {authorName === 'InstaPSV Editorial'
                                        ? 'InstaPSV Editorial publishes practical guides to public profile research and creator workflows. Product descriptions are checked against the implementation; examples are labeled and provider coverage is not guaranteed.'
                                        : 'This article is attributed to the author shown above. Product availability and current limits are documented in the linked tool guides.'}
                                    {' '}<a href="/editorial-policy">How we maintain our guides</a>. Found an error? <a href="/contact">Report a correction</a>.
                                </p>
                            </div>
                        </aside>
                    </div>
                </main>
                <Footer />
            </>
        );
    } catch (err: any) {
        // IMPORTANT: If this is a Next.js internal error (like notFound()), rethrow it!
        // These errors have a 'digest' property starting with 'NEXT_'
        if (err.message?.includes('NEXT_HTTP_ERROR_FALLBACK') || err.digest?.startsWith('NEXT_')) {
            throw err;
        }

        throw err;
    }
}

