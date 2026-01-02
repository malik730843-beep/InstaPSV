'use client';

import { useAds } from './AdProvider';
import { useEffect, useState, useRef } from 'react';

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
    const impressionRecorded = useRef(false);

    // Hydration mismatch avoidance + resize listener
    useEffect(() => {
        const updateAd = () => {
            setAd(getAdForSlot(slot));
        };

        updateAd();
        window.addEventListener('resize', updateAd);
        return () => window.removeEventListener('resize', updateAd);
    }, [slot, getAdForSlot]);

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
                color: '#999',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '5px'
            }}>
                Advertisement
            </div>
            <div dangerouslySetInnerHTML={{ __html: ad.code }} />
        </div>
    );
}

// Specialized Ad Components for specific placements
export function HeaderBannerAd() {
    return (
        <div style={{
            background: 'linear-gradient(to right, #f8f9fa, #e9ecef)',
            padding: '10px 0',
            borderBottom: '1px solid #dee2e6'
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
            background: '#f8f9fa',
            borderRadius: '8px'
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
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            borderRadius: '12px',
            maxWidth: '728px'
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
            background: '#fff',
            border: '1px solid #e1e4e8',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
            <AdUnit slot="sidebar" format="rectangle" />
        </div>
    );
}

export function FooterBannerAd() {
    return (
        <div style={{
            background: '#1a1a2e',
            padding: '20px 0',
            marginTop: '40px'
        }}>
            <AdUnit slot="footer" format="horizontal" style={{ margin: '0 auto' }} />
        </div>
    );
}
