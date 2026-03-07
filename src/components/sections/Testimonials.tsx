'use client';

import { useTranslations } from 'next-intl';
import styles from './Testimonials.module.css';
import dynamic from 'next/dynamic';

const TestimonialsCarousel = dynamic(() => import('./TestimonialsCarousel'), {
    ssr: false,
});

export default function Testimonials() {
    const t = useTranslations('testimonials');
    const testimonialItems = t.raw('items') as Array<{
        id: number;
        name: string;
        handle: string;
        avatar: string;
        rating: number;
        text: string;
        role: string;
    }>;

    return (
        <section className={styles.testimonials}>
            <div className={styles.container}>
                {/* Section Header */}
                <div className={styles.header}>
                    <span className={styles.badge}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        {t('badge')}
                    </span>
                    <h2 className={styles.title}>
                        {t('titleStart')} <span className={styles.highlight}>{t('titleHighlight')}</span> {t('titleEnd')}
                    </h2>
                    <p className={styles.subtitle}>
                        {t('subtitle')}
                    </p>
                </div>

                {/* Carousel */}
                <TestimonialsCarousel testimonials={testimonialItems} />
            </div>
        </section>
    );
}
