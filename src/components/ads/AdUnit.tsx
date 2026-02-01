'use client';

import { useAds } from './AdProvider';
import { useEffect, useState, useRef, useCallback } from 'react';

interface AdUnitProps {
    slot: string;
    className?: string;
    style?: React.CSSProperties;
    format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle';
}

export default function AdUnit({ slot, className, style, format = 'auto' }: AdUnitProps) {
    const { getAdForSlot, recordImpression, recordClick } = useAds();
    const [ad, setAd] = useState<any>(null);
    const [visible, setVisible] = useState(false);
    const adRef = useRef<HTMLDivElement>(null);
    const adContentRef = useRef<HTMLDivElement>(null);
    const impressionRecorded = useRef(false);
    const scriptsExecuted = useRef(false);

    // Hydration mismatch avoidance + resize listener
    useEffect(() => {
        const updateAd = () => {
            setAd(getAdForSlot(slot));
        };

        updateAd();
        window.addEventListener('resize', updateAd);
        return () => window.removeEventListener('resize', updateAd);
    }, [slot, getAdForSlot]);

    // Execute scripts from ad code - dangerouslySetInnerHTML doesn't execute scripts
    const executeAdScripts = useCallback((adCode: string, container: HTMLDivElement) => {
        if (scriptsExecuted.current) return;
        scriptsExecuted.current = true;

        // Parse the ad code to find all script tags
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = adCode;

        // Find all inline scripts and external scripts
        const scripts = tempDiv.querySelectorAll('script');

        scripts.forEach((oldScript) => {
            const newScript = document.createElement('script');

            // Copy all attributes (including src, async, etc.)
            Array.from(oldScript.attributes).forEach(attr => {
                newScript.setAttribute(attr.name, attr.value);
            });

            // Copy inline script content
            if (oldScript.textContent) {
                newScript.textContent = oldScript.textContent;
            }

            // Append to container to execute
            container.appendChild(newScript);
        });

        // Also set non-script HTML content
        const nonScriptContent = adCode.replace(/<script[\s\S]*?<\/script>/gi, '');
        if (nonScriptContent.trim()) {
            const contentDiv = document.createElement('div');
            contentDiv.innerHTML = nonScriptContent;
            container.insertBefore(contentDiv, container.firstChild);
        }
    }, []);

    // Execute scripts when ad loads and becomes visible
    useEffect(() => {
        if (!ad || !adContentRef.current || !visible) return;

        // Small delay to ensure DOM is ready
        const timer = setTimeout(() => {
            if (adContentRef.current && ad.code) {
                executeAdScripts(ad.code, adContentRef.current);
            }
        }, 100);

        return () => clearTimeout(timer);
    }, [ad, visible, executeAdScripts]);

    // Intersection Observer for viewability tracking
    useEffect(() => {
        if (!ad || !adRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setVisible(true);
                        // Record impression when ad is 50% visible
                        if (!impressionRecorded.current && entry.intersectionRatio >= 0.5) {
                            recordImpression(ad.id);
                            impressionRecorded.current = true;
                        }
                    }
                });
            },
            { threshold: [0, 0.5, 1] }
        );

        observer.observe(adRef.current);
        return () => observer.disconnect();
    }, [ad, recordImpression]);

    // Reset script execution state when ad changes
    useEffect(() => {
        scriptsExecuted.current = false;
    }, [ad?.id]);

    if (!ad) return null;

    // Format-specific styles
    const formatStyles: Record<string, React.CSSProperties> = {
        horizontal: { minHeight: '90px', maxHeight: '250px' },
        vertical: { minWidth: '160px', maxWidth: '300px', minHeight: '600px' },
        rectangle: { width: '336px', height: '280px' },
        auto: {},
    };

    return (
        <div
            ref={adRef}
            className={`ad-unit ad-${slot} ${className || ''}`}
            style={{
                margin: '15px auto',
                textAlign: 'center',
                maxWidth: '100%',
                overflow: 'hidden',
                opacity: visible ? 1 : 0,
                transition: 'opacity 0.3s ease',
                ...formatStyles[format],
                ...style
            }}
            onClick={() => recordClick(ad.id)}
        >
            {/* Ad Label */}
            <div style={{
                fontSize: '10px',
                color: 'rgba(255, 255, 255, 0.4)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '5px'
            }}>
                Ad
            </div>
            {/* Ad content container - scripts will be injected here */}
            <div ref={adContentRef} style={{ background: 'transparent' }} />
        </div>
    );
}

// Specialized Ad Components for specific placements
export function HeaderBannerAd() {
    return (
        <div style={{
            background: 'transparent',
            padding: '10px 0',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
            <AdUnit slot="header" format="horizontal" style={{ margin: '0 auto' }} />
        </div>
    );
}

export function SidebarAd({ position = 'right' }: { position?: 'left' | 'right' }) {
    return (
        <div style={{
            position: 'sticky',
            top: '100px',
            padding: '15px',
            background: 'transparent'
        }}>
            <AdUnit slot="sidebar" format="vertical" />
        </div>
    );
}

export function InlineContentAd() {
    return (
        <div style={{
            margin: '30px auto',
            padding: '20px',
            background: 'transparent',
            maxWidth: '728px',
            display: 'flex',
            justifyContent: 'center'
        }}>
            <AdUnit slot="header" format="horizontal" />
        </div>
    );
}

export function SearchResultAd() {
    return (
        <div style={{
            margin: '20px 0',
            padding: '15px',
            background: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            boxShadow: 'none'
        }}>
            <AdUnit slot="sidebar" format="rectangle" />
        </div>
    );
}

export function FooterBannerAd() {
    return (
        <div style={{
            background: 'transparent',
            padding: '20px 0',
            marginTop: '40px',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
            <AdUnit slot="footer" format="horizontal" style={{ margin: '0 auto' }} />
        </div>
    );
}
