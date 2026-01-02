
'use client';

import { useEffect, useState } from 'react';
import styles from './MediaViewer.module.css';
import { useAds } from '@/components/ads/AdProvider';
import AdUnit from '@/components/ads/AdUnit';
import { useTranslations } from 'next-intl';

interface MediaViewerProps {
    media: any;
    onClose: () => void;
}

export default function MediaViewer({ media, onClose }: MediaViewerProps) {
    const t = useTranslations('viewer');
    const isVideo = media.media_type === 'VIDEO';
    const [downloading, setDownloading] = useState(false);
    const [showPreDownloadAd, setShowPreDownloadAd] = useState(false);
    const [countdown, setCountdown] = useState(5);
    const { triggerInterstitial } = useAds();

    useEffect(() => {
        // Prevent background scrolling
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    // Countdown timer for pre-download ad
    useEffect(() => {
        if (showPreDownloadAd && countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [showPreDownloadAd, countdown]);

    const initiateDownload = () => {
        const fileUrl = media.media_url;
        const filename = `insta-${media.id}.${isVideo ? 'mp4' : 'jpg'}`;
        window.location.href = `/api/download?url=${encodeURIComponent(fileUrl)}&filename=${filename}`;
        setShowPreDownloadAd(false);
        setDownloading(false);
    };

    const handleDownload = async () => {
        // Show pre-download ad first
        setShowPreDownloadAd(true);
        setCountdown(5);
        setDownloading(true);
        triggerInterstitial();
    };

    if (!media) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <button className={styles.closeButton} onClick={onClose}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <div className={styles.content} onClick={(e) => e.stopPropagation()}>
                <div className={styles.mediaContainer}>
                    {isVideo ? (
                        <video
                            src={media.media_url}
                            controls
                            autoPlay
                            className={styles.media}
                            poster={media.thumbnail_url}
                        />
                    ) : (
                        <img
                            src={media.media_url}
                            alt={media.caption}
                            className={styles.media}
                        />
                    )}
                </div>

                <div className={styles.footer}>
                    {media.caption && (
                        <p className={styles.caption}>{media.caption.substring(0, 100)}{media.caption.length > 100 ? '...' : ''}</p>
                    )}

                    <button
                        className={styles.downloadButton}
                        onClick={handleDownload}
                        disabled={downloading}
                    >
                        {downloading ? t('pleaseWait') : t('download')}
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    </button>
                </div>

                {/* Inline ad below content */}
                <div style={{ marginTop: '15px', padding: '10px', background: '#f8f9fa', borderRadius: '8px' }}>
                    <AdUnit slot="sidebar" />
                </div>
            </div>

            {/* Pre-Download Ad Modal */}
            {showPreDownloadAd && (
                <div className={styles.adModalOverlay} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.adModalContent}>
                        <p className={styles.adLabel}>{t('advertisement')}</p>

                        {/* Ad Content */}
                        <div className={styles.adContentBox}>
                            <AdUnit slot="header" />
                        </div>

                        {/* Countdown or Download Button */}
                        {countdown > 0 ? (
                            <div>
                                <p className={styles.countdownTimer}>
                                    {t('downloadStartIn')}
                                </p>
                                <div className={styles.countdownCircle}>
                                    {countdown}
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={initiateDownload}
                                className={styles.finalDownloadBtn}
                            >
                                🎉 {t('downloadNow')}
                            </button>
                        )}

                        <button
                            onClick={() => {
                                setShowPreDownloadAd(false);
                                setDownloading(false);
                            }}
                            className={styles.cancelBtn}
                        >
                            {t('cancel')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
