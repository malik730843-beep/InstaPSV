'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Sparkles, Loader2, CheckCircle, AlertCircle, Lock } from 'lucide-react';
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
    // 1. Read query parameters from URL (e.g. /checkout?plan=pro)
    const searchParams = useSearchParams();
    const plan = searchParams.get('plan') || 'pro';
    
    // 2. Define Form Inputs State variables
    const [email, setEmail] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Payoneer'); // Only Payoneer is accepted
    const [transactionId, setTransactionId] = useState('');
    
    // 3. Define Form Submission Status State variables
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // 4. Autofill Email: If user is logged in, grab their email from Supabase session
    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user?.email) {
                setEmail(session.user.email);
            }
        };
        getSession();
    }, []);

    // 5. Handle Form Submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Simple client validation
        if (!email || !transactionId) {
            setError('Please fill in all fields.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // POST request to subscription upgrades queue
            const res = await fetch('/api/subscriptions/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    plan_name: 'monthly', // Maps to the 'monthly' Pro plan in DB
                    amount: 5.00,
                    payment_method: paymentMethod, // 'Payoneer'
                    transaction_id: transactionId
                })
            });

            const data = await res.json();

            if (!res.ok) {
                // Show errors returned by the API
                setError(data.error || 'Failed to submit request.');
            } else {
                // Toggle success state to display confirmation UI
                setSuccess(true);
            }
        } catch (err) {
            setError('Connection error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // ===================================================
    // SUCCESS VIEW (Rendered after successful submission)
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
    // FORM VIEW (Main checkout instructions and form)
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

            {/* RIGHT COLUMN: Payment Details and Form Submission */}
            <div className={styles.paymentCard}>
                <h2 className={styles.cardSectionTitle}>Payment Details</h2>
                
                {/* Payoneer Address & How-to-pay block */}
                <div className={styles.instructions}>
                    <p>
                        To activate your account, please send <strong>$5.00 USD</strong> via Payoneer:
                    </p>
                    
                    <div className={styles.paymentInfo}>
                        <p><strong>Payoneer Email:</strong> payoneer@instapsv.com</p>
                    </div>
                    
                    <p className={styles.instructionNote}>
                        After sending payment, enter your email and transaction ID below. Our support team will verify and activate your Pro plan.
                    </p>
                </div>

                {/* Form Elements */}
                <form onSubmit={handleSubmit} className={styles.paymentForm}>
                    {/* Account email input */}
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

                    {/* Payoneer indicator input (read-only) */}
                    <div className={styles.inputGroup}>
                        <label htmlFor="paymentMethod">Payment Method</label>
                        <input
                            id="paymentMethod"
                            type="text"
                            value={paymentMethod}
                            className={styles.input}
                            disabled
                            readOnly
                        />
                    </div>

                    {/* Payoneer Transaction ID reference number */}
                    <div className={styles.inputGroup}>
                        <label htmlFor="transactionId">Transaction ID / Reference Number</label>
                        <input
                            id="transactionId"
                            type="text"
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value)}
                            placeholder="Paste your Payoneer Transaction ID"
                            className={styles.input}
                            required
                        />
                    </div>

                    {/* Error Notice block */}
                    {error && (
                        <div className={styles.errorText} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <AlertCircle size={16} /> {error}
                        </div>
                    )}

                    {/* Submit Button */}
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
