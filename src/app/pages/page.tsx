import Link from 'next/link';
import styles from './page.module.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { createClient } from '@supabase/supabase-js';
import { getTranslations } from 'next-intl/server';

// Initialize Supabase Client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface Page {
    slug: string;
    title: string;
    excerpt?: string;
}

async function getDynamicPages() {
    const { data: pages, error } = await supabase
        .from('pages')
        .select('slug, title, excerpt')
        .eq('status', 'published');

    if (error || !pages) return [];

    return pages.map((page: Page) => ({
        slug: page.slug,
        title: page.title,
        description: page.excerpt || page.title,
        icon: '📄'
    }));
}

export async function generateMetadata() {
    const t = await getTranslations('pages');
    return {
        title: `${t('badge')} - InstaPSV`,
        description: t('subtitle'),
    };
}

export default async function PagesArchivePage() {
    const t = await getTranslations('pages');
    const navT = await getTranslations('nav');
    const dynamicPages = await getDynamicPages();

    // Static pages that are hardcoded routes
    const staticPages = [
        { slug: 'about', title: navT('about'), description: t('aboutDesc'), icon: '👥' },
        { slug: 'contact', title: navT('contact'), description: t('contactDesc'), icon: '📧' },
        { slug: 'features', title: navT('features'), description: t('featuresDesc'), icon: '⚡' },
        { slug: 'faq', title: navT('faq'), description: t('faqDesc'), icon: '❓' },
    ];

    const allPages = [...staticPages, ...dynamicPages];

    return (
        <>
            <Header />
            <main className={styles.main}>
                <section className={styles.hero}>
                    <div className={styles.container}>
                        <span className={styles.badge}>📄 {t('badge')}</span>
                        <h1 className={styles.title}>
                            {t('title')} <span className={styles.highlight}>{t('highlight')}</span>
                        </h1>
                        <p className={styles.subtitle}>
                            {t('subtitle')}
                        </p>
                    </div>
                </section>

                <section className={styles.pagesSection}>
                    <div className={styles.container}>
                        <div className={styles.pagesGrid}>
                            {allPages.map((page) => (
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
