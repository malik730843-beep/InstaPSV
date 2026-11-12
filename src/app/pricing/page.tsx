import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import styles from './pricing.module.css';
import Link from 'next/link';
import type { Metadata } from 'next';
import PricingCards from '@/components/pricing/PricingCards';
import PricingFaq from '@/components/pricing/PricingFaq';

export const metadata: Metadata = {
    alternates: {
        canonical: '/pricing',
    },
    title: 'Pricing — InstaPSV | Anonymous Instagram Viewer Plans',
    description: 'Compare free search credits and the Pro plan. Check provider coverage, download access and manual payment activation before purchasing.',
    keywords: 'InstaPSV pricing, anonymous Instagram viewer plans, Instagram story viewer credits',
    openGraph: {
        title: 'Pricing — InstaPSV',
        description: 'Compare search credits, Pro access, coverage limits and manual activation.',
        type: 'website',
    },
};

const plans = [
    {
        name: 'Free',
        price: '$0',
        period: 'forever',
        credits: '3 Profile Searches',
        creditsDetail: '6 initial credits; 2 per successful search',
        description: 'Try it out — see how it works.',
        features: [
            'Supported public Business and Creator accounts',
            'Posts & Reels access',
            'View media at the supplied quality',
            '3 initial searches (6 credits)',
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
        creditsDetail: 'No monthly credit deduction; rate limits still apply',
        description: 'Best value for power users.',
        features: [
            'Supported public Business and Creator accounts',
            'Stories when the provider supplies them',
            'Download available media files',
            'View media at the supplied quality',
            'Unlimited searches',
            'No credit limits',
            'Provider availability limits apply',
            'Email support; no guaranteed response time',
        ],
        cta: 'Upgrade to Pro',
        ctaHref: '/checkout?plan=pro',
        highlighted: true,
        badge: 'Best Value',
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
                                Choose access <span className={styles.gradientText}>with clear limits</span>
                            </h1>
                            <p className={styles.subtitle}>
                                Start with 6 credits, enough for 3 successful profile searches. Pro enables downloads and eligible story access; provider coverage and rate limits still apply.
                            </p>
                        </div>

                        {/* Pricing Cards */}
                        <aside style={{ maxWidth: 820, margin: '0 auto 32px', padding: 24, border: '1px solid #555', borderRadius: 16, lineHeight: 1.7 }}>
                            <h2>Before buying Pro</h2>
                            <p>Full highlight collection retrieval is not implemented. Story data is not guaranteed for a particular account. Check a supported profile and <Link href="/contact">ask about the feature you need</Link> before payment. Downloads save the source file; there is no guaranteed resolution.</p>
                            <p>Payments are reviewed manually. Access begins after approval, rather than immediately after submitting a transaction ID.</p>
                        </aside>
                        <PricingCards plans={plans} />

                        {/* Trust row */}
                        <div className={styles.trustRow}>
                            <div className={styles.trustItem}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                                <span>No Instagram credentials</span>
                            </div>
                            <div className={styles.trustItem}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                                <span>Manual payment review</span>
                            </div>
                            <div className={styles.trustItem}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                                <span>Manual renewal</span>
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
                                Try the initial search credits before choosing a paid plan. Check coverage before paying for a particular feature.
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
