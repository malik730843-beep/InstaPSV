import { getTranslations } from 'next-intl/server';
import styles from './Features.module.css';
import ScrollToSearch from '../ui/ScrollToSearch';

export default async function Features() {
    const t = await getTranslations('features');

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
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
            ),
            title: t('highlightsViewer.title'),
            description: t('highlightsViewer.description'),
            gradient: 'linear-gradient(135deg, #7928ca, #00d4ff)',
        },
        {
            icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <line x1="3" y1="9" x2="21" y2="9" />
                    <line x1="3" y1="15" x2="21" y2="15" />
                    <line x1="9" y1="3" x2="9" y2="21" />
                    <line x1="15" y1="3" x2="15" y2="21" />
                </svg>
            ),
            title: t('postGrid.title'),
            description: t('postGrid.description'),
            gradient: 'linear-gradient(135deg, #00d4ff, #7928ca)',
        },
        {
            icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="23 7 16 12 23 17 23 7" />
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                    <circle cx="8" cy="12" r="3" />
                </svg>
            ),
            title: t('reelsPlayer.title'),
            description: t('reelsPlayer.description'),
            gradient: 'linear-gradient(135deg, #ff00ff, #ff0080)',
        },
    ];

    return (
        <section className={styles.features} id="features">
            <div className={styles.container}>
                {/* Section Header */}
                <div className={styles.header}>
                    <span className={styles.badge}>
                        <svg className={styles.badgeIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
                            <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z" />
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
                            <a href="/features" className={styles.cardLink}>
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
