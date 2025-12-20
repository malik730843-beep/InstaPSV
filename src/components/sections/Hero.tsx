'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import styles from './Hero.module.css';

// Dynamic import for Three.js to avoid SSR issues
const ParticleBackground = dynamic(() => import('../ui/ParticleBackground'), {
    ssr: false,
});

export default function Hero() {
    const t = useTranslations('hero');
    const [username, setUsername] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim()) return;

        setIsLoading(true);
        // Simulate loading - replace with actual functionality
        setTimeout(() => {
            setIsLoading(false);
            // Navigate to profile page or show results
            window.location.href = `/profile/${username.replace('@', '')}`;
        }, 1000);
    };

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
                    Instagram{' '}
                    <span className={styles.gradientText}>{t('story')}</span>
                    {' '}and{' '}
                    <span className={styles.gradientText}>{t('followers')}</span>
                    {' '}Viewer
                </h1>

                <p className={styles.subtitle}>
                    {t('subtitle')}
                </p>

                {/* Search Form */}
                <form onSubmit={handleSubmit} className={styles.searchForm}>
                    <div className={styles.searchInputWrapper}>
                        <span className={styles.searchIcon}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.35-4.35" />
                            </svg>
                        </span>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder={t('searchPlaceholder')}
                            className={styles.searchInput}
                            aria-label="Instagram username"
                        />
                        <button
                            type="submit"
                            className={styles.searchButton}
                            disabled={isLoading || !username.trim()}
                        >
                            {isLoading ? (
                                <span className={styles.loadingSpinner} />
                            ) : (
                                <>
                                    <span>{t('searchButton')}</span>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </div>
                    <p className={styles.searchHint}>
                        {t('searchHint')}
                    </p>
                </form>

                {/* Stats */}
                <div className={styles.stats}>
                    <div className={styles.stat}>
                        <span className={styles.statValue}>10M+</span>
                        <span className={styles.statLabel}>{t('stats.profiles')}</span>
                    </div>
                    <div className={styles.statDivider} />
                    <div className={styles.stat}>
                        <span className={styles.statValue}>50M+</span>
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
                <span>Scroll to explore</span>
                <div className={styles.scrollMouse}>
                    <div className={styles.scrollWheel} />
                </div>
            </div>
        </section>
    );
}
