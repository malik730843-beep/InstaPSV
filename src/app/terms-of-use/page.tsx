import { createClient } from '@supabase/supabase-js';
import styles from '../about/page.module.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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
    const page = await getPage('terms-of-use');
    return {
        title: page?.meta_title || 'Terms of Use - InstaPSV',
        description: page?.meta_description || 'Read the InstaPSV Terms of Use to understand the rules and guidelines for using our platform.',
        alternates: {
            canonical: '/terms-of-use',
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function TermsOfUsePage() {
    const page = await getPage('terms-of-use');

    return (
        <>
            <Header alwaysDark />
            <main className={styles.main}>
                <section className={styles.hero}>
                    <div className={styles.container}>
                        <span className={styles.badge}>📋 Legal</span>
                        <h1 className={styles.title}>
                            Terms of{' '}
                            <span className={styles.highlight}>Use</span>
                        </h1>
                        <p className={styles.subtitle}>
                            {page?.excerpt || 'Rules and guidelines for using InstaPSV.'}
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
                                <p>Terms of Use content is being updated. Please check back soon.</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
