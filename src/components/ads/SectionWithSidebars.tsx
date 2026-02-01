'use client';

import styles from './SectionWithSidebars.module.css';

interface SectionWithSidebarsProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'hero';
}

export default function SectionWithSidebars({ children, className, variant = 'default' }: SectionWithSidebarsProps) {
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

    const wrapperClass = `${styles.sectionWrapper} ${variant === 'hero' ? styles.heroVariant : ''} ${className || ''}`;

    const renderAd = (position: 'left' | 'right') => (
        <aside className={styles.sidebar}>
            <div className={styles.adBox}>
                <span className={styles.adLabel}>Ad</span>
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
        </aside>
    );

    return (
        <div className={wrapperClass}>
            {/* Left Sidebar */}
            {renderAd('left')}

            {/* Main Content */}
            <div className={styles.mainContent}>
                {children}
            </div>

            {/* Right Sidebar */}
            {renderAd('right')}
        </div>
    );
}
