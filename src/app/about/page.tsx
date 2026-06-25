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
        alternates: {
            canonical: '/about',
        },
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
                        <div
                            className={styles.card}
                            dangerouslySetInnerHTML={{
                                __html: page?.content || `
                                    <p>Welcome to <strong>InstaPSV</strong>, a leading web-based utility designed to provide clean, fast, and completely anonymous access to public Instagram profiles, stories, highlights, and posts. We believe that public information on the web should be easily accessible without technical hurdles, user tracking, or the necessity of creating personal accounts.</p>

                                    <h3>Our Mission</h3>
                                    <p>At InstaPSV, our mission is to empower users with tools that respect their privacy. Social media platforms often restrict the viewing of public information behind login walls or track user viewing habits. InstaPSV provides a transparent, secure, and private way to browse public Instagram content. Whether you are conducting marketing research, analyzing public trends, or simply viewing a public profile without leaving a footprint, InstaPSV is built for you.</p>

                                    <h3>Our Core Principles</h3>
                                    <ul>
                                        <li><strong>Privacy First:</strong> We do not track your search history, we do not require any login credentials, and we never collect personal identifiable information (PII) during your usage of our tools.</li>
                                        <li><strong>Technical Transparency:</strong> InstaPSV is a viewer utility. We do not host, store, or cache Instagram media. When you query a public username, our tool streams the content directly from public APIs, ensuring real-time results without unauthorized duplication of media.</li>
                                        <li><strong>Ease of Use:</strong> No installations, no browser extensions, and no subscription fees. Just paste a public Instagram username or link and get instant access.</li>
                                    </ul>

                                    <h3>How InstaPSV Works</h3>
                                    <p>Our system uses advanced proxy and streaming technology to retrieve public data in real-time. When you use any of our tools (such as the Anonymous Instagram Viewer or Highlights Downloader), our servers query the public availability of that content and display it on our web interface. Since the request is mediated by InstaPSV, your profile remains invisible to the content creator.</p>

                                    <h3>E-E-A-T and Compliance</h3>
                                    <p>InstaPSV is managed by a team of software developers and web enthusiasts dedicated to building privacy-respecting tools. We strictly adhere to public API policies, fair use standards, and intellectual property guidelines. We do not support or facilitate access to private profiles, and we respect copyright owners' rights. If you have any copyright inquiries or technical questions, please reach out via our Contact page.</p>
                                `
                            }}
                        />
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}

