'use client';

import { useState, useEffect } from 'react';

export default function SEOSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    const [seo, setSeo] = useState({
        default_title: '',
        default_description: '',
        default_keywords: '',
        robots_default: 'index,follow',
        robots_txt: '',
        canonical_base: '',
        og_type: 'website',
        twitter_site: '',
        google_analytics_id: '',
        google_search_console: '',
    });

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const res = await fetch('/api/admin/settings?type=seo');
            const data = await res.json();
            if (data.settings) {
                const settingsObj: any = {};
                data.settings.forEach((s: any) => {
                    settingsObj[s.key] = s.value || '';
                });
                setSeo(prev => ({ ...prev, ...settingsObj }));
            }
        } catch (error) {
            console.error('Failed to load settings');
        }
        setLoading(false);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'seo',
                    settings: Object.entries(seo).map(([key, value]) => ({ key, value })),
                }),
            });

            if (res.ok) {
                setMessage('SEO settings saved!');
                setTimeout(() => setMessage(''), 3000);
            }
        } catch (error) {
            setMessage('Failed to save');
        }
        setSaving(false);
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
            <div className="page-header">
                <div>
                    <h1 className="page-title">🔍 SEO Settings</h1>
                    <p className="page-subtitle">Configure default SEO settings (RankMath-style)</p>
                </div>
                <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Settings'}
                </button>
            </div>

            {message && (
                <div style={{
                    padding: '12px 16px',
                    background: '#d1fae5',
                    color: '#065f46',
                    borderRadius: 'var(--admin-radius)',
                    marginBottom: '20px'
                }}>
                    {message}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {/* Meta Settings */}
                <div className="admin-card">
                    <h3 className="admin-card-title" style={{ marginBottom: '20px' }}>Default Meta Tags</h3>

                    <div className="form-group">
                        <label className="form-label">Default Title</label>
                        <input
                            type="text"
                            className="form-input"
                            value={seo.default_title}
                            onChange={(e) => setSeo(prev => ({ ...prev, default_title: e.target.value }))}
                            placeholder="Site Name - Tagline"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Default Description</label>
                        <textarea
                            className="form-textarea"
                            value={seo.default_description}
                            onChange={(e) => setSeo(prev => ({ ...prev, default_description: e.target.value }))}
                            placeholder="A brief description of your site..."
                            style={{ minHeight: '100px' }}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Default Keywords</label>
                        <input
                            type="text"
                            className="form-input"
                            value={seo.default_keywords}
                            onChange={(e) => setSeo(prev => ({ ...prev, default_keywords: e.target.value }))}
                            placeholder="keyword1, keyword2, keyword3"
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Default Robots</label>
                        <select
                            className="form-select"
                            value={seo.robots_default}
                            onChange={(e) => setSeo(prev => ({ ...prev, robots_default: e.target.value }))}
                        >
                            <option value="index,follow">Index, Follow</option>
                            <option value="index,nofollow">Index, No Follow</option>
                            <option value="noindex,follow">No Index, Follow</option>
                            <option value="noindex,nofollow">No Index, No Follow</option>
                        </select>
                    </div>
                </div>

                {/* Social Settings */}
                <div className="admin-card">
                    <h3 className="admin-card-title" style={{ marginBottom: '20px' }}>Social & Advanced</h3>

                    <div className="form-group">
                        <label className="form-label">Canonical URL Base</label>
                        <input
                            type="text"
                            className="form-input"
                            value={seo.canonical_base}
                            onChange={(e) => setSeo(prev => ({ ...prev, canonical_base: e.target.value }))}
                            placeholder="https://example.com"
                        />
                        <p style={{ fontSize: '12px', color: 'var(--admin-text-muted)', marginTop: '4px' }}>
                            Leave empty to use current domain
                        </p>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Open Graph Type</label>
                        <select
                            className="form-select"
                            value={seo.og_type}
                            onChange={(e) => setSeo(prev => ({ ...prev, og_type: e.target.value }))}
                        >
                            <option value="website">Website</option>
                            <option value="article">Article</option>
                            <option value="profile">Profile</option>
                        </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Twitter Site Handle</label>
                        <input
                            type="text"
                            className="form-input"
                            value={seo.twitter_site}
                            onChange={(e) => setSeo(prev => ({ ...prev, twitter_site: e.target.value }))}
                            placeholder="@yoursite"
                        />
                    </div>
                </div>
            </div>

            {/* Verification & Analytics */}
            <div className="admin-card" style={{ marginTop: '24px' }}>
                <h3 className="admin-card-title" style={{ marginBottom: '20px' }}>Verification & Analytics</h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div className="form-group">
                        <label className="form-label">Google Analytics Measurement ID</label>
                        <input
                            type="text"
                            className="form-input"
                            value={seo.google_analytics_id}
                            onChange={(e) => setSeo(prev => ({ ...prev, google_analytics_id: e.target.value }))}
                            placeholder="G-XXXXXXXXXX"
                        />
                        <p style={{ fontSize: '12px', color: 'var(--admin-text-muted)', marginTop: '4px' }}>
                            The Measurement ID from your GA4 property property.
                        </p>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Google Search Console Verification</label>
                        <input
                            type="text"
                            className="form-input"
                            value={seo.google_search_console}
                            onChange={(e) => setSeo(prev => ({ ...prev, google_search_console: e.target.value }))}
                            placeholder="<meta name='google-site-verification' ... />"
                        />
                        <p style={{ fontSize: '12px', color: 'var(--admin-text-muted)', marginTop: '4px' }}>
                            Paste the full HTML meta tag or just the content code.
                        </p>
                    </div>
                </div>

                <div className="form-group" style={{ marginTop: '16px', marginBottom: 0 }}>
                    <label className="form-label">Custom Robots.txt Content</label>
                    <textarea
                        className="form-textarea"
                        value={seo.robots_txt}
                        onChange={(e) => setSeo(prev => ({ ...prev, robots_txt: e.target.value }))}
                        placeholder="User-agent: *&#10;Allow: /"
                        style={{ minHeight: '120px', fontFamily: 'monospace' }}
                    />
                    <p style={{ fontSize: '12px', color: 'var(--admin-text-muted)', marginTop: '4px' }}>
                        This content will be served at /robots.txt. If empty, a default one will be generated based on your settings.
                    </p>
                </div>
            </div>

            {/* SERP Preview */}
            <div className="admin-card" style={{ marginTop: '24px' }}>
                <h3 className="admin-card-title" style={{ marginBottom: '20px' }}>Google SERP Preview</h3>
                <div style={{
                    padding: '20px',
                    background: '#fff',
                    border: '1px solid var(--admin-border)',
                    borderRadius: 'var(--admin-radius)',
                    maxWidth: '600px'
                }}>
                    <div style={{ color: '#1a0dab', fontSize: '18px', marginBottom: '4px' }}>
                        {seo.default_title || 'Your Site Title'}
                    </div>
                    <div style={{ color: '#006621', fontSize: '13px', marginBottom: '4px' }}>
                        {seo.canonical_base || 'https://example.com'}
                    </div>
                    <div style={{ color: '#545454', fontSize: '13px' }}>
                        {seo.default_description || 'Your site description will appear here...'}
                    </div>
                </div>
            </div>

            <style jsx>{`
                @media (max-width: 768px) {
                    div[style*="grid-template-columns: 1fr 1fr"] {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </div >
    );
}
