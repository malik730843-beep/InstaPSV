'use client';

import { useTranslations } from 'next-intl';
import styles from './Hero.module.css';
import Link from 'next/link';
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
                    <Link href="/anonymous-instagram-viewer" className={styles.getStartedButton}>
                        {t('getStarted')}
                        <svg className={styles.buttonIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </Link>
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

