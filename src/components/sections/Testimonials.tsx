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
                    <span className={styles.badge}>⭐ {t('badge')}</span>
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
