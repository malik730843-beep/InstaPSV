'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { createClient } from '@supabase/supabase-js';
import GoogleLogin from '@/components/auth/google-login';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    message?: string;
}

export default function LoginModal({ isOpen, onClose, message }: LoginModalProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState<{ text: string; type: 'error' | 'success' } | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!isOpen || !mounted) return null;

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setFeedback(null);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                onClose();
                window.location.reload();
            } else {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                await fetch('/api/credits?email=' + email);
                setFeedback({ text: 'Account created! You can now sign in.', type: 'success' });
                setIsLogin(true);
            }
        } catch (error: any) {
            setFeedback({ text: error.message || 'An error occurred', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    // handleGoogle was removed. Google Sign in is now handled by the native SDK GoogleLogin component.

    return createPortal(
        <>
            <style>{`
                .modal-overlay {
                    position: fixed;
                    inset: 0;
                    z-index: 99999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem 1rem;
                    background: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(8px);
                    animation: modalFadeIn 0.25s ease;
                    overflow-y: auto;
                }
                @media (max-height: 650px) {
                    .modal-overlay {
                        align-items: flex-start;
                    }
                }
                @keyframes modalFadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes modalSlideUp {
                    from { opacity: 0; transform: translateY(20px) scale(0.97); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                .modal-card {
                    position: relative;
                    background: rgba(10, 10, 15, 0.9);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 28px;
                    padding: 3rem 2.5rem;
                    width: 100%;
                    max-width: 440px;
                    backdrop-filter: blur(40px);
                    box-shadow: 
                        0 25px 80px rgba(0,0,0,0.8),
                        0 0 0 1px rgba(255,255,255,0.05),
                        0 0 100px rgba(255,0,128,0.08);
                    animation: modalSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .modal-card::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    border-radius: 28px;
                    padding: 1px;
                    background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent 40%, rgba(255,255,255,0.05));
                    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                    -webkit-mask-composite: xor;
                    mask-composite: exclude;
                    pointer-events: none;
                }
                .modal-close {
                    position: absolute;
                    top: 1.5rem;
                    right: 1.5rem;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 50%;
                    width: 38px;
                    height: 38px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: rgba(255,255,255,0.4);
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    font-size: 1.2rem;
                }
                .modal-close:hover {
                    background: rgba(255,255,255,0.08);
                    color: #fff;
                    transform: rotate(90deg);
                    border-color: rgba(255,255,255,0.2);
                }
                .modal-title {
                    font-size: 1.75rem;
                    font-weight: 800;
                    text-align: center;
                    margin-bottom: 0.5rem;
                    letter-spacing: -0.02em;
                    background: linear-gradient(135deg, #fff 30%, rgba(255,255,255,0.7));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .modal-subtitle {
                    font-size: 0.9rem;
                    color: rgba(255,255,255,0.5);
                    text-align: center;
                    margin-bottom: 2rem;
                    line-height: 1.6;
                    font-weight: 400;
                }
                .modal-promo {
                    background: rgba(255, 0, 128, 0.08);
                    border: 1px solid rgba(255, 0, 128, 0.2);
                    border-radius: 16px;
                    padding: 1rem 1.25rem;
                    margin-bottom: 2rem;
                    text-align: center;
                    font-size: 0.85rem;
                    color: #ff4d94;
                    font-weight: 500;
                    line-height: 1.5;
                    box-shadow: 0 4px 20px rgba(255, 0, 128, 0.1);
                }
                .modal-google {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0.9rem;
                    border-radius: 50px;
                    border: 1px solid rgba(255,255,255,0.15);
                    background: transparent;
                    color: #fff;
                    font-size: 0.95rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .modal-google:hover {
                    background: rgba(255,255,255,0.05);
                    border-color: rgba(255,255,255,0.3);
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                }
                .modal-divider {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin: 2rem 0;
                }
                .modal-divider-line {
                    flex: 1;
                    height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
                }
                .modal-divider-text {
                    font-size: 0.75rem;
                    color: rgba(255,255,255,0.3);
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    font-weight: 500;
                }
                .modal-form { display: flex; flex-direction: column; gap: 1.25rem; }
                .modal-input-group { display: flex; flex-direction: column; gap: 0.5rem; }
                .modal-label {
                    font-size: 0.8rem;
                    font-weight: 600;
                    color: rgba(255,255,255,0.6);
                    margin-left: 0.2rem;
                }
                .modal-input {
                    width: 100%;
                    padding: 0.9rem 1.1rem;
                    border-radius: 14px;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.08);
                    color: #fff;
                    font-size: 0.95rem;
                    outline: none;
                    transition: all 0.3s ease;
                }
                .modal-input::placeholder { color: rgba(255,255,255,0.15); }
                .modal-input:focus {
                    background: rgba(255,255,255,0.05);
                    border-color: rgba(255,0,128,0.5);
                    box-shadow: 0 0 20px rgba(255,0,128,0.1);
                }
                .modal-submit {
                    width: 100%;
                    padding: 1rem;
                    border-radius: 16px;
                    border: none;
                    background: linear-gradient(135deg, #ff0080, #7928ca);
                    color: #fff;
                    font-size: 1rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                    margin-top: 0.5rem;
                    box-shadow: 0 10px 30px rgba(255,0,128,0.2);
                }
                .modal-submit:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 15px 35px rgba(255,0,128,0.4);
                    filter: brightness(1.1);
                }
                .modal-submit:active { transform: translateY(0); }
                .modal-submit:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
                .modal-toggle {
                    margin-top: 2rem;
                    text-align: center;
                    font-size: 0.9rem;
                    color: rgba(255,255,255,0.4);
                }
                .modal-toggle-btn {
                    background: none;
                    border: none;
                    color: #ff0080;
                    font-weight: 700;
                    cursor: pointer;
                    padding: 0 0.4rem;
                    font-size: 0.9rem;
                    transition: all 0.2s;
                }
                .modal-toggle-btn:hover { 
                    color: #ff3399;
                    text-decoration: underline;
                }
                .modal-msg {
                    padding: 0.7rem;
                    border-radius: 10px;
                    font-size: 0.8rem;
                    text-align: center;
                }
                .modal-msg-error {
                    background: rgba(239,68,68,0.1);
                    color: #ef4444;
                    border: 1px solid rgba(239,68,68,0.15);
                }
                .modal-msg-success {
                    background: rgba(16,185,129,0.1);
                    color: #10b981;
                    border: 1px solid rgba(16,185,129,0.15);
                }
            `}</style>

            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                    <button className="modal-close" onClick={onClose}>✕</button>

                    <h2 className="modal-title">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                    <p className="modal-subtitle">
                        {isLogin ? 'Sign in to continue viewing profiles.' : 'Sign up to get free credits.'}
                    </p>

                    {message && (
                        <div className="modal-promo">{message}</div>
                    )}

                    <GoogleLogin 
                        onSuccess={() => {
                            onClose();
                            window.location.reload();
                        }}
                        onError={(err) => setFeedback({ text: err.message || 'Google sign-in failed', type: 'error' })}
                    />

                    <div className="modal-divider">
                        <div className="modal-divider-line" />
                        <span className="modal-divider-text">or continue with email</span>
                        <div className="modal-divider-line" />
                    </div>

                    <form onSubmit={handleAuth} className="modal-form">
                        <div className="modal-input-group">
                            <label className="modal-label">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="modal-input"
                                placeholder="name@example.com"
                                required
                            />
                        </div>
                        <div className="modal-input-group">
                            <label className="modal-label">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="modal-input"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {feedback && (
                            <div className={`modal-msg ${feedback.type === 'error' ? 'modal-msg-error' : 'modal-msg-success'}`}>
                                {feedback.text}
                            </div>
                        )}

                        <button type="submit" className="modal-submit" disabled={loading}>
                            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
                        </button>
                    </form>

                    <p className="modal-toggle">
                        {isLogin ? "Don't have an account? " : 'Already have an account? '}
                        <button onClick={() => { setIsLogin(!isLogin); setFeedback(null); }} className="modal-toggle-btn">
                            {isLogin ? 'Sign up' : 'Sign in'}
                        </button>
                    </p>
                </div>
            </div>
        </>,
        document.body
    );
}
