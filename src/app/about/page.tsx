import styles from './page.module.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata = {
    title: 'About Us - InstaPSV',
    description: 'Learn about InstaPSV, the free Instagram viewer tool. Our mission, team, and commitment to privacy.',
};

export default function AboutPage() {
    return (
        <>
            <Header />
            <main className={styles.main}>
                <section className={styles.hero}>
                    <div className={styles.container}>
                        <span className={styles.badge}>👥 About Us</span>
                        <h1 className={styles.title}>
                            About <span className={styles.highlight}>InstaPSV</span>
                        </h1>
                        <p className={styles.subtitle}>
                            We&apos;re on a mission to make Instagram content accessible to everyone, anonymously and freely.
                        </p>
                    </div>
                </section>

                <section className={styles.content}>
                    <div className={styles.container}>
                        <div className={styles.card}>
                            <h2>Our Story</h2>
                            <p>
                                InstaPSV was founded in 2023 with a simple idea: make Instagram content accessible to everyone
                                without requiring an account or login. We noticed that many people wanted to view Instagram
                                profiles, stories, and posts anonymously for various legitimate reasons - from market research
                                to simply checking out content without the social pressure of being tracked.
                            </p>
                            <p>
                                Today, InstaPSV serves millions of users worldwide who trust us to provide fast, reliable,
                                and completely anonymous access to public Instagram content.
                            </p>
                        </div>

                        <div className={styles.card}>
                            <h2>Our Mission</h2>
                            <p>
                                Our mission is to democratize access to public social media content while respecting user
                                privacy. We believe that publicly shared content should be viewable without requiring
                                account creation or tracking.
                            </p>
                        </div>

                        <div className={styles.statsGrid}>
                            <div className={styles.statCard}>
                                <span className={styles.statNumber}>10M+</span>
                                <span className={styles.statLabel}>Monthly Users</span>
                            </div>
                            <div className={styles.statCard}>
                                <span className={styles.statNumber}>50M+</span>
                                <span className={styles.statLabel}>Profiles Viewed</span>
                            </div>
                            <div className={styles.statCard}>
                                <span className={styles.statNumber}>100%</span>
                                <span className={styles.statLabel}>Anonymous</span>
                            </div>
                            <div className={styles.statCard}>
                                <span className={styles.statNumber}>0</span>
                                <span className={styles.statLabel}>Login Required</span>
                            </div>
                        </div>

                        <div className={styles.card}>
                            <h2>What We Offer</h2>
                            <ul className={styles.featureList}>
                                <li>
                                    <strong>Story Viewer</strong> - Watch Instagram stories anonymously without leaving a trace
                                </li>
                                <li>
                                    <strong>Profile Viewer</strong> - Browse any public Instagram profile without an account
                                </li>
                                <li>
                                    <strong>Followers Parser</strong> - View complete follower and following lists
                                </li>
                                <li>
                                    <strong>Content Download</strong> - Save photos, videos, and stories to your device
                                </li>
                                <li>
                                    <strong>Reels Viewer</strong> - Watch and download Instagram Reels in HD quality
                                </li>
                            </ul>
                        </div>

                        <div className={styles.card}>
                            <h2>Our Values</h2>
                            <div className={styles.valuesGrid}>
                                <div className={styles.valueItem}>
                                    <span className={styles.valueIcon}>🔒</span>
                                    <h3>Privacy First</h3>
                                    <p>We never track our users or store personal data. Your browsing is 100% anonymous.</p>
                                </div>
                                <div className={styles.valueItem}>
                                    <span className={styles.valueIcon}>⚡</span>
                                    <h3>Speed</h3>
                                    <p>Fast loading times and instant results. No waiting, no delays.</p>
                                </div>
                                <div className={styles.valueItem}>
                                    <span className={styles.valueIcon}>🆓</span>
                                    <h3>Free Forever</h3>
                                    <p>InstaPSV is and always will be completely free to use.</p>
                                </div>
                                <div className={styles.valueItem}>
                                    <span className={styles.valueIcon}>🌍</span>
                                    <h3>Accessible</h3>
                                    <p>Available worldwide in multiple languages for everyone.</p>
                                </div>
                            </div>
                        </div>

                        <div className={styles.card}>
                            <h2>Contact Us</h2>
                            <p>
                                Have questions, feedback, or partnership inquiries? We&apos;d love to hear from you!
                            </p>
                            <p>
                                <strong>Email:</strong> support@instapsv.com<br />
                                <strong>Twitter:</strong> @InstaPSV<br />
                                <strong>Response Time:</strong> Within 24 hours
                            </p>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
