'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { CheckCircle2, ShieldCheck, CreditCard, ArrowLeft, Loader2, Sparkles, Send } from 'lucide-react';
import Link from 'next/link';
import ParticleBackground from '@/components/ui/ParticleBackground';
import styles from './checkout.module.css';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function CheckoutContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const plan = searchParams.get('plan') || 'pro';
    
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('paypal');
    const [transactionId, setTransactionId] = useState('');

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                // Not logged in, redirect to home with login modal trigger if possible
                // or just show a message. For now, redirect home.
                router.push('/?login=true');
            } else {
                setUser(session.user);
            }
            setLoading(false);
        };
        checkUser();
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!transactionId) {
            setError('Please enter your payment transaction ID or email.');
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            const res = await fetch('/api/subscriptions/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: user.email,
                    plan_name: plan,
                    amount: 5, // Pro is $5
                    payment_method: paymentMethod,
                    transaction_id: transactionId,
                }),
            });

            const data = await res.json();
            if (res.ok) {
                setSuccess(true);
            } else {
                setError(data.error || 'Failed to submit request.');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const content = () => {
        if (loading) {
            return (
                <div className={styles.loadingWrapper}>
                    <div className={styles.spinner} />
                    <p>Preparing secure checkout...</p>
                </div>
            );
        }

        if (success) {
            return (
                <div className={styles.successWrapper}>
                    <div className={styles.successCard}>
                        <CheckCircle2 size={80} color="#10b981" />
                        <h1>Request Received!</h1>
                        <p>Your subscription upgrade request has been submitted to the admin team.</p>
                        <div className={styles.statusInfo}>
                            <span>Status: <strong>Pending Approval</strong></span>
                            <p>We'll process your request within 24 hours. You'll receive full access once approved.</p>
                        </div>
                        <Link href="/" className={styles.doneBtn}>Back to Search</Link>
                    </div>
                </div>
            );
        }

        return (
            <div className={styles.checkoutContainer}>
                <div className={styles.checkoutHeader}>
                    <Link href="/pricing" className={styles.backLink}>
                        <ArrowLeft size={18} /> Back to Pricing
                    </Link>
                    <h1 className={styles.title}>Secure Checkout</h1>
                    <p className={styles.subtitle}>Unlock unlimited anonymous browsing</p>
                </div>

                <div className={styles.checkoutGrid}>
                    {/* Left: Summary */}
                    <div className={styles.summaryCard}>
                        <div className={styles.planBadge}>
                            <Sparkles size={16} /> RECOMMENDED
                        </div>
                        <h2 className={styles.planName}>Pro Monthly Plan</h2>
                        <div className={styles.priceSection}>
                            <span className={styles.currency}>$</span>
                            <span className={styles.amount}>5</span>
                            <span className={styles.period}>/month</span>
                        </div>

                        <ul className={styles.featureList}>
                            <li><CheckCircle2 size={16} color="#10b981" /> Unlimited Anonymous Searches</li>
                            <li><CheckCircle2 size={16} color="#10b981" /> Stories & Highlights Access</li>
                            <li><CheckCircle2 size={16} color="#10b981" /> HD Media Downloads</li>
                            <li><CheckCircle2 size={16} color="#10b981" /> Cloud Sync Search History</li>
                            <li><CheckCircle2 size={16} color="#10b981" /> Priority Support</li>
                        </ul>

                        <div className={styles.securitySeal}>
                            <ShieldCheck size={20} />
                            <span>Encrypted & Secure</span>
                        </div>
                    </div>

                    {/* Right: Payment Instructions & Form */}
                    <div className={styles.paymentCard}>
                        <h3 className={styles.cardSectionTitle}>Payment Instructions</h3>
                        <div className={styles.instructions}>
                            <p>Please send <strong>$5.00 USD</strong> to the following account:</p>
                            <div className={styles.paymentInfo}>
                                <p><strong>PayPal:</strong> payments@instapsv.com</p>
                                <p><strong>Crypto (USDT):</strong> 0x71C7656EC7ab88b098defB751B7401B5f6d8976F</p>
                            </div>
                            <p className={styles.instructionNote}>
                                After payment, please provide your transaction ID or payment email below. 
                                Our admin will verify the payment and activate your plan.
                            </p>
                        </div>

                        <form className={styles.paymentForm} onSubmit={handleSubmit}>
                            <div className={styles.inputGroup}>
                                <label>Email Address</label>
                                <input type="text" value={user?.email || ''} disabled className={styles.inputDisabled} />
                            </div>

                            <div className={styles.inputGroup}>
                                <label>Payment Method</label>
                                <select 
                                    value={paymentMethod} 
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className={styles.select}
                                >
                                    <option value="paypal">PayPal</option>
                                    <option value="usdt">Crypto (USDT)</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div className={styles.inputGroup}>
                                <label>Transaction ID / Payment Email</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter ID or email used for payment"
                                    value={transactionId}
                                    onChange={(e) => setTransactionId(e.target.value)}
                                    className={styles.input}
                                    required
                                />
                            </div>

                            {error && <p className={styles.errorText}>{error}</p>}

                            <button 
                                type="submit" 
                                className={styles.submitBtn}
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <><Loader2 className={styles.spin} size={20} /> Processing...</>
                                ) : (
                                    <><Send size={18} /> Request Activation</>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className={styles.checkoutPage}>
            <ParticleBackground />
            {content()}
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div className={styles.loadingWrapper}><Loader2 className={styles.spinner} /><p>Loading Checkout...</p></div>}>
            <CheckoutContent />
        </Suspense>
    );
}
