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
async function getPost(slug: string, isPreview = false): Promise<Post | null> {
    const query = supabaseAdmin
        .from('posts')
        .select('*')
        .eq('slug', slug);

    // If not previewing, only show published posts
    if (!isPreview) {
        query.eq('status', 'published');
    }

    const { data, error } = await query.single();

    if (error) {
        console.error(`Error fetching post [${slug}]:`, error.message);
        return null;
    }

    if (!data) return null;
    return data;
}

// Fetch category name
async function getCategoryName(categoryId: string | undefined) {
    if (!categoryId) return null;

    const { data } = await supabaseAdmin
        .from('categories')
        .select('name')
        .eq('id', categoryId)
        .single();

    return data?.name || null;
}


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getPost(slug);
    const t = await getTranslations('blog');
    const commonT = await getTranslations('common');

    if (!post) return { title: t('postNotFound') };

    return {
        title: `${post.title} - InstaPSV ${t('title')}`,
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
    const { slug } = await params;
    const { preview } = await searchParams;
    const isPreview = preview === 'true';

    const post = await getPost(slug, isPreview);

    if (!post) {
        if (isPreview) {
            return (
                <div style={{ padding: '100px 20px', textAlign: 'center', background: '#f9fafb', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ maxWidth: '600px', width: '100%', padding: '40px', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                        <h1 style={{ color: '#ef4444', marginBottom: '16px' }}>Preview Not Found</h1>
                        <p style={{ color: '#374151', fontSize: '16px', lineHeight: '1.6' }}>
                            We couldn't find a draft or published post with the slug: <br />
                            <strong style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: '4px' }}>{slug}</strong>
                        </p>
                        <div style={{ marginTop: '32px', textAlign: 'left', background: '#fef2f2', padding: '20px', borderRadius: '8px', border: '1px solid #fee2e2' }}>
                            <h2 style={{ fontSize: '14px', fontWeight: '600', color: '#991b1b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Possible Reasons:</h2>
                            <ul style={{ paddingLeft: '20px', margin: 0, color: '#b91c1c', fontSize: '14px' }}>
                                <li>The post hasn't been saved to the database yet.</li>
                                <li>The slug was changed in the editor but not saved.</li>
                                <li>The <strong>SUPABASE_SERVICE_ROLE_KEY</strong> is missing on the Vercel server.</li>
                            </ul>
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            style={{ marginTop: '24px', padding: '12px 24px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            );
        }
        notFound();
    }

    const t = await getTranslations('blog');
    const locale = await getLocale();

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
}
