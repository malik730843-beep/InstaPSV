'use client';

import { useTranslations } from 'next-intl';
import styles from './Features.module.css';

export default function Features() {
    const t = useTranslations('features');

    const features = [
        {
            icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                </svg>
            ),
            title: t('storyViewer.title'),
            description: t('storyViewer.description'),
            gradient: 'linear-gradient(135deg, #ff0080, #ff00ff)',
        },
        {
            icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
            ),
            title: t('followersParser.title'),
            description: t('followersParser.description'),
            gradient: 'linear-gradient(135deg, #7928ca, #00d4ff)',
        },
        {
            icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="23 7 16 12 23 17 23 7" />
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                </svg>
            ),
            title: t('reelsViewer.title'),
            description: t('reelsViewer.description'),
            gradient: 'linear-gradient(135deg, #00d4ff, #7928ca)',
        },
        {
            icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                </svg>
            ),
            title: t('photoSaver.title'),
            description: t('photoSaver.description'),
            gradient: 'linear-gradient(135deg, #ff00ff, #ff0080)',
        },
    ];

    return (
        <section className={styles.features}>
            <div className={styles.container}>
                {/* Section Header */}
                <div className={styles.header}>
                    <span className={styles.badge}>✨ {t('badge')}</span>
                    <h2 className={styles.title}>
                        {t('titleStart')} <span className={styles.highlight}>{t('titleHighlight')}</span> {t('titleEnd')}
                    </h2>
                    <p className={styles.subtitle}>
                        {t('subtitle')}
                    </p>
                </div>

                {/* Feature Cards */}
                <div className={styles.grid}>
                    {features.map((feature, index) => (
                        <div key={index} className={styles.card}>
                            <div
                                className={styles.iconWrapper}
                                style={{ background: feature.gradient }}
                            >
                                {feature.icon}
                            </div>
                            <h3 className={styles.cardTitle}>{feature.title}</h3>
                            <p className={styles.cardDescription}>{feature.description}</p>
                            <a href="#" className={styles.cardLink}>
                                {t('learnMore')}
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
