'use client';

import { useEffect, useRef, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface GoogleLoginProps {
    onSuccess?: () => void;
    onError?: (err: any) => void;
}

export default function GoogleLogin({ onSuccess, onError }: GoogleLoginProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(false);
    const [configLoading, setConfigLoading] = useState(true);
    const [clientId, setClientId] = useState<string | null>(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || null);

    useEffect(() => {
        const fetchConfig = async () => {
            if (!clientId) {
                try {
                    const res = await fetch('/api/auth/google-config');
                    const data = await res.json();
                    if (data.clientId) {
                        setClientId(data.clientId);
                    }
                } catch (err) {
                    console.error('Failed to fetch Google config:', err);
                }
            }
            setConfigLoading(false);
        };
        fetchConfig();
    }, [clientId]);

    useEffect(() => {
        if (configLoading || !clientId) return;

        if (typeof window === 'undefined' || !(window as any).google) {
            console.error('Google Identity script not loaded');
            return;
        }

        (window as any).google.accounts.id.initialize({
            client_id: clientId,
            callback: async (response: any) => {
                setLoading(true);
                try {
                    // Send the native Google ID token to Supabase
                    const { data, error } = await supabase.auth.signInWithIdToken({
                        provider: 'google',
                        token: response.credential,
                    });
                    if (error) throw error;
                    
                    // Initialize free credits if this is a new user
                    if (data.user?.email) {
                        try {
                            await fetch('/api/credits?email=' + encodeURIComponent(data.user.email));
                        } catch (e) {
                            console.error('Failed to initialize credits', e);
                        }
                    }

                    if (onSuccess) onSuccess();
                    else window.location.reload();
                } catch (error: any) {
                    console.error('Google Sign-In Error:', error);
                    if (onError) onError(error);
                } finally {
                    setLoading(false);
                }
            },
            context: 'signin',
            ux_mode: 'popup',
        });

        // Render the official Google button
        if (containerRef.current) {
            (window as any).google.accounts.id.renderButton(containerRef.current, {
                theme: 'filled_black',
                size: 'large',
                type: 'standard',
                shape: 'rectangular',
                text: 'continue_with',
                width: 320, // Strict width to match the login modal
                logo_alignment: 'left'
            });
        }
    }, [onSuccess, onError, clientId, configLoading]);

    return (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            {configLoading ? (
                <div style={{ padding: '0.8rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
                    Loading...
                </div>
            ) : !clientId ? (
                <div style={{ 
                    padding: '0.8rem', 
                    color: '#ef4444', 
                    fontSize: '0.85rem',
                    background: 'rgba(239,68,68,0.05)',
                    border: '1px solid rgba(239,68,68,0.15)',
                    borderRadius: '12px',
                    width: '100%',
                    textAlign: 'center'
                }}>
                    Google Client ID not configured. <br/>
                    <small>Set it in Admin Settings &gt; Integrations</small>
                </div>
            ) : loading ? (
                <div style={{ 
                    padding: '0.8rem', 
                    color: '#fff', 
                    fontSize: '0.9rem',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '12px',
                    width: '100%',
                    textAlign: 'center'
                }}>
                    Authenticating with Google...
                </div>
            ) : (
                <div ref={containerRef} style={{ minHeight: '40px' }} />
            )}
        </div>
    );
}
