'use client';

import React, { useState, useEffect } from 'react';

interface Ad {
    id: string;
    name: string;
    type: string;
    code: string;
    enabled: boolean;
    device_target: string;
    page_target: string;
    delay_seconds: number;
    start_date?: string;
    end_date?: string;
    impressions?: number;
    clicks?: number;
    created_at: string;
}

const AD_TEMPLATES = [
    {
        name: 'Google AdSense - Responsive',
        type: 'sidebar',
        code: `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
     data-ad-slot="XXXXXXXXXX"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>`
    },
    {
        name: 'Banner 728x90',
        type: 'header',
        code: `<div style="width:728px;height:90px;margin:0 auto;background:#f0f0f0;display:flex;align-items:center;justify-content:center;border-radius:8px;">
    <span style="color:#666;">728x90 Banner Ad</span>
</div>`
    },
    {
        name: 'Sticky Footer Banner',
        type: 'sticky_bottom',
        code: `<div style="background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;padding:12px 24px;text-align:center;border-radius:8px 8px 0 0;">
    <strong>Special Offer!</strong> Get 50% off today. <a href="#" style="color:#fff;text-decoration:underline;margin-left:8px;">Learn More</a>
</div>`
    },
    {
        name: 'Exit Intent Popup',
        type: 'popup',
        code: `<div style="text-align:center;padding:40px;">
    <h2 style="margin:0 0 16px;">Wait! Don't Leave Yet</h2>
    <p style="color:#666;margin:0 0 24px;">Subscribe to our newsletter and get 10% off!</p>
    <input type="email" placeholder="Enter your email" style="padding:12px;border:1px solid #ddd;border-radius:8px;width:100%;max-width:300px;margin-bottom:12px;" />
    <button style="background:#6366f1;color:#fff;border:none;padding:12px 24px;border-radius:8px;cursor:pointer;">Subscribe</button>
</div>`
    }
];

