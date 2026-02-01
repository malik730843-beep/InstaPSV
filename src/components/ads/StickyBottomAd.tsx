'use client';

import React, { useState, useEffect } from 'react';
import styles from './StickyBottomAd.module.css';

export default function StickyBottomAd() {
    const [isVisible, setIsVisible] = useState(false);
    const [isClosed, setIsClosed] = useState(false);

    useEffect(() => {
        // Show after a short delay for better engagement
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    if (isClosed) return null;

    const adCode = `
        <html>
            <body style="margin: 0; padding: 0; background: transparent; overflow: hidden; display: flex; justify-content: center; align-items: center;">
                <script type="text/javascript">
                    atOptions = {
                        'key' : '593354ffe4f9cbe99ac9c6ba4c93023d',
                        'format' : 'iframe',
                        'height' : 90,
                        'width' : 728,
                        'params' : {}
                    };
                </script>
                <script type="text/javascript" src="https://www.highperformanceformat.com/593354ffe4f9cbe99ac9c6ba4c93023d/invoke.js"></script>
            </body>
        </html>
    `;

    return (
        <div className={`${styles.stickyWrapper} ${isVisible ? styles.visible : ''}`}>
            <div className={styles.adContent}>
                <button
                    className={styles.closeButton}
                    onClick={() => setIsClosed(true)}
                    aria-label="Close Ad"
                >
                    ×
                </button>
                <div className={styles.adLabel}>Advertisement</div>
                <div className={styles.iframeContainer}>
                    <iframe
                        srcDoc={adCode}
                        width="728"
                        height="90"
                        frameBorder="0"
                        scrolling="no"
                        style={{ border: 'none', background: 'transparent' }}
                        title="sticky-bottom-ad"
                    />
                </div>
            </div>
        </div>
    );
}
