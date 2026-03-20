'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import LoginModal from '@/components/ui/LoginModal';
import styles from '@/app/pricing/pricing.module.css';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Plan {
    name: string;
    price: string;
    period: string;
    credits: string;
    creditsDetail: string;
    description: string;
    features: string[];
    cta: string;
    ctaHref: string;
    highlighted: boolean;
    badge: string | null;
}

interface PricingCardsProps {
    plans: Plan[];
}

export default function PricingCards({ plans }: PricingCardsProps) {
    const [showLogin, setShowLogin] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setIsLoggedIn(!!session);
        };
        checkAuth();
    }, []);

    const handleCtaClick = (e: React.MouseEvent) => {
        if (!isLoggedIn) {
            e.preventDefault();
            setShowLogin(true);
        }
    };

    return (
        <div className={styles.cardsGrid}>
            {plans.map((plan) => (
                <div
                    key={plan.name}
                    className={`${styles.card} ${plan.highlighted ? styles.cardHighlighted : ''}`}
                >
                    {plan.badge && (
                        <div className={styles.cardBadge}>{plan.badge}</div>
                    )}
                    <div className={styles.cardHeader}>
                        <h3 className={styles.planName}>{plan.name}</h3>
                        <div className={styles.priceRow}>
                            <span className={styles.price}>{plan.price}</span>
                            <span className={styles.period}>{plan.period}</span>
                        </div>
                        <p className={styles.planDesc}>{plan.description}</p>
                    </div>

                    <div className={styles.creditsBox}>
                        <span className={styles.creditsValue}>{plan.credits}</span>
                        <span className={styles.creditsDetail}>{plan.creditsDetail}</span>
                    </div>

                    <ul className={styles.featureList}>
                        {plan.features.map((f, i) => (
                            <li key={i} className={styles.featureItem}>
                                <svg className={styles.checkIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                {f}
                            </li>
                        ))}
                    </ul>

                    <a
                        href={plan.ctaHref}
                        onClick={handleCtaClick}
                        className={`${styles.ctaBtn} ${plan.highlighted ? styles.ctaPrimary : styles.ctaSecondary}`}
                    >
                        {plan.cta}
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </a>
                </div>
            ))}
            <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
        </div>
    );
}
