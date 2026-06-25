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
    const page = await getPage('privacy-policy');
    return {
        title: page?.meta_title || 'Privacy Policy - InstaPSV',
        description: page?.meta_description || 'Read the InstaPSV Privacy Policy to understand how we collect, use, and protect your information.',
        alternates: {
            canonical: '/privacy-policy',
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function PrivacyPolicyPage() {
    const page = await getPage('privacy-policy');

    return (
        <>
            <Header alwaysDark />
            <main className={styles.main}>
                <section className={styles.hero}>
                    <div className={styles.container}>
                        <span className={styles.badge}>🔒 Legal</span>
                        <h1 className={styles.title}>
                            Privacy{' '}
                            <span className={styles.highlight}>Policy</span>
                        </h1>
                        <p className={styles.subtitle}>
                            {page?.excerpt || 'How we collect, use, and protect your information.'}
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
                                    <p>At <strong>InstaPSV</strong>, accessible from <a href="https://instapsv.com">https://instapsv.com</a>, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by InstaPSV and how we use it.</p>
                                    <p>If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.</p>

                                    <h3>Log Files</h3>
                                    <p>InstaPSV follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.</p>

                                    <h3>Google AdSense and DoubleClick DART Cookie</h3>
                                    <p>Google is one of the third-party vendors on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to our website and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL – <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">https://policies.google.com/technologies/ads</a></p>

                                    <h3>Advertising Partners Privacy Policies</h3>
                                    <p>You may consult this list to find the Privacy Policy for each of the advertising partners of InstaPSV.</p>
                                    <p>Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on InstaPSV, which are sent directly to users' browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.</p>
                                    <p>Note that InstaPSV has no access to or control over these cookies that are used by third-party advertisers.</p>

                                    <h3>Third Party Privacy Policies</h3>
                                    <p>InstaPSV's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.</p>
                                    <p>You can choose to disable cookies through your individual browser options. To know more detailed information about cookie management with specific web browsers, it can be found at the browsers' respective websites.</p>

                                    <h3>CCPA Privacy Rights (Do Not Sell My Personal Information)</h3>
                                    <p>Under the CCPA, among other rights, California consumers have the right to:</p>
                                    <ul>
                                        <li>Request that a business that collects a consumer's personal data disclose the categories and specific pieces of personal data that a business has collected about consumers.</li>
                                        <li>Request that a business delete any personal data about the consumer that a business has collected.</li>
                                        <li>Request that a business that sells a consumer's personal data, not sell the consumer's personal data.</li>
                                    </ul>
                                    <p>If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.</p>

                                    <h3>GDPR Data Protection Rights</h3>
                                    <p>We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:</p>
                                    <ul>
                                        <li><strong>The right to access</strong> – You have the right to request copies of your personal data. We may charge you a small fee for this service.</li>
                                        <li><strong>The right to rectification</strong> – You have the right to request that we correct any information you believe is inaccurate. You also have the right to request that we complete the information you believe is incomplete.</li>
                                        <li><strong>The right to erasure</strong> – You have the right to request that we erase your personal data, under certain conditions.</li>
                                        <li><strong>The right to restrict processing</strong> – You have the right to request that we restrict the processing of your personal data, under certain conditions.</li>
                                        <li><strong>The right to object to processing</strong> – You have the right to object to our processing of your personal data, under certain conditions.</li>
                                        <li><strong>The right to data portability</strong> – You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.</li>
                                    </ul>
                                    <p>If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.</p>

                                    <h3>Children's Information</h3>
                                    <p>Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.</p>
                                    <p>InstaPSV does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.</p>
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
