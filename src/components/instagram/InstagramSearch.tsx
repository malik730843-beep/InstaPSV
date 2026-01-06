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
    const [activeTab, setActiveTab] = useState<'POSTS' | 'REELS' | 'STORIES' | 'TAGGED'>('POSTS');
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
            case 'TAGGED':
                return profile.tagged?.data || [];
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

                    {/* Main Results Layout */}
                    <div className={styles.profileBox} ref={resultsRef}>
                        {/* Full Width Hero Area (Header + Highlights) */}
                        <div className={styles.profileHeader}>
                            <div className={styles.avatarWrapper}>
                                <img src={profile.profile_picture_url} alt={profile.username} className={styles.avatar} />
                            </div>
                            <div className={styles.profileInfo}>
                                <div className={styles.usernameWrapper}>
                                    <p className={styles.username}>{profile.username}</p>
                                </div>

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

                                <h3 className={styles.name}>{profile.name || profile.username}</h3>

                                {profile.biography && (
                                    <p className={styles.bio}>{profile.biography}</p>
                                )}
                            </div>
                        </div>

                        {/* Highlights Section */}
                        {(profile.highlights?.data?.length > 0 || profile.stories?.data?.length > 0) && (
                            <div className={styles.highlights}>
                                {profile.highlights?.data?.map((highlight: any) => (
                                    <div key={highlight.id} className={styles.highlightItem}>
                                        <div className={styles.highlightCircle}>
                                            <img src={highlight.thumbnail_url} alt={highlight.title} className={styles.highlightThumb} />
                                        </div>
                                        <span className={styles.highlightLabel}>{highlight.title}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Main Content with Sidebar (Tabs + Grid) */}
                        <div className={styles.mainLayout}>
                            <div className={styles.mainContent}>
                                <div className={styles.tabs}>

                                    <button
                                        className={`${styles.tab} ${activeTab === 'POSTS' ? styles.activeTab : ''}`}
                                        onClick={() => setActiveTab('POSTS')}
                                    >
                                        <svg aria-label="" fill="currentColor" height="12" role="img" viewBox="0 0 24 24" width="12"><rect fill="none" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" width="18" x="3" y="3"></rect><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="9.015" x2="9.015" y1="3" y2="21"></line><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="14.985" x2="14.985" y1="3" y2="21"></line><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="21" x2="3" y1="9.015" y2="9.015"></line><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="21" x2="3" y1="14.985" y2="14.985"></line></svg>
                                        <span>{t('posts').toUpperCase()}</span>
                                    </button>
                                    <button
                                        className={`${styles.tab} ${activeTab === 'REELS' ? styles.activeTab : ''}`}
                                        onClick={() => setActiveTab('REELS')}
                                    >
                                        <svg aria-label="" fill="currentColor" height="12" role="img" viewBox="0 0 24 24" width="12"><line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="2.049" x2="21.95" y1="7.002" y2="7.002"></line><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="13.504" x2="16.362" y1="2.001" y2="7.002"></line><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="7.207" x2="10.002" y1="2.11" y2="7.002"></line><path d="M2 12.001v3.449c0 2.849.698 4.006 1.606 4.945.94.908 2.098 1.607 4.946 1.607h6.896c2.848 0 4.006-.699 4.946-1.607.908-.939 1.606-2.096 1.606-4.945V8.552c0-2.848-.698-4.006-1.606-4.945C19.454 2.699 18.296 2 15.448 2H8.552c-2.848 0-4.006.699-4.946 1.607C2.698 4.546 2 5.704 2 8.552Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path><path d="M9.763 17.664a.908.908 0 0 1-.455-1.655l4.1-2.408a.91.91 0 0 1 0-.916l-4.1-2.408a.908.908 0 0 1-.913.065.909.909 0 0 1-.445-.838v4.818a.909.909 0 0 1-.914.918" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path></svg>
                                        <span>REELS</span>
                                    </button>
                                    <button
                                        className={`${styles.tab} ${activeTab === 'STORIES' ? styles.activeTab : ''}`}
                                        onClick={() => setActiveTab('STORIES')}
                                    >
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
                                        <span>STORIES</span>
                                    </button>
                                    <button
                                        className={`${styles.tab} ${activeTab === 'TAGGED' ? styles.activeTab : ''}`}
                                        onClick={() => setActiveTab('TAGGED')}
                                    >
                                        <svg aria-label="" fill="currentColor" height="12" role="img" viewBox="0 0 24 24" width="12"><path d="M10.201 3.797 12 1.997l1.799 1.8a1.59 1.59 0 0 0 1.124.465h5.259A1.818 1.818 0 0 1 22 6.08v14.104a1.818 1.818 0 0 1-1.818 1.818H3.818A1.818 1.818 0 0 1 2 20.184V6.08a1.818 1.818 0 0 1 1.818-1.818h5.26a1.59 1.59 0 0 0 1.123-.465Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path><path d="M18.598 22.002V21.4a3.949 3.949 0 0 0-3.948-3.949H9.495A3.949 3.949 0 0 0 5.546 21.4v.603" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path><circle cx="12.072" cy="11.075" fill="none" r="3.556" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle></svg>
                                        <span>TAGGED</span>
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
                                                                <span className={styles.mediaStat}>
                                                                    <svg className={styles.statIcon} viewBox="0 0 24 24"><path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.203 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.32.486.555.846.617.945.062-.099.297-.459.617-.945a4.21 4.21 0 0 1 3.675-1.941"></path></svg>
                                                                    {item.like_count?.toLocaleString() || 0}
                                                                </span>
                                                                <span className={styles.mediaStat}>
                                                                    <svg className={styles.statIcon} viewBox="0 0 24 24"><path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" fill="white" stroke="white" strokeWidth="2"></path></svg>
                                                                    {item.comments_count?.toLocaleString() || 0}
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
