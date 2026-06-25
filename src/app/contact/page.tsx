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
        alternates: {
            canonical: '/contact',
        },
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
                        <div
                            className={styles.contactContent}
                            dangerouslySetInnerHTML={{
                                __html: page?.content || `
                                    <h2>Get in Touch</h2>
                                    <p>Have questions, feedback, technical suggestions, or advertising inquiries? The InstaPSV team is here to help! We strive to respond to all inquiries within 24–48 hours.</p>

                                    <h3>General Inquiries & Support</h3>
                                    <p>For help using our tools, reporting bugs, or recommending new features, please send us a message using the contact form below or reach out to our team via email at <a href="mailto:support@instapsv.com">support@instapsv.com</a>.</p>

                                    <h3>Copyright and DMCA Takedown Requests</h3>
                                    <p>If you are a copyright owner or an authorized agent thereof and believe that any content streamed through our tool infringes upon your copyright, you may submit a formal notification. Please include the specific username and URLs, and send your request to <a href="mailto:dmca@instapsv.com">dmca@instapsv.com</a>. We will process and respond to legitimate requests promptly by blacklisting the specific profile from being viewed or downloaded through our tool.</p>

                                    <h3>Ad Partnership Inquiries</h3>
                                    <p>If you are interested in advertising on InstaPSV or setting up sponsorship campaigns, please contact us with the subject line "Advertising" at <a href="mailto:ads@instapsv.com">ads@instapsv.com</a>.</p>
                                `
                            }}
                        />

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
