
'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './MediaViewer.module.css';
import { useTranslations } from 'next-intl';

interface MediaViewerProps {
    media: any;
    profile?: any;
    onClose: () => void;
}

export default function MediaViewer({ media, profile, onClose }: MediaViewerProps) {
    const t = useTranslations('viewer');
    const isVideo = media.media_type === 'VIDEO';
    const [downloading, setDownloading] = useState(false);
    const [captionExpanded, setCaptionExpanded] = useState(false);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    const handleDownload = async () => {
        setDownloading(true);
        const fileUrl = media.media_url;
        const filename = `insta-${media.id}.${isVideo ? 'mp4' : 'jpg'}`;
        window.location.href = `/api/download?url=${encodeURIComponent(fileUrl)}&filename=${filename}`;
        setTimeout(() => setDownloading(false), 2000);
    };

    const formatDate = (timestamp: string) => {
        try {
            const date = new Date(timestamp);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        } catch {
            return '';
        }
    };

    // Split caption into text and hashtags
    const renderCaption = (caption: string) => {
        const parts = caption.split(/(#\w+)/g);
        return parts.map((part, i) =>
            part.startsWith('#') ? (
                <span key={i} className={styles.hashtag}>{part}</span>
            ) : (
                <span key={i}>{part}</span>
            )
        );
    };

    if (!media) return null;

    return createPortal(
        <div className={styles.overlay} onClick={onClose}>
            <button className={styles.closeButton} onClick={onClose}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <div className={styles.content} onClick={(e) => e.stopPropagation()}>
                {/* Left: Media */}
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
                            alt={media.caption || 'Instagram media'}
                            className={styles.media}
                        />
                    )}
                </div>

                {/* Right: Description Panel */}
                <div className={styles.sidePanel}>
                    {/* Profile Header */}
                    {profile && (
                        <div className={styles.profileRow}>
                            <img
                                src={profile.profile_picture_url}
                                alt={profile.username}
                                className={styles.profileAvatar}
                            />
                            <span className={styles.profileName}>{profile.username}</span>
                        </div>
                    )}

                    {/* Caption / Description */}
                    <div className={styles.captionSection}>
                        {profile && (
                            <span className={styles.captionUsername}>{profile.username}</span>
                        )}
                        {media.caption ? (
                            <div className={styles.captionArea}>
                                <p className={`${styles.captionText} ${captionExpanded ? styles.captionExpanded : ''}`}>
                                    {renderCaption(media.caption)}
                                </p>
                                {media.caption.length > 200 && (
                                    <button
                                        className={styles.moreBtn}
                                        onClick={() => setCaptionExpanded(!captionExpanded)}
                                    >
                                        {captionExpanded ? 'less' : 'more'}
                                    </button>
                                )}
                            </div>
                        ) : (
                            <p className={styles.noCaption}>No caption</p>
                        )}
                    </div>

                    {/* Timestamp */}
                    {media.timestamp && (
                        <p className={styles.timestamp}>{formatDate(media.timestamp)}</p>
                    )}

                    {/* Stats */}
                    <div className={styles.statsRow}>
                        {media.like_count !== undefined && (
                            <div className={styles.statChip}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="#ed4956" stroke="none"><path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.203 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.32.486.555.846.617.945.062-.099.297-.459.617-.945a4.21 4.21 0 0 1 3.675-1.941"></path></svg>
                                <span>{media.like_count?.toLocaleString() || 0} likes</span>
                            </div>
                        )}
                        {media.comments_count !== undefined && (
                            <div className={styles.statChip}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                <span>{media.comments_count?.toLocaleString() || 0} comments</span>
                            </div>
                        )}
                    </div>

                    {/* Spacer */}
                    <div className={styles.spacer}></div>

                    {/* Download Button */}
                    <button
                        className={styles.downloadButton}
                        onClick={handleDownload}
                        disabled={downloading}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        {downloading ? t('pleaseWait') : t('download')}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
