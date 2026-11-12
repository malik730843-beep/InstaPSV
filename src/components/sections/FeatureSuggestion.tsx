import styles from './FeatureSuggestion.module.css';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export default async function FeatureSuggestion() {
    const t = await getTranslations('featureSuggestion');

    return (
        <section className={styles.featureSuggestion} id="feedback">
            <div className={styles.container}>
                {/* Background Elements */}
                <div className={styles.bgElements}>
                    <div className={styles.orb1} />
                    <div className={styles.orb2} />
                </div>

                {/* Content */}
                <div className={styles.stealthContent}>
                    <div className={styles.icon}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                        </svg>
                    </div>
                    <h2 className={styles.stealthTitle}>
                        {t('feedbackTitle')}
                    </h2>
                    <p className={styles.stealthDescription}>
                        {t('feedbackDescription')}
                    </p>

                    <Link href="/contact" className={styles.gradientButton}>
                        {t('feedbackCta')}
                    </Link>
                </div>
            </div>
        </section>
    );
}
