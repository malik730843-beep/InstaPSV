'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { CreditCard, RefreshCw, CheckCircle, XCircle, Clock, Mail, Hash, DollarSign, Users, Search } from 'lucide-react';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface PaymentRequest {
    id: string;
    email: string;
    plan_name: string;
    amount: number;
    payment_method: string;
    transaction_id: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    processed_at?: string;
}

export default function AdminPaymentsPage() {
    const [requests, setRequests] = useState<PaymentRequest[]>([]);
    const [activeProsCount, setActiveProsCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState<string | null>(null);
    const [message, setMessage] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/payments');
            const data = await res.json();
            if (Array.isArray(data)) {
                setRequests(data);
            }

            // Fetch active pro count
            const { count, error } = await supabase
                .from('user_subscriptions')
                .select('*', { count: 'exact', head: true })
                .eq('plan', 'monthly');
            
            if (!error && count !== null) {
                setActiveProsCount(count);
            }
        } catch (err) {
            console.error('Fetch requests error:', err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    // Stats calculations
    const stats = {
        totalEarnings: requests
            .filter(r => r.status === 'approved')
            .reduce((sum, r) => sum + (Number(r.amount) || 0), 0),
        totalSubscriptions: requests.filter(r => r.status === 'approved').length,
        pendingVolume: requests
            .filter(r => r.status === 'pending')
            .reduce((sum, r) => sum + (Number(r.amount) || 0), 0),
        pendingCount: requests.filter(r => r.status === 'pending').length
    };

    const handleAction = async (requestId: string, status: 'approved' | 'rejected') => {
        setProcessing(requestId);
        setMessage('');

        try {
            const res = await fetch('/api/admin/payments', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ requestId, status }),
            });

            if (res.ok) {
                setMessage(`Request successfully ${status}!`);
                fetchRequests();
            } else {
                setMessage('Operation failed.');
            }
        } catch (err) {
            setMessage('Something went wrong.');
        } finally {
            setProcessing(null);
        }
    };

    const filteredRequests = requests.filter(req => {
        const matchesStatus = filterStatus === 'all' || req.status === filterStatus;
        const matchesSearch = req.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             req.transaction_id.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved': return 'badge-success';
            case 'rejected': return 'badge-danger';
            default: return 'badge-warning';
        }
    };

    return (
        <div className="payment-tracking-container">
            <div className="page-header">
                <div>
                    <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 0 }}>
                        <CreditCard size={28} color="#f59e0b" /> Payment Tracking System
                    </h1>
                    <p style={{ color: '#9ca3af', marginTop: '0.25rem' }}>
                        Track revenue, monitor subscriptions, and manage pending approvals
                    </p>
                </div>
                <button className="btn-primary" onClick={fetchRequests} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <RefreshCw size={18} className={loading ? "spin" : ""} /> {loading ? 'Updating...' : 'Refresh Data'}
                </button>
            </div>

            {/* Stats Overview */}
            <div className="stats-grid" style={{ marginBottom: '2rem' }}>
                <div className="stat-card">
                    <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                        <DollarSign size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>Total Earnings</h3>
                        <p className="stat-value">${stats.totalEarnings}</p>
                        <span className="stat-label">From {stats.totalSubscriptions} subscriptions</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ backgroundColor: 'rgba(96, 165, 250, 0.1)', color: '#60a5fa' }}>
                        <Users size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>Active Pros</h3>
                        <p className="stat-value">{activeProsCount}</p>
                        <span className="stat-label">Currently active subscribers</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
                        <Clock size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>Pending Volume</h3>
                        <p className="stat-value">${stats.pendingVolume}</p>
                        <span className="stat-label">{stats.pendingCount} requests waiting</span>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="filter-bar" style={{ 
                display: 'flex', 
                gap: '1rem', 
                marginBottom: '1.5rem', 
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '1rem',
                borderRadius: '0.75rem',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                flexWrap: 'wrap',
                alignItems: 'center'
            }}>
                <div style={{ display: 'flex', gap: '0.5rem', flex: 1, minWidth: '300px' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                        <input 
                            type="text" 
                            placeholder="Search by email or Transaction ID..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ 
                                width: '100%',
                                padding: '0.6rem 1rem 0.6rem 2.5rem',
                                background: 'rgba(0, 0, 0, 0.2)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '0.5rem',
                                color: 'white',
                                outline: 'none'
                            }}
                        />
                    </div>
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '0.5rem',
                                background: filterStatus === status ? '#3b82f6' : 'rgba(255, 255, 255, 0.05)',
                                color: filterStatus === status ? 'white' : '#9ca3af',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                                transition: 'all 0.2s',
                                textTransform: 'capitalize'
                            }}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {message && (
                <div className={`admin-alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`} style={{ marginBottom: '1rem' }}>
                    {message}
                </div>
            )}

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
                    <div className="admin-spinner" />
                    <p>Refreshing tracking data...</p>
                </div>
            ) : filteredRequests.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
                    <Clock size={48} style={{ opacity: 0.5, marginBottom: '1rem', display: 'inline-block' }} />
                    <p>No transactions match your current filters.</p>
                </div>
            ) : (
                <div className="table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Subscriber</th>
                                <th>Plan / Revenue</th>
                                <th>Transaction Details</th>
                                <th>Status</th>
                                <th>Request Date</th>
                                <th style={{ textAlign: 'center' }}>Actions / Processed</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRequests.map((req) => (
                                <tr key={req.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(96, 165, 250, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa' }}>
                                                <Mail size={16} />
                                            </div>
                                            <strong>{req.email}</strong>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{req.plan_name.toUpperCase()}</span>
                                            <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 'bold' }}>+${req.amount}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
                                            <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{req.payment_method.toUpperCase()}</span>
                                            <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', background: 'rgba(255, 255, 255, 0.05)', padding: '2px 4px', borderRadius: '4px' }}>
                                                {req.transaction_id}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`badge ${getStatusBadge(req.status)}`}>
                                            {req.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
                                        {new Date(req.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        {req.status === 'pending' ? (
                                            <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
                                                <button 
                                                    className="btn-small btn-success" 
                                                    onClick={() => handleAction(req.id, 'approved')}
                                                    disabled={!!processing}
                                                    title="Approve & Activate"
                                                >
                                                    {processing === req.id ? '...' : <CheckCircle size={14} />}
                                                </button>
                                                <button 
                                                    className="btn-small btn-danger" 
                                                    onClick={() => handleAction(req.id, 'rejected')}
                                                    disabled={!!processing}
                                                    title="Reject Request"
                                                >
                                                    {processing === req.id ? '...' : <XCircle size={14} />}
                                                </button>
                                            </div>
                                        ) : (
                                            <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                                                {req.processed_at ? new Date(req.processed_at).toLocaleDateString() : '—'}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
