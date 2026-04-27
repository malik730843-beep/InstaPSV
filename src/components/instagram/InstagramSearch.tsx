'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import styles from './InstagramSearch.module.css';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Script from 'next/script';
import LoginModal from '@/components/ui/LoginModal';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const MediaViewer = dynamic(() => import('./MediaViewer'), {
    ssr: false,
});

interface InstagramSearchProps {
    placeholder?: string;
    restrictedTo?: 'POSTS' | 'REELS' | 'STORIES' | 'HIGHLIGHTS';
}

export default function InstagramSearch({ placeholder, restrictedTo }: InstagramSearchProps) {
    const t = useTranslations('search');
    const commonT = useTranslations('common');
    const [username, setUsername] = useState('');
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState<'POSTS' | 'REELS' | 'STORIES' | 'HIGHLIGHTS'>(restrictedTo || 'POSTS');
    const [selectedMedia, setSelectedMedia] = useState<any>(null);
    const resultsRef = useRef<HTMLDivElement>(null);

    // Credit System State
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [creditsRemaining, setCreditsRemaining] = useState<number>(6);
    const [userPlan, setUserPlan] = useState<string>('free');
    const [authChecked, setAuthChecked] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [loginModalMessage, setLoginModalMessage] = useState('');

    // History State
    const [searchHistory, setSearchHistory] = useState<string[]>([]);
    const [showHistory, setShowHistory] = useState(false);
    const historyRef = useRef<HTMLDivElement>(null);

    // Load credits and auth
    useEffect(() => {
        const checkAuthAndCredits = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const email = session?.user?.email;

            if (email) {
                setUserEmail(email);
                const res = await fetch(`/api/credits?email=${encodeURIComponent(email)}`);
                if (res.ok) {
                    const data = await res.json();
                    setCreditsRemaining(data.credits_remaining);
                    setUserPlan(data.plan);
                }
            } else {
                setUserEmail(null);
                const localStr = localStorage.getItem('insta_free_credits');
                if (localStr) {
                    setCreditsRemaining(parseInt(localStr, 10));
                } else {
                    setCreditsRemaining(6);
                    localStorage.setItem('insta_free_credits', '6');
                }
                setUserPlan('free');
            }
            setAuthChecked(true);
        };
        checkAuthAndCredits();
    }, []);

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
            case 'HIGHLIGHTS':
                return profile.highlights?.data || [];
            default:
                return [];
        }
    };

    const performSearch = async (targetUsername: string) => {
        if (!targetUsername) return;

        if (userPlan !== 'monthly' && creditsRemaining < 2) {
            if (!userEmail) {
                setLoginModalMessage('🔒 Your free credits have run out! Create an account or sign in to get more credits and continue searching.');
                setShowLoginModal(true);
            } else {
                setError('Not enough credits. Please upgrade your plan to continue searching.');
            }
            return;
        }

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
                if (restrictedTo) {
                    setActiveTab(restrictedTo);
                } else {
                    setActiveTab('POSTS');
                }

                // Deduct credits on success
                if (userPlan !== 'monthly') {
                    if (userEmail) {
                        const deductRes = await fetch('/api/credits', {
                            method: 'POST',
                            body: JSON.stringify({ email: userEmail, username_searched: cleanUsername }),
                            headers: { 'Content-Type': 'application/json' }
                        });
                        if (deductRes.ok) {
                            const dData = await deductRes.json();
                            setCreditsRemaining(dData.credits_remaining);
                            setUserPlan(dData.plan || userPlan);
                        } else {
                            const dData = await deductRes.json();
                            if (dData.error) setError(dData.error);
                        }
                    } else {
                        const newCredits = Math.max(0, creditsRemaining - 2);
                        setCreditsRemaining(newCredits);
                        localStorage.setItem('insta_free_credits', newCredits.toString());
                    }
                }

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
                            placeholder={placeholder || 'Enter Username'}
                            className={styles.input}
                            disabled={loading || !authChecked}
                        />
                    </div>
                    <button type="submit" className={styles.button} disabled={loading || !username || !authChecked}>
                        {loading ? <span className={styles.loader}></span> : t('viewProfile')}
                    </button>
                </form>

                {/* Credits Display */}
                {authChecked && (
                    <div style={{ marginTop: '0.75rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-text-light-muted)' }}>
                        {userPlan === 'monthly' ? (
                            <span style={{ color: '#10b981', fontWeight: '500' }}>✨ Unlimited Search Access</span>
                        ) : (
                            <>
                                <span>{creditsRemaining / 2} Profile Searches Remaining</span>
                                {creditsRemaining < 2 && (
                                    <Link href="/pricing" style={{ color: '#ff0080', marginLeft: '0.5rem', fontWeight: 'bold' }}>
                                        Upgrade Plan →
                                    </Link>
                                )}
                            </>
                        )}
                    </div>
                )}

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
                <div className={styles.profileBox} ref={resultsRef}>
                        {/* Full Width Hero Area (Header + Highlights) */}
                        <div className={styles.profileHeader}>
                            <div
                                className={`${styles.avatarWrapper} ${profile.stories?.data?.length > 0 ? styles.hasStory : ''}`}
                                onClick={() => {
                                    if (profile.stories?.data?.length > 0) {
                                        setSelectedMedia(profile.stories.data[0]);
                                    } else {
                                        setSelectedMedia({
                                            id: 'profile-pic',
                                            media_url: profile.profile_picture_url,
                                            media_type: 'IMAGE',
                                            caption: `${profile.username}'s profile picture`,
                                            timestamp: new Date().toISOString(),
                                            permalink: `https://instagram.com/${profile.username}`,
                                        });
                                    }
                                }}
                                title={profile.stories?.data?.length > 0 ? 'View Story' : 'View Profile Picture'}
                            >
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

                        {/* Main Content with Tabs + Grid */}
                        <div className={styles.mainContent}>
                            {!restrictedTo && (
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
                                        <svg aria-label="" fill="currentColor" height="12" role="img" viewBox="0 0 24 24" width="12"><line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="2.049" x2="21.95" y1="7.002" y2="7.002"></line><line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="13.504" x2="16.362" y1="2.001" y2="7.002"></line><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="7.207" x2="10.002" y1="2.11" y2="7.002"></line><path d="M2 12.001v3.449c0 2.849.698 4.006 1.606 4.945.94.908 2.098 1.607 4.946 1.607h6.896c2.848 0 4.006-.699 4.946-1.607.908-.939 1.606-2.096 1.606-4.945V8.552c0-2.848-.698-4.006-1.606-4.945C19.454 2.699 18.296 2 15.448 2H8.552c-2.848 0-4.006.699-4.946 1.607C2.698 4.546 2 5.704 2 8.552Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path><path d="M9.763 17.664a.908.908 0 0 1-.455-1.655l4.1-2.408a.91.91 0 0 1 0-.916l-4.1-2.408a.908.908 0 0 1-.913.065.909.909 0 0 1-.445-.838v4.818a.909.909 0 0 1-.914.918" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path></svg>
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
                                        className={`${styles.tab} ${activeTab === 'HIGHLIGHTS' ? styles.activeTab : ''}`}
                                        onClick={() => setActiveTab('HIGHLIGHTS')}
                                    >
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                                        <span>HIGHLIGHTS</span>
                                    </button>
                                </div>
                            )}

                            {activeTab === 'HIGHLIGHTS' ? (
                                /* Highlights Grid - Circular thumbnails */
                                <div className={styles.highlightsGrid}>
                                    {userPlan === 'free' ? (
                                        <div className={styles.lockedItem} style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem 1rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '1rem', border: '1px dashed rgba(255, 255, 255, 0.1)' }}>
                                            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔒</div>
                                            <h3 style={{ marginBottom: '0.5rem', color: '#fff' }}>Pro Plan Required</h3>
                                            <p style={{ color: 'var(--color-text-light-muted)', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
                                                Viewing <strong>Highlights</strong> is a premium feature available only on the Pro plan.
                                            </p>
                                            <Link href="/pricing" className={styles.button} style={{ display: 'inline-block', width: 'auto', padding: '0.75rem 2rem' }}>
                                                Upgrade to Pro
                                            </Link>
                                        </div>
                                    ) : getFilteredMedia().length > 0 ? (
                                        getFilteredMedia().map((item: any) => (
                                            <div
                                                key={item.id}
                                                className={styles.highlightGridItem}
                                                onClick={() => setSelectedMedia({
                                                    ...item,
                                                    media_url: item.cover_media?.media_url || item.cover_media?.thumbnail_url || item.thumbnail_url || item.media_url,
                                                    media_type: 'IMAGE',
                                                })}
                                            >
                                                <div className={styles.highlightGridCircle}>
                                                    <img
                                                        src={item.cover_media?.thumbnail_url || item.cover_media?.media_url || item.thumbnail_url || item.media_url}
                                                        alt={item.title || 'Highlight'}
                                                        className={styles.highlightGridThumb}
                                                    />
                                                </div>
                                                <span className={styles.highlightGridLabel}>
                                                    {item.title || 'Highlight'}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className={styles.emptyState} style={{ gridColumn: '1 / -1' }}>
                                            <p>{t('noMedia', { type: 'highlights' })}</p>
                                            <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', opacity: 0.7 }}>Highlights are only available for some public profiles.</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                /* Regular Media Grid - Posts, Reels, Stories */
                                <div className={styles.mediaGrid}>
                                    {activeTab === 'STORIES' && userPlan === 'free' ? (
                                        <div className={styles.lockedItem} style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem 1rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '1rem', border: '1px dashed rgba(255, 255, 255, 0.1)' }}>
                                            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔒</div>
                                            <h3 style={{ marginBottom: '0.5rem', color: '#fff' }}>Pro Plan Required</h3>
                                            <p style={{ color: 'var(--color-text-light-muted)', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
                                                Viewing <strong>Stories</strong> is a premium feature available only on the Pro plan.
                                            </p>
                                            <Link href="/pricing" className={styles.button} style={{ display: 'inline-block', width: 'auto', padding: '0.75rem 2rem' }}>
                                                Upgrade to Pro
                                            </Link>
                                        </div>
                                    ) : getFilteredMedia().length > 0 ? (
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
                                                    <button
                                                        className={styles.overlayDownloadBtn}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (userPlan === 'free') {
                                                                setLoginModalMessage('🔒 Downloading media is a premium feature. Upgrade to Pro to save posts and reels directly to your device!');
                                                                setShowLoginModal(true);
                                                                return;
                                                            }
                                                            const isVideo = item.media_type === 'VIDEO';
                                                            const fileUrl = item.media_url;
                                                            const filename = `insta-${item.id}.${isVideo ? 'mp4' : 'jpg'}`;
                                                            window.location.href = `/api/download?url=${encodeURIComponent(fileUrl)}&filename=${filename}`;
                                                        }}
                                                        title={userPlan === 'free' ? "Download (Pro)" : "Download"}
                                                    >
                                                        {userPlan === 'free' ? (
                                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                                        ) : (
                                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                                        )}
                                                    </button>
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
                            )}
                        </div>
                    </div>
            )}

            {selectedMedia && (
                    <MediaViewer
                        media={selectedMedia}
                        profile={profile}
                        userPlan={userPlan}
                        onClose={() => setSelectedMedia(null)}
                        onShowLogin={(msg) => {
                            setLoginModalMessage(msg);
                            setShowLoginModal(true);
                        }}
                    />
            )}

            <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                message={loginModalMessage}
            />
        </div>
    );
}
