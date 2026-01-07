'use client';

import { useTranslations } from 'next-intl';
import styles from './StealthBanner.module.css';

export default function StealthBanner() {
    const t = useTranslations('common');

    const scrollToTop = (e: React.MouseEvent) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        // Optional: Focus on search input if available
        const searchInput = document.querySelector('input[type="text"]');
        if (searchInput instanceof HTMLElement) {
            setTimeout(() => searchInput.focus(), 800);
        }
    };

    return (
        <section className={styles.banner}>
            <div className={styles.overlay} />
            <div className={styles.container}>
                <div className={styles.content}>
                    <h2 className={styles.title}>
                        Explore Instagram in Complete Stealth Mode with InstaPSV
                    </h2>
                    <p className={styles.text}>
                        Unlock the power of digital invisibility. View Instagram stories, reels, and profiles completely anonymously without leaving a footprint. Discover why millions trust InstaPSV for secure, private, and fast Instagram viewing.
                    </p>
                </div>
                <div className={styles.ctaWrapper}>
                    <a href="#" onClick={scrollToTop} className={styles.button}>
                        <span className={styles.icon}>🚀</span>
                        Start Viewing Now
                    </a>
                </div>
            </div>
        </section>
    );
}
