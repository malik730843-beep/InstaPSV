"use client";

import React, { useState, useEffect } from 'react';
import { calculateSEOScore, SEOAnalysisResult } from '@/lib/seoAnalysis';

interface SEOPanelProps {
    formData: any;
    setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export default function SEOPanel({ formData, setFormData }: SEOPanelProps) {
    const [showSEO, setShowSEO] = useState(true);
    const [activeTab, setActiveTab] = useState<'general' | 'social' | 'advanced'>('general');
    const [analysis, setAnalysis] = useState<SEOAnalysisResult | null>(null);

    // Run analysis whenever content changes
    useEffect(() => {
        const result = calculateSEOScore(
            formData.content || '',
            formData.focus_keyword || '',
            formData.meta_title || formData.title || '',
            formData.meta_description || formData.excerpt || '',
            formData.slug || ''
        );
        setAnalysis(result);
    }, [formData.content, formData.focus_keyword, formData.meta_title, formData.title, formData.meta_description, formData.excerpt, formData.slug]);

    const getScoreColor = (score: number) => {
        if (score >= 80) return '#10b981'; // Green
        if (score >= 50) return '#f59e0b'; // Orange
        return '#ef4444'; // Red
    };

    return (
        <div className="admin-card">
            <div
                className="admin-card-header"
                style={{ cursor: 'pointer', marginBottom: showSEO ? '20px' : 0, borderBottom: showSEO ? '1px solid var(--admin-border)' : 'none', paddingBottom: showSEO ? '20px' : 0 }}
                onClick={() => setShowSEO(!showSEO)}
            >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <h2 className="admin-card-title" style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            padding: '6px',
                            borderRadius: '6px',
                            marginRight: '10px',
                            color: 'white',
                            display: 'flex'
                        }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </span>
                        SEO & Schema
                    </h2>

                    {analysis && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                border: `3px solid ${getScoreColor(analysis.score)}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                color: getScoreColor(analysis.score),
                                fontSize: '14px'
                            }}>
                                {analysis.score}
                            </div>
                            <span style={{ transform: showSEO ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', color: 'var(--admin-text-muted)' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {showSEO && (
                <div>
                    {/* SEO Tabs */}
                    <div className="admin-tabs" style={{ marginBottom: '24px', borderBottom: '1px solid var(--admin-border)', display: 'flex', overflowX: 'auto' }}>
                        <button
                            type="button"
                            className={`tab-btn ${activeTab === 'general' ? 'active' : ''}`}
                            onClick={() => setActiveTab('general')}
                            style={{ padding: '12px 20px', fontSize: '14px', whiteSpace: 'nowrap' }}
                        >General</button>
                        <button
                            type="button"
                            className={`tab-btn ${activeTab === 'social' ? 'active' : ''}`}
                            onClick={() => setActiveTab('social')}
                            style={{ padding: '12px 20px', fontSize: '14px', whiteSpace: 'nowrap' }}
                        >Social</button>
                        <button
                            type="button"
                            className={`tab-btn ${activeTab === 'advanced' ? 'active' : ''}`}
                            onClick={() => setActiveTab('advanced')}
                            style={{ padding: '12px 20px', fontSize: '14px', whiteSpace: 'nowrap' }}
                        >Advanced</button>
                    </div>

                    {/* General Tab */}
                    {activeTab === 'general' && (
                        <div id="seo-tab-general">
                            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                                {/* Left Side: Editors */}
                                <div style={{ flex: '2', minWidth: '300px' }}>
                                    {/* Snippet Preview */}
                                    <div style={{
                                        background: '#fff',
                                        border: '1px solid var(--admin-border)',
                                        borderRadius: '8px',
                                        padding: '20px',
                                        marginBottom: '24px',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                            <h3 style={{ fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4285f4" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 8v8" /><path d="M8 12h8" /></svg>
                                                Snippet Preview
                                            </h3>
                                            <div style={{ fontSize: '12px', display: 'flex', gap: '8px' }}>
                                                <button type="button" style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: '600', color: 'var(--admin-primary)' }}>Mobile</button>
                                                <button type="button" style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--admin-text-muted)' }}>Desktop</button>
                                            </div>
                                        </div>

                                        <div style={{ background: '#fff', padding: '12px', borderRadius: '4px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                                <div style={{ width: '28px', height: '28px', background: '#f1f3f4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#5f6368' }}>I</div>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span style={{ fontSize: '12px', color: '#202124' }}>InstaPSV</span>
                                                    <span style={{ fontSize: '12px', color: '#5f6368' }}>instapsv.com › blog › {formData.slug || 'post-slug'}</span>
                                                </div>
                                            </div>
                                            <div style={{ color: '#1a0dab', fontSize: '20px', fontWeight: '400', lineHeight: '1.3', marginBottom: '4px', cursor: 'pointer', textDecoration: 'none' }}>
                                                {formData.meta_title || formData.title || 'Post Title'}
                                            </div>
                                            <div style={{ color: '#4d5156', fontSize: '14px', lineHeight: '1.58' }}>
                                                <span style={{ color: '#70757a', fontSize: '12px', marginRight: '4px' }}>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} — </span>
                                                {(formData.meta_description || formData.excerpt || 'Please provide a meta description to see how it will look in search engines.').substring(0, 155)}...
                                            </div>
                                        </div>
                                    </div>

                                    {/* Focus Keyword */}
                                    <div className="form-group">
                                        <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span>Focus Keyword</span>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                {/* Premium Auto Extract Button */}
                                                <button className="btn btn-secondary btn-sm" type="button" style={{ fontSize: '10px', padding: '2px 8px' }}>🤖 AI Extract</button>
                                                <span style={{ color: formData.focus_keyword ? '#10b981' : '#f59e0b', fontSize: '12px', fontWeight: '500' }}>
                                                    {formData.focus_keyword ? 'Active' : 'Missing'}
                                                </span>
                                            </div>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="Focus keyword..."
                                            value={formData.focus_keyword}
                                            onChange={(e) => setFormData((prev: any) => ({ ...prev, focus_keyword: e.target.value }))}
                                            style={{ borderColor: formData.focus_keyword ? '#10b981' : '' }}
                                        />
                                        <p style={{ fontSize: '12px', color: 'var(--admin-text-muted)', marginTop: '4px' }}>
                                            Enter the main keyword you want to rank for.
                                        </p>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span>SEO Title</span>
                                            <button className="btn btn-secondary btn-sm" type="button" style={{ fontSize: '10px', padding: '2px 8px' }}>✨ AI Generate</button>
                                        </label>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                type="text"
                                                className="form-input"
                                                placeholder={formData.title}
                                                value={formData.meta_title}
                                                onChange={(e) => setFormData((prev: any) => ({ ...prev, meta_title: e.target.value }))}
                                                style={{ paddingRight: '50px' }}
                                            />
                                            <div style={{
                                                position: 'absolute',
                                                right: '12px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                fontSize: '12px',
                                                fontWeight: '600',
                                                color: (formData.meta_title.length > 60 || formData.meta_title.length === 0) ? '#f59e0b' : '#10b981'
                                            }}>
                                                {formData.meta_title.length}/60
                                            </div>
                                        </div>
                                        {/* Progress Bar */}
                                        <div style={{ height: '4px', width: '100%', background: '#e5e7eb', marginTop: '8px', borderRadius: '2px', overflow: 'hidden' }}>
                                            <div style={{
                                                height: '100%',
                                                width: `${Math.min((formData.meta_title.length / 60) * 100, 100)}%`,
                                                background: (formData.meta_title.length > 60 || formData.meta_title.length < 30) ? '#f59e0b' : '#10b981',
                                                transition: 'width 0.3s ease'
                                            }}></div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span>Meta Description</span>
                                            <button className="btn btn-secondary btn-sm" type="button" style={{ fontSize: '10px', padding: '2px 8px' }}>✨ AI Generate</button>
                                        </label>
                                        <div style={{ position: 'relative' }}>
                                            <textarea
                                                className="form-textarea"
                                                placeholder="Write a compelling meta description..."
                                                value={formData.meta_description}
                                                onChange={(e) => setFormData((prev: any) => ({ ...prev, meta_description: e.target.value }))}
                                                style={{ minHeight: '80px' }}
                                            />
                                            <div style={{
                                                position: 'absolute',
                                                bottom: '12px',
                                                right: '12px',
                                                fontSize: '12px',
                                                fontWeight: '600',
                                                color: (formData.meta_description.length > 160 || formData.meta_description.length === 0) ? '#f59e0b' : '#10b981'
                                            }}>
                                                {formData.meta_description.length}/160
                                            </div>
                                        </div>
                                        {/* Progress Bar */}
                                        <div style={{ height: '4px', width: '100%', background: '#e5e7eb', marginTop: '8px', borderRadius: '2px', overflow: 'hidden' }}>
                                            <div style={{
                                                height: '100%',
                                                width: `${Math.min((formData.meta_description.length / 160) * 100, 100)}%`,
                                                background: (formData.meta_description.length > 160 || formData.meta_description.length < 100) ? '#f59e0b' : '#10b981',
                                                transition: 'width 0.3s ease'
                                            }}></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Analysis Results */}
                                <div style={{ flex: '1', minWidth: '250px', background: '#f9fafb', padding: '16px', borderRadius: '8px', border: '1px solid var(--admin-border)' }}>
                                    <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px' }}>SEO Analysis</h3>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {analysis?.issues.map((issue, idx) => (
                                            <div key={idx} style={{
                                                display: 'flex',
                                                gap: '8px',
                                                alignItems: 'start',
                                                fontSize: '13px',
                                                color: '#374151'
                                            }}>
                                                <span style={{
                                                    color: issue.type === 'good' ? '#10b981' : (issue.type === 'critical' ? '#ef4444' : '#f59e0b'),
                                                    marginTop: '2px'
                                                }}>
                                                    {issue.type === 'good' ? '✔' : (issue.type === 'critical' ? '✖' : '⚠')}
                                                </span>
                                                <span>{issue.message}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Stats */}
                                    <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e5e7eb', fontSize: '12px', color: '#6b7280' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                            <span>Word Count:</span>
                                            <span style={{ fontWeight: '600' }}>{analysis?.stats.wordCount}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                            <span>Keyword Density:</span>
                                            <span style={{ fontWeight: '600' }}>{(analysis?.stats.keywordDensity || 0).toFixed(2)}%</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span>Reading Time:</span>
                                            <span style={{ fontWeight: '600' }}>{analysis?.stats.readingTime} min</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Social Tab */}
                    {activeTab === 'social' && (
                        <div id="seo-tab-social">
                            <div className="form-group" style={{ marginBottom: '24px' }}>
                                <h3 style={{ fontSize: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ color: '#1877f2' }}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z" /></svg>
                                    </span>
                                    Facebook / Open Graph
                                </h3>
                                <div style={{ background: '#f0f2f5', padding: '16px', borderRadius: '8px' }}>
                                    <div style={{ background: '#fff', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ddd', maxWidth: '500px', margin: '0 auto' }}>
                                        <div style={{ height: '260px', background: '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                            {formData.og_image || formData.featured_image ? (
                                                <img src={formData.og_image || formData.featured_image} alt="OG Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <span style={{ color: '#666' }}>No Image</span>
                                            )}
                                        </div>
                                        <div style={{ padding: '12px' }}>
                                            <div style={{ fontSize: '12px', color: '#65676b', fontWeight: '500', marginBottom: '4px', textTransform: 'uppercase' }}>INSTAPSV.COM</div>
                                            <div style={{ fontSize: '16px', color: '#050505', fontWeight: '700', marginBottom: '4px', lineHeight: '1.2' }}>{formData.og_title || formData.title || 'Post Title'}</div>
                                            <div style={{ fontSize: '14px', color: '#65676b', lineHeight: '1.3', maxHeight: '38px', overflow: 'hidden' }}>{formData.og_description || formData.excerpt || 'Post description...'}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Facebook Title</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder={formData.title}
                                    value={formData.og_title}
                                    onChange={(e) => setFormData((prev: any) => ({ ...prev, og_title: e.target.value }))}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Facebook Description</label>
                                <textarea
                                    className="form-textarea"
                                    placeholder={formData.excerpt}
                                    value={formData.og_description}
                                    onChange={(e) => setFormData((prev: any) => ({ ...prev, og_description: e.target.value }))}
                                    style={{ minHeight: '80px' }}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Facebook Image URL</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder={formData.featured_image || "https://..."}
                                    value={formData.og_image}
                                    onChange={(e) => setFormData((prev: any) => ({ ...prev, og_image: e.target.value }))}
                                />
                            </div>
                        </div>
                    )}

                    {/* Advanced Tab */}
                    {activeTab === 'advanced' && (
                        <div id="seo-tab-advanced">
                            <div className="form-group">
                                <label className="form-label">Robots Meta</label>
                                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                                    <div style={{ width: '100%' }}>
                                        <select
                                            className="form-select"
                                            value={formData.robots || 'index,follow'}
                                            onChange={(e) => setFormData((prev: any) => ({ ...prev, robots: e.target.value }))}
                                        >
                                            <option value="index,follow">Index, Follow (Default)</option>
                                            <option value="noindex,follow">No Index, Follow</option>
                                            <option value="index,nofollow">Index, No Follow</option>
                                            <option value="noindex,nofollow">No Index, No Follow</option>
                                        </select>
                                        <p style={{ fontSize: '12px', color: 'var(--admin-text-muted)', marginTop: '4px' }}>
                                            Control how search engines index this page.
                                        </p>
                                    </div>

                                    <div style={{ display: 'flex', gap: '16px', width: '100%' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
                                            <input
                                                type="checkbox"
                                                checked={formData.robots_advanced?.includes('noarchive')}
                                                onChange={(e) => {
                                                    const val = 'noarchive';
                                                    if (e.target.checked) setFormData((prev: any) => ({ ...prev, robots_advanced: [...(prev.robots_advanced || []), val] }));
                                                    else setFormData((prev: any) => ({ ...prev, robots_advanced: prev.robots_advanced?.filter((v: string) => v !== val) }));
                                                }}
                                            />
                                            No Archive
                                        </label>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
                                            <input
                                                type="checkbox"
                                                checked={formData.robots_advanced?.includes('noimageindex')}
                                                onChange={(e) => {
                                                    const val = 'noimageindex';
                                                    if (e.target.checked) setFormData((prev: any) => ({ ...prev, robots_advanced: [...(prev.robots_advanced || []), val] }));
                                                    else setFormData((prev: any) => ({ ...prev, robots_advanced: prev.robots_advanced?.filter((v: string) => v !== val) }));
                                                }}
                                            />
                                            No Image Index
                                        </label>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
                                            <input
                                                type="checkbox"
                                                checked={formData.robots_advanced?.includes('nosnippet')}
                                                onChange={(e) => {
                                                    const val = 'nosnippet';
                                                    if (e.target.checked) setFormData((prev: any) => ({ ...prev, robots_advanced: [...(prev.robots_advanced || []), val] }));
                                                    else setFormData((prev: any) => ({ ...prev, robots_advanced: prev.robots_advanced?.filter((v: string) => v !== val) }));
                                                }}
                                            />
                                            No Snippet
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Canonical URL</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder={`https://instapsv.com/blog/${formData.slug || 'slug'}`}
                                    value={formData.canonical_url}
                                    onChange={(e) => setFormData((prev: any) => ({ ...prev, canonical_url: e.target.value }))}
                                />
                                <p style={{ fontSize: '12px', color: 'var(--admin-text-muted)', marginTop: '4px' }}>
                                    Leave empty to use the default permalink.
                                </p>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Schema Type</label>
                                <select
                                    className="form-select"
                                    value={formData.schema_type || 'Article'}
                                    onChange={(e) => setFormData((prev: any) => ({ ...prev, schema_type: e.target.value }))}
                                >
                                    <option value="Article">Article</option>
                                    <option value="BlogPosting">Blog Posting</option>
                                    <option value="NewsArticle">News Article</option>
                                    <option value="Product">Product</option>
                                    <option value="Service">Service</option>
                                </select>
                                <p style={{ fontSize: '12px', color: 'var(--admin-text-muted)', marginTop: '4px' }}>
                                    Select the schema type that best describes this content.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
