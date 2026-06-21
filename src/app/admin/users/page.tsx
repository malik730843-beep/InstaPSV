'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Users, RefreshCw, UserX, Edit2, Zap, Rocket } from 'lucide-react';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface UserSub {
    id: string;
    email: string;
    plan: string;
    credits_remaining: number;
    credits_total: number;
    plan_expires_at: string | null;
    created_at: string;
    updated_at: string;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<UserSub[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState({ plan: '', credits_remaining: 0, plan_expires_at: '' });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [activeFilter, setActiveFilter] = useState<'all' | 'free' | 'paid' | 'expired'>('all');

    const fetchUsers = async () => {
        setLoading(true);
        const res = await fetch('/api/admin/users');
        const data = await res.json();
        if (Array.isArray(data)) {
            setUsers(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const startEdit = (user: UserSub) => {
        setEditingId(user.id);
        setEditForm({
            plan: user.plan,
            credits_remaining: user.credits_remaining,
            plan_expires_at: user.plan_expires_at ? user.plan_expires_at.slice(0, 16) : '',
        });
        setMessage('');
    };

    const cancelEdit = () => {
        setEditingId(null);
        setMessage('');
    };

    const saveEdit = async (userId: string) => {
        setSaving(true);
        setMessage('');

        let credits = editForm.credits_remaining;
        let creditsTotal = editForm.credits_remaining;

        if (editForm.plan === 'free') {
            creditsTotal = 2; // 1 profile search
            if (credits > 2) credits = 2;
        } else if (editForm.plan === 'monthly') {
            credits = -1;
            creditsTotal = -1;
        }

        const res = await fetch('/api/admin/users', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: userId,
                plan: editForm.plan,
                credits_remaining: credits,
                credits_total: creditsTotal,
                plan_expires_at: editForm.plan_expires_at || null,
            }),
        });

        if (res.ok) {
            setMessage('User updated successfully!');
            setEditingId(null);
            fetchUsers();
        } else {
            setMessage('Failed to update user.');
        }
        setSaving(false);
    };

    const quickUpgrade = async (userId: string, plan: string) => {
        const now = new Date();
        let expires: string;
        let credits: number;
        let creditsTotal: number;

        const exp = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        expires = exp.toISOString();
        credits = -1;
        creditsTotal = -1;

        setSaving(true);
        const res = await fetch('/api/admin/users', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: userId,
                plan,
                credits_remaining: credits,
                credits_total: creditsTotal,
                plan_expires_at: expires,
            }),
        });

        if (res.ok) {
            setMessage(`User upgraded to ${plan}!`);
            fetchUsers();
        } else {
            setMessage('Failed to upgrade user.');
        }
        setSaving(false);
    };

    const getPlanBadgeClass = (plan: string) => {
        switch (plan) {
            case 'monthly': return 'badge-success';
            default: return 'badge-default';
        }
    };

    const formatDate = (d: string | null) => {
        if (!d) return '—';
        return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const isExpired = (d: string | null) => {
        if (!d) return false;
        return new Date(d) < new Date();
    };

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 0 }}>
                        <Users size={28} color="#60a5fa" /> User Management
                    </h1>
                    <p style={{ color: '#9ca3af', marginTop: '0.25rem' }}>
                        Manage subscriptions and credits for all users
                    </p>
                </div>
                <button className="btn-primary" onClick={fetchUsers} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <RefreshCw size={18} className={loading ? "spin" : ""} /> {loading ? 'Loading...' : 'Refresh'}
                </button>
            </div>

            {message && (
                <div style={{
                    padding: '0.75rem 1rem',
                    marginBottom: '1rem',
                    borderRadius: '0.5rem',
                    background: message.includes('success') || message.includes('upgraded')
                        ? 'rgba(16, 185, 129, 0.15)'
                        : 'rgba(239, 68, 68, 0.15)',
                    color: message.includes('success') || message.includes('upgraded') ? '#10b981' : '#ef4444',
                    border: `1px solid ${message.includes('success') || message.includes('upgraded') ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                    fontSize: '0.9rem',
                }}>
                    {message}
                </div>
            )}

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
                    <div className="admin-spinner" />
                    <p>Loading users...</p>
                </div>
            ) : users.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
                    <UserX size={48} style={{ opacity: 0.5, marginBottom: '1rem', display: 'inline-block' }} />
                    <p>No users found. Users appear here after they perform a search.</p>
                </div>
            ) : (
                <div>
                    {/* Filter Tabs */}
                    <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '0.75rem', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => setActiveFilter('all')}
                            style={{
                                background: activeFilter === 'all' ? '#2563eb' : 'rgba(255, 255, 255, 0.05)',
                                color: '#fff',
                                border: 'none',
                                padding: '0.5rem 1rem',
                                borderRadius: '0.375rem',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '0.85rem',
                                transition: 'all 0.2s'
                            }}
                        >
                            All ({users.length})
                        </button>
                        <button
                            onClick={() => setActiveFilter('free')}
                            style={{
                                background: activeFilter === 'free' ? '#2563eb' : 'rgba(255, 255, 255, 0.05)',
                                color: '#fff',
                                border: 'none',
                                padding: '0.5rem 1rem',
                                borderRadius: '0.375rem',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '0.85rem',
                                transition: 'all 0.2s'
                            }}
                        >
                            Free ({users.filter(u => u.plan === 'free').length})
                        </button>
                        <button
                            onClick={() => setActiveFilter('paid')}
                            style={{
                                background: activeFilter === 'paid' ? '#10b981' : 'rgba(255, 255, 255, 0.05)',
                                color: '#fff',
                                border: 'none',
                                padding: '0.5rem 1rem',
                                borderRadius: '0.375rem',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '0.85rem',
                                transition: 'all 0.2s'
                            }}
                        >
                            Paid ({users.filter(u => u.plan !== 'free' && !isExpired(u.plan_expires_at)).length})
                        </button>
                        <button
                            onClick={() => setActiveFilter('expired')}
                            style={{
                                background: activeFilter === 'expired' ? '#ef4444' : 'rgba(255, 255, 255, 0.05)',
                                color: '#fff',
                                border: 'none',
                                padding: '0.5rem 1rem',
                                borderRadius: '0.375rem',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '0.85rem',
                                transition: 'all 0.2s'
                            }}
                        >
                            Expired ({users.filter(u => u.plan !== 'free' && isExpired(u.plan_expires_at)).length})
                        </button>
                    </div>

                    <div className="table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Email</th>
                                    <th>Plan</th>
                                    <th>Credits</th>
                                    <th>Expires</th>
                                    <th>Joined</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users
                                    .filter((user) => {
                                        if (activeFilter === 'free') return user.plan === 'free';
                                        if (activeFilter === 'paid') return user.plan !== 'free' && !isExpired(user.plan_expires_at);
                                        if (activeFilter === 'expired') return user.plan !== 'free' && isExpired(user.plan_expires_at);
                                        return true;
                                    })
                                    .map((user) => (
                                        <tr key={user.id}>
                                    <td>
                                        <strong style={{ color: 'var(--admin-text)' }}>{user.email}</strong>
                                    </td>
                                    <td>
                                        <span className={`badge ${getPlanBadgeClass(user.plan)}`}>
                                            {user.plan.toUpperCase()}
                                        </span>
                                    </td>
                                    <td>
                                        {user.plan === 'monthly'
                                            ? '∞'
                                            : `${user.credits_remaining} / ${user.credits_total}`
                                        }
                                    </td>
                                    <td>
                                        {user.plan_expires_at ? (
                                            <span style={{ color: isExpired(user.plan_expires_at) ? '#ef4444' : '#10b981' }}>
                                                {formatDate(user.plan_expires_at)}
                                                {isExpired(user.plan_expires_at) && ' (EXPIRED)'}
                                            </span>
                                        ) : '—'}
                                    </td>
                                    <td style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
                                        {formatDate(user.created_at)}
                                    </td>
                                    <td>
                                        {editingId === user.id ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '220px' }}>
                                                <select
                                                    value={editForm.plan}
                                                    onChange={(e) => setEditForm({ ...editForm, plan: e.target.value })}
                                                    className="admin-input"
                                                >
                                                    <option value="free">Free ($0)</option>
                                                    <option value="monthly">Pro ($5)</option>
                                                </select>
                                                {editForm.plan !== 'monthly' && (
                                                    <input
                                                        type="number"
                                                        value={editForm.credits_remaining}
                                                        onChange={(e) => setEditForm({ ...editForm, credits_remaining: parseInt(e.target.value) || 0 })}
                                                        className="admin-input"
                                                        placeholder="Credits"
                                                    />
                                                )}
                                                {editForm.plan !== 'free' && (
                                                    <input
                                                        type="datetime-local"
                                                        value={editForm.plan_expires_at}
                                                        onChange={(e) => setEditForm({ ...editForm, plan_expires_at: e.target.value })}
                                                        className="admin-input"
                                                    />
                                                )}
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button
                                                        className="btn-primary"
                                                        onClick={() => saveEdit(user.id)}
                                                        disabled={saving}
                                                        style={{ flex: 1, padding: '0.4rem' }}
                                                    >
                                                        {saving ? '...' : 'Save'}
                                                    </button>
                                                    <button
                                                        className="btn-secondary"
                                                        onClick={cancelEdit}
                                                        style={{ flex: 1, padding: '0.4rem' }}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                <button
                                                    className="btn-small"
                                                    onClick={() => startEdit(user)}
                                                    title="Edit user plan"
                                                    style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                                                >
                                                    <Edit2 size={14} /> Edit
                                                </button>
                                                {user.plan !== 'monthly' && (
                                                    <button
                                                        className="btn-small btn-success"
                                                        onClick={() => quickUpgrade(user.id, 'monthly')}
                                                        disabled={saving}
                                                        title="Quick Upgrade to Pro"
                                                        style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                                                    >
                                                        <Rocket size={14} /> Upgrade to Pro
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            )}
        </div>
    );
}
