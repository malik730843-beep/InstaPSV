'use client';

import { Suspense } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import Link from 'next/link';
import ParticleBackground from '@/components/ui/ParticleBackground';
import styles from './checkout.module.css';

function CheckoutContent() {
    return (
        <div className={styles.checkoutContainer} style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className={styles.successCard} style={{ maxWidth: '480px', textAlign: 'center' }}>
                <Sparkles size={64} color="#ff0080" style={{ marginBottom: '1.5rem', opacity: 0.8 }} />
                <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem', background: 'linear-gradient(135deg, #fff, #d1d5db)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Coming Soon
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                    We're currently perfecting our automated payment system to provide you with the best experience. 
                    <br/><br/>
                    Check back soon to unlock unlimited anonymous browsing!
                </p>
                <Link href="/pricing" className={styles.doneBtn} style={{ background: 'linear-gradient(135deg, #ff0080, #7928ca)', border: 'none', padding: '0.8rem 2rem' }}>
                    Back to Pricing
                </Link>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <div className={styles.checkoutPage}>
            <ParticleBackground />
            <Suspense fallback={<div className={styles.loadingWrapper}><Loader2 className={styles.spinner} /><p>Loading Checkout...</p></div>}>
                <CheckoutContent />
            </Suspense>
        </div>
    );
}
