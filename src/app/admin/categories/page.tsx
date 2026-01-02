'use client';

import { useEffect, useState } from 'react';

interface Category {
    id: string;
    name: string;
    slug: string;
    color: string;
    created_at: string;
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({ name: '', slug: '', color: '#6366f1' });

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/categories');
            const data = await res.json();
            setCategories(data.categories || []);
        } catch (error) {
            console.error('Failed to load categories');
        }
        setLoading(false);
    };

    const generateSlug = (name: string) => {
        return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    };

    const handleSave = async () => {
        if (!formData.name.trim()) {
            alert('Please enter a name');
            return;
        }

        try {
            const payload = editingCategory
                ? { ...formData, id: editingCategory.id }
                : { ...formData, slug: formData.slug || generateSlug(formData.name) };

            const res = await fetch('/api/admin/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                setShowModal(false);
                setEditingCategory(null);
                setFormData({ name: '', slug: '', color: '#6366f1' });
                loadCategories();
            }
        } catch (error) {
            console.error('Failed to save category');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this category?')) return;

        try {
            const res = await fetch(`/api/admin/categories?id=${id}`, {
                method: 'DELETE',
            });
            if (res.ok) loadCategories();
        } catch (error) {
            console.error('Failed to delete');
        }
    };

    const openEditModal = (cat: Category) => {
        setEditingCategory(cat);
        setFormData({ name: cat.name, slug: cat.slug, color: cat.color });
        setShowModal(true);
    };

    const openNewModal = () => {
        setEditingCategory(null);
        setFormData({ name: '', slug: '', color: '#6366f1' });
        setShowModal(true);
    };

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Categories</h1>
                    <p className="page-subtitle">Organize your posts</p>
                </div>
                <button onClick={openNewModal} className="btn btn-primary">
                    ➕ New Category
                </button>
            </div>

            <div className="admin-card">
                {loading ? (
                    <div className="admin-loading" style={{ minHeight: '200px' }}>
                        <div className="admin-spinner"></div>
                    </div>
                ) : categories.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">📁</div>
                        <h3>No categories yet</h3>
                        <p>Create categories to organize your posts</p>
                        <button onClick={openNewModal} className="btn btn-primary">
                            Create Category
                        </button>
                    </div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Slug</th>
                                <th>Color</th>
                                <th style={{ width: '150px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((cat) => (
                                <tr key={cat.id}>
                                    <td style={{ fontWeight: 500 }}>{cat.name}</td>
                                    <td style={{ color: 'var(--admin-text-muted)', fontSize: '13px' }}>
                                        {cat.slug}
                                    </td>
                                    <td>
                                        <div style={{
                                            width: '24px',
                                            height: '24px',
                                            borderRadius: '4px',
                                            background: cat.color
                                        }} />
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button
                                                onClick={() => openEditModal(cat)}
                                                className="btn btn-secondary btn-sm"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(cat.id)}
                                                className="btn btn-danger btn-sm"
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

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h3 className="modal-title">
                                {editingCategory ? 'Edit Category' : 'New Category'}
                            </h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}>
                                ×
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label className="form-label">Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        name: e.target.value,
                                        slug: prev.slug || generateSlug(e.target.value)
                                    }))}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Slug</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.slug}
                                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label">Color</label>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <input
                                        type="color"
                                        value={formData.color}
                                        onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                                        style={{ width: '50px', height: '40px', border: 'none', cursor: 'pointer' }}
                                    />
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.color}
                                        onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                                        style={{ flex: 1 }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                Cancel
                            </button>
                            <button className="btn btn-primary" onClick={handleSave}>
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
