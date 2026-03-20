import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import styles from './pricing.module.css';
import Link from 'next/link';
import type { Metadata } from 'next';
import PricingCards from '@/components/pricing/PricingCards';
import PricingFaq from '@/components/pricing/PricingFaq';

export const metadata: Metadata = {
    title: 'Pricing — InstaPSV | Anonymous Instagram Viewer Plans',
    description: 'Choose a plan to view Instagram profiles, stories, reels, and highlights anonymously. Start free with 5 credits or go unlimited with our Monthly plan.',
    keywords: 'InstaPSV pricing, anonymous Instagram viewer plans, Instagram story viewer credits',
    openGraph: {
        title: 'Pricing — InstaPSV',
        description: 'Start free. Upgrade for more anonymous Instagram views.',
        type: 'website',
    },
};

const plans = [
    {
        name: 'Free',
        price: '$0',
        period: 'forever',
        credits: '1 Profile Search',
        creditsDetail: 'Full access to posts only',
        description: 'Try it out — see how it works.',
        features: [
            'View public profiles anonymously',
            'Posts access only',
            'HD media viewing',
            '1 profile search included',
            'No account required',
        ],
        cta: 'Start Free',
        ctaHref: '/#search',
        highlighted: false,
        badge: null,
    },
    {
        name: 'Pro',
        price: '$5',
        period: '/month',
        credits: 'Unlimited',
        creditsDetail: 'No limits — search as much as you want',
        description: 'Best value for power users.',
        features: [
            'View public profiles anonymously',
            'Stories, Reels & Highlights',
            'HD media viewing',
            'Unlimited searches',
            'No credit limits',
            'Fastest search priority',
            'Priority email support',
        ],
        cta: 'Coming Soon',
        ctaHref: '#',
        highlighted: true,
        badge: 'Coming Soon',
    },
];


export default async function PricingPage() {
    return (
        <>
            <Header alwaysDark />
            <main>
                <section className={styles.pricingHero}>
                    {/* Background orbs */}
                    <div className={styles.orb1} />
                    <div className={styles.orb2} />
                    <div className={styles.orb3} />

                    <div className={styles.container}>
                        <div className={styles.heroContent}>
                            <span className={styles.badge}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z" />
                                </svg>
                                Simple Pricing
                            </span>
                            <h1 className={styles.title}>
                                Browse Instagram <span className={styles.gradientText}>Without Limits</span>
                            </h1>
                            <p className={styles.subtitle}>
                                Start free with 1 profile search. Upgrade for reels, stories and highlights.
                            </p>
                        </div>

                        {/* Pricing Cards */}
                        <PricingCards plans={plans} />

                        {/* Trust row */}
                        <div className={styles.trustRow}>
                            <div className={styles.trustItem}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                                <span>100% Anonymous</span>
                            </div>
                            <div className={styles.trustItem}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                                <span>Instant Activation</span>
                            </div>
                            <div className={styles.trustItem}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                                <span>Cancel Anytime</span>
                            </div>
                        </div>

                        {/* FAQ Section */}
                        <PricingFaq />

                        {/* Bottom CTA */}
                        <div className={styles.bottomCta}>
                            <h2 className={styles.bottomCtaTitle}>
                                Ready to browse Instagram <span className={styles.gradientText}>privately</span>?
                            </h2>
                            <p className={styles.bottomCtaDesc}>
                                Start with 1 free profile search — no signup needed. Upgrade anytime.
                            </p>
                            <Link 
                                href="/#search" 
                                className={styles.bottomCtaBtn}
                            >
                                Start Searching Now
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
