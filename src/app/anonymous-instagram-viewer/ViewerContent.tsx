'use client';

import React from 'react';
import InstagramSearch from '@/components/instagram/InstagramSearch';
import MediaTabs from '@/components/ui/MediaTabs';
import styles from './Viewer.module.css';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { Shield, Lock, EyeOff, Info } from 'lucide-react';

const ParticleBackground = dynamic(() => import('@/components/ui/ParticleBackground'), {
    ssr: false,
});

interface ViewerContentProps {
    header: React.ReactNode;
    footer: React.ReactNode;
}

export default function ViewerContent({ header, footer }: ViewerContentProps) {
    const t = useTranslations('hero');

    return (
        <div className={styles.viewerPage}>
            {header}

            <main>
                {/* Hero Section */}
                <section className={styles.hero} aria-labelledby="viewer-title">
                    <ParticleBackground className={styles.particles} />
                    <div className={styles.floatingOrbs}>
                        <div className={`${styles.orb} ${styles.orb1}`} />
                        <div className={`${styles.orb} ${styles.orb2}`} />
                    </div>

                    <div className={styles.content}>
                        <span className={styles.badge}>
                            <Shield size={14} />
                            100% Anonymous Viewer
                        </span>
                        <h1 id="viewer-title" className={styles.title}>
                            Anonymous Instagram Viewer — <span className={styles.highlight}>Browse Profiles Secretly</span>
                        </h1>
                        <p className={styles.subtitle}>
                            Enter an Instagram username to view stories, posts, and reels completely anonymously. 
                            Our private proxy ensuring your identity stays hidden from creators.
                        </p>
                    </div>
                </section>

                {/* Tool Selection & Search Section */}
                <section className={styles.searchSection} aria-label="Instagram Search Tool">
                    <div className={styles.searchWrapper}>
                        <MediaTabs />
                        <InstagramSearch />
                    </div>

                    {/* Anonymity Level Check - Semantic Optimization */}
                    <div className={styles.anonymitySection}>
                        <header>
                            <h2 className={styles.sectionTitle}>{t('anonymityCheck.title')}</h2>
                        </header>

                        <div className={styles.anonymityGrid}>
                            {/* Standard Login Card */}
                            <article className={styles.statusCard}>
                                <div className={styles.cardHeader}>
                                    <h3 className={styles.cardTitle}>
                                        <Lock size={20} />
                                        {t('anonymityCheck.standardLogin.title')}
                                    </h3>
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
                            </article>

                            {/* Safe Mode Card */}
                            <article className={`${styles.statusCard} ${styles.safeCard}`}>
                                <div className={styles.cardHeader}>
                                    <h3 className={styles.cardTitle}>
                                        <EyeOff size={20} />
                                        {t('anonymityCheck.safeMode.title')}
                                    </h3>
                                    <div className={`${styles.cardBadge} ${styles.safeBadge}`}>
                                        {t('anonymityCheck.safeMode.percentage')}
                                    </div>
                                </div>
                                <div className={styles.progressBar}>
                                    <div className={`${styles.progressFill} ${styles.safeFill}`} />
                                </div>
                                <div className={styles.pointsList}>
                                    <div className={styles.pointItem}>
                                        <Info size={16} className={styles.checkIcon} />
                                        {t('anonymityCheck.safeMode.point1')}
                                    </div>
                                    <div className={styles.pointItem}>
                                        <Info size={16} className={styles.checkIcon} />
                                        {t('anonymityCheck.safeMode.point2')}
                                    </div>
                                    <div className={styles.pointItem}>
                                        <Info size={16} className={styles.checkIcon} />
                                        {t('anonymityCheck.safeMode.point3')}
                                    </div>
                                </div>
                            </article>
                        </div>
                    </div>
                </section>
            </main>

            {footer}
        </div>
    );
}
