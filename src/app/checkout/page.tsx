import { Suspense } from 'react';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CheckoutContent from './CheckoutContent';
import styles from './checkout.module.css';

// ==========================================
// SEO METADATA & CANONICAL PERMALINK CONFIG
// ==========================================
export const metadata: Metadata = {
    alternates: {
        canonical: '/checkout', // Defines the canonical permalink for SEO
    },
    robots: {
        index: false,
        follow: false,
    },
    title: 'Subscribe to Pro Plan — InstaPSV',
    description: 'Complete your upgrade to InstaPSV Pro. Get unlimited anonymous searches, view stories, highlights, and download media in HD quality.',
    keywords: 'InstaPSV checkout, buy anonymous instagram viewer, upgrade instapsv',
    openGraph: {
        title: 'Subscribe to Pro Plan — InstaPSV',
        description: 'Complete your upgrade to InstaPSV Pro. Get unlimited anonymous searches.',
        type: 'website',
    },
};

// ==========================================
// SERVER-SIDE CHECKOUT WRAPPER COMPONENT
// ==========================================
export default function CheckoutPage() {
    return (
        <div className={styles.container}>
            {/* Navigation Header */}
            <Header alwaysDark />
            
            <main className={styles.main}>
                <div className={styles.checkoutContainer}>
                    {/* Header back-link and text headers */}
                    <div className={styles.checkoutHeader}>
                        <Link href="/pricing" className={styles.backLink}>
                            <ArrowLeft size={16} /> Back to Pricing
                        </Link>
                        <h1 className={styles.title}>Complete Your Upgrade</h1>
                        <p className={styles.subtitle}>Unlock unlimited anonymous searches and premium story downloading features instantly.</p>
                    </div>

                    {/* 
                      Suspense Boundary wraps the client component because it calls useSearchParams().
                      This prevents Next.js from throwing server-side compilation warnings.
                    */}
                    <Suspense fallback={
                        <div className={styles.loadingWrapper}>
                            <Loader2 className={styles.spinner} />
                            <p>Loading Checkout...</p>
                        </div>
                    }>
                        <CheckoutContent />
                    </Suspense>
                </div>
            </main>
            
            {/* Website Footer */}
            <Footer />
        </div>
    );
}
