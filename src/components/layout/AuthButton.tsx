'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import LoginModal from '@/components/ui/LoginModal';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AuthButton() {
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [showLogin, setShowLogin] = useState(false);

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user?.email) {
                setUserEmail(session.user.email);
            }
            setLoading(false);

            const { data: authListener } = supabase.auth.onAuthStateChange(
                async (event, session) => {
                    if (session?.user?.email) {
                        setUserEmail(session.user.email);
                    } else {
                        setUserEmail(null);
                    }
                }
            );

            return () => {
                authListener?.subscription.unsubscribe();
            };
        };
        checkSession();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.reload();
    };

    if (loading) return <div style={{ width: '60px' }} />;

    if (userEmail) {
        // Hide admin accounts from the frontend
        const adminEmails = [
            'info.instapsv@gmail.com',
            'instapsv@gmail.com',
            'malikbilal73084@gmail.com',
            'malik730843@gmail.com',
        ];
        const isAdmin = adminEmails.some(
            (e) => userEmail.toLowerCase() === e || userEmail.toLowerCase().startsWith(e.split('@')[0])
        );

        if (isAdmin) return null;

        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255, 255, 255, 0.05)', padding: '0.4rem 1rem', borderRadius: '9999px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <span style={{ fontSize: '0.85rem', color: '#ff0080', fontWeight: 'bold' }}>
                    {userEmail.split('@')[0]}
                </span>
                <button
                    onClick={handleLogout}
                    style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '0.8rem', padding: 0, fontFamily: 'inherit' }}
                    title="Logout"
                >
                    Logout
                </button>
            </div>
        );
    }

    return (
        <>
            <button
                onClick={() => setShowLogin(true)}
                style={{
                    fontSize: '0.9rem',
                    color: '#fff',
                    textDecoration: 'none',
                    fontWeight: '600',
                    background: 'linear-gradient(135deg, #ff0080, #7928ca)',
                    padding: '0.5rem 1.25rem',
                    borderRadius: '9999px',
                    boxShadow: '0 4px 15px rgba(255, 0, 128, 0.3)',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'all 0.25s',
                }}
            >
                Login
            </button>
            <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
        </>
    );
}
