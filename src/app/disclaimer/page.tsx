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
    const page = await getPage('disclaimer');
    return {
        title: page?.meta_title || 'Disclaimer - InstaPSV',
        description: page?.meta_description || 'Read the InstaPSV Disclaimer regarding the use of our services and third-party content.',
        alternates: {
            canonical: '/disclaimer',
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function DisclaimerPage() {
    const page = await getPage('disclaimer');

    return (
        <>
            <Header alwaysDark />
            <main className={styles.main}>
                <section className={styles.hero}>
                    <div className={styles.container}>
                        <span className={styles.badge}>⚠️ Legal</span>
                        <h1 className={styles.title}>
                            Our{' '}
                            <span className={styles.highlight}>Disclaimer</span>
                        </h1>
                        <p className={styles.subtitle}>
                            {page?.excerpt || 'Important legal information about using InstaPSV.'}
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
                                <p>Disclaimer content is being updated. Please check back soon.</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
