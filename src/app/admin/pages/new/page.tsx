'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import RichEditor from '@/components/admin/RichEditor';

export default function NewPagePage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        content: '',
        template: 'default',
        status: 'draft',
        meta_title: '',
        meta_description: '',
        robots: 'index,follow',
    });

    const generateSlug = (title: string) => {
        return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        setFormData(prev => ({
            ...prev,
            title,
            slug: prev.slug || generateSlug(title),
        }));
    };

    const handleSave = async (status?: string) => {
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
            };

            const res = await fetch('/api/admin/pages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                router.push('/admin/pages');
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to save page');
            }
        } catch (error) {
            console.error('Failed to save:', error);
            alert('Failed to save page');
        }
        setSaving(false);
    };

    const wordCount = formData.content.replace(/<[^>]*>/g, '').split(/\s+/).filter(x => x).length;

    return (
        <div style={{ maxWidth: '100%', paddingBottom: '100px' }}>
            <div className="page-header" style={{ marginBottom: '30px' }}>
                <div>
                    <Link href="/admin/pages" className="btn-back" style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--admin-text-muted)', marginBottom: '12px', textDecoration: 'none', fontSize: '14px' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px' }}>
                            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
                        </svg>
                        Back to Pages
                    </Link>
                    <h1 className="page-title" style={{ fontSize: '2rem', marginBottom: '8px' }}>
                        New Page
                    </h1>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-secondary" onClick={() => handleSave('draft')} disabled={saving}>
                        Save Draft
                    </button>
                    <button className="btn btn-primary" onClick={() => handleSave('published')} disabled={saving}>
                        {saving ? 'Publishing...' : 'Publish'}
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '40px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>

                    {/* Title & Slug */}
                    <div style={{ padding: '0 0 20px', borderBottom: '1px solid var(--admin-border)' }}>
                        <input
                            type="text"
                            placeholder="Title..."
                            value={formData.title}
                            onChange={handleTitleChange}
                            style={{
                                width: '100%',
                                fontSize: '42px',
                                fontWeight: '800',
                                border: 'none',
                                background: 'transparent',
                                outline: 'none',
                                color: 'var(--text-color, #111)',
                                fontFamily: 'var(--font-heading, sans-serif)',
                                lineHeight: '1.2'
                            }}
                        />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px' }}>
                            <span style={{ color: '#888', fontSize: '14px' }}>instapsv.com/</span>
                            <input
                                type="text"
                                value={formData.slug}
                                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#555',
                                    fontSize: '14px',
                                    outline: 'none',
                                    width: '100%'
                                }}
                            />
                        </div>
                    </div>

                    {/* Rich Editor */}
                    <div>
                        <RichEditor
                            content={formData.content}
                            onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                            placeholder="Tell your story..."
                            minHeight="60vh"
                        />
                    </div>
                </div>

                {/* Sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    {/* SEO Card */}
                    <div className="admin-card">
                        <div className="admin-card-header">
                            <h3 className="admin-card-title">SEO Settings</h3>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Meta Title</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder={formData.title || 'Page Title'}
                                value={formData.meta_title}
                                onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
                            />
                            <div style={{ fontSize: '11px', color: formData.meta_title.length > 60 ? '#ef4444' : 'var(--admin-text-muted)', marginTop: '4px', textAlign: 'right' }}>
                                {formData.meta_title.length}/60
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Meta Description</label>
                            <textarea
                                className="form-textarea"
                                placeholder="Description for search engines..."
                                value={formData.meta_description}
                                onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                                style={{ minHeight: '100px' }}
                            />
                            <div style={{ fontSize: '11px', color: formData.meta_description.length > 160 ? '#ef4444' : 'var(--admin-text-muted)', marginTop: '4px', textAlign: 'right' }}>
                                {formData.meta_description.length}/160
                            </div>
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Robots</label>
                            <select
                                className="form-select"
                                value={formData.robots}
                                onChange={(e) => setFormData(prev => ({ ...prev, robots: e.target.value }))}
                            >
                                <option value="index,follow">Index, Follow</option>
                                <option value="noindex,follow">No Index, Follow</option>
                                <option value="noindex,nofollow">No Index, No Follow</option>
                            </select>
                        </div>
                    </div>

                    {/* Page Settings */}
                    <div className="admin-card">
                        <div className="admin-card-header">
                            <h3 className="admin-card-title">Page Settings</h3>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Status</label>
                            <select
                                className="form-select"
                                value={formData.status}
                                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                            >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                            </select>
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Template</label>
                            <select
                                className="form-select"
                                value={formData.template}
                                onChange={(e) => setFormData(prev => ({ ...prev, template: e.target.value }))}
                            >
                                <option value="default">Default</option>
                                <option value="full-width">Full Width</option>
                                <option value="sidebar">With Sidebar</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ fontSize: '13px', color: '#999', textAlign: 'center' }}>
                        {wordCount} words &bull; {Math.ceil(wordCount / 200)} min read
                    </div>

                </div>
            </div>

            <style jsx global>{`
                .admin-card {
                    background: var(--admin-card-bg, #fff);
                    border: 1px solid var(--admin-border, #eee);
                    border-radius: 12px;
                    padding: 20px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
                }
                .admin-card-header {
                    margin-bottom: 16px;
                    border-bottom: 1px solid var(--admin-border, #eee);
                    padding-bottom: 12px;
                }
                .admin-card-title {
                    font-size: 16px;
                    font-weight: 700;
                    margin: 0;
                }
                 @media (max-width: 1024px) {
                    div[style*="grid-template-columns: 1fr 320px"] {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </div>
    );
}
