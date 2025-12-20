import styles from './page.module.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata = {
    title: 'Privacy Policy - InstaPSV',
    description: 'Read our privacy policy to understand how InstaPSV protects your data and privacy.',
};

export default function PrivacyPage() {
    return (
        <>
            <Header />
            <main className={styles.main}>
                <section className={styles.hero}>
                    <div className={styles.container}>
                        <span className={styles.badge}>🔒 Legal</span>
                        <h1 className={styles.title}>
                            Privacy <span className={styles.highlight}>Policy</span>
                        </h1>
                        <p className={styles.subtitle}>
                            Last updated: January 1, 2024
                        </p>
                    </div>
                </section>

                <section className={styles.content}>
                    <div className={styles.container}>
                        <div className={styles.legalContent}>
                            <h2>1. Introduction</h2>
                            <p>
                                Welcome to InstaPSV (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your privacy
                                and personal information. This Privacy Policy explains how we collect, use, and safeguard
                                your information when you use our website and services.
                            </p>

                            <h2>2. Information We Collect</h2>
                            <p>
                                <strong>Information You Provide:</strong> We do not require you to create an account or
                                provide personal information to use our services. If you contact us, we may collect your
                                email address and any information you include in your message.
                            </p>
                            <p>
                                <strong>Automatically Collected Information:</strong> When you visit our website, we may
                                automatically collect certain information, including:
                            </p>
                            <ul>
                                <li>IP address (anonymized for analytics)</li>
                                <li>Browser type and version</li>
                                <li>Device type</li>
                                <li>Pages visited and time spent</li>
                                <li>Referring website</li>
                            </ul>

                            <h2>3. How We Use Your Information</h2>
                            <p>We use the collected information to:</p>
                            <ul>
                                <li>Provide and maintain our services</li>
                                <li>Improve user experience</li>
                                <li>Analyze usage patterns</li>
                                <li>Respond to inquiries</li>
                                <li>Detect and prevent fraud</li>
                            </ul>

                            <h2>4. Cookies and Tracking</h2>
                            <p>
                                We use cookies to enhance your experience. These include:
                            </p>
                            <ul>
                                <li><strong>Essential Cookies:</strong> Required for the website to function</li>
                                <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</li>
                                <li><strong>Preference Cookies:</strong> Remember your language and display preferences</li>
                            </ul>
                            <p>
                                You can disable cookies in your browser settings, but this may affect site functionality.
                            </p>

                            <h2>5. Data Sharing</h2>
                            <p>
                                We do not sell, trade, or rent your personal information. We may share data with:
                            </p>
                            <ul>
                                <li>Service providers who assist in operating our website</li>
                                <li>Law enforcement when required by law</li>
                                <li>Third parties with your explicit consent</li>
                            </ul>

                            <h2>6. Data Security</h2>
                            <p>
                                We implement appropriate security measures to protect your information, including
                                encryption, secure servers, and regular security audits. However, no method of
                                transmission over the Internet is 100% secure.
                            </p>

                            <h2>7. Your Rights</h2>
                            <p>You have the right to:</p>
                            <ul>
                                <li>Access your personal data</li>
                                <li>Request correction of inaccurate data</li>
                                <li>Request deletion of your data</li>
                                <li>Opt-out of marketing communications</li>
                                <li>Withdraw consent at any time</li>
                            </ul>

                            <h2>8. Children&apos;s Privacy</h2>
                            <p>
                                Our services are not intended for children under 13. We do not knowingly collect
                                personal information from children. If you believe a child has provided us with
                                personal information, please contact us.
                            </p>

                            <h2>9. Changes to This Policy</h2>
                            <p>
                                We may update this Privacy Policy periodically. We will notify you of significant
                                changes by posting the new policy on this page with an updated date.
                            </p>

                            <h2>10. Contact Us</h2>
                            <p>
                                If you have questions about this Privacy Policy, please contact us at:
                            </p>
                            <p>
                                <strong>Email:</strong> privacy@instapsv.com<br />
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
