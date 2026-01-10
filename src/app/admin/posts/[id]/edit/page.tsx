'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import RichEditor from '@/components/admin/RichEditor';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Category {
    id: string;
    name: string;
    slug: string;
}

export default function EditPostPage() {
    const router = useRouter();
    const params = useParams();
    const postId = params.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const editorRef = useRef<HTMLDivElement>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [showBgColorPicker, setShowBgColorPicker] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        status: 'draft',
        featured_image: '',
        meta_title: '',
        meta_description: '',
        meta_keywords: '',
        og_title: '',
        og_description: '',
        og_image: '',
        robots: 'index,follow',
    });

    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [showSEO, setShowSEO] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    // Auto-save every 30 seconds
    useEffect(() => {
        const autoSaveInterval = setInterval(() => {
            if (formData.title) {
                handleAutoSave();
            }
        }, 30000);

        return () => clearInterval(autoSaveInterval);
    }, [formData]); // Auto-save when form data changes effectively resets timer? No, incorrect dep. 
    // Actually, setInterval will run every 30s. But if we depend on formData, it will reset interval on every keystroke.
    // Correct way: use ref for formData or just let the closure be stale? React hooks trap.
    // Better: use a separate effect for debouncing or keep ref. 
    // BUT `new` page implementation had `[formData]` dependency which resets timer on change. 
    // That acts like a debounce (30s after LAST change). That is actually desired behavior.

    const handleAutoSave = async () => {
        if (!formData.title) return;

        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        try {
            const payload = {
                id: postId, // Ensure ID is passed for update
                ...formData,
                status: 'draft', // FORCE draft status on auto-save?? 
                // Wait, if I am editing a PUBLISHED post, auto-save should probably NOT change it to draft.
                // It should keeping current status OR maybe we shouldn't auto-save published posts to live?
                // The implementation plan said: "Let's update updated_at but keep status."
                // So let's use formData.status but maybe we want to be careful.
                // If I edit a published post, I might not want to push changes live until I click update.
                // But this backend overwrites content. 
                // SAFE APPROACH: Only auto-save if status is 'draft'.
                // If status is published, maybe we only save to localStorage?
                // Let's stick to the plan: "Implement handleAutoSave... to update the existing post."
                // I'll check status. If published, I will SKIP server auto-save to avoid accidents.
            };

            if (formData.status !== 'draft') {
                // Skip server auto-save for published posts to avoid live breakages
                // Just local storage
                localStorage.setItem(`draft_post_${postId}`, JSON.stringify({
                    ...formData,
                    categories: selectedCategories,
                    savedAt: new Date().toISOString()
                }));
                setLastSaved(new Date());
                return;
            }

            // Server save for drafts
            const res = await fetch('/api/admin/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({
                    ...payload,
                    categories: selectedCategories,
                }),
            });

            if (res.ok) {
                setLastSaved(new Date());
            }
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
            // Note: GET request might need auth too if admin API is protected. 
            // The route says: "const adminUser = await verifyAdmin(req);" for GET as well.
            // So we MUST add headers here too.
            const res = await fetch(`/api/admin/posts?id=${postId}`, {
                headers: {
                    'Authorization': `Bearer ${session?.access_token || ''}`
                }
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
                    meta_title: data.post.meta_title || '',
                    meta_description: data.post.meta_description || '',
                    meta_keywords: data.post.meta_keywords || '',
                    og_title: data.post.og_title || '',
                    og_description: data.post.og_description || '',
                    og_image: data.post.og_image || '',
                    robots: data.post.robots || 'index,follow',
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
                if (openPreview) {
                    window.open(`/blog/${formData.slug}?preview=true`, '_blank');
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
    const editorImageInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'featured' | 'editor') => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.access_token) {
                alert('Session expired');
                setUploading(false);
                return;
            }

            const res = await fetch('/api/admin/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: formDataUpload,
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Upload failed');
            }

            const data = await res.json();

            if (target === 'featured') {
                setFormData(prev => ({ ...prev, featured_image: data.url }));
            } else {
                handleFormat('insertImage', data.url);
            }
        } catch (error: any) {
            console.error('Upload Error:', error);
            alert(error.message || 'Failed to upload image');
        }
        setUploading(false);
    };

    const handleFormat = (command: string, value: string | undefined = undefined) => {
        document.execCommand(command, false, value);
        if (editorRef.current) {
            setFormData(prev => ({ ...prev, content: editorRef.current?.innerHTML || '' }));
        }
    };

    const insertCodeBlock = () => {
        const code = prompt('Enter your code:');
        if (code) {
            const html = `<pre style="background:#1e1e1e;color:#d4d4d4;padding:16px;border-radius:8px;overflow-x:auto;font-family:monospace;font-size:14px;"><code>${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre><p><br></p>`;
            document.execCommand('insertHTML', false, html);
            if (editorRef.current) setFormData(prev => ({ ...prev, content: editorRef.current?.innerHTML || '' }));
        }
    };

    const insertTable = () => {
        const rows = prompt('Number of rows:', '3');
        const cols = prompt('Number of columns:', '3');
        if (rows && cols) {
            let tableHtml = '<table style="width:100%;border-collapse:collapse;margin:16px 0;"><thead><tr>';
            for (let c = 0; c < parseInt(cols); c++) {
                tableHtml += '<th style="border:1px solid #ddd;padding:12px;background:#f9fafb;">Header ' + (c + 1) + '</th>';
            }
            tableHtml += '</tr></thead><tbody>';
            for (let r = 0; r < parseInt(rows) - 1; r++) {
                tableHtml += '<tr>';
                for (let c = 0; c < parseInt(cols); c++) {
                    tableHtml += '<td style="border:1px solid #ddd;padding:12px;">Cell</td>';
                }
                tableHtml += '</tr>';
            }
            tableHtml += '</tbody></table><p><br></p>';
            document.execCommand('insertHTML', false, tableHtml);
            if (editorRef.current) setFormData(prev => ({ ...prev, content: editorRef.current?.innerHTML || '' }));
        }
    };

    const insertEmbed = () => {
        const url = prompt('Enter YouTube or Twitter URL:');
        if (url) {
            let embedHtml = '';
            if (url.includes('youtube.com') || url.includes('youtu.be')) {
                const videoId = url.includes('youtu.be')
                    ? url.split('/').pop()
                    : new URLSearchParams(new URL(url).search).get('v');
                embedHtml = `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:16px 0;border-radius:8px;"><iframe src="https://www.youtube.com/embed/${videoId}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;" allowfullscreen></iframe></div><p><br></p>`;
            } else if (url.includes('twitter.com') || url.includes('x.com')) {
                embedHtml = `<blockquote class="twitter-tweet"><a href="${url}">View Tweet</a></blockquote><script async src="https://platform.twitter.com/widgets.js"></script><p><br></p>`;
            } else {
                embedHtml = `<a href="${url}" target="_blank">${url}</a>`;
            }
            document.execCommand('insertHTML', false, embedHtml);
            if (editorRef.current) setFormData(prev => ({ ...prev, content: editorRef.current?.innerHTML || '' }));
        }
    };

    const setTextColor = (color: string) => {
        document.execCommand('foreColor', false, color);
        setShowColorPicker(false);
        if (editorRef.current) setFormData(prev => ({ ...prev, content: editorRef.current?.innerHTML || '' }));
    };

    const setBackgroundColor = (color: string) => {
        document.execCommand('hiliteColor', false, color);
        setShowBgColorPicker(false);
        if (editorRef.current) setFormData(prev => ({ ...prev, content: editorRef.current?.innerHTML || '' }));
    };

    const wordCount = formData.content.replace(/<[^>]*>/g, '').split(/\s+/).filter(x => x).length;
    const readingTime = Math.ceil(wordCount / 200);

    const colorOptions = ['#000000', '#374151', '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'];

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
                <div>
                    <h1 className="page-title">Edit Post</h1>
                    <p className="page-subtitle">Editing: {formData.title}</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <Link href="/admin/posts" className="btn btn-secondary">
                        ← Back
                    </Link>
                    <button
                        className="btn btn-secondary"
                        onClick={() => handleSave('draft', true)}
                        disabled={saving}
                        style={{ background: 'var(--admin-bg)', border: '1px solid var(--admin-primary)', color: 'var(--admin-primary)' }}
                    >
                        🚀 Save & Preview
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={() => handleSave('draft')}
                        disabled={saving}
                    >
                        Save Draft
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={() => handleSave('published')}
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : formData.status === 'published' ? 'Update' : 'Publish'}
                    </button>
                </div>
            </div>

            {/* Premium Two-Column Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: isFullscreen ? '1fr' : '1fr 380px', gap: '32px' }}>
                {/* Main Content Area */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Writing Header (Distraction-Free) */}
                    <div className="admin-card" style={{ padding: '40px' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Enter a catchy title..."
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                style={{
                                    fontSize: '36px',
                                    fontWeight: '800',
                                    border: 'none',
                                    padding: '0',
                                    letterSpacing: '-1px',
                                    color: 'var(--admin-text)'
                                }}
                            />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px' }}>
                                <span style={{ color: 'var(--admin-text-muted)', fontSize: '13px', fontWeight: '500' }}>Permalink:</span>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    background: 'var(--admin-bg)',
                                    padding: '4px 12px',
                                    borderRadius: '8px',
                                    fontSize: '13px'
                                }}>
                                    <span style={{ color: 'var(--admin-text-muted)' }}>/blog/</span>
                                    <input
                                        type="text"
                                        value={formData.slug}
                                        onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            color: 'var(--admin-primary)',
                                            fontWeight: '600',
                                            outline: 'none',
                                            width: 'auto',
                                            minWidth: '100px'
                                        }}
                                    />
                                    <span style={{ cursor: 'pointer' }} title="Copy Link">🔗</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Editor (Visual WYSIWYG) */}
                    <div className="rich-editor-container">
                        <div className="rich-toolbar">
                            <input
                                type="file"
                                ref={editorImageInputRef}
                                style={{ display: 'none' }}
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, 'editor')}
                            />

                            {/* Undo/Redo */}
                            <div className="toolbar-group">
                                <button type="button" onClick={() => document.execCommand('undo')} className="editor-btn" title="Undo">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7v6h6" /><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" /></svg>
                                </button>
                                <button type="button" onClick={() => document.execCommand('redo')} className="editor-btn" title="Redo">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 7v6h-6" /><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" /></svg>
                                </button>
                            </div>

                            <div className="toolbar-divider"></div>

                            {/* Formatting Group */}
                            <div className="toolbar-group">
                                <button type="button" onClick={() => handleFormat('bold')} className="editor-btn" title="Bold">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path></svg>
                                </button>
                                <button type="button" onClick={() => handleFormat('italic')} className="editor-btn" title="Italic">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="4" x2="10" y2="4"></line><line x1="14" y1="20" x2="5" y2="20"></line><line x1="15" y1="4" x2="9" y2="20"></line></svg>
                                </button>
                                <button type="button" onClick={() => handleFormat('underline')} className="editor-btn" title="Underline">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"></path><line x1="4" y1="21" x2="20" y2="21"></line></svg>
                                </button>
                                <button type="button" onClick={() => handleFormat('strikeThrough')} className="editor-btn" title="Strikethrough">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="12" x2="20" y2="12" /><path d="M17.5 7.5c-1.5-1.5-4-2-6.5-1.5-2.5.5-4 2-4 4 0 1.5.5 2.5 3 3.5" /><path d="M6.5 16.5c1.5 1.5 4 2 6.5 1.5 2.5-.5 4-2 4-4" /></svg>
                                </button>
                            </div>

                            <div className="toolbar-divider"></div>

                            {/* Headings */}
                            <div className="toolbar-group">
                                <button type="button" onClick={() => handleFormat('formatBlock', 'h2')} className="editor-btn" title="Heading 2">H2</button>
                                <button type="button" onClick={() => handleFormat('formatBlock', 'h3')} className="editor-btn" title="Heading 3">H3</button>
                                <button type="button" onClick={() => handleFormat('formatBlock', 'h4')} className="editor-btn" title="Heading 4">H4</button>
                            </div>

                            <div className="toolbar-divider"></div>

                            {/* Colors */}
                            <div className="toolbar-group" style={{ position: 'relative' }}>
                                <button type="button" onClick={() => setShowColorPicker(!showColorPicker)} className="editor-btn" title="Text Color">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M4 20h16" /><path d="M9.354 4L12 12l2.646-8" /><path d="M6.5 12h11" />
                                    </svg>
                                </button>
                                {showColorPicker && (
                                    <div style={{ position: 'absolute', top: '100%', left: 0, background: '#fff', padding: '8px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 100, display: 'flex', gap: '4px', flexWrap: 'wrap', width: '120px' }}>
                                        {colorOptions.map(color => (
                                            <button key={color} onClick={() => setTextColor(color)} style={{ width: '24px', height: '24px', background: color, border: 'none', borderRadius: '4px', cursor: 'pointer' }} />
                                        ))}
                                    </div>
                                )}
                                <button type="button" onClick={() => setShowBgColorPicker(!showBgColorPicker)} className="editor-btn" title="Highlight">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 2L2 12l10 10 10-10L12 2z" fill="yellow" fillOpacity="0.3" />
                                        <path d="M12 2L2 12l10 10 10-10L12 2z" />
                                    </svg>
                                </button>
                                {showBgColorPicker && (
                                    <div style={{ position: 'absolute', top: '100%', left: '40px', background: '#fff', padding: '8px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 100, display: 'flex', gap: '4px', flexWrap: 'wrap', width: '120px' }}>
                                        {['#fef08a', '#bbf7d0', '#bfdbfe', '#f5d0fe', '#fed7aa', '#ffffff'].map(color => (
                                            <button key={color} onClick={() => setBackgroundColor(color)} style={{ width: '24px', height: '24px', background: color, border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }} />
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="toolbar-divider"></div>

                            {/* Alignment */}
                            <div className="toolbar-group">
                                <button type="button" onClick={() => handleFormat('justifyLeft')} className="editor-btn" title="Align Left">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="17" y1="10" x2="3" y2="10" /><line x1="21" y1="6" x2="3" y2="6" /><line x1="21" y1="14" x2="3" y2="14" /><line x1="17" y1="18" x2="3" y2="18" /></svg>
                                </button>
                                <button type="button" onClick={() => handleFormat('justifyCenter')} className="editor-btn" title="Align Center">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="10" x2="6" y2="10" /><line x1="21" y1="6" x2="3" y2="6" /><line x1="21" y1="14" x2="3" y2="14" /><line x1="18" y1="18" x2="6" y2="18" /></svg>
                                </button>
                                <button type="button" onClick={() => handleFormat('justifyRight')} className="editor-btn" title="Align Right">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="21" y1="10" x2="7" y2="10" /><line x1="21" y1="6" x2="3" y2="6" /><line x1="21" y1="14" x2="3" y2="14" /><line x1="21" y1="18" x2="7" y2="18" /></svg>
                                </button>
                            </div>

                            <div className="toolbar-divider"></div>

                            {/* Lists */}
                            <div className="toolbar-group">
                                <button type="button" onClick={() => handleFormat('insertUnorderedList')} className="editor-btn" title="Bullet List">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                                </button>
                                <button type="button" onClick={() => handleFormat('insertOrderedList')} className="editor-btn" title="Numbered List">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="10" y1="6" x2="21" y2="6"></line><line x1="10" y1="12" x2="21" y2="12"></line><line x1="10" y1="18" x2="21" y2="18"></line><path d="M4 6h1v4"></path><path d="M4 10h2"></path><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path></svg>
                                </button>
                                <button type="button" onClick={() => handleFormat('formatBlock', 'blockquote')} className="editor-btn" title="Quote">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path></svg>
                                </button>
                            </div>

                            <div className="toolbar-divider"></div>

                            {/* Inserts */}
                            <div className="toolbar-group">
                                <button type="button" onClick={() => {
                                    const url = prompt('Enter Link URL:');
                                    if (url) handleFormat('createLink', url);
                                }} className="editor-btn" title="Insert Link">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                                </button>
                                <button type="button" onClick={() => editorImageInputRef.current?.click()} className="editor-btn" title="Upload Image">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                                </button>
                                <button type="button" onClick={insertCodeBlock} className="editor-btn" title="Code Block">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
                                </button>
                                <button type="button" onClick={insertTable} className="editor-btn" title="Insert Table">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="3" y1="15" x2="21" y2="15" /><line x1="9" y1="3" x2="9" y2="21" /><line x1="15" y1="3" x2="15" y2="21" /></svg>
                                </button>
                                <button type="button" onClick={insertEmbed} className="editor-btn" title="Embed YouTube/Twitter">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                                </button>
                                <button type="button" onClick={() => handleFormat('insertHorizontalRule')} className="editor-btn" title="Horizontal Rule">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12" /></svg>
                                </button>
                            </div>

                            <div className="toolbar-divider"></div>

                            {/* Utilities */}
                            <div className="toolbar-group">
                                <button type="button" onClick={() => handleFormat('removeFormat')} className="editor-btn" title="Clear Formatting">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 10l-2-6H9l-.5 1.5" /><path d="M5 13l4 7h6l.5-.9" /><line x1="2" y1="2" x2="22" y2="22" /></svg>
                                </button>
                                <button type="button" onClick={() => setIsFullscreen(!isFullscreen)} className="editor-btn" title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}>
                                    {isFullscreen ? (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" /></svg>
                                    ) : (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" /></svg>
                                    )}
                                </button>
                            </div>

                            <div style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--admin-text-muted)', fontWeight: '500', display: 'flex', gap: '16px' }}>
                                <span>{wordCount} words</span>
                                <span>~{readingTime} min read</span>
                            </div>
                        </div>
                        <RichEditor
                            ref={editorRef}
                            content={formData.content}
                            onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                            placeholder="Tell your story..."
                            minHeight="450px"
                        />
                    </div>

                    {/* Excerpt with Premium Box */}
                    <div className="admin-card">
                        <div className="admin-card-header">
                            <h2 className="admin-card-title">📝 Excerpt</h2>
                            <p style={{ margin: 0, fontSize: '12px', color: 'var(--admin-text-muted)' }}>Short summary for blog list</p>
                        </div>
                        <textarea
                            className="form-textarea"
                            placeholder="Write a compelling summary..."
                            value={formData.excerpt}
                            onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                            style={{ minHeight: '120px', background: 'var(--admin-bg)' }}
                        />
                    </div>

                    {/* SEO */}
                    <div className="admin-card">
                        <div
                            className="admin-card-header"
                            style={{ cursor: 'pointer', marginBottom: showSEO ? '20px' : 0 }}
                            onClick={() => setShowSEO(!showSEO)}
                        >
                            <h2 className="admin-card-title">🔍 SEO Settings</h2>
                            <span>{showSEO ? '▼' : '▶'}</span>
                        </div>

                        {showSEO && (
                            <div>
                                <div className="form-group">
                                    <label className="form-label">Meta Title</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder={formData.title || 'Enter meta title'}
                                        value={formData.meta_title}
                                        onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Meta Description</label>
                                    <textarea
                                        className="form-textarea"
                                        placeholder="Enter meta description..."
                                        value={formData.meta_description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                                        style={{ minHeight: '80px' }}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Keywords</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="keyword1, keyword2, keyword3"
                                        value={formData.meta_keywords}
                                        onChange={(e) => setFormData(prev => ({ ...prev, meta_keywords: e.target.value }))}
                                    />
                                </div>

                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label className="form-label">Robots</label>
                                    <select
                                        className="form-select"
                                        value={formData.robots}
                                        onChange={(e) => setFormData(prev => ({ ...prev, robots: e.target.value }))}
                                    >
                                        <option value="index,follow">Index, Follow</option>
                                        <option value="index,nofollow">Index, No Follow</option>
                                        <option value="noindex,follow">No Index, Follow</option>
                                        <option value="noindex,nofollow">No Index, No Follow</option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar (Settings Area) - Hidden in fullscreen */}
                {!isFullscreen && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                        {/* Status & Visibility */}
                        <div className="admin-card" style={{ padding: '24px' }}>
                            <div className="admin-card-header" style={{ marginBottom: '20px' }}>
                                <h3 className="admin-card-title">Status & Visibility</h3>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Post Status</label>
                                <select
                                    className="form-select"
                                    value={formData.status}
                                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                                >
                                    <option value="draft">📁 Draft</option>
                                    <option value="published">✅ Published</option>
                                    <option value="scheduled">⏰ Scheduled</option>
                                </select>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => handleSave('draft')}
                                    disabled={saving}
                                    style={{ padding: '12px' }}
                                >
                                    Save Draft
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => handleSave('published')}
                                    disabled={saving}
                                    style={{ padding: '12px' }}
                                >
                                    {saving ? '...' : 'Update'}
                                </button>
                            </div>

                            {formData.slug && (
                                <a
                                    href={`/blog/${formData.slug}`}
                                    target="_blank"
                                    className="btn btn-secondary"
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', marginTop: '12px', textDecoration: 'none', width: '100%' }}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                        <polyline points="15 3 21 3 21 9" />
                                        <line x1="10" y1="14" x2="21" y2="3" />
                                    </svg>
                                    View Live Post
                                </a>
                            )}
                        </div>

                        {/* Real-time SEO Score Panel */}
                        <div className="admin-card" style={{ background: 'var(--admin-primary-gradient)', color: '#fff', border: 'none' }}>
                            <div style={{ textAlign: 'center' }}>
                                <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>SEO Score</h3>
                                <div style={{
                                    fontSize: '48px',
                                    fontWeight: '900',
                                    margin: '16px 0',
                                    textShadow: '0 4px 10px rgba(0,0,0,0.2)'
                                }}>
                                    {Math.min(100, (formData.title.length > 30 ? 40 : 10) + (formData.content.length > 500 ? 60 : 20))}
                                </div>
                                <p style={{ margin: 0, fontSize: '12px', opacity: '0.9' }}>
                                    {formData.title ? 'Keep going! Optimize for RankMath.' : 'Start writing to see score'}
                                </p>
                            </div>
                        </div>

                        {/* Featured Image (With Preview) */}
                        <div className="admin-card">
                            <div className="admin-card-header">
                                <h3 className="admin-card-title">Featured Image</h3>
                            </div>

                            <div style={{
                                border: '2px dashed var(--admin-border)',
                                borderRadius: 'var(--admin-radius)',
                                padding: '20px',
                                textAlign: 'center',
                                background: formData.featured_image ? 'none' : 'var(--admin-bg)',
                                position: 'relative'
                            }}>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e, 'featured')}
                                />

                                {uploading && (
                                    <div style={{
                                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                        background: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5
                                    }}>
                                        <div className="admin-spinner"></div>
                                    </div>
                                )}

                                {formData.featured_image ? (
                                    <div style={{ position: 'relative' }}>
                                        <img
                                            src={formData.featured_image}
                                            alt="Featured"
                                            style={{ width: '100%', borderRadius: '8px', boxShadow: 'var(--admin-shadow)' }}
                                        />
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => setFormData(prev => ({ ...prev, featured_image: '' }))}
                                            style={{ position: 'absolute', top: '10px', right: '10px' }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ) : (
                                    <div onClick={() => fileInputRef.current?.click()} style={{ cursor: 'pointer' }}>
                                        <div style={{ fontSize: '32px', marginBottom: '12px' }}>🖼️</div>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="Paste image URL..."
                                            value={formData.featured_image}
                                            onChange={(e) => setFormData(prev => ({ ...prev, featured_image: e.target.value }))}
                                            style={{ marginBottom: '12px' }}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                        <button className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                                            Upload Image
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Categories (Premium Checkboxes) */}
                        <div className="admin-card">
                            <div className="admin-card-header">
                                <h3 className="admin-card-title">Categories</h3>
                            </div>

                            <div style={{ maxHeight: '250px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {categories.length > 0 ? (
                                    categories.map(cat => (
                                        <label key={cat.id} className="category-item" style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            padding: '10px',
                                            borderRadius: '8px',
                                            background: selectedCategories.includes(cat.id) ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
                                            cursor: 'pointer',
                                            transition: 'var(--admin-transition)',
                                            border: '1px solid',
                                            borderColor: selectedCategories.includes(cat.id) ? 'var(--admin-primary)' : 'transparent'
                                        }}>
                                            <input
                                                type="checkbox"
                                                style={{ width: '18px', height: '18px' }}
                                                checked={selectedCategories.includes(cat.id)}
                                                onChange={() => {
                                                    setSelectedCategories(prev =>
                                                        prev.includes(cat.id)
                                                            ? prev.filter(id => id !== cat.id)
                                                            : [...prev, cat.id]
                                                    );
                                                }}
                                            />
                                            <span style={{
                                                fontSize: '14px',
                                                fontWeight: '600',
                                                color: selectedCategories.includes(cat.id) ? 'var(--admin-primary)' : 'var(--admin-text)'
                                            }}>{cat.name}</span>
                                        </label>
                                    ))
                                ) : (
                                    <p style={{ color: 'var(--admin-text-muted)', fontSize: '13px', textAlign: 'center' }}>
                                        No categories yet
                                    </p>
                                )}
                            </div>
                            <Link href="/admin/categories" className="btn btn-secondary btn-sm" style={{ marginTop: '16px', width: '100%', justifyContent: 'center' }}>
                                + Manage Categories
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            {/* Premium Styles */}
            <style jsx>{`
                .toolbar-group {
                    display: flex;
                    gap: 4px;
                    padding-right: 12px;
                    margin-right: 12px;
                    border-right: 1px solid var(--admin-border);
                }
                .toolbar-divider {
                    width: 1px;
                    height: 24px;
                    background: var(--admin-border);
                    margin: 0 8px;
                }
                .editor-btn {
                    width: 32px;
                    height: 32px;
                    border: none;
                    background: transparent;
                    color: var(--admin-text-muted);
                    font-size: 14px;
                    border-radius: 6px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: var(--admin-transition);
                }
                .editor-btn:hover {
                    background: var(--admin-bg);
                    color: var(--admin-primary);
                }
                .category-item:hover {
                    background: rgba(99, 102, 241, 0.05);
                }
                @media (max-width: 1200px) {
                    div[style*="grid-template-columns: 1fr 380px"] {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </div>
    );
}
