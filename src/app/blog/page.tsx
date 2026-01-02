import Link from 'next/link';
import styles from './page.module.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import NewsletterForm from '@/components/NewsletterForm';
import { createClient } from '@supabase/supabase-js';
import { getTranslations, getLocale } from 'next-intl/server';

// Initialize Supabase Client (Server-side)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function generateMetadata() {
    const t = await getTranslations('blog');
    return {
        title: `${t('title')} - InstaPSV | Instagram Tips, Tutorials & Insights`,
        description: t('subtitle'),
    };
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface Post {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featured_image: string;
    created_at: string;
    categories: string[];
    author_name?: string;
}

interface Category {
    id: string;
    name: string;
}

export default async function BlogPage() {
    let posts: Post[] = [];
    let categories: Category[] = [];
    const t = await getTranslations('blog');
    const locale = await getLocale();

    // Fetch Posts from Supabase
    try {
        const { data: postsData, error: postsError } = await supabase
            .from('posts')
            .select('*')
            .eq('status', 'published')
            .order('created_at', { ascending: false });

        if (postsData && !postsError) {
            posts = postsData;
        }

        // Fetch Categories
        const { data: categoriesData, error: catError } = await supabase
            .from('categories')
            .select('*');

        if (categoriesData && !catError) {
            categories = categoriesData;
        }
    } catch (error) {
        console.error('Failed to fetch data:', error);
    }

    const categoryNames = [t('all'), ...categories.map(c => c.name)];

    // Reading time calculation helper
    const getReadingTime = (text: string) => {
        const wpm = 200;
        const words = text.trim().split(/\s+/).length;
        return Math.ceil(words / wpm);
    };

    // Get author initials
    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <>
            <Header />
            <main className={styles.main}>
                {/* Hero Section */}
                <section className={styles.hero}>
                    <div className={styles.container}>
                        <span className={styles.badge}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                            </svg>
                            {t('badge')}
                        </span>
                        <h1 className={styles.title}>
                            {t('insights')} <span className={styles.highlight}>{t('resources')}</span>
                        </h1>
                        <p className={styles.subtitle}>
                            {t('subtitle')}
                        </p>
                    </div>
                </section>

                {/* Categories */}
                <section className={styles.categoriesSection}>
                    <div className={styles.container}>
                        <div className={styles.categories}>
                            {categoryNames.map((cat) => (
                                <button
                                    key={cat}
                                    className={`${styles.categoryBtn} ${cat === t('all') ? styles.active : ''}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Posts Grid */}
                <section className={styles.postsSection}>
                    <div className={styles.container}>
                        <div className={styles.postsGrid}>
                            {posts.length > 0 ? (
                                posts.map((post, index) => {
                                    // Resolve category name
                                    const catId = post.categories?.[0];
                                    const categoryName = categories.find(c => c.id === catId)?.name || 'Tips';
                                    const readTime = getReadingTime(post.content || '');
                                    const authorName = post.author_name || t('team');

                                    return (
                                        <article key={post.id} className={styles.postCard}>
                                            <div className={styles.postImage}>
                                                {post.featured_image ? (
                                                    <img src={post.featured_image} alt={post.title} />
                                                ) : (
                                                    <div className={styles.imagePlaceholder}>
                                                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3">
                                                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                                            <circle cx="8.5" cy="8.5" r="1.5" />
                                                            <polyline points="21 15 16 10 5 21" />
                                                        </svg>
                                                    </div>
                                                )}
                                                <span className={styles.postCategory}>{categoryName}</span>
                                            </div>
                                            <div className={styles.postContent}>
                                                <div className={styles.postMeta}>
                                                    <span>{new Date(post.created_at).toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                    <span>•</span>
                                                    <span>{readTime} {t('minRead')}</span>
                                                </div>
                                                <h2 className={styles.postTitle}>
                                                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                                                </h2>
                                                <p className={styles.postExcerpt}>{post.excerpt}</p>
                                                <Link href={`/blog/${post.slug}`} className={styles.readMore}>
                                                    {t('readArticle')}
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                                    </svg>
                                                </Link>

                                                {/* Author Info (only on first/featured post) */}
                                                {index === 0 && (
                                                    <div className={styles.authorInfo}>
                                                        <div className={styles.authorAvatar}>
                                                            {getInitials(authorName)}
                                                        </div>
                                                        <div>
                                                            <div className={styles.authorName}>{authorName}</div>
                                                            <div className={styles.authorRole}>{t('writer')}</div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </article>
                                    );
                                })
                            ) : (
                                <div className={styles.emptyState}>
                                    <div className={styles.emptyIcon}>
                                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                                        </svg>
                                    </div>
                                    <h3 className={styles.emptyTitle}>{t('noPosts')}</h3>
                                    <p className={styles.emptyText}>{t('working')}</p>
                                    <Link href="/" className={styles.readMore} style={{ justifyContent: 'center' }}>
                                        {t('backHome')}
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M5 12h14M12 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Newsletter Section */}
                <section className={styles.newsletterSection}>
                    <div className={styles.container}>
                        <div className={styles.newsletterCard}>
                            <h2 className={styles.newsletterTitle}>{t('stayUpdated')}</h2>
                            <p className={styles.newsletterText}>
                                {t('newsletterText')}
                            </p>
                            <NewsletterForm />
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
