'use client';

import { useState } from 'react';
import styles from '../app/blog/page.module.css';
import { useTranslations } from 'next-intl';

export default function NewsletterForm() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const t = useTranslations('blog');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        setStatus('success');
        setEmail('');

        // Reset after 3 seconds
        setTimeout(() => setStatus('idle'), 3000);
    };

    return (
        <form className={styles.newsletterForm} onSubmit={handleSubmit}>
            <input
                type="email"
                placeholder={t('newsletterPlaceholder')}
                className={styles.newsletterInput}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === 'loading' || status === 'success'}
                required
            />
            <button
                type="submit"
                className={styles.newsletterBtn}
                disabled={status === 'loading' || status === 'success'}
            >
                {status === 'loading' ? t('subscribing') :
                    status === 'success' ? `✓ ${t('subscribed')}` :
                        t('subscribe')}
            </button>
        </form>
    );
}
