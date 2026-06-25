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
                        <div
                            className={styles.card}
                            dangerouslySetInnerHTML={{
                                __html: page?.content || `
                                    <p>Last updated: June 25, 2026</p>
                                    <p>The information, tools, and services provided by <strong>InstaPSV</strong> (accessible at <a href="https://instapsv.com">https://instapsv.com</a>) are offered on an "as is" and "as available" basis for general informational, educational, and personal use only.</p>

                                    <h3>1. No Affiliation with Instagram or Meta Platforms, Inc.</h3>
                                    <p>InstaPSV is an independent, third-party service provider. <strong>InstaPSV is NOT affiliated with, sponsored by, endorsed by, or in any way associated with Instagram, Meta Platforms, Inc.</strong>, or any of their partners. Instagram is a registered trademark of Meta Platforms, Inc. We use names, logos, and descriptions on this website solely for descriptive and identification purposes to explain the utility of our tools.</p>

                                    <h3>2. Content Ownership and Streaming Policy</h3>
                                    <p>InstaPSV operates purely as a proxy viewer. <strong>We do NOT store, host, or archive any media files (videos, photos, stories, highlights) on our servers.</strong> All content viewed through our tools is streamed directly from Instagram’s public CDN (Content Delivery Network). All rights, titles, and ownership of the displayed content belong to the respective content creators or intellectual property owners. Users are advised to respect the rights of content creators and refrain from downloading or reusing content without the owner's explicit permission.</p>

                                    <h3>3. Account Integrity and Privacy Boundaries</h3>
                                    <p>InstaPSV does not require or request your Instagram login credentials, passwords, or personal information. <strong>Our tools can ONLY access and display content from profiles that are configured as "Public" by their owners.</strong> We do not circumvent Instagram's privacy settings, and we cannot bypass private profiles. We respect the privacy boundaries set by Instagram users and the platform.</p>

                                    <h3>4. Accuracy of Information</h3>
                                    <p>While we make reasonable efforts to maintain the functionality of our website, the tools are dependent on external social media architectures. We make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the tools, information, or related graphics contained on the website for any purpose.</p>

                                    <h3>5. Limitation of Liability</h3>
                                    <p>In no event shall InstaPSV, its operators, or affiliates be liable for any loss or damage including without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits arising out of, or in connection with, the use of this website. Your use of our tools is entirely at your own risk and discretion.</p>
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
