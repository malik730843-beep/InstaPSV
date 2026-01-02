'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Page {
    id: string;
    title: string;
    slug: string;
    status: string;
    created_at: string;
}

export default function PagesListPage() {
    const [pages, setPages] = useState<Page[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPages();
    }, []);

    const loadPages = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/pages');
            const data = await res.json();
            setPages(data.pages || []);
        } catch (error) {
            console.error('Failed to load pages:', error);
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this page?')) return;

        try {
            const res = await fetch(`/api/admin/pages?id=${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                loadPages();
            }
        } catch (error) {
            console.error('Failed to delete page:', error);
        }
    };

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Pages</h1>
                    <p className="page-subtitle">Manage your static pages</p>
                </div>
                <Link href="/admin/pages/new" className="btn btn-primary">
                    ➕ New Page
                </Link>
            </div>

            <div className="admin-card">
                {loading ? (
                    <div className="admin-loading" style={{ minHeight: '200px' }}>
                        <div className="admin-spinner"></div>
                    </div>
                ) : pages.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">📄</div>
                        <h3>No pages yet</h3>
                        <p>Create pages like About, Privacy, Terms, etc.</p>
                        <Link href="/admin/pages/new" className="btn btn-primary">
                            Create Page
                        </Link>
                    </div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Slug</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th style={{ width: '150px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pages.map((page) => (
                                <tr key={page.id}>
                                    <td>
                                        <Link
                                            href={`/admin/pages/${page.id}/edit`}
                                            style={{ color: 'var(--admin-primary)', textDecoration: 'none', fontWeight: 500 }}
                                        >
                                            {page.title}
                                        </Link>
                                    </td>
                                    <td style={{ color: 'var(--admin-text-muted)', fontSize: '13px' }}>
                                        /{page.slug}
                                    </td>
                                    <td>
                                        <span className={`badge ${page.status === 'published' ? 'badge-success' : 'badge-warning'}`}>
                                            {page.status}
                                        </span>
                                    </td>
                                    <td style={{ color: 'var(--admin-text-muted)', fontSize: '13px' }}>
                                        {new Date(page.created_at).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <Link
                                                href={`/admin/pages/${page.id}/edit`}
                                                className="btn btn-secondary btn-sm"
                                            >
                                                Edit
                                            </Link>
                                            <a
                                                href={`/${page.slug}`}
                                                target="_blank"
                                                className="btn btn-secondary btn-sm"
                                                title="View Page"
                                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            >
                                                👁️
                                            </a>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDelete(page.id)}
                                            >
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
        </div>
    );
}
