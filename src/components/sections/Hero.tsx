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
                    <span className={styles.badgeIcon}>✨</span>
                    <span>{t('badge')}</span>
                </div>

                <h1 className={styles.title}>
                    {commonT('instagram')}{' '}
                    <span className={styles.gradientText}>{t('story')}</span>
                    {' '}{commonT('and')}{' '}
                    <span className={styles.gradientText}>{t('followers')}</span>
                    {' '}{commonT('viewer')}
                </h1>

                <p className={styles.subtitle}>
                    {t('subtitle')}
                </p>

                {/* Interactive Search Component */}
                <div className={styles.searchContainer}>
                    <InstagramSearch />
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
