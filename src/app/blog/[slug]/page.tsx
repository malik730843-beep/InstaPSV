import { notFound } from 'next/navigation';
import styles from './page.module.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AdUnit from '@/components/ads/AdUnit';
import { getTranslations, getLocale } from 'next-intl/server';
import { supabaseAdmin } from '@/lib/supabase';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface Post {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    featured_image: string;
    created_at: string;
    author_name?: string;
    categories?: string[]; // Array of category IDs
}

// Fetch single post
async function getPost(slug: string, isPreview = false): Promise<{ post: Post | null, error: any, recentSlugs?: string[] }> {
    console.log(`Fetching post: ${slug}, isPreview: ${isPreview}`);
    let query = supabaseAdmin
        .from('posts')
        .select('*')
        .eq('slug', slug);

    // If not previewing, only show published posts
    if (!isPreview) {
        query = query.eq('status', 'published');
    }

    const { data: post, error } = await query.single();

    if (error) {
        console.error(`Error fetching post [${slug}]:`, error.message);

        // If not found, let's fetch recent slugs to help debug
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


// Fetch category name
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

    const { post } = await getPost(slug, isPreview);
    const t = await getTranslations('blog');

    if (!post) return { title: t('postNotFound') };

    return {
        title: `${post.title} - InstaPSV ${isPreview ? '[PREVIEW]' : t('title')}`,
        description: post.excerpt || post.content.slice(0, 160),
    };
}


export default async function BlogPostPage({
    params,
    searchParams
}: {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    try {
        const { slug } = await params;
        const sParams = await searchParams;
        const isPreview = sParams.preview === 'true';

        console.log('Blog Page params:', { slug, isPreview, rawParams: sParams });

        const { post, error, recentSlugs } = await getPost(slug, isPreview);

        const t = await getTranslations('blog');
        const locale = await getLocale();

        if (!post) {
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
                                    <div style={{ marginBottom: '8px' }}>🔍 <strong>Debug Status:</strong></div>
                                    <div>• URL Preview Mode: <span style={{ color: isPreview ? '#16a34a' : '#dc2626', fontWeight: 'bold' }}>{String(isPreview)}</span></div>
                                    <div>• Service Role Key: <span style={{ color: hasServiceKey ? '#16a34a' : '#dc2626', fontWeight: 'bold' }}>{hasServiceKey ? 'Detected' : 'MISSING'}</span></div>
                                    {error && <div style={{ marginTop: '8px', color: '#991b1b' }}>• DB Error: {error.message}</div>}

                                    {recentSlugs && recentSlugs.length > 0 && (
                                        <div style={{ marginTop: '12px', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
                                            <div style={{ marginBottom: '4px' }}>📋 <strong>Last 5 Slugs in DB:</strong></div>
                                            {recentSlugs.map((s, i) => (
                                                <div key={i} style={{ color: '#475569', fontSize: '12px' }}>• {s}</div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div style={{ marginTop: '32px', textAlign: 'left', background: '#fef2f2', padding: '20px', borderRadius: '8px', border: '1px solid #fee2e2' }}>
                                    <h2 style={{ fontSize: '14px', fontWeight: '600', color: '#991b1b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Possible Reasons:</h2>
                                    <ul style={{ paddingLeft: '20px', margin: 0, color: '#b91c1c', fontSize: '14px', lineHeight: '1.8' }}>
                                        <li><strong>Save first:</strong> Ensure you saved as "Draft" in the editor.</li>
                                        <li><strong>Wait:</strong> Vercel caching may take 30-60 seconds to update.</li>
                                        <li><strong>Mismatch:</strong> Check if your slug matches the "Last 5 Slugs" list above.</li>
                                    </ul>
                                </div>
                                <a
                                    href={`/blog/${slug}?preview=true&t=${Date.now()}`}
                                    style={{ marginTop: '24px', padding: '12px 24px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', textDecoration: 'none', display: 'inline-block' }}
                                >
                                    🔄 Refresh Preview
                                </a>
                            </div>
                        </div>
                        <Footer />
                    </>
                );
            }
            notFound();
        }

        // Resolve category name for the main post
        const categoryName = (await getCategoryName(post.categories?.[0])) || t('defaultCategory');
        const authorName = post.author_name || t('defaultAuthor');

        return (
            <>
                <Header alwaysDark />
                <main className={styles.main}>
                    <div className={styles.articleContainer}>
                        {/* Header Ad */}
                        <AdUnit slot="header" style={{ marginBottom: '20px' }} />

                        {/* Header */}
                        <header className={styles.postHeader}>
                            {/* Featured Image */}
                            <div className={styles.featuredImage}>
                                {post.featured_image ? (
                                    <img src={post.featured_image} alt={post.title} />
                                ) : (
                                    <div className={styles.imagePlaceholder}>
                                        <span>📸</span>
                                    </div>
                                )}
                            </div>

                            <div className={styles.meta}>
                                <span>{new Date(post.created_at).toLocaleDateString(locale, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}</span>
                                <span className={styles.separator}>•</span>
                                <span className={styles.category}>{categoryName}</span>
                            </div>

                            <h1 className={styles.title}>{post.title}</h1>

                            <div className={styles.author}>
                                <div className={styles.authorAvatar}>
                                    {authorName.charAt(0)}
                                </div>
                                <div className={styles.authorInfo}>
                                    <span className={styles.authorName}>{authorName}</span>
                                    <span className={styles.authorRole}>{t('writer')}</span>
                                </div>
                            </div>
                        </header>

                        {/* Content */}
                        <div
                            className={styles.content}
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                    </div>
                </main>
                <Footer />
            </>
        );
    } catch (err: any) {
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
