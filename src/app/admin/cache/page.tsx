'use client';

import { useState } from 'react';

export default function CacheManagerPage() {
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [messageType, setMessageType] = useState<'success' | 'error'>('success');

    const handleClearProfile = async () => {
        if (!username) {
            setMessage('Please enter a username');
            setMessageType('error');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`/api/admin/cache?username=${username}`, {
                method: 'DELETE',
            });
            const data = await res.json();

            if (res.ok) {
                setMessage(data.message);
                setMessageType('success');
                setUsername('');
            } else {
                setMessage(data.error || 'Failed to clear cache');
                setMessageType('error');
            }
        } catch (error) {
            setMessage('Network error');
            setMessageType('error');
        }
        setLoading(false);
    };

    const handleClearAll = async () => {
        if (!confirm('Are you sure you want to clear ALL cache? This cannot be undone.')) {
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/admin/cache?all=true', {
                method: 'DELETE',
            });
            const data = await res.json();

            if (res.ok) {
                setMessage(data.message);
                setMessageType('success');
            } else {
                setMessage(data.error || 'Failed to clear cache');
                setMessageType('error');
            }
        } catch (error) {
            setMessage('Network error');
            setMessageType('error');
        }
        setLoading(false);
    };

    const handleRefreshProfile = async () => {
        if (!username) {
            setMessage('Please enter a username');
            setMessageType('error');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/admin/cache', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username }),
            });
            const data = await res.json();

            if (res.ok) {
                setMessage('Profile refreshed successfully');
                setMessageType('success');
                setUsername('');
            } else {
                setMessage(data.error || 'Failed to refresh profile');
                setMessageType('error');
            }
        } catch (error) {
            setMessage('Network error');
            setMessageType('error');
        }
        setLoading(false);
    };

    return (
        <div>
            <h1 style={styles.title}>Cache Manager</h1>
            <p style={styles.subtitle}>Manage Redis cache for Instagram profiles</p>

            {message && (
                <div style={{
                    ...styles.message,
                    background: messageType === 'success' ? '#d4edda' : '#f8d7da',
                    color: messageType === 'success' ? '#155724' : '#721c24',
                }}>
                    {message}
                </div>
            )}

            <div style={styles.card}>
                <h2 style={styles.sectionTitle}>Profile Cache</h2>

                <div style={styles.inputGroup}>
                    <label style={styles.label}>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter Instagram username"
                        style={styles.input}
                    />
                </div>

                <div style={styles.buttonGroup}>
                    <button
                        onClick={handleClearProfile}
                        style={styles.buttonDanger}
                        disabled={loading}
                    >
                        🗑️ Clear Profile Cache
                    </button>
                    <button
                        onClick={handleRefreshProfile}
                        style={styles.buttonPrimary}
                        disabled={loading}
                    >
                        🔄 Force Refresh
                    </button>
                </div>
            </div>

            <div style={styles.card}>
                <h2 style={styles.sectionTitle}>Danger Zone</h2>
                <p style={styles.dangerText}>
                    Clearing all cache will remove ALL cached profiles. Use with caution.
                </p>
                <button
                    onClick={handleClearAll}
                    style={styles.buttonDangerLarge}
                    disabled={loading}
                >
                    💥 Clear ALL Cache
                </button>
            </div>
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    title: {
        fontSize: '28px',
        fontWeight: '700',
        color: '#1a1a2e',
        marginBottom: '8px',
    },
    subtitle: {
        fontSize: '14px',
        color: '#666',
        marginBottom: '30px',
    },
    message: {
        padding: '12px 16px',
        borderRadius: '8px',
        marginBottom: '20px',
        fontSize: '14px',
    },
    card: {
        background: '#fff',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    },
    sectionTitle: {
        fontSize: '18px',
        fontWeight: '600',
        color: '#1a1a2e',
        marginBottom: '16px',
    },
    inputGroup: {
        marginBottom: '16px',
    },
    label: {
        display: 'block',
        fontSize: '14px',
        fontWeight: '500',
        color: '#333',
        marginBottom: '6px',
    },
    input: {
        width: '100%',
        padding: '12px 16px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        fontSize: '16px',
    },
    buttonGroup: {
        display: 'flex',
        gap: '12px',
    },
    buttonPrimary: {
        padding: '12px 24px',
        borderRadius: '8px',
        border: 'none',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    buttonDanger: {
        padding: '12px 24px',
        borderRadius: '8px',
        border: 'none',
        background: '#e74c3c',
        color: '#fff',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    dangerText: {
        fontSize: '14px',
        color: '#666',
        marginBottom: '16px',
    },
    buttonDangerLarge: {
        padding: '14px 28px',
        borderRadius: '8px',
        border: '2px solid #e74c3c',
        background: 'transparent',
        color: '#e74c3c',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
    },
};
