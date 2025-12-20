import Link from 'next/link';
import styles from './page.module.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Mock pages
const pages = [
    { slug: 'about', title: 'About Us', description: 'Learn more about InstaPSV and our mission to provide free Instagram viewing tools.', icon: '👥' },
    { slug: 'contact', title: 'Contact', description: 'Get in touch with our team for support, partnerships, or feedback.', icon: '📧' },
    { slug: 'features', title: 'Features', description: 'Explore all the features InstaPSV offers for Instagram viewing.', icon: '⚡' },
    { slug: 'privacy', title: 'Privacy Policy', description: 'Read our privacy policy and how we protect your data.', icon: '🔒' },
    { slug: 'terms', title: 'Terms of Service', description: 'Our terms of service and usage guidelines.', icon: '📄' },
    { slug: 'faq', title: 'FAQ', description: 'Frequently asked questions about InstaPSV.', icon: '❓' },
];

export const metadata = {
    title: 'Pages - InstaPSV',
    description: 'Browse all information pages on InstaPSV.',
};

export default function PagesArchivePage() {
    return (
        <>
            <Header />
            <main className={styles.main}>
                <section className={styles.hero}>
                    <div className={styles.container}>
                        <span className={styles.badge}>📄 Pages</span>
                        <h1 className={styles.title}>
                            Information <span className={styles.highlight}>Pages</span>
                        </h1>
                        <p className={styles.subtitle}>
                            Browse all our information and legal pages.
                        </p>
                    </div>
                </section>

                <section className={styles.pagesSection}>
                    <div className={styles.container}>
                        <div className={styles.pagesGrid}>
                            {pages.map((page) => (
                                <Link key={page.slug} href={`/${page.slug}`} className={styles.pageCard}>
                                    <span className={styles.pageIcon}>{page.icon}</span>
                                    <div className={styles.pageContent}>
                                        <h2 className={styles.pageTitle}>{page.title}</h2>
                                        <p className={styles.pageDescription}>{page.description}</p>
                                    </div>
                                    <svg className={styles.arrow} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
