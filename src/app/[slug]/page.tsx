
import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
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
    categories?: string[];
}

async function getPost(slug: string, isPreview = false): Promise<{ post: Post | null, error: any, recentSlugs?: string[] }> {
    let query = supabaseAdmin
        .from('posts')
        .select('*')
        .eq('slug', slug);

    if (!isPreview) {
        query = query.eq('status', 'published');
    }

    const { data: post, error } = await query.single();

    if (error) {
        try {
            const { data: recent } = await supabaseAdmin
                .from('posts')
                .select('slug')
                .order('created_at', { ascending: false })
                .limit(5);
            return { post: null, error, recentSlugs: recent?.map(r => r.slug) || [] };
        } catch (e) {
            return { post: null, error };
        }
    }

    return { post, error: null };
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
    const isPreview = sParams.preview === 'true';

    // Try static page first
    const page = await getPage(slug);
    if (page) {
        return {
            title: page.meta_title || `${page.title} - InstaPSV`,
            description: page.meta_description || page.excerpt || '',
        };
    }

    // Try blog post
    const { post } = await getPost(slug, isPreview);
    if (post) {
        const t = await getTranslations('blog');
        return {
            title: `${post.title} - InstaPSV ${isPreview ? '[PREVIEW]' : t('title')}`,
            description: post.excerpt || post.content.slice(0, 160),
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
    const { slug: rawSlug } = await params;
    // Decode and sanitize slug (e.g. "my post" or "my%20post" -> "my-post")
    const slug = decodeURIComponent(rawSlug)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    const sParams = await searchParams;
    const isPreview = sParams.preview === 'true';

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
        const { post, error, recentSlugs } = await getPost(slug, isPreview);
        const t = await getTranslations('blog');
        const locale = await getLocale();

        if (!post) {
            console.log(`[Slug-Page] No post found for slug: "${slug}" (Preview: ${isPreview})`);
            if (isPreview) {
                const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
                return (
                    <>
                        <Header alwaysDark />
                        <div style={{ padding: '100px 20px', textAlign: 'center', background: '#f9fafb', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
                            <div style={{ maxWidth: '600px', width: '100%', padding: '40px', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                                <h1 style={{ color: '#ef4444', marginBottom: '16px', fontSize: '24px' }}>Preview Not Found</h1>
                                <p style={{ color: '#374151', fontSize: '16px', lineHeight: '1.6' }}>
                                    We couldn't find a draft or published post with the slug: <br />
                                    <strong style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: '4px' }}>{slug}</strong>
                                </p>

                                <div style={{ marginTop: '24px', padding: '16px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', textAlign: 'left', fontSize: '13px' }}>
                                    <div style={{ marginBottom: '8px' }}><strong>Debug Status:</strong></div>
                                    <div>URL Preview Mode: <span style={{ color: isPreview ? '#16a34a' : '#dc2626', fontWeight: 'bold' }}>{String(isPreview)}</span></div>
                                    <div>Service Role Key: <span style={{ color: hasServiceKey ? '#16a34a' : '#dc2626', fontWeight: 'bold' }}>{hasServiceKey ? 'Detected' : 'MISSING'}</span></div>
                                    {error && <div style={{ marginTop: '8px', color: '#991b1b' }}>DB Error: {error.message}</div>}

                                    {recentSlugs && recentSlugs.length > 0 && (
                                        <div style={{ marginTop: '12px', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
                                            <div style={{ marginBottom: '4px' }}><strong>Last 5 Slugs in DB:</strong></div>
                                            {recentSlugs.map((s, i) => (
                                                <div key={i} style={{ color: '#475569', fontSize: '12px' }}>{s}</div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <a
                                    href={`/${slug}?preview=true&t=${Date.now()}`}
                                    style={{ marginTop: '24px', padding: '12px 24px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', textDecoration: 'none', display: 'inline-block' }}
                                >
                                    Refresh Preview
                                </a>
                            </div>
                        </div>
                        <Footer />
                    </>
                );
            }
            
            // Re-throw this so Next.js handles the 404
            notFound();
        }

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
                            <div className="blog-post-body" dangerouslySetInnerHTML={{ __html: sanitizeContent(post.content || '') }} />
                        </div>
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

        console.error("CRITICAL PAGE ERROR:", err);
        return (
            <div style={{ padding: '40px', background: '#fff', color: '#000', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                <h1>Critical Server Error (Caught)</h1>
                <p>Message: {err.message}</p>
                <p>Stack: {err.stack}</p>
                <hr />
                <p>Please share this with the developer to fix the crash.</p>
            </div>
        );
    }
}

