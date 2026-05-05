'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import RichEditor from '@/components/admin/RichEditor';
import { compressImage } from '@/lib/imageUtils';
import SEOPanel from '@/components/admin/SEOPanel';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Category {
    id: string;
    name: string;
    slug: string;
}

const generateSlug = (title: string) => {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
};

export default function EditPostPage() {
    const router = useRouter();
    const params = useParams();
    const postId = params.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        status: 'draft',
        featured_image: '',
        featured_image_alt: '',
        // SEO - Basic
        focus_keyword: '',
        meta_title: '',
        meta_description: '',
        meta_keywords: '',
        // SEO - Advanced

        robots: 'index,follow',
        robots_advanced: [] as string[],
        schema_type: 'Article',
        // Social - Open Graph
        og_title: '',
        og_description: '',
        og_image: '',
        // Social - Twitter
        twitter_title: '',
        twitter_description: '',
        twitter_image: '',
        twitter_card_type: 'summary_large_image',
    });

    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);


    // Auto-save every 30 seconds
    useEffect(() => {
        const autoSaveInterval = setInterval(() => {
            if (formData.title) {
                handleAutoSave();
            }
        }, 30000);

        return () => clearInterval(autoSaveInterval);
    }, [formData]);

    const handleAutoSave = async () => {
        if (!formData.title) return;

        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        try {
            // Save to server only if it's a draft
            if (formData.status === 'draft') {
                await fetch('/api/admin/posts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${session.access_token}`
                    },
                    body: JSON.stringify({
                        id: postId,
                        ...formData,
                        categories: selectedCategories,
                    }),
                });
            }

            // Always save to local storage as fallback
            localStorage.setItem(`draft_post_${postId}`, JSON.stringify({
                ...formData,
                categories: selectedCategories,
                savedAt: new Date().toISOString()
            }));
            
            setLastSaved(new Date());
        } catch (e) {
            console.error("Auto-save failed", e);
        }
    };

    useEffect(() => {
        loadPost();
        loadCategories();
    }, [postId]);

    const loadPost = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch(`/api/admin/posts?id=${postId}`, {
                headers: { 'Authorization': `Bearer ${session?.access_token || ''}` }
            });
            const data = await res.json();

            if (data.post) {
                setFormData({
                    title: data.post.title || '',
                    slug: data.post.slug || '',
                    content: data.post.content || '',
                    excerpt: data.post.excerpt || '',
                    status: data.post.status || 'draft',
                    featured_image: data.post.featured_image || '',
                    featured_image_alt: data.post.featured_image_alt || '',
                    focus_keyword: data.post.focus_keyword || '',
                    meta_title: data.post.meta_title || '',
                    meta_description: data.post.meta_description || '',
                    meta_keywords: data.post.meta_keywords || '',

                    robots: data.post.robots || 'index,follow',
                    robots_advanced: data.post.robots_advanced || [],
                    schema_type: data.post.schema_type || 'Article',
                    og_title: data.post.og_title || '',
                    og_description: data.post.og_description || '',
                    og_image: data.post.og_image || '',
                    twitter_title: data.post.twitter_title || '',
                    twitter_description: data.post.twitter_description || '',
                    twitter_image: data.post.twitter_image || '',
                    twitter_card_type: data.post.twitter_card_type || 'summary_large_image',
                });
                if (data.post.categories) {
                    setSelectedCategories(data.post.categories.map((c: any) => c.category_id));
                }
            }
        } catch (error) {
            console.error('Failed to load post:', error);
        }
        setLoading(false);
    };

    const loadCategories = async () => {
        try {
            const res = await fetch('/api/admin/categories');
            const data = await res.json();
            setCategories(data.categories || []);
        } catch (error) {
            console.error('Failed to load categories');
        }
    };

    const handleSave = async (status?: string, openPreview = false) => {
        if (!formData.title.trim()) {
            alert('Please enter a title');
            return;
        }

        setSaving(true);
        try {
            const payload = {
                id: postId,
                ...formData,
                status: status || formData.status,
                categories: selectedCategories,
            };

            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.access_token) {
                alert('Session expired');
                setSaving(false);
                return;
            }

            const res = await fetch('/api/admin/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                localStorage.removeItem(`draft_post_${postId}`);
                if (openPreview) {
                    window.open(`/${formData.slug}?preview=true`, '_blank');
                } else {
                    router.push('/admin/posts');
                }
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to save post');
            }
        } catch (error) {
            console.error('Failed to save:', error);
            alert('Failed to save post');
        }
        setSaving(false);
    };

    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const compressedFile = await compressImage(file, 100);
            const formDataUpload = new FormData();
            formDataUpload.append('file', compressedFile);
            const { data: { session } } = await supabase.auth.getSession();
            
            const res = await fetch('/api/admin/upload', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${session?.access_token || ''}` },
                body: formDataUpload,
            });

            if (!res.ok) throw new Error('Upload failed');
            const data = await res.json();
            setFormData(prev => ({ ...prev, featured_image: data.url }));
        } catch (error: any) {
            console.error('Upload Error:', error);
            alert('Failed to upload image');
        }
        setUploading(false);
    };

    if (loading) {
        return (
            <div className="admin-loading">
                <div className="admin-spinner"></div>
            </div>
        );
    }

    return (
        <div className={isFullscreen ? 'fullscreen-editor' : ''}>
            {/* Page Header */}
            <div className="page-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Link href="/admin/posts" className="back-btn" title="Back to Posts">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                    </Link>
                    <div>
                        <h1 className="page-title">Edit Post</h1>
                        <p className="page-subtitle">
                            Refine your content for {formData.title || 'the blog'}
                            {lastSaved && (
                                <span style={{ marginLeft: '12px', fontSize: '13px', color: 'var(--admin-primary)', fontWeight: '600' }}>
                                    • Auto-saved {lastSaved.toLocaleTimeString()}
                                </span>
                            )}
                        </p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        className="btn btn-secondary"
                        onClick={() => handleSave(formData.status, true)}
                        disabled={saving}
                        style={{ background: 'var(--admin-bg)', border: '1px solid var(--admin-primary)', color: 'var(--admin-primary)' }}
                    >
                        Preview Changes
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={() => handleSave(formData.status)}
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : formData.status === 'published' ? 'Update Post' : 'Save Draft'}
                    </button>
                </div>
            </div>

            {/* Professional Two-Column Editor Grid */}
            <div className="post-editor-grid">
                {/* Main Content Column */}
                <div className="post-editor-main">
                    {/* Writing Header (Distraction-Free) */}
                    <div className="admin-card" style={{ padding: '24px', marginBottom: '24px' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Post Title..."
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                style={{
                                    fontSize: '32px',
                                    fontWeight: '800',
                                    border: 'none',
                                    padding: '0',
                                    letterSpacing: '-1px',
                                    color: 'var(--admin-text)',
                                    background: 'transparent'
                                }}
                            />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
                                <span style={{ color: 'var(--admin-text-muted)', fontSize: '13px' }}>Permalink:</span>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '2px',
                                    background: 'var(--admin-bg)',
                                    padding: '4px 10px',
                                    borderRadius: '6px',
                                    fontSize: '13px'
                                }}>
                                    <span style={{ color: '#94a3b8' }}>/</span>
                                    <input
                                        type="text"
                                        value={formData.slug}
                                        onChange={(e) => setFormData(prev => ({ ...prev, slug: generateSlug(e.target.value) }))}
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            color: 'var(--admin-primary)',
                                            fontWeight: '600',
                                            outline: 'none',
                                            width: 'auto',
                                            minWidth: '120px'
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Integrated Professional TipTap Editor */}
                    <div className="editor-container" style={{ marginBottom: '24px' }}>
                        <RichEditor
                            content={formData.content}
                            onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                            placeholder="Tell your story professionally..."
                            minHeight="650px"
                        />
                    </div>

                    {/* Excerpt Section */}
                    <div className="admin-card">
                        <div className="admin-card-header">
                            <h3 className="admin-card-title">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px', verticalAlign: 'middle' }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                                Excerpt
                            </h3>
                            <p className="admin-card-desc">Write a brief summary for blog listings</p>
                        </div>
                        <textarea
                            className="form-textarea"
                            placeholder="Compelling summary..."
                            value={formData.excerpt}
                            onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                            style={{ minHeight: '100px' }}
                        />
                    </div>

                    {/* SEO Management Panel */}
                    <div style={{ marginTop: '24px' }}>
                        <SEOPanel formData={formData} setFormData={setFormData} />
                    </div>
                </div>

                {/* Sidebar Column (Controls & Meta) */}
                <aside className="post-editor-sidebar">
                    {/* Publishing Status */}
                    <div className="admin-card">
                        <div className="admin-card-header">
                            <h3 className="admin-card-title">Publishing</h3>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Post Status</label>
                            <select
                                className="form-select"
                                value={formData.status}
                                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                            >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                                <option value="scheduled">Scheduled</option>
                            </select>
                        </div>
                        <div className="form-group" style={{ marginTop: '16px' }}>
                             <div style={{ fontSize: '13px', color: 'var(--admin-text-muted)', marginBottom: '8px' }}>
                                <strong>Status:</strong> {formData.status.charAt(0).toUpperCase() + formData.status.slice(1)}
                             </div>
                             {formData.slug && (
                                <a
                                    href={`/${formData.slug}`}
                                    target="_blank"
                                    className="btn btn-secondary btn-sm"
                                    style={{ width: '100%', justifyContent: 'center', textDecoration: 'none' }}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px' }}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                                    View Live
                                </a>
                             )}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px', marginTop: '16px' }}>
                            <button
                                className="btn btn-primary btn-sm"
                                onClick={() => handleSave(formData.status)}
                                disabled={saving}
                                style={{ width: '100%' }}
                            >
                                {saving ? 'Updating...' : 'Update Post'}
                            </button>
                        </div>
                    </div>

                    {/* Featured Image */}
                    <div className="admin-card">
                        <div className="admin-card-header">
                            <h3 className="admin-card-title">Featured Image</h3>
                        </div>
                        <div
                            className={`image-upload-zone ${formData.featured_image ? 'has-image' : ''}`}
                            onClick={() => !formData.featured_image && fileInputRef.current?.click()}
                        >
                            {uploading && <div className="admin-spinner" style={{ margin: 'auto' }}></div>}
                            
                            {formData.featured_image ? (
                                <div style={{ position: 'relative' }}>
                                    <img src={formData.featured_image} alt="Featured" style={{ width: '100%', borderRadius: '8px' }} />
                                    <button
                                        className="image-remove-btn"
                                        onClick={(e) => { e.stopPropagation(); setFormData(prev => ({ ...prev, featured_image: '' })); }}
                                    >
                                        ×
                                    </button>
                                </div>
                            ) : !uploading && (
                                <div style={{ textAlign: 'center' }}>
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                                    <p style={{ fontSize: '12px', marginTop: '8px', color: 'var(--admin-text-muted)' }}>Choose image</p>
                                </div>
                            )}
                        </div>
                        <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleImageUpload} />
                    </div>

                    {/* Categories Management */}
                    <div className="admin-card">
                        <div className="admin-card-header">
                            <h3 className="admin-card-title">Categories</h3>
                        </div>
                        <div className="category-selection-list">
                            {categories.map(cat => (
                                <label key={cat.id} className={`category-checkbox-item ${selectedCategories.includes(cat.id) ? 'selected' : ''}`}>
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.includes(cat.id)}
                                        onChange={() => setSelectedCategories(prev => prev.includes(cat.id) ? prev.filter(id => id !== cat.id) : [...prev, cat.id])}
                                    />
                                    <span>{cat.name}</span>
                                </label>
                            ))}
                        </div>
                        <Link href="/admin/categories" className="btn btn-secondary btn-sm" style={{ width: '100%', marginTop: '12px', textAlign: 'center' }}>
                            + Manage Categories
                        </Link>
                    </div>
                </aside>
            </div>
        </div>
    );
}
