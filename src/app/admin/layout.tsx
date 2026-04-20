'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import Image from 'next/image';
import { 
    LayoutDashboard, Users, FileText, Files, FolderOpen, 
    Settings, Search, Megaphone, Map, ShieldCheck, Database,
    ExternalLink, LogOut, Menu, ChevronLeft, ChevronRight, CreditCard
} from 'lucide-react';
import './admin.css';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const navItems = [
    { name: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Users', href: '/admin/users', icon: <Users size={20} /> },
    { name: 'Posts', href: '/admin/posts', icon: <FileText size={20} /> },
    { name: 'Pages', href: '/admin/pages', icon: <Files size={20} /> },
    { name: 'Categories', href: '/admin/categories', icon: <FolderOpen size={20} /> },
    { name: 'Payment Tracking', href: '/admin/payments', icon: <CreditCard size={20} /> },
    { name: 'Site Settings', href: '/admin/settings', icon: <Settings size={20} /> },
    { name: 'SEO Settings', href: '/admin/seo', icon: <Search size={20} /> },
    { name: 'Ads Manager', href: '/admin/ads', icon: <Megaphone size={20} /> },
    { name: 'Sitemap', href: '/admin/sitemap', icon: <Map size={20} /> },
    { name: 'Verification', href: '/admin/verification', icon: <ShieldCheck size={20} /> },
    { name: 'Cache', href: '/admin/cache', icon: <Database size={20} /> },
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
            <div className="admin-loading" suppressHydrationWarning>
                <div className="admin-spinner" suppressHydrationWarning></div>
                <p>Loading...</p>
            </div>
        );
    }

    const getBreadcrumbs = () => {
        const paths = pathname.split('/').filter(Boolean);
        return paths.map((p: string, i: number) => ({
            name: p.charAt(0).toUpperCase() + p.slice(1),
            href: '/' + paths.slice(0, i + 1).join('/')
        }));
    };

    return (
        <div className="admin-container" suppressHydrationWarning>
            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="mobile-overlay" onClick={() => setMobileMenuOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
                <div className="sidebar-header">
                    <div className="logo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '0.5rem' }}>
                        {!sidebarCollapsed ? (
                            <Image 
                                src="/logo.png" 
                                alt="InstaPSV Logo" 
                                width={160} 
                                height={45} 
                                style={{ 
                                    objectFit: 'contain', 
                                    mixBlendMode: 'lighten',
                                    filter: 'contrast(1.1)'
                                }} 
                                priority
                            />
                        ) : (
                            <Image 
                                src="/logo.png" 
                                alt="InstaPSV Logo" 
                                width={40} 
                                height={40} 
                                style={{ 
                                    objectFit: 'cover', 
                                    objectPosition: 'left',
                                    mixBlendMode: 'lighten',
                                }} 
                            />
                        )}
                    </div>
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
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <ExternalLink size={18} />
                        {!sidebarCollapsed && <span>View Site</span>}
                    </Link>
                    <button onClick={handleLogout} className="logout-btn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        {sidebarCollapsed ? <LogOut size={18} /> : (
                            <>
                                <LogOut size={18} /> <span>Logout</span>
                            </>
                        )}
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className={`admin-main ${sidebarCollapsed ? 'expanded' : ''}`}>
                {/* Top Header */}
                <header className="admin-header">
                    <div className="header-left">
                        <nav className="breadcrumb">
                            {getBreadcrumbs().map((crumb: {name: string, href: string}, i: number) => (
                                <span key={crumb.href}>
                                    <Link href={crumb.href}>{crumb.name}</Link>
                                    {i < getBreadcrumbs().length - 1 && <span className="separator">/</span>}
                                </span>
                            ))}
                        </nav>
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
