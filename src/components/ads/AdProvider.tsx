'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';

interface Ad {
    id: string;
    name: string;
    type: string;
    code: string;
    device_target: string;
    page_target: string;
    delay_seconds: number;
    start_date?: string;
    end_date?: string;
    frequency?: string;
}

interface AdContextType {
    ads: Ad[];
    getAdForSlot: (slot: string) => Ad | undefined;
    getAdsForSlot: (slot: string) => Ad[];
    triggerInterstitial: () => void;
    recordImpression: (adId: string) => void;
    recordClick: (adId: string) => void;
    isAdminRoute: boolean;
}

const AdContext = createContext<AdContextType>({
    ads: [],
    getAdForSlot: () => undefined,
    getAdsForSlot: () => [],
    triggerInterstitial: () => { },
    recordImpression: () => { },
    recordClick: () => { },
    isAdminRoute: false,
});

export const useAds = () => useContext(AdContext);

// Session storage keys for frequency control
const OVERLAY_PAGES_KEY = 'instapsv_overlay_pages';
const INTERSTITIAL_COUNT_KEY = 'instapsv_interstitial_count';
const LAST_INTERSTITIAL_KEY = 'instapsv_last_interstitial';

export default function AdProvider({ children }: { children: React.ReactNode }) {
    const [ads, setAds] = useState<Ad[]>([]);
    const [loaded, setLoaded] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const [showInterstitial, setShowInterstitial] = useState(false);
    const [currentOverlayAd, setCurrentOverlayAd] = useState<Ad | null>(null);
    const [currentInterstitialAd, setCurrentInterstitialAd] = useState<Ad | null>(null);
    const pathname = usePathname();

    // Check if current route is admin
    const isAdminRoute = pathname?.startsWith('/admin') || false;

    // Fetch ads on mount
    useEffect(() => {
        // Add timestamp to prevent browser caching
        fetch(`/api/ads?t=${Date.now()}`)
            .then(res => res.json())
            .then(data => {
                if (data.ads) {
                    setAds(data.ads);
                }
                setLoaded(true);
            })
            .catch(err => console.error('Failed to load ads', err));
    }, []);

    // Device detection
    const isDeviceMatch = useCallback((target: string) => {
        if (typeof window === 'undefined') return true;
        if (target === 'all') return true;
        const isMobile = window.innerWidth <= 768;
        if (target === 'mobile' && isMobile) return true;
        if (target === 'desktop' && !isMobile) return true;
        return false;
    }, []);

    // Page targeting
    const isPageMatch = useCallback((target: string) => {
        if (target === 'all') return true;

        // Handle localized pathnames (e.g., /en, /de)
        const segments = pathname?.split('/').filter(Boolean) || [];
        const isHomePage = segments.length === 0 || (segments.length === 1 && supportedLocales.includes(segments[0] as any));

        if (target === 'homepage') return isHomePage;
        if (target === 'posts') return pathname?.includes('/blog/');
        if (target === 'pages') return !isHomePage && !pathname?.includes('/blog/');
        return false;
    }, [pathname]);

    // Get single ad for slot
    const getAdForSlot = useCallback((slot: string) => {
        return ads.find(ad =>
            ad.type === slot &&
            isDeviceMatch(ad.device_target) &&
            isPageMatch(ad.page_target)
        );
    }, [ads, isDeviceMatch, isPageMatch]);

    // Get all ads for a slot type
    const getAdsForSlot = useCallback((slot: string) => {
        return ads.filter(ad =>
            ad.type === slot &&
            isDeviceMatch(ad.device_target) &&
            isPageMatch(ad.page_target)
        );
    }, [ads, isDeviceMatch, isPageMatch]);

    // Record impression (for analytics)
    const recordImpression = useCallback(async (adId: string) => {
        try {
            await fetch('/api/ads/impression', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ adId })
            });
        } catch (e) { /* ignore */ }
    }, []);

    // Record click
    const recordClick = useCallback(async (adId: string) => {
        try {
            await fetch('/api/ads/click', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ adId })
            });
        } catch (e) { /* ignore */ }
    }, []);

    // Show overlay ad on EACH page navigation (once per page per session)
    useEffect(() => {
        if (!loaded || isAdminRoute) return;

        // Reset overlay state on navigation to ensure it can trigger again
        setShowOverlay(false);
        setCurrentOverlayAd(null);

        const overlayAd = getAdForSlot('overlay');
        if (!overlayAd) return;

        // Track which pages have shown overlay this session
        const shownPages = JSON.parse(sessionStorage.getItem(OVERLAY_PAGES_KEY) || '[]');
        if (shownPages.includes(pathname)) return;

        // Show after strict 3-second delay as requested
        const timer = setTimeout(() => {
            setCurrentOverlayAd(overlayAd);
            setShowOverlay(true);
            shownPages.push(pathname);
            sessionStorage.setItem(OVERLAY_PAGES_KEY, JSON.stringify(shownPages));
            recordImpression(overlayAd.id);
        }, 3000);

        return () => clearTimeout(timer);
    }, [loaded, pathname, isAdminRoute, getAdForSlot, recordImpression]);

    // Trigger interstitial (called on search, etc.)
    const triggerInterstitial = useCallback(() => {
        const interstitialAd = getAdForSlot('popup') || getAdForSlot('interstitial');
        if (!interstitialAd) return;

        // Rate limit: max 3 per session, min 30 seconds apart
        const count = parseInt(sessionStorage.getItem(INTERSTITIAL_COUNT_KEY) || '0');
        const lastShown = parseInt(sessionStorage.getItem(LAST_INTERSTITIAL_KEY) || '0');
        const now = Date.now();

        if (count >= 3) return;
        if (now - lastShown < 30000) return;

        setCurrentInterstitialAd(interstitialAd);
        setShowInterstitial(true);
        sessionStorage.setItem(INTERSTITIAL_COUNT_KEY, String(count + 1));
        sessionStorage.setItem(LAST_INTERSTITIAL_KEY, String(now));
        recordImpression(interstitialAd.id);
    }, [getAdForSlot, recordImpression]);

    // Close handlers
    const closeOverlay = () => setShowOverlay(false);
    const closeInterstitial = () => setShowInterstitial(false);

    // Global ads
    const stickyAd = getAdForSlot('sticky_bottom');

    return (
        <AdContext.Provider value={{
            ads,
            getAdForSlot,
            getAdsForSlot,
            triggerInterstitial,
            recordImpression,
            recordClick,
            isAdminRoute
        }}>
            {children}

            {/* Full Screen Overlay Ad (Google Vignette Style) - Not on Admin */}
            {!isAdminRoute && showOverlay && currentOverlayAd && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(128, 128, 128, 0.95)',
                    zIndex: 10000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                }}>
                    <div style={{
                        background: '#fff',
                        borderRadius: '8px',
                        position: 'relative',
                        maxWidth: '500px',
                        width: '100%',
                        boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
                        overflow: 'hidden'
                    }}>
                        {/* Ad Header */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '12px 16px',
                            borderBottom: '1px solid #f0f0f0'
                        }}>
                            <span style={{
                                fontSize: '12px',
                                color: '#5f6368',
                                fontWeight: 500
                            }}>Ad</span>
                            <button
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '4px',
                                    color: '#5f6368',
                                    fontSize: '18px'
                                }}
                            >
                                ⋮
                            </button>
                        </div>

                        {/* Ad Content */}
                        <div
                            style={{ padding: '24px 20px' }}
                            onClick={() => recordClick(currentOverlayAd.id)}
                            dangerouslySetInnerHTML={{ __html: currentOverlayAd.code }}
                        />

                        {/* Ad Footer with buttons */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '16px 20px',
                            borderTop: '1px solid #f0f0f0'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '13px', color: '#1a73e8' }}>
                                    Sponsored
                                </span>
                                <button style={{
                                    background: 'none',
                                    cursor: 'pointer',
                                    padding: '2px',
                                    color: '#5f6368',
                                    fontSize: '14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '18px',
                                    height: '18px',
                                    borderRadius: '50%',
                                    border: '1px solid #dadce0'
                                }}>
                                    i
                                </button>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    onClick={closeOverlay}
                                    style={{
                                        background: '#fff',
                                        border: '1px solid #dadce0',
                                        borderRadius: '20px',
                                        padding: '8px 24px',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        color: '#3c4043'
                                    }}
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => {
                                        recordClick(currentOverlayAd.id);
                                        closeOverlay();
                                    }}
                                    style={{
                                        background: '#1a73e8',
                                        border: 'none',
                                        borderRadius: '20px',
                                        padding: '8px 24px',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        color: '#fff'
                                    }}
                                >
                                    Open
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Interstitial Ad (Triggered on actions) - Not on Admin */}
            {!isAdminRoute && showInterstitial && currentInterstitialAd && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0,0,0,0.9)',
                    zIndex: 10001,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px'
                }}>
                    <div style={{
                        background: '#fff',
                        borderRadius: '12px',
                        position: 'relative',
                        maxWidth: '500px',
                        width: '100%',
                        padding: '20px',
                        textAlign: 'center'
                    }}>
                        <p style={{ fontSize: '12px', color: '#999', marginBottom: '10px' }}>Advertisement</p>
                        <div
                            onClick={() => recordClick(currentInterstitialAd.id)}
                            dangerouslySetInnerHTML={{ __html: currentInterstitialAd.code }}
                        />
                        <button
                            onClick={closeInterstitial}
                            style={{
                                marginTop: '20px',
                                background: '#6366f1',
                                color: '#fff',
                                border: 'none',
                                padding: '12px 30px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 600
                            }}
                        >
                            Continue to Site
                        </button>
                    </div>
                </div>
            )}

            {/* Sticky Bottom Ad - Not on Admin */}
            {!isAdminRoute && loaded && stickyAd && (
                <div id="sticky-ad-container" style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    zIndex: 999,
                    boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
                }}>
                    <div
                        onClick={() => recordClick(stickyAd.id)}
                        dangerouslySetInnerHTML={{ __html: stickyAd.code }}
                    />
                    <button
                        onClick={(e) => {
                            const container = document.getElementById('sticky-ad-container');
                            if (container) container.style.display = 'none';
                        }}
                        style={{
                            position: 'absolute',
                            top: '-12px',
                            right: '15px',
                            background: '#333',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        ×
                    </button>
                </div>
            )}

            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </AdContext.Provider>
    );
}
