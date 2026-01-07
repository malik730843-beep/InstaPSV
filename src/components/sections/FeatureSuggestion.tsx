'use client';

import styles from './FeatureSuggestion.module.css';


export default function FeatureSuggestion() {
    const scrollToTop = (e: React.MouseEvent) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        // Focus on search input
        const searchInput = document.querySelector('input[type="text"]');
        if (searchInput instanceof HTMLElement) {
            setTimeout(() => searchInput.focus(), 800);
        }
    };

    return (
        <section className={styles.featureSuggestion}>
            <div className={styles.container}>
                {/* Background Elements */}
                <div className={styles.bgElements}>
                    <div className={styles.orb1} />
                    <div className={styles.orb2} />
                </div>

                {/* Content */}
                <div className={styles.stealthContent}>
                    <div className={styles.icon}>👻</div>
                    <h2 className={styles.stealthTitle}>
                        Stalk the Gram in Stealth Mode Only on InstaPSV
                    </h2>
                    <p className={styles.stealthDescription}>
                        Master the art of Digital Invisibility with InstaPSV. View Instagram stories anonymously and download content without leaving a trace. Learn more about why users trust anonymous Instagram viewers.
                    </p>

                    <a href="#" onClick={scrollToTop} className={styles.gradientButton}>
                        🚀 Start Viewing
                    </a>
                </div>
            </div>
        </section>
    );
}