export default function AdsManagerPage() {
    const [ads, setAds] = useState<Ad[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingAd, setEditingAd] = useState<Ad | null>(null);
    const [activeTab, setActiveTab] = useState<'all' | 'analytics' | 'templates'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedAds, setSelectedAds] = useState<string[]>([]);
    const [showPreview, setShowPreview] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        type: 'header',
        code: '',
        enabled: true,
        device_target: 'all',
        page_target: 'all',
        delay_seconds: 0,
        start_date: '',
        end_date: '',
        scroll_percent: 0,
        exit_intent: false,
        frequency: 'always',
        overlay_type: 'center',
        show_close_button: true,
        auto_close_seconds: 0,
        dark_background: true,
    });

    useEffect(() => {
        loadAds();
    }, []);

    const loadAds = async () => {
        try {
            const res = await fetch('/api/admin/adunits');
            const data = await res.json();
            // Add mock analytics data
            const adsWithAnalytics = (data.ads || []).map((ad: Ad) => ({
                ...ad,
                impressions: Math.floor(Math.random() * 10000) + 1000,
                clicks: Math.floor(Math.random() * 500) + 50,
            }));
            setAds(adsWithAnalytics);
        } catch (error) {
            console.error('Failed to load ads');
        }
        setLoading(false);
    };

    const handleSave = async () => {
        if (!formData.name || !formData.code) {
            alert('Please fill in name and code');
            return;
        }

        try {
            const payload = editingAd ? { ...formData, id: editingAd.id } : formData;

            const res = await fetch('/api/admin/adunits', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                setShowModal(false);
                resetForm();
                loadAds();
            }
        } catch (error) {
            console.error('Failed to save ad');
        }
    };

    const handleDelete = async (id: string) => {
        if (!id) {
            alert('No ID provided for delete');
            return;
        }

        if (!confirm('Delete this ad?')) {
            return;
        }

        try {
            const url = `/api/admin/adunits?id=${id}`;
            const res = await fetch(url, { method: 'DELETE' });
            const data = await res.json();

            if (!res.ok) {
                alert(`Failed to delete: ${data.error || 'Unknown error'}`);
                return;
            }

            loadAds();
        } catch (error: any) {
            console.error('Failed to delete:', error);
            alert(`Failed to delete: ${error.message}`);
        }
    };

    const toggleAdStatus = async (ad: Ad) => {
        try {
            const res = await fetch('/api/admin/adunits', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: ad.id,
                    enabled: !ad.enabled
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(`Failed to toggle: ${data.error || 'Unknown error'}`);
                return;
            }

            loadAds();
        } catch (error: any) {
            console.error('Failed to toggle:', error);
            alert(`Failed to toggle: ${error.message}`);
        }
    };

    const handleBulkAction = async (action: 'enable' | 'disable' | 'delete') => {
        if (selectedAds.length === 0) return;

        if (action === 'delete' && !confirm(`Delete ${selectedAds.length} ads?`)) return;

        for (const id of selectedAds) {
            if (action === 'delete') {
                await fetch(`/api/admin/adunits?id=${id}`, { method: 'DELETE' });
            } else {
                await fetch('/api/admin/adunits', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id, enabled: action === 'enable' }),
                });
            }
        }
        setSelectedAds([]);
        loadAds();
    };

    const duplicateAd = (ad: Ad) => {
        setFormData({
            name: `${ad.name} (Copy)`,
            type: ad.type,
            code: ad.code,
            enabled: false,
            device_target: ad.device_target || 'all',
            page_target: ad.page_target || 'all',
            delay_seconds: ad.delay_seconds || 0,
            start_date: '',
            end_date: '',
            scroll_percent: 0,
            exit_intent: false,
            frequency: 'always',
            overlay_type: 'center',
            show_close_button: true,
            auto_close_seconds: 0,
            dark_background: true,
        });
        setEditingAd(null);
        setShowModal(true);
    };

    const applyTemplate = (template: typeof AD_TEMPLATES[0]) => {
        setFormData(prev => ({
            ...prev,
            name: template.name,
            type: template.type,
            code: template.code,
        }));
        setActiveTab('all');
        setShowModal(true);
    };

    const resetForm = () => {
        setEditingAd(null);
        setFormData({
            name: '',
            type: 'header',
            code: '',
            enabled: true,
            device_target: 'all',
            page_target: 'all',
            delay_seconds: 0,
            start_date: '',
            end_date: '',
            scroll_percent: 0,
            exit_intent: false,
            frequency: 'always',
            overlay_type: 'center',
            show_close_button: true,
            auto_close_seconds: 0,
            dark_background: true,
        });
    };

    const openEditModal = (ad: Ad) => {
        setEditingAd(ad);
        setFormData({
            name: ad.name,
            type: ad.type,
            code: ad.code,
            enabled: ad.enabled,
            device_target: ad.device_target || 'all',
            page_target: ad.page_target || 'all',
            delay_seconds: ad.delay_seconds || 0,
            start_date: ad.start_date || '',
            end_date: ad.end_date || '',
            scroll_percent: 0,
            exit_intent: false,
            frequency: 'always',
            overlay_type: 'center',
            show_close_button: true,
            auto_close_seconds: 0,
            dark_background: true,
        });
        setShowModal(true);
    };

    const getTypeIcon = (type: string) => {
        const icons: Record<string, React.JSX.Element> = {
            header: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /></svg>,
            footer: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="15" x2="21" y2="15" /></svg>,
            sidebar: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="9" y1="3" x2="9" y2="21" /></svg>,
            sticky_bottom: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><rect x="5" y="15" width="14" height="4" fill="currentColor" opacity="0.3" /></svg>,
            popup: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2" /><line x1="8" y1="2" x2="16" y2="2" /></svg>,
            overlay: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><rect x="6" y="6" width="12" height="12" rx="1" fill="currentColor" opacity="0.2" /></svg>,
        };
        return icons[type] || icons.header;
    };

    const getTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            header: 'Header',
            footer: 'Footer',
            sidebar: 'Sidebar',
            sticky_bottom: 'Sticky Bottom',
            popup: 'Popup',
            overlay: 'Overlay',
        };
        return labels[type] || type;
    };

    const filteredAds = ads.filter(ad => {
        if (searchQuery && !ad.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        if (filterType !== 'all' && ad.type !== filterType) return false;
        if (filterStatus !== 'all' && (filterStatus === 'enabled' ? !ad.enabled : ad.enabled)) return false;
        return true;
    });

    const totalImpressions = ads.reduce((sum, ad) => sum + (ad.impressions || 0), 0);
    const totalClicks = ads.reduce((sum, ad) => sum + (ad.clicks || 0), 0);
    const averageCTR = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00';

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '12px', verticalAlign: 'middle' }}>
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        Ads Manager
                    </h1>
                    <p className="page-subtitle">Manage advertisements with advanced targeting</p>
                </div>
                <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    New Ad
                </button>
            </div>

            {/* Tab Navigation */}
            <div className="tabs" style={{ marginBottom: '24px' }}>
                <button className={`tab ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
                        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                        <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                    </svg>
                    All Ads ({ads.length})
                </button>
                <button className={`tab ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
                        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
                        <line x1="6" y1="20" x2="6" y2="14" />
                    </svg>
                    Analytics
                </button>
                <button className={`tab ${activeTab === 'templates' ? 'active' : ''}`} onClick={() => setActiveTab('templates')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
                        <rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" />
                        <line x1="9" y1="21" x2="9" y2="9" />
                    </svg>
                    Templates
                </button>
            </div>

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
                <div style={{ marginBottom: '24px' }}>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-content">
                                <div className="stat-value">{totalImpressions.toLocaleString()}</div>
                                <div className="stat-label">Total Impressions</div>
                            </div>
                            <div className="stat-icon-wrapper blue">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" />
                                    <line x1="12" y1="8" x2="12.01" y2="8" />
                                </svg>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-content">
                                <div className="stat-value">{totalClicks.toLocaleString()}</div>
                                <div className="stat-label">Total Clicks</div>
                            </div>
                            <div className="stat-icon-wrapper green">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
                                </svg>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-content">
                                <div className="stat-value">{averageCTR}%</div>
                                <div className="stat-label">Average CTR</div>
                            </div>
                            <div className="stat-icon-wrapper orange">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" />
                                    <line x1="6" y1="20" x2="6" y2="16" />
                                </svg>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-content">
                                <div className="stat-value">{ads.filter(a => a.enabled).length}</div>
                                <div className="stat-label">Active Ads</div>
                            </div>
                            <div className="stat-icon-wrapper purple">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Per-Ad Analytics Table */}
                    <div className="admin-card">
                        <div className="admin-card-header">
                            <h2 className="admin-card-title">Performance by Ad</h2>
                        </div>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Ad Name</th>
                                    <th>Type</th>
                                    <th>Impressions</th>
                                    <th>Clicks</th>
                                    <th>CTR</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ads.map((ad) => (
                                    <tr key={ad.id}>
                                        <td style={{ fontWeight: 500 }}>{ad.name}</td>
                                        <td>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                {getTypeIcon(ad.type)} {getTypeLabel(ad.type)}
                                            </span>
                                        </td>
                                        <td>{(ad.impressions || 0).toLocaleString()}</td>
                                        <td>{(ad.clicks || 0).toLocaleString()}</td>
                                        <td>
                                            <span className={`badge ${((ad.clicks || 0) / (ad.impressions || 1)) * 100 > 3 ? 'badge-success' : 'badge-warning'}`}>
                                                {(((ad.clicks || 0) / (ad.impressions || 1)) * 100).toFixed(2)}%
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge ${ad.enabled ? 'badge-success' : 'badge-warning'}`}>
                                                {ad.enabled ? 'Active' : 'Paused'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Templates Tab */}
            {activeTab === 'templates' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px', marginBottom: '24px' }}>
                    {AD_TEMPLATES.map((template, idx) => (
                        <div key={idx} className="admin-card" style={{ padding: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                <div className="stat-icon-wrapper blue">
                                    {getTypeIcon(template.type)}
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>{template.name}</h3>
                                    <span className="badge badge-info" style={{ marginTop: '4px' }}>{getTypeLabel(template.type)}</span>
                                </div>
                            </div>
                            <div style={{
                                background: '#f9fafb',
                                padding: '12px',
                                borderRadius: '8px',
                                fontSize: '11px',
                                fontFamily: 'monospace',
                                maxHeight: '100px',
                                overflow: 'hidden',
                                marginBottom: '16px',
                                color: '#666'
                            }}>
                                {template.code.substring(0, 150)}...
                            </div>
                            <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => applyTemplate(template)}>
                                Use Template
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* All Ads Tab */}
            {activeTab === 'all' && (
                <>
                    {/* Search and Filter Bar */}
                    <div className="admin-card" style={{ padding: '16px', marginBottom: '24px' }}>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                            <div style={{ flex: 1, minWidth: '200px' }}>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Search ads..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{ margin: 0 }}
                                />
                            </div>
                            <select className="form-select" value={filterType} onChange={(e) => setFilterType(e.target.value)} style={{ width: 'auto' }}>
                                <option value="all">All Types</option>
                                <option value="header">Header</option>
                                <option value="footer">Footer</option>
                                <option value="sidebar">Sidebar</option>
                                <option value="sticky_bottom">Sticky Bottom</option>
                                <option value="popup">Popup</option>
                                <option value="overlay">Overlay</option>
                            </select>
                            <select className="form-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ width: 'auto' }}>
                                <option value="all">All Status</option>
                                <option value="enabled">Enabled</option>
                                <option value="disabled">Disabled</option>
                            </select>
                            {selectedAds.length > 0 && (
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button className="btn btn-secondary btn-sm" onClick={() => handleBulkAction('enable')}>Enable ({selectedAds.length})</button>
                                    <button className="btn btn-secondary btn-sm" onClick={() => handleBulkAction('disable')}>Disable</button>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleBulkAction('delete')}>Delete</button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="admin-card">
                        {loading ? (
                            <div className="admin-loading" style={{ minHeight: '200px' }}>
                                <div className="admin-spinner"></div>
                            </div>
                        ) : filteredAds.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-icon">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                    </svg>
                                </div>
                                <h3>No ads yet</h3>
                                <p>Create ads for header, footer, popup, overlay, etc.</p>
                                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                                    Create Ad
                                </button>
                            </div>
                        ) : (
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: '40px' }}>
                                            <input
                                                type="checkbox"
                                                checked={selectedAds.length === filteredAds.length && filteredAds.length > 0}
                                                onChange={(e) => setSelectedAds(e.target.checked ? filteredAds.map(a => a.id) : [])}
                                            />
                                        </th>
                                        <th>Name</th>
                                        <th>Type</th>
                                        <th>Device</th>
                                        <th>Schedule</th>
                                        <th>Status</th>
                                        <th style={{ width: '180px' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredAds.map((ad) => (
                                        <tr key={ad.id}>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedAds.includes(ad.id)}
                                                    onChange={(e) => setSelectedAds(prev =>
                                                        e.target.checked ? [...prev, ad.id] : prev.filter(id => id !== ad.id)
                                                    )}
                                                />
                                            </td>
                                            <td style={{ fontWeight: 500 }}>{ad.name}</td>
                                            <td>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    {getTypeIcon(ad.type)} {getTypeLabel(ad.type)}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="badge badge-info">
                                                    {ad.device_target === 'all' ? 'All' : ad.device_target}
                                                </span>
                                            </td>
                                            <td style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>
                                                {ad.start_date || ad.end_date ? (
                                                    <span>{ad.start_date || '—'} → {ad.end_date || '—'}</span>
                                                ) : (
                                                    <span>Always</span>
                                                )}
                                            </td>
                                            <td>
                                                <label className="toggle">
                                                    <input
                                                        type="checkbox"
                                                        checked={ad.enabled}
                                                        onChange={() => toggleAdStatus(ad)}
                                                    />
                                                    <span className="toggle-slider"></span>
                                                </label>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <button onClick={() => openEditModal(ad)} className="btn btn-secondary btn-sm" title="Edit">
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                        </svg>
                                                    </button>
                                                    <button onClick={() => duplicateAd(ad)} className="btn btn-secondary btn-sm" title="Duplicate">
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                                        </svg>
                                                    </button>
                                                    <button onClick={() => handleDelete(ad.id)} className="btn btn-danger btn-sm" title="Delete">
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </>
            )}

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal" style={{ maxWidth: '800px' }}>
                        <div className="modal-header">
                            <h3 className="modal-title">{editingAd ? 'Edit Ad' : 'New Ad'}</h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="form-group">
                                    <label className="form-label">Ad Name</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder="e.g., Header Banner"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Ad Type</label>
                                    <select
                                        className="form-select"
                                        value={formData.type}
                                        onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                                    >
                                        <option value="header">Header</option>
                                        <option value="footer">Footer</option>
                                        <option value="sidebar">Sidebar</option>
                                        <option value="sticky_bottom">Sticky Bottom</option>
                                        <option value="popup">Popup</option>
                                        <option value="overlay">Screen Overlay</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Device Target</label>
                                    <select
                                        className="form-select"
                                        value={formData.device_target}
                                        onChange={(e) => setFormData(prev => ({ ...prev, device_target: e.target.value }))}
                                    >
                                        <option value="all">All Devices</option>
                                        <option value="desktop">Desktop Only</option>
                                        <option value="mobile">Mobile Only</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Page Target</label>
                                    <select
                                        className="form-select"
                                        value={formData.page_target}
                                        onChange={(e) => setFormData(prev => ({ ...prev, page_target: e.target.value }))}
                                    >
                                        <option value="all">Entire Site</option>
                                        <option value="posts">Posts Only</option>
                                        <option value="pages">Pages Only</option>
                                        <option value="homepage">Homepage Only</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Start Date (Optional)</label>
                                    <input
                                        type="date"
                                        className="form-input"
                                        value={formData.start_date}
                                        onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">End Date (Optional)</label>
                                    <input
                                        type="date"
                                        className="form-input"
                                        value={formData.end_date}
                                        onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <label className="form-label" style={{ margin: 0 }}>Ad Code (HTML/Script)</label>
                                    <button
                                        type="button"
                                        className="btn btn-secondary btn-sm"
                                        onClick={() => setShowPreview(!showPreview)}
                                    >
                                        {showPreview ? 'Hide Preview' : 'Show Preview'}
                                    </button>
                                </div>
                                <textarea
                                    className="form-textarea"
                                    value={formData.code}
                                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                                    placeholder="Paste your ad code here..."
                                    style={{ minHeight: '150px', fontFamily: 'monospace', fontSize: '13px' }}
                                />
                            </div>

                            {showPreview && formData.code && (
                                <div style={{
                                    padding: '24px',
                                    background: '#f9fafb',
                                    borderRadius: 'var(--admin-radius)',
                                    marginBottom: '16px',
                                    border: '2px dashed var(--admin-border)'
                                }}>
                                    <p style={{ fontSize: '12px', color: 'var(--admin-text-muted)', marginBottom: '12px' }}>Preview:</p>
                                    <div dangerouslySetInnerHTML={{ __html: formData.code }} />
                                </div>
                            )}

                            {(formData.type === 'popup' || formData.type === 'overlay') && (
                                <div style={{ background: 'var(--admin-bg)', padding: '16px', borderRadius: 'var(--admin-radius)', marginBottom: '16px' }}>
                                    <h4 style={{ marginBottom: '16px' }}>Popup/Overlay Settings</h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                        <div className="form-group" style={{ marginBottom: 0 }}>
                                            <label className="form-label">Delay (seconds)</label>
                                            <input
                                                type="number"
                                                className="form-input"
                                                value={formData.delay_seconds}
                                                onChange={(e) => setFormData(prev => ({ ...prev, delay_seconds: parseInt(e.target.value) || 0 }))}
                                            />
                                        </div>
                                        <div className="form-group" style={{ marginBottom: 0 }}>
                                            <label className="form-label">Frequency</label>
                                            <select
                                                className="form-select"
                                                value={formData.frequency}
                                                onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value }))}
                                            >
                                                <option value="always">Always</option>
                                                <option value="once_session">Once per Session</option>
                                                <option value="once_day">Once per Day</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                                    <label className="toggle">
                                        <input
                                            type="checkbox"
                                            checked={formData.enabled}
                                            onChange={(e) => setFormData(prev => ({ ...prev, enabled: e.target.checked }))}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                    <span>Enable this ad</span>
                                </label>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleSave}>Save Ad</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
