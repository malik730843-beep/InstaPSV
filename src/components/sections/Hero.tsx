'use client';

import { useTranslations } from 'next-intl';
import styles from './Hero.module.css';
import InstagramSearch from '../instagram/InstagramSearch';
import dynamic from 'next/dynamic';

const ParticleBackground = dynamic(() => import('../ui/ParticleBackground'), {
    ssr: false,
});

export default function Hero() {
    const t = useTranslations('hero');
    const commonT = useTranslations('common');

    return (
        <section className={styles.hero} id="search">
            {/* Particle Background */}
            <ParticleBackground className={styles.particles} />

            {/* Gradient Overlay */}
            <div className={styles.gradientOverlay} />

            {/* Floating Elements */}
            <div className={styles.floatingElements}>
                <div className={`${styles.floatingOrb} ${styles.orb1}`} />
                <div className={`${styles.floatingOrb} ${styles.orb2}`} />
                <div className={`${styles.floatingOrb} ${styles.orb3}`} />
            </div>

            {/* Content */}
            <div className={styles.content}>
                <div className={styles.badge}>
                    <svg className={styles.badgeIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z" />
                    </svg>
                    <span>{t('badge')}</span>
                </div>

                <h1 className={styles.title}>
                    {t('titleStart')}{' '}
                    <span className={styles.gradientText}>{t('titleHighlight')}</span>
                </h1>

                <p className={styles.subtitle}>
                    {t('subtitle')}
                </p>

                {/* Main Action Area - Centered Column */}
                <div className={styles.centeredColumn}>
                    {/* Interactive Search Component */}
                    <div className={styles.searchContainer}>
                        <InstagramSearch />
                    </div>

                    {/* Anonymity Level Check Section */}
                    <div className={styles.anonymityCheck}>
                        <h2 className={styles.anonymityTitle}>{t('anonymityCheck.title')}</h2>

                        <div className={styles.statusCard}>
                            <div className={styles.cardHeader}>
                                <div className={styles.cardTitle}>
                                    <svg className={styles.cardIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                        <line x1="12" y1="9" x2="12" y2="13"></line>
                                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                    </svg>
                                    {t('anonymityCheck.standardLogin.title')}
                                </div>
                                <div className={`${styles.cardBadge} ${styles.standardBadge}`}>
                                    {t('anonymityCheck.standardLogin.percentage')}
                                </div>
                            </div>
                            <div className={styles.progressBar}>
                                <div className={`${styles.progressFill} ${styles.standardFill}`} />
                            </div>
                            <p className={styles.cardDescription}>
                                {t('anonymityCheck.standardLogin.description')}
                            </p>
                        </div>

                        <div className={`${styles.statusCard} ${styles.safeCard}`}>
                            <div className={styles.cardHeader}>
                                <div className={styles.cardTitle}>
                                    <svg className={styles.cardIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                        <polyline points="9 11 11 13 15 9"></polyline>
                                    </svg>
                                    {t('anonymityCheck.safeMode.title')}
                                </div>
                                <div className={`${styles.cardBadge} ${styles.safeBadge}`}>
                                    {t('anonymityCheck.safeMode.percentage')}
                                </div>
                            </div>
                            <div className={styles.progressBar}>
                                <div className={`${styles.progressFill} ${styles.safeFill}`} />
                            </div>
                            <div className={styles.pointsList}>
                                <div className={styles.pointItem}>
                                    <svg className={styles.checkIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                    {t('anonymityCheck.safeMode.point1')}
                                </div>
                                <div className={styles.pointItem}>
                                    <svg className={styles.checkIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                    {t('anonymityCheck.safeMode.point2')}
                                </div>
                                <div className={styles.pointItem}>
                                    <svg className={styles.checkIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                    {t('anonymityCheck.safeMode.point3')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className={styles.stats}>
                    <div className={styles.stat}>
                        <span className={styles.statValue}>500K+</span>
                        <span className={styles.statLabel}>{t('stats.profiles')}</span>
                    </div>
                    <div className={styles.statDivider} />
                    <div className={styles.stat}>
                        <span className={styles.statValue}>50K+</span>
                        <span className={styles.statLabel}>{t('stats.stories')}</span>
                    </div>
                    <div className={styles.statDivider} />
                    <div className={styles.stat}>
                        <span className={styles.statValue}>100%</span>
                        <span className={styles.statLabel}>{t('stats.anonymous')}</span>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className={styles.scrollIndicator}>
                <span>{commonT('scrollToExplore') || 'Scroll to explore'}</span>
                <div className={styles.scrollMouse}>
                    <div className={styles.scrollWheel} />
                </div>
            </div>
        </section>
    );
}

