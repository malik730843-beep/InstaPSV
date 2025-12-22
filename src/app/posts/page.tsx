import Link from 'next/link';
import styles from './page.module.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Mock posts grouped by year/month
const archiveData = [
    {
        year: 2025,
        months: [
            {
                month: 'January',
                posts: [
                    { slug: 'how-to-view-instagram-stories-anonymously', title: 'How to View Instagram Stories Anonymously', date: '2025-01-15' },
                    { slug: 'instagram-followers-growth-tips', title: '10 Proven Tips to Grow Your Instagram Followers', date: '2025-01-12' },
                    { slug: 'download-instagram-reels-guide', title: 'Complete Guide to Downloading Instagram Reels', date: '2025-01-10' },
                    { slug: 'instagram-algorithm-explained', title: 'Instagram Algorithm: Everything You Need to Know', date: '2025-01-08' },
                    { slug: 'best-instagram-viewer-tools', title: 'Top 5 Instagram Viewer Tools Compared', date: '2025-01-05' },
                    { slug: 'instagram-privacy-tips', title: 'Protect Your Privacy on Instagram: Essential Tips', date: '2025-01-02' },
                ],
            },
        ],
    },
    {
        year: 2023,
        months: [
            {
                month: 'December',
                posts: [
                    { slug: 'instagram-trends-2024', title: 'Instagram Trends to Watch', date: '2023-12-28' },
                    { slug: 'story-highlights-guide', title: 'Ultimate Guide to Instagram Story Highlights', date: '2023-12-20' },
                ],
            },
            {
                month: 'November',
                posts: [
                    { slug: 'instagram-reels-tips', title: 'Create Viral Instagram Reels: Tips & Tricks', date: '2023-11-15' },
                ],
            },
        ],
    },
];

export const metadata = {
    title: 'Post Archive - InstaPSV Blog',
    description: 'Browse all blog posts from InstaPSV organized by date.',
};

export default function PostsArchivePage() {
    return (
        <>
            <Header />
            <main className={styles.main}>
                <section className={styles.hero}>
                    <div className={styles.container}>
                        <span className={styles.badge}>📚 Archive</span>
                        <h1 className={styles.title}>
                            Post <span className={styles.highlight}>Archive</span>
                        </h1>
                        <p className={styles.subtitle}>
                            Browse all our articles organized by date.
                        </p>
                    </div>
                </section>

                <section className={styles.archiveSection}>
                    <div className={styles.container}>
                        {archiveData.map((yearData) => (
                            <div key={yearData.year} className={styles.yearBlock}>
                                <h2 className={styles.yearTitle}>{yearData.year}</h2>
                                {yearData.months.map((monthData) => (
                                    <div key={monthData.month} className={styles.monthBlock}>
                                        <h3 className={styles.monthTitle}>{monthData.month}</h3>
                                        <ul className={styles.postList}>
                                            {monthData.posts.map((post) => (
                                                <li key={post.slug} className={styles.postItem}>
                                                    <span className={styles.postDate}>
                                                        {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                    </span>
                                                    <Link href={`/blog/${post.slug}`} className={styles.postLink}>
                                                        {post.title}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
