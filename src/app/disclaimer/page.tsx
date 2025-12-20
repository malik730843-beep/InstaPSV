import styles from './page.module.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata = {
    title: 'Disclaimer - InstaPSV',
    description: 'Read our disclaimer regarding the use of InstaPSV services.',
};

export default function DisclaimerPage() {
    return (
        <>
            <Header />
            <main className={styles.main}>
                <section className={styles.hero}>
                    <div className={styles.container}>
                        <span className={styles.badge}>⚠️ Legal</span>
                        <h1 className={styles.title}>
                            <span className={styles.highlight}>Disclaimer</span>
                        </h1>
                        <p className={styles.subtitle}>
                            Last updated: January 1, 2024
                        </p>
                    </div>
                </section>

                <section className={styles.content}>
                    <div className={styles.container}>
                        <div className={styles.legalContent}>
                            <h2>General Disclaimer</h2>
                            <p>
                                InstaPSV is an independent service that allows users to view publicly available
                                Instagram content. We are not affiliated with, endorsed by, or in any way officially
                                connected with Instagram, Meta Platforms, Inc., or any of its subsidiaries or affiliates.
                            </p>

                            <h2>No Affiliation with Instagram</h2>
                            <p>
                                The official Instagram website can be found at instagram.com. The name &quot;Instagram&quot;
                                as well as related names, marks, emblems, and images are registered trademarks of
                                Meta Platforms, Inc.
                            </p>

                            <h2>Use of Service</h2>
                            <p>
                                InstaPSV provides access only to publicly available content on Instagram. We do not:
                            </p>
                            <ul>
                                <li>Access private accounts or protected content</li>
                                <li>Bypass any security measures or login requirements</li>
                                <li>Store or cache Instagram content on our servers</li>
                                <li>Collect or sell user data</li>
                            </ul>

                            <h2>User Responsibility</h2>
                            <p>
                                Users are solely responsible for how they use content accessed through our service.
                                By using InstaPSV, you agree to:
                            </p>
                            <ul>
                                <li>Respect copyright and intellectual property rights</li>
                                <li>Not use the service for harassment, stalking, or illegal activities</li>
                                <li>Comply with Instagram&apos;s Terms of Service</li>
                                <li>Give appropriate credit when sharing downloaded content</li>
                            </ul>

                            <h2>No Warranties</h2>
                            <p>
                                The information and services provided by InstaPSV are on an &quot;as is&quot; basis without
                                any warranty. We make no representations or warranties of any kind, express or implied,
                                regarding the accuracy, reliability, or availability of the service.
                            </p>

                            <h2>Limitation of Liability</h2>
                            <p>
                                In no event shall InstaPSV, its owners, operators, or affiliates be liable for any
                                direct, indirect, incidental, special, or consequential damages arising from the use
                                of our service.
                            </p>

                            <h2>Changes to Content Availability</h2>
                            <p>
                                Instagram may change its platform, privacy settings, or terms of service at any time,
                                which may affect the availability or functionality of our service. We are not
                                responsible for any changes made by Instagram.
                            </p>

                            <h2>Contact</h2>
                            <p>
                                If you have any questions about this Disclaimer, please contact us at:
                            </p>
                            <p>
                                <strong>Email:</strong> legal@instapsv.com
                            </p>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
