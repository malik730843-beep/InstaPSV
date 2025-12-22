import Link from 'next/link';
import styles from './BlogPreview.module.css';

// Mock blog data - will be replaced with WordPress data
const blogPosts = [
    {
        id: 1,
        slug: 'how-to-view-instagram-stories-anonymously',
        title: 'How to View Instagram Stories Anonymously',
        excerpt: 'Learn the best methods to view Instagram stories without being detected. Complete guide for anonymous viewing.',
        category: 'Guides',
        image: '/blog/stories.jpg',
        date: 'Dec 15, 2025',
        readTime: '5 min read',
    },
    {
        id: 2,
        slug: 'instagram-profile-viewer-tools-comparison',
        title: 'Best Instagram Profile Viewer Tools Compared',
        excerpt: 'Compare the top Instagram viewer tools and find out which one offers the best features for your needs.',
        category: 'Reviews',
        image: '/blog/tools.jpg',
        date: 'Dec 12, 2025',
        readTime: '8 min read',
    },
    {
        id: 3,
        slug: 'download-instagram-reels-high-quality',
        title: 'How to Download Instagram Reels in HD',
        excerpt: 'Step-by-step tutorial on downloading Instagram Reels in the highest quality available.',
        category: 'Tutorials',
        image: '/blog/reels.jpg',
        date: 'Dec 10, 2025',
        readTime: '4 min read',
    },
];

export default function BlogPreview() {
    return (
        <section className={styles.blogPreview}>
            <div className={styles.container}>
                {/* Section Header */}
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <span className={styles.badge}>📚 Resources</span>
                        <h2 className={styles.title}>
                            Insights <span className={styles.highlight}>& Resources</span>
                        </h2>
                        <p className={styles.subtitle}>
                            Tips, tutorials, and guides to help you get the most out of InstaPSV.
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
                    {blogPosts.map((post) => (
                        <Link key={post.id} href={`/blog/${post.slug}`} className={styles.card}>
                            <div className={styles.cardImage}>
                                <div className={styles.imagePlaceholder}>
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                        <circle cx="8.5" cy="8.5" r="1.5" />
                                        <polyline points="21 15 16 10 5 21" />
                                    </svg>
                                </div>
                                <span className={styles.category}>{post.category}</span>
                            </div>
                            <div className={styles.cardContent}>
                                <div className={styles.meta}>
                                    <span>{post.date}</span>
                                    <span className={styles.metaDot}>•</span>
                                    <span>{post.readTime}</span>
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
                    ))}
                </div>
            </div>
        </section>
    );
}
