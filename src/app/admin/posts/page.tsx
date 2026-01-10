'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Post {
    id: string;
    title: string;
    slug: string;
    status: string;
    created_at: string;
    published_at: string | null;
}

export default function PostsPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                setError("Authentication failed: No session found. Please log in.");
                setLoading(false);
                return;
            }

            const res = await fetch('/api/admin/posts', {
                headers: {
                    'Authorization': `Bearer ${session.access_token}`
                }
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || `Server Error: ${res.status}`);
            }

            const data = await res.json();
            setPosts(data.posts || []);
        } catch (error: any) {
            console.error('Failed to load posts:', error);
            setError(error.message || "Failed to load posts");
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this post?')) return;

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const res = await fetch(`/api/admin/posts?id=${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`
                }
            });

            if (res.ok) {
                loadPosts();
            }
        } catch (error) {
            console.error('Failed to delete post:', error);
        }
    };

    const handleBulkAction = async (action: string) => {
        if (selectedPosts.length === 0) {
            alert('Please select at least one post');
            return;
        }

        if (action === 'delete' && !confirm(`Delete ${selectedPosts.length} posts?`)) {
            return;
        }

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            for (const id of selectedPosts) {
                if (action === 'delete') {
                    await fetch(`/api/admin/posts?id=${id}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${session.access_token}`
                        }
                    });
                } else if (action === 'publish' || action === 'draft') {
                    await fetch('/api/admin/posts', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${session.access_token}`
                        },
                        body: JSON.stringify({ id, status: action === 'publish' ? 'published' : 'draft' }),
                    });
                }
            }
            setSelectedPosts([]);
            loadPosts();
        } catch (error) {
            console.error('Bulk action failed:', error);
        }
    };

    const toggleSelectAll = () => {
        if (selectedPosts.length === filteredPosts.length) {
            setSelectedPosts([]);
        } else {
            setSelectedPosts(filteredPosts.map(p => p.id));
        }
    };

    const toggleSelectPost = (id: string) => {
        setSelectedPosts(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    const filteredPosts = posts.filter(post => {
        const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    return (
        <div className="posts-container">
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">Posts</h1>
                    <p className="page-subtitle">Manage, edit, and organize your blog content</p>
                </div>
                <Link href="/admin/posts/new" className="btn btn-primary">
                    <span style={{ fontSize: '18px' }}>+</span> New Post
                </Link>
            </div>

            {/* Premium Controls Bar */}
            <div className="admin-card" style={{ padding: '20px 24px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
                    {/* Search Field with Icon */}
                    <div style={{ position: 'relative', flex: '1', minWidth: '300px' }}>
                        <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-muted)', fontSize: '18px' }}>🔍</span>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Search by title or content..."
                            style={{ paddingLeft: '48px', width: '100%' }}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Status Filter */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--admin-text-muted)' }}>Status:</span>
                        <select
                            className="form-select"
                            style={{ width: '160px' }}
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                            <option value="scheduled">Scheduled</option>
                        </select>
                    </div>

                    {/* Refresh Button */}
                    <button className="btn btn-secondary" onClick={loadPosts} title="Refresh List" style={{ padding: '12px' }}>
                        🔄
                    </button>

                    {/* Bulk Actions (Overlay style) */}
                    {selectedPosts.length > 0 && (
                        <div style={{
                            display: 'flex',
                            gap: '12px',
                            alignItems: 'center',
                            background: 'var(--admin-primary-gradient)',
                            padding: '8px 20px',
                            borderRadius: '12px',
                            color: '#fff',
                            boxShadow: 'var(--admin-shadow-lg)'
                        }}>
                            <span style={{ fontWeight: '600', fontSize: '14px' }}>
                                {selectedPosts.length} selected
                            </span>
                            <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.3)' }} />
                            <button
                                className="btn btn-sm"
                                style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}
                                onClick={() => handleBulkAction('publish')}
                            >
                                Publish
                            </button>
                            <button
                                className="btn btn-sm"
                                style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}
                                onClick={() => handleBulkAction('draft')}
                            >
                                Draft
                            </button>
                            <button
                                className="btn btn-sm"
                                style={{ background: '#ef4444', color: '#fff' }}
                                onClick={() => handleBulkAction('delete')}
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Posts Table */}
            <div className="admin-card" style={{ padding: '0', overflow: 'hidden' }}>
                {loading ? (
                    <div className="admin-loading" style={{ minHeight: '400px' }}>
                        <div className="admin-spinner"></div>
                        <p style={{ color: 'var(--admin-text-muted)', fontWeight: '500' }}>Fetching posts...</p>
                    </div>
                ) : error ? (
                    <div className="empty-state">
                        <div className="empty-state-icon" style={{ color: '#ef4444' }}>⚠️</div>
                        <h3 style={{ color: '#ef4444' }}>Error Loading Posts</h3>
                        <p>{error}</p>
                        <button className="btn btn-secondary" onClick={loadPosts}>
                            Retry
                        </button>
                    </div>
                ) : filteredPosts.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">📝</div>
                        <h3>No posts found</h3>
                        <p>Your search or filter didn't return any results.</p>
                        <button className="btn btn-secondary" onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}>
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th style={{ width: '60px', textAlign: 'center' }}>
                                    <input
                                        type="checkbox"
                                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                        checked={selectedPosts.length === filteredPosts.length && filteredPosts.length > 0}
                                        onChange={toggleSelectAll}
                                    />
                                </th>
                                <th>Title</th>
                                <th>Status</th>
                                <th>Date Created</th>
                                <th style={{ width: '200px', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPosts.map((post) => (
                                <tr key={post.id} style={{ transition: 'var(--admin-transition)' }}>
                                    <td style={{ textAlign: 'center' }}>
                                        <input
                                            type="checkbox"
                                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                            checked={selectedPosts.includes(post.id)}
                                            onChange={() => toggleSelectPost(post.id)}
                                        />
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <Link
                                                href={`/admin/posts/${post.id}/edit`}
                                                style={{
                                                    color: 'var(--admin-text)',
                                                    textDecoration: 'none',
                                                    fontWeight: '700',
                                                    fontSize: '15px'
                                                }}
                                            >
                                                {post.title}
                                            </Link>
                                            <span style={{ color: 'var(--admin-text-muted)', fontSize: '12px', marginTop: '4px' }}>
                                                /blog/{post.slug}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`badge ${post.status === 'published' ? 'badge-success' :
                                            post.status === 'scheduled' ? 'badge-primary' :
                                                'badge-warning'
                                            }`} style={{ minWidth: '100px', justifyContent: 'center' }}>
                                            {post.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontWeight: '600', color: 'var(--admin-text)', fontSize: '13px' }}>
                                                {new Date(post.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </span>
                                            <span style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>
                                                {new Date(post.created_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                            <Link
                                                href={`/admin/posts/${post.id}/edit`}
                                                className="btn btn-secondary btn-sm"
                                                style={{ background: '#f1f5f9', border: 'none' }}
                                            >
                                                ✏️ Edit
                                            </Link>
                                            <a
                                                href={`/blog/${post.slug}`}
                                                target="_blank"
                                                className="btn btn-secondary btn-sm"
                                                style={{ background: '#f1f5f9', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                title="View Post"
                                            >
                                                👁️
                                            </a>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}
                                                onClick={() => handleDelete(post.id)}
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
