import { createClient } from '@supabase/supabase-js';
import styles from './page.module.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ContactForm from '@/components/ContactForm';
import { getTranslations } from 'next-intl/server';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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
    const page = await getPage('contact');
    const t = await getTranslations('contact');
    return {
        title: page?.meta_title || `${t('title')} ${t('highlight')} - InstaPSV`,
        description: page?.meta_description || t('subtitle'),
    };
}

export default async function ContactPage() {
    const page = await getPage('contact');
    const t = await getTranslations('contact');
    const commonT = await getTranslations('common');

    return (
        <>
            <Header alwaysDark />
            <main className={styles.main}>
                <section className={styles.hero}>
                    <div className={styles.container}>
                        <span className={styles.badge}>📬 {t('badge')}</span>
                        <h1 className={styles.title}>
                            {t('title')} <span className={styles.highlight}>{t('highlight')}</span>
                        </h1>
                        <p className={styles.subtitle}>
                            {t('subtitle')}
                        </p>
                    </div>
                </section>

                <section className={styles.content}>
                    <div className={styles.container}>
                        {page ? (
                            <div
                                className={styles.contactContent}
                                dangerouslySetInnerHTML={{ __html: page.content }}
                            />
                        ) : (
                            <div className={styles.contactContent}>
                                <p>{commonT('contentNotFound')}</p>
                            </div>
                        )}

                        <div className={styles.formCard}>
                            <h3>{t('sendMessage')}</h3>
                            <ContactForm />
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
