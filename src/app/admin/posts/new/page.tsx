'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
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

export default function NewPostPage() {
    const router = useRouter();
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
        canonical_url: '',
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


    useEffect(() => {
        loadCategories();
    }, []);

    // Auto-save every 30 seconds
    useEffect(() => {
        const autoSaveInterval = setInterval(() => {
            if (formData.title && formData.content) {
                handleAutoSave();
            }
        }, 30000);

        return () => clearInterval(autoSaveInterval);
    }, [formData]);

    const handleAutoSave = async () => {
        // Don't auto-save if no title
        if (!formData.title) return;

        try {
            // 1. Save to local storage as backup
            localStorage.setItem('draft_post', JSON.stringify({
                ...formData,
                categories: selectedCategories,
                savedAt: new Date().toISOString()
            }));

            // 2. Server-side auto-save
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return; // Can't save to server if not logged in

            const payload = {
                ...formData,
                status: 'draft', // Always save as draft during auto-save
                slug: formData.slug || generateSlug(formData.title),
                categories: selectedCategories,
            };

            const res = await fetch('/api/admin/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                const data = await res.json();
                setLastSaved(new Date());

                // If this was a new post and we just created it via auto-save, 
                // we should switch to edit mode to avoid creating duplicates.
                if (data.post && data.post.id) {
                    router.replace(`/admin/posts/${data.post.id}/edit`);
                }
            }

        } catch (error) {
            console.error('Auto-save failed', error);
        }
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

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        setFormData(prev => ({
            ...prev,
            title,
            slug: prev.slug || generateSlug(title),
        }));
    };

    const handleSave = async (status?: string, openPreview = false) => {
        if (!formData.title.trim()) {
            alert('Please enter a title');
            return;
        }

        setSaving(true);
        try {
            const payload = {
                ...formData,
                status: status || formData.status,
                slug: formData.slug || generateSlug(formData.title),
                categories: selectedCategories,
            };

            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.access_token) {
                alert('Session expired. Please log in again.');
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
                localStorage.removeItem('draft_post');
                const data = await res.json();

                if (openPreview) {
                    window.open(`/${payload.slug}?preview=true`, '_blank');
                    if (data.post && data.post.id) {
                        router.push(`/admin/posts/${data.post.id}/edit`);
                    } else {
                        router.push('/admin/posts');
                    }
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
            if (!session?.access_token) {
                alert('Session expired');
                setUploading(false);
                return;
            }

            const res = await fetch('/api/admin/upload', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${session.access_token}` },
                body: formDataUpload,
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Upload failed');
            }

            const data = await res.json();
            setFormData(prev => ({ ...prev, featured_image: data.url }));
        } catch (error: any) {
            console.error('Upload Error:', error);
            alert(error.message || 'Failed to upload image');
        }
        setUploading(false);
    };

    // Load draft from localStorage
    useEffect(() => {
        const savedDraft = localStorage.getItem('draft_post');
        if (savedDraft) {
            try {
                const draft = JSON.parse(savedDraft);
                if (draft && draft.title && confirm('Restore unsaved draft?')) {
                    setFormData(prev => ({ ...prev, ...draft }));
                    if (draft.categories) setSelectedCategories(draft.categories);
                }
            } catch (e) {
                console.error('Failed to parse draft', e);
            }
        }
    }, []);

    return (
        <div className={isFullscreen ? 'fullscreen-editor' : ''}>
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">New Post</h1>
                    <p className="page-subtitle">
                        Create a brand new story for your blog
                        {lastSaved && (
                            <span style={{ marginLeft: '12px', fontSize: '13px', color: 'var(--admin-primary)', fontWeight: '600' }}>
                                • Auto-saved {lastSaved.toLocaleTimeString()}
                            </span>
                        )}
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        className="btn btn-secondary"
                        onClick={() => handleSave('draft', true)}
                        disabled={saving}
                        style={{ background: 'var(--admin-bg)', border: '1px solid var(--admin-primary)', color: 'var(--admin-primary)' }}
                    >
                        Save & Preview
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={() => handleSave('published')}
                        disabled={saving}
                    >
                        {saving ? 'Publishing...' : 'Publish Post'}
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
                                onChange={handleTitleChange}
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
                            minHeight="600px"
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
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '16px' }}>
                            <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => handleSave('draft')}
                                disabled={saving}
                            >
                                Save Draft
                            </button>
                            <button
                                className="btn btn-primary btn-sm"
                                onClick={() => handleSave('published')}
                                disabled={saving}
                            >
                                {saving ? '...' : 'Publish'}
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
