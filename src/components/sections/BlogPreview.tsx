import { STATIC_BLOG_POSTS, STATIC_BLOG_CATEGORIES } from '@/lib/staticBlogPosts';
import Link from 'next/link';
import styles from './BlogPreview.module.css';

export default function BlogPreview() {
    const posts = STATIC_BLOG_POSTS.slice(0, 3);
    const categoryMap = new Map(STATIC_BLOG_CATEGORIES.map(c => [c.id, c.name]));

    if (!posts || posts.length === 0) {
        return null;
    }

    return (
        <section className={styles.blogPreview}>
            <div className={styles.container}>
                {/* Section Header */}
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <span className={styles.badge}>📚 Resources</span>
                        <h2 className={styles.title}>
                            Insights <span className={styles.highlight}>&amp; Resources</span>
                        </h2>
                        <p className={styles.subtitle}>
                            In-depth guides, research frameworks, and creator strategies from InstaPSV Editorial.
                        </p>
                    </div>
                    <Link href="/blog" className={styles.viewAllLink}>
                        View All Articles
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>

                {/* Blog Grid */}
                <div className={styles.grid}>
                    {posts.map((post) => {
                        const catId = post.categories?.[0];
                        const categoryName = categoryMap.get(catId) || 'Guides';
                        const wordCount = (post.content || '').replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
                        const readTime = Math.ceil(wordCount / 200) + ' min read';
                        const date = new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

                        return (
                            <Link key={post.id} href={`/${post.slug}`} className={styles.card}>
                                <div className={styles.cardImage}>
                                    {post.featured_image ? (
                                        <img src={post.featured_image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div className={styles.imagePlaceholder}>
                                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                                <circle cx="8.5" cy="8.5" r="1.5" />
                                                <polyline points="21 15 16 10 5 21" />
                                            </svg>
                                        </div>
                                    )}
                                    <span className={styles.category}>{categoryName}</span>
                                </div>
                                <div className={styles.cardContent}>
                                    <div className={styles.meta}>
                                        <span>{date}</span>
                                        <span className={styles.metaDot}>•</span>
                                        <span>{readTime}</span>
                                    </div>
                                    <h3 className={styles.cardTitle}>{post.title}</h3>
                                    <p className={styles.cardExcerpt}>{post.excerpt}</p>
                                    <span className={styles.readMore}>
                                        Read More
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M5 12h14M12 5l7 7-7 7" />
                                        </svg>
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
