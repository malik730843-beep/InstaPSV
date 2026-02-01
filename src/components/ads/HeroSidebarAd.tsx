'use client';

import styles from './HeroSidebarAd.module.css';

interface HeroSidebarAdProps {
    position: 'left' | 'right';
}

export default function HeroSidebarAd({ position }: HeroSidebarAdProps) {
    const adCode = `
        <html>
            <body style="margin: 0; padding: 0; background: transparent; overflow: hidden;">
                <script type="text/javascript">
                    atOptions = {
                        'key' : '4f319d74c2a31c41d92de9782ade7d37',
                        'format' : 'iframe',
                        'height' : 600,
                        'width' : 160,
                        'params' : {}
                    };
                </script>
                <script type="text/javascript" src="https://www.highperformanceformat.com/4f319d74c2a31c41d92de9782ade7d37/invoke.js"></script>
            </body>
        </html>
    `;

    return (
        <div className={`${styles.sidebarAd} ${styles[position]}`}>
            <div className={styles.adLabel}>Ad</div>
            <div className={styles.adContainer}>
                <iframe
                    srcDoc={adCode}
                    width="160"
                    height="600"
                    frameBorder="0"
                    scrolling="no"
                    style={{ border: 'none', background: 'transparent' }}
                    title={`ad-${position}`}
                />
            </div>
        </div>
    );
}
