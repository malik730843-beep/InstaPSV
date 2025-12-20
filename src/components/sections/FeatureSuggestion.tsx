'use client';

import { useState } from 'react';
import styles from './FeatureSuggestion.module.css';

export default function FeatureSuggestion() {
    const [suggestion, setSuggestion] = useState('');
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!suggestion.trim()) return;

        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        setIsSubmitting(false);
        setIsSubmitted(true);
        setSuggestion('');
        setEmail('');

        // Reset after 3 seconds
        setTimeout(() => setIsSubmitted(false), 3000);
    };

    return (
        <section className={styles.featureSuggestion}>
            <div className={styles.container}>
                {/* Background Elements */}
                <div className={styles.bgElements}>
                    <div className={styles.orb1} />
                    <div className={styles.orb2} />
                </div>

                {/* Content */}
                <div className={styles.content}>
                    <div className={styles.icon}>💡</div>
                    <h2 className={styles.title}>
                        Help us build the best{' '}
                        <span className={styles.highlight}>Instagram tool</span>
                        <br />
                        by suggesting features
                    </h2>
                    <p className={styles.description}>
                        We&apos;re constantly improving InstaPSV. Share your ideas and help us create
                        the features you need most.
                    </p>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.inputGroup}>
                            <textarea
                                value={suggestion}
                                onChange={(e) => setSuggestion(e.target.value)}
                                placeholder="Describe your feature idea..."
                                className={styles.textarea}
                                rows={3}
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className={styles.formRow}>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Your email (optional)"
                                className={styles.emailInput}
                                disabled={isSubmitting}
                            />
                            <button
                                type="submit"
                                className={styles.submitBtn}
                                disabled={isSubmitting || !suggestion.trim()}
                            >
                                {isSubmitting ? (
                                    <span className={styles.spinner} />
                                ) : isSubmitted ? (
                                    <>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                        Sent!
                                    </>
                                ) : (
                                    <>
                                        Submit Idea
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Popular Tags */}
                    <div className={styles.tags}>
                        <span className={styles.tagsLabel}>Popular requests:</span>
                        <div className={styles.tagList}>
                            <span className={styles.tag}>Dark Mode</span>
                            <span className={styles.tag}>Batch Download</span>
                            <span className={styles.tag}>Highlights Viewer</span>
                            <span className={styles.tag}>Browser Extension</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
