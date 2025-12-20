import styles from './page.module.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata = {
    title: 'Terms of Service - InstaPSV',
    description: 'Read our terms of service and usage guidelines for InstaPSV.',
};

export default function TermsPage() {
    return (
        <>
            <Header />
            <main className={styles.main}>
                <section className={styles.hero}>
                    <div className={styles.container}>
                        <span className={styles.badge}>📄 Legal</span>
                        <h1 className={styles.title}>
                            Terms of <span className={styles.highlight}>Service</span>
                        </h1>
                        <p className={styles.subtitle}>
                            Last updated: January 1, 2024
                        </p>
                    </div>
                </section>

                <section className={styles.content}>
                    <div className={styles.container}>
                        <div className={styles.legalContent}>
                            <h2>1. Acceptance of Terms</h2>
                            <p>
                                By accessing and using InstaPSV (&quot;Service&quot;), you agree to be bound by these Terms of
                                Service (&quot;Terms&quot;). If you do not agree to these Terms, please do not use our Service.
                            </p>

                            <h2>2. Description of Service</h2>
                            <p>
                                InstaPSV provides tools to view publicly available Instagram content anonymously. Our
                                services include viewing public profiles, stories, posts, and downloading publicly
                                shared content. We do not access private accounts or bypass any security measures.
                            </p>

                            <h2>3. User Responsibilities</h2>
                            <p>By using our Service, you agree to:</p>
                            <ul>
                                <li>Use the Service only for lawful purposes</li>
                                <li>Not use the Service to harass, stalk, or harm others</li>
                                <li>Respect copyright and intellectual property rights</li>
                                <li>Not attempt to bypass any security measures</li>
                                <li>Not use automated tools to scrape or overload our servers</li>
                                <li>Comply with Instagram&apos;s Terms of Service</li>
                            </ul>

                            <h2>4. Intellectual Property</h2>
                            <p>
                                The Service and its original content, features, and functionality are owned by
                                InstaPSV and are protected by international copyright, trademark, and other
                                intellectual property laws.
                            </p>
                            <p>
                                Content accessed through our Service belongs to the original creators. Users are
                                responsible for ensuring they have the right to download or share any content.
                            </p>

                            <h2>5. Disclaimer of Warranties</h2>
                            <p>
                                The Service is provided &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; without warranties of any kind.
                                We do not guarantee that:
                            </p>
                            <ul>
                                <li>The Service will be uninterrupted or error-free</li>
                                <li>All content will be available at all times</li>
                                <li>The Service will meet your specific requirements</li>
                            </ul>

                            <h2>6. Limitation of Liability</h2>
                            <p>
                                InstaPSV shall not be liable for any indirect, incidental, special, consequential,
                                or punitive damages resulting from your use of the Service. Our total liability
                                shall not exceed $100.
                            </p>

                            <h2>7. Third-Party Content</h2>
                            <p>
                                Our Service accesses content from Instagram. We are not affiliated with, endorsed
                                by, or connected to Instagram or Meta Platforms, Inc. All Instagram trademarks
                                belong to their respective owners.
                            </p>

                            <h2>8. Modifications to Service</h2>
                            <p>
                                We reserve the right to modify, suspend, or discontinue the Service at any time
                                without prior notice. We may also modify these Terms at any time. Continued use
                                of the Service after changes constitutes acceptance of the new Terms.
                            </p>

                            <h2>9. Termination</h2>
                            <p>
                                We may terminate or suspend your access to the Service immediately, without prior
                                notice, for conduct that we believe violates these Terms or is harmful to other
                                users, us, or third parties.
                            </p>

                            <h2>10. Governing Law</h2>
                            <p>
                                These Terms shall be governed by and construed in accordance with the laws of
                                the State of California, United States, without regard to its conflict of law
                                provisions.
                            </p>

                            <h2>11. Contact Information</h2>
                            <p>
                                For questions about these Terms, please contact us at:
                            </p>
                            <p>
                                <strong>Email:</strong> legal@instapsv.com<br />
                                <strong>Address:</strong> InstaPSV Inc., 123 Tech Street, San Francisco, CA 94102
                            </p>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
