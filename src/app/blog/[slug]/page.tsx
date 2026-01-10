import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import styles from './page.module.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AdUnit from '@/components/ads/AdUnit';
import { getTranslations, getLocale } from 'next-intl/server';

// Initialize Supabase Client with Service Role Key to bypass RLS for previews
// This is safe because this is a server component
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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
    const query = supabase
        .from('posts')
        .select('*')
        .eq('slug', slug);

    // If not previewing, only show published posts
    if (!isPreview) {
        query.eq('status', 'published');
    }

    const { data, error } = await query.single();

    if (error || !data) return null;
    return data;
}

// Fetch category name
async function getCategoryName(categoryId: string | undefined) {
    if (!categoryId) return null;

    const { data } = await supabase
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

    const t = await getTranslations('blog');
    const locale = await getLocale();

    if (!post) {
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
}
