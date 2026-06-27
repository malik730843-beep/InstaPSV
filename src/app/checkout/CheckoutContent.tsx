'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Sparkles, Loader2, CheckCircle, AlertCircle, Lock, CreditCard, Building2 } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import styles from './checkout.module.css';

// ===================================================
// SUPABASE CLIENT INITIALIZATION (CLIENT SIDE)
// ===================================================
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function CheckoutContent() {
    const searchParams = useSearchParams();
    const plan = searchParams.get('plan') || 'pro';

    const [email, setEmail] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Payoneer');
    const [transactionId, setTransactionId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user?.email) {
                setEmail(session.user.email);
            }
        };
        getSession();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !transactionId) {
            setError('Please fill in all fields.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/subscriptions/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    plan_name: 'monthly',
                    amount: 5.00,
                    payment_method: paymentMethod,
                    transaction_id: transactionId
                })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Failed to submit request.');
            } else {
                setSuccess(true);
            }
        } catch (err) {
            setError('Connection error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // ===================================================
    // SUCCESS VIEW
    // ===================================================
    if (success) {
        return (
            <div className={styles.successWrapper}>
                <div className={styles.successCard}>
                    <CheckCircle size={64} color="#10b981" style={{ margin: '0 auto 1.5rem', display: 'inline-block' }} />
                    <h1 className={styles.successTitle}>Request Submitted!</h1>
                    <p className={styles.successText}>
                        Your payment verification request for <strong>{email}</strong> has been successfully submitted.
                        Our admins will verify your transaction ID shortly.
                    </p>
                    <div className={styles.statusInfo}>
                        <span>Transaction ID: {transactionId}</span>
                        <p>Status: Pending Approval (typically takes 5-15 minutes)</p>
                    </div>
                    <Link href="/" className={styles.doneBtn}>
                        Go to Homepage
                    </Link>
                </div>
            </div>
        );
    }

    // ===================================================
    // FORM VIEW
    // ===================================================
    return (
        <div className={styles.checkoutGrid}>
            {/* LEFT COLUMN: Plan Summary Card */}
            <div className={styles.summaryCard}>
                <span className={styles.planBadge}>
                    <Sparkles size={14} /> PRO PLAN
                </span>
                <h2 className={styles.planName}>Monthly Membership</h2>

                <div className={styles.priceSection}>
                    <span className={styles.currency}>$</span>
                    <span className={styles.amount}>5.00</span>
                    <span className={styles.period}>/month</span>
                </div>

                <ul className={styles.featureList}>
                    <li>
                        <CheckCircle size={16} color="#10b981" /> Unlimited Anonymous Searches
                    </li>
                    <li>
                        <CheckCircle size={16} color="#10b981" /> View Instagram Stories & Reels
                    </li>
                    <li>
                        <CheckCircle size={16} color="#10b981" /> Browse Saved Highlights Folder
                    </li>
                    <li>
                        <CheckCircle size={16} color="#10b981" /> Download Media Directly in HD
                    </li>
                </ul>

                <div className={styles.securitySeal}>
                    <Lock size={16} style={{ marginRight: '8px' }} /> Secure Payment Gateway
                </div>
            </div>

            {/* RIGHT COLUMN: Payment Details and Form */}
            <div className={styles.paymentCard}>
                <h2 className={styles.cardSectionTitle}>Payment Details</h2>

                {/* Payment Method Tabs */}
                <div className={styles.paymentTabs}>
                    <button
                        type="button"
                        className={`${styles.paymentTab} ${paymentMethod === 'Payoneer' ? styles.paymentTabActive : ''}`}
                        onClick={() => { setPaymentMethod('Payoneer'); setTransactionId(''); setError(''); }}
                    >
                        <CreditCard size={16} />
                        Payoneer
                    </button>
                    <button
                        type="button"
                        className={`${styles.paymentTab} ${paymentMethod === 'Bank Transfer' ? styles.paymentTabActive : ''}`}
                        onClick={() => { setPaymentMethod('Bank Transfer'); setTransactionId(''); setError(''); }}
                    >
                        <Building2 size={16} />
                        Bank Transfer
                    </button>
                </div>

                {/* Payment Instructions */}
                <div className={styles.instructions}>
                    {paymentMethod === 'Payoneer' ? (
                        <>
                            <p>
                                Send <strong>$5.00 USD</strong> to the Payoneer account below:
                            </p>
                            <div className={styles.paymentInfo}>
                                <p><strong>Payoneer Email:</strong> payoneer@instapsv.com</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <p>
                                Send <strong>$5.00 USD</strong> via US Bank Transfer (ACH) to:
                            </p>
                            <div className={styles.paymentInfo}>
                                <p><strong>Account Name:</strong> Muhammad Rizwan</p>
                                <p><strong>Bank Name:</strong> JP Morgan Chase NA</p>
                                <p><strong>Routing Number:</strong> 028000024</p>
                                <p><strong>Account Number:</strong> 30000002936888</p>
                            </div>
                        </>
                    )}

                    <p className={styles.instructionNote}>
                        After sending payment, enter your email and transaction reference below. Our team will verify and activate your Pro plan.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className={styles.paymentForm}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email">Your Account Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter the email address you sign in with"
                            className={styles.input}
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="transactionId">
                            {paymentMethod === 'Payoneer' ? 'Payoneer Transaction ID' : 'Bank Transfer Reference / ID'}
                        </label>
                        <input
                            id="transactionId"
                            type="text"
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value)}
                            placeholder={paymentMethod === 'Payoneer' ? 'Paste your Payoneer Transaction ID' : 'Enter your Bank Transfer Reference Number'}
                            className={styles.input}
                            required
                        />
                    </div>

                    {error && (
                        <div className={styles.errorText} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <AlertCircle size={16} /> {error}
                        </div>
                    )}

                    <button type="submit" className={styles.submitBtn} disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className={styles.spin} size={20} /> Submitting Verification...
                            </>
                        ) : (
                            'Submit Payment Verification'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
