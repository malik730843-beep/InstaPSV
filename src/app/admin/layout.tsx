'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import './admin.css';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const navItems = [
    { name: 'Dashboard', href: '/admin', icon: '📊' },
    { name: 'Posts', href: '/admin/posts', icon: '📝' },
    { name: 'Pages', href: '/admin/pages', icon: '📄' },
    { name: 'Categories', href: '/admin/categories', icon: '📁' },
    { name: 'Site Settings', href: '/admin/settings', icon: '⚙️' },
    { name: 'SEO Settings', href: '/admin/seo', icon: '🔍' },
    { name: 'Ads Manager', href: '/admin/ads', icon: '📢' },
    { name: 'Sitemap', href: '/admin/sitemap', icon: '🗺️' },
    { name: 'Verification', href: '/admin/verification', icon: '✅' },
    { name: 'Cache', href: '/admin/cache', icon: '🗄️' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session && pathname !== '/admin/login') {
                router.push('/admin/login');
            } else {
                setUser(session?.user);
                setLoading(false);
            }
        };
        checkSession();
    }, [pathname, router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/admin/login');
    };

    // Don't show layout for login page
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    if (loading) {
        return (
            <div className="admin-loading">
                <div className="admin-spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    const getBreadcrumbs = () => {
        const paths = pathname.split('/').filter(Boolean);
        return paths.map((p, i) => ({
            name: p.charAt(0).toUpperCase() + p.slice(1),
            href: '/' + paths.slice(0, i + 1).join('/')
        }));
    };

    return (
        <div className="admin-container">
            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="mobile-overlay" onClick={() => setMobileMenuOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
                <div className="sidebar-header">
                    <div className="logo">
                        <span className="logo-icon">📸</span>
                        {!sidebarCollapsed && <span className="logo-text">InstaPSV</span>}
                    </div>
                    <button
                        className="collapse-btn"
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        title={sidebarCollapsed ? 'Expand' : 'Collapse'}
                    >
                        {sidebarCollapsed ? '→' : '←'}
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`nav-item ${pathname === item.href ? 'active' : ''}`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            {!sidebarCollapsed && <span className="nav-text">{item.name}</span>}
                        </Link>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    {!sidebarCollapsed && (
                        <p className="user-email">{user?.email}</p>
                    )}
                    <Link
                        href="/"
                        target="_blank"
                        className="view-site-btn"
                        title="View Live Site"
                    >
                        <span className="icon">🚀</span>
                        {!sidebarCollapsed && <span>View Site</span>}
                    </Link>
                    <button onClick={handleLogout} className="logout-btn">
                        {sidebarCollapsed ? '🚪' : 'Logout'}
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className={`admin-main ${sidebarCollapsed ? 'expanded' : ''}`}>
                {/* Top Header */}
                <header className="admin-header">
                    <div className="header-left">
                        <button
                            className="mobile-menu-btn"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            ☰
                        </button>
                        <nav className="breadcrumb">
                            {getBreadcrumbs().map((crumb, i) => (
                                <span key={crumb.href}>
                                    <Link href={crumb.href}>{crumb.name}</Link>
                                    {i < getBreadcrumbs().length - 1 && <span className="separator">/</span>}
                                </span>
                            ))}
                        </nav>
                    </div>
                    <div className="header-right">
                        <div className="header-search">
                            <input type="text" placeholder="Search..." />
                        </div>
                        <button className="header-btn" title="Notifications">🔔</button>
                        <button className="header-btn" title="Settings">⚙️</button>
                        <div className="header-user">
                            <span className="avatar">👤</span>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="admin-content">
                    {children}
                </main>
            </div>
        </div>
    );
}
