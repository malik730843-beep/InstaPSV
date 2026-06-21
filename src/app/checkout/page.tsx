import { Suspense } from 'react';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CheckoutContent from './CheckoutContent';
import styles from './checkout.module.css';

export const metadata: Metadata = {
    alternates: {
        canonical: '/checkout',
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

export default function CheckoutPage() {
    return (
        <div className={styles.container}>
            <Header alwaysDark />
            <main className={styles.main}>
                <div className={styles.checkoutContainer}>
                    <div className={styles.checkoutHeader}>
                        <Link href="/pricing" className={styles.backLink}>
                            <ArrowLeft size={16} /> Back to Pricing
                        </Link>
                        <h1 className={styles.title}>Complete Your Upgrade</h1>
                        <p className={styles.subtitle}>Unlock unlimited anonymous searches and premium story downloading features instantly.</p>
                    </div>

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
            <Footer />
        </div>
    );
}
