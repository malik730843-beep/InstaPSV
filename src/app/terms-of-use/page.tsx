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
                        <div
                            className={styles.card}
                            dangerouslySetInnerHTML={{
                                __html: page?.content || `
                                    <p>Last updated: June 25, 2026</p>
                                    <p>Welcome to <strong>InstaPSV</strong> (“we,” “our,” or “us”). By accessing or using our website, tools, and services (collectively, the “Service”) located at <a href="https://instapsv.com">https://instapsv.com</a>, you agree to comply with and be bound by the following Terms of Use. Please read these terms carefully before using our Service.</p>

                                    <h3>1. Acceptance of Terms</h3>
                                    <p>By using the Service, you represent that you have read, understood, and agreed to these Terms of Use and our Privacy Policy. If you do not agree to these terms, you must immediately discontinue using our Service.</p>

                                    <h3>2. Permitted Use</h3>
                                    <p>InstaPSV provides a web-based interface for viewing public Instagram profiles, stories, highlights, hashtags, and downloader utilities. You agree to use the Service only for personal, non-commercial, and informational purposes. You are strictly prohibited from using the Service to:</p>
                                    <ul>
                                        <li>Harass, stalk, or violate the privacy of any individual.</li>
                                        <li>Download and redistribute copyrighted content without authorization from the intellectual property owner.</li>
                                        <li>Scrape or extract data in bulk for commercial databases or resale.</li>
                                        <li>Interfere with or disrupt the operation of the Service, its servers, or networks.</li>
                                    </ul>

                                    <h3>3. No Affiliation with Instagram/Meta</h3>
                                    <p>InstaPSV is an independent, third-party utility. <strong>We are NOT affiliated with, authorized, associated, endorsed by, or in any way officially connected with Instagram, Meta Platforms, Inc., or any of their subsidiaries or affiliates.</strong> All product names, logos, brands, and trademarks are the property of their respective owners.</p>

                                    <h3>4. Intellectual Property & Copyright (DMCA)</h3>
                                    <p>We respect the intellectual property rights of others. InstaPSV does not host or store any media (images, videos, or audios) on its servers. All displayed content is streamed in real-time directly from Instagram's public CDN servers. If you believe your copyrighted content is being accessed or used inappropriately through our Service, you may submit a copyright notification via our Contact page, and we will take appropriate actions to block the query for the specified content.</p>

                                    <h3>5. Disclaimer of Warranties</h3>
                                    <p>The Service is provided on an “as is” and “as available” basis without warranties of any kind, either express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, or non-infringement. We do not warrant that the Service will be uninterrupted, error-free, or completely secure.</p>

                                    <h3>6. Limitation of Liability</h3>
                                    <p>To the maximum extent permitted by law, InstaPSV, its owners, and operators shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, arising out of your access to or use of, or inability to access or use, the Service.</p>

                                    <h3>7. Governing Law</h3>
                                    <p>These Terms of Use shall be governed by and construed in accordance with the laws of the jurisdiction in which the operators of InstaPSV reside, without regard to its conflict of law provisions.</p>

                                    <h3>8. Modifications to Terms</h3>
                                    <p>We reserve the right to modify or replace these Terms of Use at any time. The most current version will always be posted on this page. Your continued use of the Service after any changes constitutes acceptance of the new Terms of Use.</p>
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
