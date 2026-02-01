'use client';

import { useEffect, useRef } from 'react';
import styles from './GlobalSidebarAds.module.css';

const SIDEBAR_AD_CODE = `<script>
  atOptions = {
    'key' : '4f319d74c2a31c41d92de9782ade7d37',
    'format' : 'iframe',
    'height' : 600,
    'width' : 160,
    'params' : {}
  };
</script>
<script src="https://www.highperformanceformat.com/4f319d74c2a31c41d92de9782ade7d37/invoke.js"></script>`;

export default function GlobalSidebarAds() {
    const leftRef = useRef<HTMLDivElement>(null);
    const rightRef = useRef<HTMLDivElement>(null);
    const leftExecuted = useRef(false);
    const rightExecuted = useRef(false);

    useEffect(() => {
        // Execute left ad scripts
        if (leftRef.current && !leftExecuted.current) {
            leftExecuted.current = true;
            executeAdScript(leftRef.current);
        }
    }, []);

    useEffect(() => {
        // Execute right ad scripts
        if (rightRef.current && !rightExecuted.current) {
            rightExecuted.current = true;
            executeAdScript(rightRef.current);
        }
    }, []);

    const executeAdScript = (container: HTMLDivElement) => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = SIDEBAR_AD_CODE;

        const scripts = tempDiv.querySelectorAll('script');
        scripts.forEach((oldScript) => {
            const newScript = document.createElement('script');
            Array.from(oldScript.attributes).forEach(attr => {
                newScript.setAttribute(attr.name, attr.value);
            });
            if (oldScript.textContent) {
                newScript.textContent = oldScript.textContent;
            }
            container.appendChild(newScript);
        });
    };

    return (
        <>
            {/* Left Sidebar Ad */}
            <div className={`${styles.sidebarAd} ${styles.left}`}>
                <div className={styles.adLabel}>Ad</div>
                <div ref={leftRef} className={styles.adContainer} />
            </div>

            {/* Right Sidebar Ad */}
            <div className={`${styles.sidebarAd} ${styles.right}`}>
                <div className={styles.adLabel}>Ad</div>
                <div ref={rightRef} className={styles.adContainer} />
            </div>
        </>
    );
}
