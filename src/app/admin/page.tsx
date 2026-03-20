'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText } from 'lucide-react';

interface DashboardStats {
    totalPosts: number;
    totalPages: number;
    totalCategories: number;
    publishedPosts: number;
    draftPosts: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats>({
        totalPosts: 0,
        totalPages: 0,
        totalCategories: 0,
        publishedPosts: 0,
        draftPosts: 0,
    });
    const [recentPosts, setRecentPosts] = useState<any[]>([]);
    const [searchAnalytics, setSearchAnalytics] = useState<any>({
        topSearches: [],
        recentSearches: [],
        stats: { totalSearches: 0, todaySearches: 0 }
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            // Load posts, pages, categories (parallel)
            const [postsRes, pagesRes, categoriesRes, analyticsRes] = await Promise.all([
                fetch('/api/admin/posts'),
                fetch('/api/admin/pages'),
                fetch('/api/admin/categories'),
                fetch('/api/admin/analytics/searches')
            ]);

            const postsData = await postsRes.json();
            const pagesData = await pagesRes.json();
            const categoriesData = await categoriesRes.json();
            const analyticsData = await analyticsRes.json();

            const posts = postsData.posts || [];
            const pages = pagesData.pages || [];
            const categories = categoriesData.categories || [];

            setStats({
                totalPosts: posts.length,
                totalPages: pages.length,
                totalCategories: categories.length,
                publishedPosts: posts.filter((p: any) => p.status === 'published').length,
                draftPosts: posts.filter((p: any) => p.status === 'draft').length,
            });

            setRecentPosts(posts.slice(0, 5));
            setSearchAnalytics(analyticsData);
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        }
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="admin-loading">
                <div className="admin-spinner"></div>
            </div>
        );
    }

    return (
        <div>
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">Dashboard</h1>
                    <p className="page-subtitle">Welcome back to InstaPSV Admin</p>
                </div>
                <Link href="/admin/posts/new" className="btn btn-primary">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5v14M5 12h14" />
                    </svg>
                    New Post
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-content">
                        <div className="stat-value">{stats.totalPosts}</div>
                        <div className="stat-label">Total Posts</div>
                    </div>
                    <div className="stat-icon-wrapper blue">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-content">
                        <div className="stat-value">{stats.publishedPosts}</div>
                        <div className="stat-label">Published</div>
                    </div>
                    <div className="stat-icon-wrapper green">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-content">
                        <div className="stat-value">{stats.totalPages}</div>
                        <div className="stat-label">Pages</div>
                    </div>
                    <div className="stat-icon-wrapper orange">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                            <polyline points="13 2 13 9 20 9" />
                        </svg>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-content">
                        <div className="stat-value">{stats.totalCategories}</div>
                        <div className="stat-label">Categories</div>
                    </div>
                    <div className="stat-icon-wrapper purple">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Search Analytics Overview */}
            <div className="stats-grid" style={{ marginBottom: '32px' }}>
                <div className="stat-card">
                    <div className="stat-content">
                        <div className="stat-value">{searchAnalytics.stats.todaySearches}</div>
                        <div className="stat-label">Searches Today</div>
                    </div>
                    <div className="stat-icon-wrapper green">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-content">
                        <div className="stat-value">{searchAnalytics.stats.totalSearches}</div>
                        <div className="stat-label">Total Searches</div>
                    </div>
                    <div className="stat-icon-wrapper blue">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                    </div>
                </div>
            </div>

            {/* Content Layout */}
            <div className="dashboard-grid">
                {/* Search Analytics */}
                <div className="admin-card">
                    <div className="admin-card-header">
                        <h2 className="admin-card-title">🔥 Trending Profiles</h2>
                        <span className="text-muted" style={{ fontSize: '0.8rem' }}>Most Searched</span>
                    </div>
                    <div className="table-responsive">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Searches</th>
                                </tr>
                            </thead>
                            <tbody>
                                {searchAnalytics.topSearches.map((item: any, i: number) => (
                                    <tr key={i}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span style={{ color: 'var(--admin-primary)', fontWeight: '600' }}>#{i + 1}</span>
                                                <span>@{item.username}</span>
                                            </div>
                                        </td>
                                        <td style={{ fontWeight: '500' }}>{item.count}</td>
                                    </tr>
                                ))}
                                {searchAnalytics.topSearches.length === 0 && (
                                    <tr><td colSpan={2} style={{ textAlign: 'center' }}>No search data yet</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="admin-card">
                    <div className="admin-card-header">
                        <h2 className="admin-card-title">🕒 Search Activity</h2>
                    </div>
                    <div className="table-responsive">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {searchAnalytics.recentSearches.map((item: any, i: number) => (
                                    <tr key={i}>
                                        <td>@{item.username_searched}</td>
                                        <td className="text-muted">{new Date(item.created_at).toLocaleTimeString()}</td>
                                    </tr>
                                ))}
                                {searchAnalytics.recentSearches.length === 0 && (
                                    <tr><td colSpan={2} style={{ textAlign: 'center' }}>No activity yet</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Posts */}
                <div className="admin-card">
                    <div className="admin-card-header">
                        <h2 className="admin-card-title">Recent Posts</h2>
                    </div>
                    {recentPosts.length > 0 ? (
                        <div className="table-responsive">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentPosts.map((post: any) => (
                                        <tr key={post.id}>
                                            <td>
                                                <Link href={`/admin/posts/${post.id}/edit`} className="post-link">
                                                    {post.title}
                                                </Link>
                                            </td>
                                            <td>
                                                <span className={`status-badge status-${post.status}`}>
                                                    {post.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="empty-state" style={{ padding: '20px' }}>
                            <p>No posts yet</p>
                        </div>
                    )}
                </div>

                {/* Quick Actions & System Status */}
                <div className="dashboard-sidebar">
                    <div className="admin-card">
                        <div className="admin-card-header">
                            <h2 className="admin-card-title">Quick Actions</h2>
                        </div>
                        <div className="quick-actions">
                            <Link href="/admin/posts/new" className="action-btn">
                                <span className="action-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 5v14M5 12h14" />
                                    </svg>
                                </span>
                                Create New Post
                            </Link>
                            <Link href="/admin/pages/new" className="action-btn">
                                <span className="action-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                                        <polyline points="13 2 13 9 20 9" />
                                    </svg>
                                </span>
                                Create New Page
                            </Link>
                            <Link href="/admin/categories" className="action-btn">
                                <span className="action-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                                    </svg>
                                </span>
                                Manage Categories
                            </Link>
                            <Link href="/admin/settings" className="action-btn">
                                <span className="action-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="3" />
                                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                                    </svg>
                                </span>
                                Site Settings
                            </Link>
                        </div>
                    </div>

                    <div className="admin-card">
                        <div className="admin-card-header">
                            <h2 className="admin-card-title">System Status</h2>
                        </div>
                        <div className="system-status-list">
                            <div className="status-item">
                                <span className="status-indicator active"></span>
                                <div>
                                    <strong>Redis Cache</strong>
                                    <p className="status-sub">Connected</p>
                                </div>
                            </div>
                            <div className="status-item">
                                <span className="status-indicator active"></span>
                                <div>
                                    <strong>Supabase</strong>
                                    <p className="status-sub">Connected</p>
                                </div>
                            </div>
                            <div className="status-item">
                                <span className="status-indicator active"></span>
                                <div>
                                    <strong>Meta API</strong>
                                    <p className="status-sub">Active</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
