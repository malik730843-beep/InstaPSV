import Link from 'next/link';
import styles from './page.module.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Mock blog posts (will be replaced with WordPress data)
const mockPosts = [
    {
        id: 1,
        slug: 'how-to-view-instagram-stories-anonymously',
        title: 'How to View Instagram Stories Anonymously in 2024',
        excerpt: 'Learn the best methods to view Instagram stories without the user knowing. Complete guide with step-by-step instructions.',
        category: 'Tutorials',
        date: '2024-01-15',
        readTime: 5,
        image: '/blog/story-viewer.jpg',
    },
    {
        id: 2,
        slug: 'instagram-followers-growth-tips',
        title: '10 Proven Tips to Grow Your Instagram Followers',
        excerpt: 'Discover effective strategies to increase your Instagram following organically without buying fake followers.',
        category: 'Growth',
        date: '2024-01-12',
        readTime: 8,
        image: '/blog/growth-tips.jpg',
    },
    {
        id: 3,
        slug: 'download-instagram-reels-guide',
        title: 'Complete Guide to Downloading Instagram Reels',
        excerpt: 'Step-by-step tutorial on how to save Instagram Reels to your device in high quality.',
        category: 'Tutorials',
        date: '2024-01-10',
        readTime: 4,
        image: '/blog/reels-download.jpg',
    },
    {
        id: 4,
        slug: 'instagram-algorithm-explained',
        title: 'Instagram Algorithm 2024: Everything You Need to Know',
        excerpt: 'Understanding how the Instagram algorithm works and how to use it to your advantage.',
        category: 'Insights',
        date: '2024-01-08',
        readTime: 10,
        image: '/blog/algorithm.jpg',
    },
    {
        id: 5,
        slug: 'best-instagram-viewer-tools',
        title: 'Top 5 Instagram Viewer Tools Compared',
        excerpt: 'A comprehensive comparison of the best Instagram viewer tools available in 2024.',
        category: 'Reviews',
        date: '2024-01-05',
        readTime: 6,
        image: '/blog/viewer-tools.jpg',
    },
    {
        id: 6,
        slug: 'instagram-privacy-tips',
        title: 'Protect Your Privacy on Instagram: Essential Tips',
        excerpt: 'Learn how to secure your Instagram account and protect your personal information.',
        category: 'Privacy',
        date: '2024-01-02',
        readTime: 7,
        image: '/blog/privacy.jpg',
    },
];

const categories = ['All', 'Tutorials', 'Growth', 'Insights', 'Reviews', 'Privacy'];

export const metadata = {
    title: 'Blog - InstaPSV | Instagram Tips, Tutorials & Insights',
    description: 'Discover tips, tutorials, and insights about Instagram. Learn how to view stories anonymously, grow followers, and more.',
};

export default function BlogPage() {
    return (
        <>
            <Header />
            <main className={styles.main}>
                {/* Hero Section */}
                <section className={styles.hero}>
                    <div className={styles.container}>
                        <span className={styles.badge}>📚 Blog</span>
                        <h1 className={styles.title}>
                            Insights & <span className={styles.highlight}>Resources</span>
                        </h1>
                        <p className={styles.subtitle}>
                            Tips, tutorials, and guides to help you get the most out of Instagram.
                        </p>
                    </div>
                </section>

                {/* Categories */}
                <section className={styles.categoriesSection}>
                    <div className={styles.container}>
                        <div className={styles.categories}>
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    className={`${styles.categoryBtn} ${cat === 'All' ? styles.active : ''}`}
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
                            {mockPosts.map((post) => (
                                <article key={post.id} className={styles.postCard}>
                                    <div className={styles.postImage}>
                                        <div className={styles.imagePlaceholder}>
                                            <span>📸</span>
                                        </div>
                                        <span className={styles.postCategory}>{post.category}</span>
                                    </div>
                                    <div className={styles.postContent}>
                                        <div className={styles.postMeta}>
                                            <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                            <span>•</span>
                                            <span>{post.readTime} min read</span>
                                        </div>
                                        <h2 className={styles.postTitle}>
                                            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                                        </h2>
                                        <p className={styles.postExcerpt}>{post.excerpt}</p>
                                        <Link href={`/blog/${post.slug}`} className={styles.readMore}>
                                            Read More
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M5 12h14M12 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
