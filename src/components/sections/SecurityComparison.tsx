import { getTranslations } from 'next-intl/server';
import styles from './SecurityComparison.module.css';
import Link from 'next/link';

export default async function SecurityComparison() {
    const t = await getTranslations('security');

    const tracksItems = t.raw('tracks.items') as Array<{ title: string; text: string }>;
    const protectsItems = t.raw('protects.items') as Array<{ title: string; text: string }>;

    const tracksIcons = [
        (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
            </svg>
        ),
        (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
        ),
        (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
        )
    ];

    const protectsIcons = [
        (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
        ),
        (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="21 8 21 21 3 21 3 8" />
                <rect x="1" y="3" width="22" height="5" />
                <line x1="10" y1="12" x2="14" y2="12" />
            </svg>
        ),
        (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
        )
    ];

    return (
        <section className={styles.security} id="security">
            <div className={styles.container}>
                <div className={styles.header}>
                    <span className={styles.badge}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                        {t('badge')}
                    </span>
                    <h2 className={styles.title}>{t('title')}</h2>
                    <p className={styles.subtitle}>{t('subtitle')}</p>
                </div>

                <div className={styles.grid}>
                    {/* Left Card: How Instagram Tracks You */}
                    <div className={`${styles.card} ${styles.cardTracks}`}>
                        <h3 className={`${styles.cardTitle} ${styles.tracksTitle}`}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                <line x1="12" y1="9" x2="12" y2="13" />
                                <line x1="12" y1="17" x2="12.01" y2="17" />
                            </svg>
                            {t('tracks.title')}
                        </h3>
                        <div className={styles.items}>
                            {tracksItems.map((item, index) => (
                                <div key={index} className={styles.item}>
                                    <div className={`${styles.iconWrapper} ${styles.tracksIcon}`}>
                                        {tracksIcons[index]}
                                    </div>
                                    <div className={styles.itemContent}>
                                        <h4 className={styles.itemTitle}>{item.title}</h4>
                                        <p>{item.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Card: How InstaPSV Protects You */}
                    <div className={`${styles.card} ${styles.cardProtects}`}>
                        <h3 className={`${styles.cardTitle} ${styles.protectsTitle}`}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                            {t('protects.title')}
                        </h3>
                        <div className={styles.items}>
                            {protectsItems.map((item, index) => (
                                <div key={index} className={styles.item}>
                                    <div className={`${styles.iconWrapper} ${styles.protectsIcon}`}>
                                        {protectsIcons[index]}
                                    </div>
                                    <div className={styles.itemContent}>
                                        <h4 className={styles.itemTitle}>{item.title}</h4>
                                        <p>{item.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={styles.ctaWrapper}>
                    <Link href="/#search" className={styles.ctaBtn}>
                        {t('cta')}
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}
