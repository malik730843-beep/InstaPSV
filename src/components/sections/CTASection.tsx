import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import styles from './CTASection.module.css';

export default async function CTASection() {
    const t = await getTranslations('cta');

    return (
        <section className={styles.cta}>
            <div className={styles.container}>
                {/* Background Elements */}
                <div className={styles.bgElements}>
                    <div className={styles.orb1} />
                    <div className={styles.orb2} />
                    <div className={styles.grid} />
                </div>

                {/* Content */}
                <div className={styles.content}>
                    <h2 className={styles.title}>
                        {t('titleStart')} <span className={styles.highlight}>{t('titleHighlight')}</span> {t('titleEnd')}
                    </h2>
                    <p className={styles.description}>
                        {t('description')}
                    </p>

                    <div className={styles.actions}>
                        <Link href="/#search" className={styles.primaryBtn}>
                            {t('primaryBtn')}
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </Link>
                        <Link href="/features" className={styles.secondaryBtn}>
                            {t('secondaryBtn')}
                        </Link>
                    </div>

                    {/* Trust Badges */}
                    <div className={styles.trustBadges}>
                        <div className={styles.badge}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            </svg>
                            <span>{t('badges.secure')}</span>
                        </div>
                        <div className={styles.badge}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                <path d="M2 17l10 5 10-5" />
                                <path d="M2 12l10 5 10-5" />
                            </svg>
                            <span>{t('badges.noLogin')}</span>
                        </div>
                        <div className={styles.badge}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 6v6l4 2" />
                            </svg>
                            <span>{t('badges.instant')}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
