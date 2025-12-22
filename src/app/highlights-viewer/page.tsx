import Link from 'next/link';
import styles from './page.module.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata = {
    title: 'Instagram Highlights Viewer - View & Download IG Highlights Anonymously | InstaPSV',
    description: 'View and download Instagram Highlights anonymously without an account. Watch saved story highlights from any public profile. Free, secure, no login required.',
    keywords: 'Instagram Highlights Viewer, IG Highlights Viewer, View Instagram Highlights Anonymously, Download Instagram Highlights, Anonymous Highlights Viewer',
};

export default function HighlightsViewerPage() {
    return (
        <>
            <Header />
            <main className={styles.main}>
                {/* Hero Section */}
                <section className={styles.hero}>
                    <div className={styles.container}>
                        <span className={styles.badge}>✨ New Feature</span>
                        <h1 className={styles.title}>
                            Instagram <span className={styles.highlight}>Highlights</span> Viewer
                        </h1>
                        <p className={styles.subtitle}>
                            View and download Instagram Highlights anonymously. Watch saved story collections from any public profile without an account.
                        </p>

                        {/* Search Form */}
                        <div className={styles.searchForm}>
                            <div className={styles.searchInputWrapper}>
                                <span className={styles.searchIcon}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="11" cy="11" r="8" />
                                        <path d="m21 21-4.35-4.35" />
                                    </svg>
                                </span>
                                <input
                                    type="text"
                                    placeholder="Enter Instagram username..."
                                    className={styles.searchInput}
                                    aria-label="Instagram username"
                                />
                                <button className={styles.searchButton}>
                                    View Highlights
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className={styles.features}>
                    <div className={styles.container}>
                        <h2 className={styles.sectionTitle}>
                            Why Use Our <span className={styles.highlight}>Highlights Viewer</span>?
                        </h2>
                        <div className={styles.featuresGrid}>
                            <div className={styles.featureCard}>
                                <div className={styles.featureIcon}>🔒</div>
                                <h3>100% Anonymous</h3>
                                <p>View highlights without the profile owner knowing. Your identity stays completely hidden.</p>
                            </div>
                            <div className={styles.featureCard}>
                                <div className={styles.featureIcon}>📥</div>
                                <h3>Download & Save</h3>
                                <p>Save highlight videos and photos to your device in original quality with one click.</p>
                            </div>
                            <div className={styles.featureCard}>
                                <div className={styles.featureIcon}>🚫</div>
                                <h3>No Account Needed</h3>
                                <p>Browse Instagram highlights without logging in or creating any account.</p>
                            </div>
                            <div className={styles.featureCard}>
                                <div className={styles.featureIcon}>⚡</div>
                                <h3>Fast & Reliable</h3>
                                <p>Instant access to all public highlights. No waiting, no delays.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className={styles.howItWorks}>
                    <div className={styles.container}>
                        <h2 className={styles.sectionTitle}>
                            How to View <span className={styles.highlight}>Instagram Highlights</span>
                        </h2>
                        <div className={styles.stepsGrid}>
                            <div className={styles.step}>
                                <div className={styles.stepNumber}>1</div>
                                <h3>Enter Username</h3>
                                <p>Type the Instagram username in the search bar above.</p>
                            </div>
                            <div className={styles.step}>
                                <div className={styles.stepNumber}>2</div>
                                <h3>Browse Highlights</h3>
                                <p>View all saved story highlights from the profile.</p>
                            </div>
                            <div className={styles.step}>
                                <div className={styles.stepNumber}>3</div>
                                <h3>Watch or Download</h3>
                                <p>View anonymously or save to your device.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className={styles.faqSection}>
                    <div className={styles.container}>
                        <h2 className={styles.sectionTitle}>
                            Frequently Asked <span className={styles.highlight}>Questions</span>
                        </h2>
                        <div className={styles.faqList}>
                            <div className={styles.faqItem}>
                                <h3>What are Instagram Highlights?</h3>
                                <p>Instagram Highlights are saved stories that appear on a user&apos;s profile below their bio. Unlike regular stories that disappear after 24 hours, highlights stay visible permanently until the user removes them.</p>
                            </div>
                            <div className={styles.faqItem}>
                                <h3>Can I view highlights from private accounts?</h3>
                                <p>No, our tool only works with public Instagram profiles. If an account is private, you won&apos;t be able to view their highlights without following them.</p>
                            </div>
                            <div className={styles.faqItem}>
                                <h3>Will the user know I viewed their highlights?</h3>
                                <p>No! When you use InstaPSV to view highlights, your activity is completely anonymous. The profile owner will not receive any notification or see you in their viewers list.</p>
                            </div>
                            <div className={styles.faqItem}>
                                <h3>Is it free to use?</h3>
                                <p>Yes, our Instagram Highlights Viewer is completely free to use with no hidden costs or premium features locked behind paywalls.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className={styles.cta}>
                    <div className={styles.container}>
                        <h2>Ready to View Instagram Highlights?</h2>
                        <p>Start browsing highlights anonymously now. No account required.</p>
                        <Link href="/" className={styles.ctaBtn}>
                            Try Story Viewer Too
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
