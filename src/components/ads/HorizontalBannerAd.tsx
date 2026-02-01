'use client';

import styles from './HorizontalBannerAd.module.css';

interface HorizontalBannerAdProps {
    className?: string;
    id?: string;
    style?: React.CSSProperties;
}

export default function HorizontalBannerAd({ className, id, style }: HorizontalBannerAdProps) {
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
        <div
            id={id}
            className={`${styles.bannerWrapper} ${className || ''}`}
            style={style}
        >
            <div className={styles.adScaler}>
                <iframe
                    srcDoc={adCode}
                    width="728"
                    height="90"
                    frameBorder="0"
                    scrolling="no"
                    style={{ border: 'none', background: 'transparent' }}
                    title="horizontal-banner-ad"
                />
            </div>
        </div>
    );
}
