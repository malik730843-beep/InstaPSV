import { createClient } from '@supabase/supabase-js';
import styles from './page.module.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getTranslations } from 'next-intl/server';

// Initialize Supabase Client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getPage(slug: string) {
    const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

    if (error) return null;
    return data;
}

export async function generateMetadata() {
    const page = await getPage('about');
    const t = await getTranslations('nav');
    return {
        title: page?.meta_title || `${t('about')} - InstaPSV`,
        description: page?.meta_description || 'Learn about InstaPSV, the free Instagram viewer tool.',
    };
}

export default async function AboutPage() {
    const page = await getPage('about');
    const heroT = await getTranslations('hero');
    const commonT = await getTranslations('common');
    const navT = await getTranslations('nav');

    return (
        <>
            <Header alwaysDark />
            <main className={styles.main}>
                {/* Hero Section */}
                <section className={styles.hero}>
                    <div className={styles.container}>
                        <span className={styles.badge}>👥 {navT('about')}</span>
                        <h1 className={styles.title}>
                            {(() => {
                                const titleText = page?.title || `About ${commonT('instagram')}`;
                                const parts = titleText.split(' ');
                                if (parts.length > 1) {
                                    const last = parts.pop();
                                    return <>{parts.join(' ')} <span className={styles.highlight}>{last}</span></>;
                                }
                                return <span className={styles.highlight}>{titleText}</span>;
                            })()}
                        </h1>
                        <p className={styles.subtitle}>
                            We&apos;re on a mission to make Instagram content accessible to everyone, anonymously and freely.
                        </p>
                    </div>
                </section>

                <section className={styles.content}>
                    <div className={styles.container}>
                        {page ? (
                            <div
                                className={styles.card}
                                dangerouslySetInnerHTML={{ __html: page.content }}
                            />
                        ) : (
                            <div className={styles.card}>
                                <p>{commonT('contentNotFound')}</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}

