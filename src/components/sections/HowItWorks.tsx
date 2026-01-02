import { getTranslations } from 'next-intl/server';
import styles from './HowItWorks.module.css';

export default async function HowItWorks() {
    const t = await getTranslations('howItWorks');

    const steps = [
        {
            number: '01',
            title: t('step1.title'),
            description: t('step1.description'),
            icon: (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                </svg>
            ),
        },
        {
            number: '02',
            title: t('step2.title'),
            description: t('step2.description'),
            icon: (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                </svg>
            ),
        },
        {
            number: '03',
            title: t('step3.title'),
            description: t('step3.description'),
            icon: (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
            ),
        },
    ];

    return (
        <section className={styles.howItWorks} id="how-it-works">
            <div className={styles.container}>
                {/* Section Header */}
                <div className={styles.header}>
                    <span className={styles.badge}>🚀 {t('badge')}</span>
                    <h2 className={styles.title}>
                        {t('titleStart')} <span className={styles.highlight}>{t('titleHighlight')}</span> {t('titleEnd')}
                    </h2>
                    <p className={styles.subtitle}>
                        {t('subtitle')}
                    </p>
                </div>

                {/* Steps */}
                <div className={styles.stepsContainer}>
                    {steps.map((step, index) => (
                        <div key={index} className={styles.step}>
                            <div className={styles.stepNumber}>{step.number}</div>
                            <div className={styles.stepCard}>
                                <div className={styles.stepIcon}>{step.icon}</div>
                                <h3 className={styles.stepTitle}>{step.title}</h3>
                                <p className={styles.stepDescription}>{step.description}</p>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={styles.connector}>
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Preview Image */}
                <div className={styles.previewWrapper}>
                    <div className={styles.preview}>
                        <div className={styles.previewHeader}>
                            <div className={styles.previewDots}>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                            <span className={styles.previewUrl}>instapsv.com/profile/instagram</span>
                        </div>
                        <div className={styles.previewContent}>
                            <div className={styles.previewProfile}>
                                <div className={styles.previewAvatar}></div>
                                <div className={styles.previewInfo}>
                                    <div className={styles.previewName}></div>
                                    <div className={styles.previewHandle}></div>
                                </div>
                            </div>
                            <div className={styles.previewStats}>
                                <div className={styles.previewStat}></div>
                                <div className={styles.previewStat}></div>
                                <div className={styles.previewStat}></div>
                            </div>
                            <div className={styles.previewGrid}>
                                <div className={styles.previewImage}></div>
                                <div className={styles.previewImage}></div>
                                <div className={styles.previewImage}></div>
                                <div className={styles.previewImage}></div>
                                <div className={styles.previewImage}></div>
                                <div className={styles.previewImage}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
