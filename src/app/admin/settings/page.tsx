'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SiteSettingsPage() {
    const [activeTab, setActiveTab] = useState('general');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');

    const [settings, setSettings] = useState({
        site_name: '',
        tagline: '',
        logo: '',
        favicon: '',
        social_image: '',
        footer_text: '',
        contact_email: '',
        ads_enabled: 'true',
        maintenance_mode: 'false',
    });

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const res = await fetch('/api/admin/settings?type=site');
            const data = await res.json();
            if (data.settings) {
                const settingsObj: any = {};
                data.settings.forEach((s: any) => {
                    settingsObj[s.key] = s.value || '';
                });
                setSettings(prev => ({ ...prev, ...settingsObj }));
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
                    type: 'site',
                    settings: Object.entries(settings).map(([key, value]) => ({ key, value })),
                }),
            });

            if (res.ok) {
                setMessage('Settings saved successfully!');
                setTimeout(() => setMessage(''), 3000);
            }
        } catch (error) {
            setMessage('Failed to save settings');
        }
        setSaving(false);
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        setUploading(true);

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `logo-${Date.now()}.${fileExt}`;
            const filePath = `branding/${fileName}`;

            // Upload to 'assets' bucket
            const { error: uploadError } = await supabase.storage
                .from('assets')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Get public URL
            const { data } = supabase.storage
                .from('assets')
                .getPublicUrl(filePath);

            setSettings(prev => ({ ...prev, logo: data.publicUrl }));
            setMessage('Logo uploaded! Don\'t forget to save.');
        } catch (error: any) {
            console.error('Error uploading logo:', error);
            setMessage('Failed to upload logo: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        setUploading(true);

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `favicon-${Date.now()}.${fileExt}`;
            const filePath = `branding/${fileName}`;

            // Upload to 'assets' bucket
            const { error: uploadError } = await supabase.storage
                .from('assets')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Get public URL
            const { data } = supabase.storage
                .from('assets')
                .getPublicUrl(filePath);

            setSettings(prev => ({ ...prev, favicon: data.publicUrl }));
            setMessage('Favicon uploaded! Don\'t forget to save.');
        } catch (error: any) {
            console.error('Error uploading favicon:', error);
            setMessage('Failed to upload favicon: ' + error.message);
        } finally {
            setUploading(false);
        }
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
                    <h1 className="page-title">Site Settings</h1>
                    <p className="page-subtitle">Configure your website settings</p>
                </div>
                <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Settings'}
                </button>
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

            {/* Tabs */}
            <div className="tabs">
                <button
                    className={`tab ${activeTab === 'general' ? 'active' : ''}`}
                    onClick={() => setActiveTab('general')}
                >
                    General
                </button>
                <button
                    className={`tab ${activeTab === 'branding' ? 'active' : ''}`}
                    onClick={() => setActiveTab('branding')}
                >
                    Branding
                </button>
                <button
                    className={`tab ${activeTab === 'behavior' ? 'active' : ''}`}
                    onClick={() => setActiveTab('behavior')}
                >
                    Behavior
                </button>
            </div>

            {/* General Tab */}
            {activeTab === 'general' && (
                <div className="admin-card">
                    <div className="form-group">
                        <label className="form-label">Site Name</label>
                        <input
                            type="text"
                            className="form-input"
                            value={settings.site_name}
                            onChange={(e) => setSettings(prev => ({ ...prev, site_name: e.target.value }))}
                            placeholder="InstaPSV"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Tagline</label>
                        <input
                            type="text"
                            className="form-input"
                            value={settings.tagline}
                            onChange={(e) => setSettings(prev => ({ ...prev, tagline: e.target.value }))}
                            placeholder="Anonymous Instagram Viewer"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Footer Text</label>
                        <textarea
                            className="form-textarea"
                            value={settings.footer_text}
                            onChange={(e) => setSettings(prev => ({ ...prev, footer_text: e.target.value }))}
                            placeholder="© 2024 InstaPSV. All rights reserved."
                            style={{ minHeight: '80px' }}
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Contact Email</label>
                        <input
                            type="email"
                            className="form-input"
                            value={settings.contact_email}
                            onChange={(e) => setSettings(prev => ({ ...prev, contact_email: e.target.value }))}
                            placeholder="contact@example.com"
                        />
                    </div>
                </div>
            )}

            {/* Branding Tab */}
            {activeTab === 'branding' && (
                <div className="admin-card">
                    <div className="form-group">
                        <label className="form-label">Logo URL</label>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                            <input
                                type="text"
                                className="form-input"
                                value={settings.logo}
                                onChange={(e) => setSettings(prev => ({ ...prev, logo: e.target.value }))}
                                placeholder="https://example.com/logo.png"
                                style={{ flex: 1 }}
                            />
                            <div className="file-upload-btn" style={{ position: 'relative', overflow: 'hidden' }}>
                                <button className="btn btn-secondary" type="button">
                                    Upload
                                </button>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoUpload}
                                    disabled={uploading}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        opacity: 0,
                                        cursor: 'pointer'
                                    }}
                                />
                            </div>
                        </div>
                        {uploading && <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>Uploading...</div>}
                        {settings.logo && (
                            <img src={settings.logo} alt="Logo preview" style={{ marginTop: '4px', maxHeight: '60px', borderRadius: '4px' }} />
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Favicon URL</label>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                            <input
                                type="text"
                                className="form-input"
                                value={settings.favicon}
                                onChange={(e) => setSettings(prev => ({ ...prev, favicon: e.target.value }))}
                                placeholder="https://example.com/favicon.ico"
                                style={{ flex: 1 }}
                            />
                            <div className="file-upload-btn" style={{ position: 'relative', overflow: 'hidden' }}>
                                <button className="btn btn-secondary" type="button">
                                    Upload
                                </button>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFaviconUpload}
                                    disabled={uploading}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        opacity: 0,
                                        cursor: 'pointer'
                                    }}
                                />
                            </div>
                        </div>
                        {uploading && <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>Uploading...</div>}
                        {settings.favicon && (
                            <img src={settings.favicon} alt="Favicon preview" style={{ marginTop: '4px', maxHeight: '32px', borderRadius: '4px' }} />
                        )}
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Default Social Image</label>
                        <input
                            type="text"
                            className="form-input"
                            value={settings.social_image}
                            onChange={(e) => setSettings(prev => ({ ...prev, social_image: e.target.value }))}
                            placeholder="https://example.com/og-image.jpg"
                        />
                        <p style={{ fontSize: '12px', color: 'var(--admin-text-muted)', marginTop: '8px' }}>
                            Used for Open Graph and Twitter cards when sharing
                        </p>
                    </div>
                </div>
            )}

            {/* Behavior Tab */}
            {activeTab === 'behavior' && (
                <div className="admin-card">
                    <div className="form-group">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                            <label className="toggle">
                                <input
                                    type="checkbox"
                                    checked={settings.ads_enabled === 'true'}
                                    onChange={(e) => setSettings(prev => ({
                                        ...prev,
                                        ads_enabled: e.target.checked ? 'true' : 'false'
                                    }))}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                            <div>
                                <strong>Enable Ads</strong>
                                <p style={{ margin: 0, fontSize: '13px', color: 'var(--admin-text-muted)' }}>
                                    Show advertisements on the frontend
                                </p>
                            </div>
                        </label>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                            <label className="toggle">
                                <input
                                    type="checkbox"
                                    checked={settings.maintenance_mode === 'true'}
                                    onChange={(e) => setSettings(prev => ({
                                        ...prev,
                                        maintenance_mode: e.target.checked ? 'true' : 'false'
                                    }))}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                            <div>
                                <strong>Maintenance Mode</strong>
                                <p style={{ margin: 0, fontSize: '13px', color: 'var(--admin-text-muted)' }}>
                                    Show maintenance page to visitors (admins can still access)
                                </p>
                            </div>
                        </label>
                    </div>
                </div>
            )}
        </div>
    );
}
