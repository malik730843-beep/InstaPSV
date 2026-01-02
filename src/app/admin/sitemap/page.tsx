'use client';

import { useState, useEffect } from 'react';

export default function SitemapPage() {
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [message, setMessage] = useState('');
    const [sitemapUrls, setSitemapUrls] = useState<string[]>([]);

    const [settings, setSettings] = useState({
        include_homepage: true,
        include_posts: true,
        include_pages: true,
        exclude_noindex: true,
        default_priority: '0.8',
        default_changefreq: 'weekly',
        auto_regenerate: true,
        last_generated: '',
    });

    useEffect(() => {
        loadSettings();
        loadPreview();
    }, []);

    const loadSettings = async () => {
        try {
            const res = await fetch('/api/admin/sitemap/settings');
            const data = await res.json();
            if (data.settings) {
                setSettings(prev => ({ ...prev, ...data.settings }));
            }
        } catch (error) {
            console.error('Failed to load sitemap settings');
        }
        setLoading(false);
    };

    const loadPreview = async () => {
        try {
            const res = await fetch('/api/admin/sitemap/preview');
            const data = await res.json();
            setSitemapUrls(data.urls || []);
        } catch (error) {
            // Preview might not be available
        }
    };

    const handleSave = async () => {
        try {
            const res = await fetch('/api/admin/sitemap/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });

            if (res.ok) {
                setMessage('Settings saved!');
                setTimeout(() => setMessage(''), 3000);
            }
        } catch (error) {
            setMessage('Failed to save');
        }
    };

    const generateSitemap = async () => {
        setGenerating(true);
        try {
            const res = await fetch('/api/admin/sitemap/generate', {
                method: 'POST',
            });

            if (res.ok) {
                setMessage('Sitemap generated successfully!');
                loadPreview();
                loadSettings();
            } else {
                setMessage('Failed to generate sitemap');
            }
        } catch (error) {
            setMessage('Failed to generate sitemap');
        }
        setGenerating(false);
        setTimeout(() => setMessage(''), 3000);
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
                    <h1 className="page-title">🗺️ Sitemap</h1>
                    <p className="page-subtitle">Auto-generate XML sitemap for search engines</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-secondary" onClick={handleSave}>
                        Save Settings
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={generateSitemap}
                        disabled={generating}
                    >
                        {generating ? 'Generating...' : '🔄 Generate Sitemap'}
                    </button>
                </div>
            </div>

            {message && (
                <div style={{
                    padding: '12px 16px',
                    background: message.includes('Failed') ? '#fef2f2' : '#d1fae5',
                    color: message.includes('Failed') ? '#991b1b' : '#065f46',
                    borderRadius: 'var(--admin-radius)',
                    marginBottom: '20px'
                }}>
                    {message}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {/* Settings */}
                <div className="admin-card">
                    <h3 className="admin-card-title" style={{ marginBottom: '20px' }}>Sitemap Settings</h3>

                    <div className="form-group">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={settings.include_homepage}
                                onChange={(e) => setSettings(prev => ({ ...prev, include_homepage: e.target.checked }))}
                            />
                            <span>Include Homepage</span>
                        </label>
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={settings.include_posts}
                                onChange={(e) => setSettings(prev => ({ ...prev, include_posts: e.target.checked }))}
                            />
                            <span>Include Published Posts</span>
                        </label>
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={settings.include_pages}
                                onChange={(e) => setSettings(prev => ({ ...prev, include_pages: e.target.checked }))}
                            />
                            <span>Include Published Pages</span>
                        </label>
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={settings.exclude_noindex}
                                onChange={(e) => setSettings(prev => ({ ...prev, exclude_noindex: e.target.checked }))}
                            />
                            <span>Exclude noindex pages</span>
                        </label>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Default Priority</label>
                        <select
                            className="form-select"
                            value={settings.default_priority}
                            onChange={(e) => setSettings(prev => ({ ...prev, default_priority: e.target.value }))}
                        >
                            <option value="1.0">1.0 (Highest)</option>
                            <option value="0.8">0.8</option>
                            <option value="0.6">0.6</option>
                            <option value="0.5">0.5 (Default)</option>
                            <option value="0.3">0.3</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Default Change Frequency</label>
                        <select
                            className="form-select"
                            value={settings.default_changefreq}
                            onChange={(e) => setSettings(prev => ({ ...prev, default_changefreq: e.target.value }))}
                        >
                            <option value="always">Always</option>
                            <option value="hourly">Hourly</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                            <option value="never">Never</option>
                        </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={settings.auto_regenerate}
                                onChange={(e) => setSettings(prev => ({ ...prev, auto_regenerate: e.target.checked }))}
                            />
                            <span>Auto-regenerate on publish</span>
                        </label>
                    </div>
                </div>

                {/* Preview */}
                <div className="admin-card">
                    <div className="admin-card-header">
                        <h3 className="admin-card-title">Sitemap Preview</h3>
                        <a
                            href="/sitemap.xml"
                            target="_blank"
                            className="btn btn-secondary btn-sm"
                        >
                            View /sitemap.xml
                        </a>
                    </div>

                    {settings.last_generated && (
                        <p style={{ fontSize: '13px', color: 'var(--admin-text-muted)', marginBottom: '16px' }}>
                            Last generated: {new Date(settings.last_generated).toLocaleString()}
                        </p>
                    )}

                    <div style={{
                        background: '#1e293b',
                        padding: '16px',
                        borderRadius: 'var(--admin-radius)',
                        maxHeight: '400px',
                        overflowY: 'auto'
                    }}>
                        {sitemapUrls.length > 0 ? (
                            <pre style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>
                                {`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map(url => `  <url>
    <loc>${url}</loc>
    <priority>${settings.default_priority}</priority>
    <changefreq>${settings.default_changefreq}</changefreq>
  </url>`).join('\n')}
</urlset>`}
                            </pre>
                        ) : (
                            <p style={{ color: '#94a3b8', fontSize: '13px' }}>
                                Click "Generate Sitemap" to create your sitemap
                            </p>
                        )}
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
        </div>
    );
}
