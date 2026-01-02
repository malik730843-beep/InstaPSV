'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import styles from './InstagramSearch.module.css';
import { useAds } from '@/components/ads/AdProvider';
import AdUnit from '@/components/ads/AdUnit';
import dynamic from 'next/dynamic';

const MediaViewer = dynamic(() => import('./MediaViewer'), {
    ssr: false,
});

export default function InstagramSearch() {
    const t = useTranslations('search');
    const commonT = useTranslations('common');
    const [username, setUsername] = useState('');
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState<'POSTS' | 'REELS' | 'STORIES'>('POSTS');
    const [selectedMedia, setSelectedMedia] = useState<any>(null);
    const resultsRef = useRef<HTMLDivElement>(null);
    const { triggerInterstitial } = useAds();

    // History State
    const [searchHistory, setSearchHistory] = useState<string[]>([]);
    const [showHistory, setShowHistory] = useState(false);
    const historyRef = useRef<HTMLDivElement>(null);

    // Load history from localStorage
    useEffect(() => {
        const savedHistory = localStorage.getItem('insta_search_history');
        if (savedHistory) {
            try {
                setSearchHistory(JSON.parse(savedHistory));
            } catch (e) {
                console.error("Failed to parse search history", e);
            }
        }
    }, []);

    // Close history when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (historyRef.current && !historyRef.current.contains(event.target as Node)) {
                setShowHistory(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (profile && resultsRef.current) {
            setTimeout(() => {
                resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }, [profile]);

    const getFilteredMedia = () => {
        if (!profile) return [];
        switch (activeTab) {
            case 'POSTS':
                return profile.media?.data?.filter((item: any) => item.media_type !== 'VIDEO') || [];
            case 'REELS':
                return profile.media?.data?.filter((item: any) => item.media_type === 'VIDEO') || [];
            case 'STORIES':
                return profile.stories?.data || [];
            default:
                return [];
        }
    };

    const performSearch = async (targetUsername: string) => {
        if (!targetUsername) return;

        // Trigger interstitial ad before search
        triggerInterstitial();

        setLoading(true);
        setError('');
        setProfile(null);

        const cleanUsername = targetUsername.startsWith('@') ? targetUsername.substring(1) : targetUsername;

        try {
            const res = await fetch(`/api/profile/search?username=${encodeURIComponent(cleanUsername)}`);
            const data = await res.json();

            if (!res.ok) {
                setError(data.error || commonT('error'));
            } else {
                setProfile(data);
                setActiveTab('POSTS');

                // Add to history
                const updatedHistory = [
                    cleanUsername,
                    ...searchHistory.filter(h => h.toLowerCase() !== cleanUsername.toLowerCase())
                ].slice(0, 5); // Keep last 5

                setSearchHistory(updatedHistory);
                localStorage.setItem('insta_search_history', JSON.stringify(updatedHistory));
                setShowHistory(false);
            }
        } catch (err) {
            setError('Failed to fetch profile. Please check your connection.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        await performSearch(username);
    };

    const formatCount = (count: number) => {
        if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
        if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
        return count?.toLocaleString();
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.searchContainer} ref={historyRef}>
                <form onSubmit={handleSearch} className={styles.searchForm}>
                    <div className={styles.inputGroup}>
                        <span className={styles.atSymbol}>@</span>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                                if (!showHistory && searchHistory.length > 0) setShowHistory(true);
                            }}
                            onFocus={() => {
                                if (searchHistory.length > 0) setShowHistory(true);
                            }}
                            placeholder=""
                            className={styles.input}
                            disabled={loading}
                        />
                    </div>
                    <button type="submit" className={styles.button} disabled={loading || !username}>
                        {loading ? <span className={styles.loader}></span> : t('viewProfile')}
                    </button>
                </form>

                {/* Search History Dropdown */}
                {showHistory && searchHistory.length > 0 && (
                    <div className={styles.historyDropdown}>
                        <div className={styles.historyHeader}>
                            <span>{t('history')}</span>
                            <button
                                className={styles.clearHistory}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setSearchHistory([]);
                                    localStorage.removeItem('insta_search_history');
                                    setShowHistory(false);
                                }}
                            >
                                {t('clearHistory')}
                            </button>
                        </div>
                        <div className={styles.historyList}>
                            {searchHistory.map((item, index) => (
                                <div
                                    key={index}
                                    className={styles.historyItem}
                                    onClick={() => {
                                        setUsername(item);
                                        setShowHistory(false);
                                        performSearch(item);
                                    }}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                    <span>@{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {error && (
                <div className={styles.errorCard}>
                    <div className={styles.errorIcon}>⚠️</div>
                    <p className={styles.errorMessage}>{error}</p>
                    <p className={styles.errorTip}>{t('errorTip')}</p>
                </div>
            )}

            {profile && (
                <>
                    {/* Ad Banner Above Results */}
                    <div className={styles.adBannerContainer}>
                        <AdUnit slot="header" />
                    </div>
 
                    {/* Main Content with Sidebar Layout */}
                    <div className={styles.mainLayout}>
                        {/* Main Profile Content */}
                        <div className={styles.mainContent}>
                            <div className={styles.profileBox} ref={resultsRef}>
                                <div className={styles.profileHeader}>
                                    <div className={styles.avatarWrapper}>
                                        <img src={profile.profile_picture_url} alt={profile.username} className={styles.avatar} />
                                    </div>
                                    <div className={styles.profileInfo}>
                                        <h3 className={styles.name}>{profile.name || profile.username}</h3>
                                        <div className={styles.usernameWrapper}>
                                            <p className={styles.username}>@{profile.username}</p>
                                            <span className={styles.anonymousBadge}>{t('anonymousBadge')}</span>
                                        </div>

                                        {profile.biography && (
                                            <p className={styles.bio}>{profile.biography}</p>
                                        )}

                                        <div className={styles.stats}>
                                            <div className={styles.statItem}>
                                                <span className={styles.statValue}>{profile.media_count?.toLocaleString()}</span>
                                                <span className={styles.statLabel}>{t('posts')}</span>
                                            </div>
                                            <div className={styles.statItem}>
                                                <span className={styles.statValue}>
                                                    {formatCount(profile.followers_count)}
                                                </span>
                                                <span className={styles.statLabel}>{t('followers')}</span>
                                            </div>
                                            <div className={styles.statItem}>
                                                <span className={styles.statValue}>{profile.follows_count?.toLocaleString()}</span>
                                                <span className={styles.statLabel}>{t('following')}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Tabs */}
                                <div className={styles.tabs}>
                                    <button
                                        className={`${styles.tab} ${activeTab === 'POSTS' ? styles.activeTab : ''}`}
                                        onClick={() => setActiveTab('POSTS')}
                                    >
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                                        {t('posts').toUpperCase()}
                                    </button>
                                    <button
                                        className={`${styles.tab} ${activeTab === 'REELS' ? styles.activeTab : ''}`}
                                        onClick={() => setActiveTab('REELS')}
                                    >
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line></svg>
                                        REELS
                                    </button>
                                    <button
                                        className={`${styles.tab} ${activeTab === 'STORIES' ? styles.activeTab : ''}`}
                                        onClick={() => setActiveTab('STORIES')}
                                    >
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
                                        STORIES
                                    </button>
                                </div>

                                <div className={styles.mediaGrid}>
                                    {getFilteredMedia().length > 0 ? (
                                        getFilteredMedia().map((item: any) => (
                                            <div
                                                key={item.id}
                                                className={styles.mediaItem}
                                                onClick={() => setSelectedMedia(item)}
                                            >
                                                {item.media_type === 'VIDEO' ? (
                                                    <div className={styles.videoThumbnailWrapper} style={{ width: '100%', height: '100%' }}>
                                                        <img
                                                            src={item.thumbnail_url || item.media_url}
                                                            alt={item.caption || 'Instagram Reel'}
                                                            className={styles.mediaThumb}
                                                        />
                                                        <div className={styles.typeIcon}>
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <img
                                                            src={item.media_url}
                                                            alt={item.caption || 'Instagram Post'}
                                                            className={styles.mediaThumb}
                                                        />
                                                        {item.media_type === 'CAROUSEL_ALBUM' && (
                                                            <div className={styles.typeIcon}>
                                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                                                            </div>
                                                        )}
                                                    </>
                                                )}

                                                <div className={styles.mediaOverlay}>
                                                    <div className={styles.mediaStats}>
                                                        {activeTab !== 'STORIES' ? (
                                                            <>
                                                                <span className={styles.mediaStat} title={`${item.like_count?.toLocaleString()} Likes`}>
                                                                    ❤️ {item.like_count?.toLocaleString() || 0}
                                                                </span>
                                                                <span className={styles.mediaStat} title={`${item.comments_count?.toLocaleString()} Comments`}>
                                                                    💬 {item.comments_count?.toLocaleString() || 0}
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <span className={styles.mediaStat} style={{ fontSize: '0.8rem' }}>{t('viewStory')}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className={styles.emptyState}>
                                            <p>{t('noMedia', { type: activeTab.toLowerCase() })}</p>
                                            {activeTab === 'STORIES' && <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', opacity: 0.7 }}>{t('storyTip')}</p>}
                                        </div>
                                    )}
                                </div>

                                 {/* Inline Ad after media grid */}
                                <div style={{ marginTop: '20px' }}>
                                    <AdUnit slot="sidebar" />
                                </div>
                            </div>
                        </div>
 
                        {/* Sidebar Ads - Desktop Only */}
                        <aside className={styles.desktopSidebar}>
                            <div className={styles.sidebarAdBox}>
                                <AdUnit slot="sidebar" />
                            </div>
                            <div className={styles.sidebarAdBox}>
                                <AdUnit slot="sidebar" />
                            </div>
                        </aside>
                    </div>
                </>
            )}

            {selectedMedia && (
                <MediaViewer
                    media={selectedMedia}
                    onClose={() => setSelectedMedia(null)}
                />
            )}
        </div>
    );
}
