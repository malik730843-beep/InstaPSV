'use client';

import { useState, useEffect } from 'react';

interface Verification {
    id: string;
    service: string;
    verification_type: string;
    verification_code: string;
    is_verified: boolean;
    enabled: boolean;
}

export default function VerificationPage() {
    const [verifications, setVerifications] = useState<Verification[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<Verification | null>(null);

    const [formData, setFormData] = useState({
        service: 'google',
        verification_type: 'meta_tag',
        verification_code: '',
        enabled: true,
    });

    useEffect(() => {
        loadVerifications();
    }, []);

    const loadVerifications = async () => {
        try {
            const res = await fetch('/api/admin/verification');
            const data = await res.json();
            setVerifications(data.verifications || []);
        } catch (error) {
            console.error('Failed to load verifications');
        }
        setLoading(false);
    };

    const handleSave = async () => {
        if (!formData.verification_code) {
            alert('Please enter the verification code');
            return;
        }

        try {
            const payload = editingItem ? { ...formData, id: editingItem.id } : formData;

            const res = await fetch('/api/admin/verification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                setShowModal(false);
                resetForm();
                loadVerifications();
            }
        } catch (error) {
            console.error('Failed to save');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Remove this verification?')) return;

        try {
            const res = await fetch(`/api/admin/verification?id=${id}`, { method: 'DELETE' });
            if (res.ok) loadVerifications();
        } catch (error) {
            console.error('Failed to delete');
        }
    };

    const resetForm = () => {
        setEditingItem(null);
        setFormData({
            service: 'google',
            verification_type: 'meta_tag',
            verification_code: '',
            enabled: true,
        });
    };

    const openEditModal = (item: Verification) => {
        setEditingItem(item);
        setFormData({
            service: item.service,
            verification_type: item.verification_type,
            verification_code: item.verification_code,
            enabled: item.enabled,
        });
        setShowModal(true);
    };

    const getServiceLabel = (service: string) => {
        const labels: Record<string, string> = {
            google: '🔍 Google Search Console',
            adsense: '💰 Google AdSense',
            analytics: '📊 Google Analytics',
            bing: '🔎 Bing Webmaster Tools',
            yandex: '🔴 Yandex Webmaster',
            pinterest: '📌 Pinterest',
            other: '🌐 Other',
        };
        return labels[service] || service;
    };

    const getTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            meta_tag: 'Meta Tag',
            html_file: 'HTML File',
            dns: 'DNS TXT Record',
        };
        return labels[type] || type;
    };

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">✅ Site Verification</h1>
                    <p className="page-subtitle">Verify site ownership for search engines</p>
                </div>
                <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
                    ➕ Add Verification
                </button>
            </div>

            <div className="admin-card">
                {loading ? (
                    <div className="admin-loading" style={{ minHeight: '200px' }}>
                        <div className="admin-spinner"></div>
                    </div>
                ) : verifications.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">✅</div>
                        <h3>No verifications yet</h3>
                        <p>Add verification codes for Google, Bing, and other search engines</p>
                        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                            Add Verification
                        </button>
                    </div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Service</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Enabled</th>
                                <th style={{ width: '150px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {verifications.map((v) => (
                                <tr key={v.id}>
                                    <td style={{ fontWeight: 500 }}>{getServiceLabel(v.service)}</td>
                                    <td>
                                        <span className="badge badge-primary">{getTypeLabel(v.verification_type)}</span>
                                    </td>
                                    <td>
                                        <span className={`badge ${v.is_verified ? 'badge-success' : 'badge-warning'}`}>
                                            {v.is_verified ? 'Verified' : 'Pending'}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge ${v.enabled ? 'badge-success' : 'badge-danger'}`}>
                                            {v.enabled ? 'Yes' : 'No'}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button onClick={() => openEditModal(v)} className="btn btn-secondary btn-sm">
                                                Edit
                                            </button>
                                            <button onClick={() => handleDelete(v.id)} className="btn btn-danger btn-sm">
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Instructions Card */}
            <div className="admin-card" style={{ marginTop: '24px' }}>
                <h3 className="admin-card-title" style={{ marginBottom: '16px' }}>How it works</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                    <div>
                        <h4 style={{ marginBottom: '8px' }}>🏷️ Meta Tag</h4>
                        <p style={{ fontSize: '13px', color: 'var(--admin-text-muted)' }}>
                            We automatically inject the verification meta tag into your site's &lt;head&gt; section.
                        </p>
                    </div>
                    <div>
                        <h4 style={{ marginBottom: '8px' }}>📄 HTML File</h4>
                        <p style={{ fontSize: '13px', color: 'var(--admin-text-muted)' }}>
                            We serve the verification file at the root URL (e.g., /google123abc.html).
                        </p>
                    </div>
                    <div>
                        <h4 style={{ marginBottom: '8px' }}>🌐 DNS TXT Record</h4>
                        <p style={{ fontSize: '13px', color: 'var(--admin-text-muted)' }}>
                            You'll need to add the TXT record manually through your DNS provider.
                        </p>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h3 className="modal-title">{editingItem ? 'Edit Verification' : 'Add Verification'}</h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label className="form-label">Service</label>
                                <select
                                    className="form-select"
                                    value={formData.service}
                                    onChange={(e) => setFormData(prev => ({ ...prev, service: e.target.value }))}
                                >
                                    <option value="google">Google Search Console</option>
                                    <option value="adsense">Google AdSense</option>
                                    <option value="analytics">Google Analytics</option>
                                    <option value="bing">Bing Webmaster Tools</option>
                                    <option value="yandex">Yandex Webmaster</option>
                                    <option value="pinterest">Pinterest</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Verification Type</label>
                                <select
                                    className="form-select"
                                    value={formData.verification_type}
                                    onChange={(e) => setFormData(prev => ({ ...prev, verification_type: e.target.value }))}
                                >
                                    <option value="meta_tag">Meta Tag</option>
                                    <option value="html_file">HTML File</option>
                                    <option value="dns">DNS TXT Record</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Verification Code</label>
                                <textarea
                                    className="form-textarea"
                                    value={formData.verification_code}
                                    onChange={(e) => setFormData(prev => ({ ...prev, verification_code: e.target.value }))}
                                    placeholder={
                                        formData.verification_type === 'meta_tag'
                                            ? '<meta name="google-site-verification" content="..." />'
                                            : formData.verification_type === 'html_file'
                                                ? 'google123abc456def.html (filename)'
                                                : 'google-site-verification=xxxxx'
                                    }
                                    style={{ minHeight: '80px', fontFamily: 'monospace', fontSize: '13px' }}
                                />
                            </div>

                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={formData.enabled}
                                        onChange={(e) => setFormData(prev => ({ ...prev, enabled: e.target.checked }))}
                                    />
                                    <span>Enabled</span>
                                </label>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleSave}>Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
