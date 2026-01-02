'use client';

import { useState } from 'react';
import styles from '@/app/contact/page.module.css';
import { useTranslations } from 'next-intl';

export default function ContactForm() {
    const [submitted, setSubmitted] = useState(false);
    const t = useTranslations('contact');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically send the data to an API
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className={styles.formCard} style={{ textAlign: 'center', padding: '60px 40px' }}>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>✅</div>
                <h3>{t('success')}</h3>
                <p style={{ color: '#94a3b8' }}>{t('successSub')}</p>
                <button
                    className={styles.submitBtn}
                    onClick={() => setSubmitted(false)}
                    style={{ marginTop: '20px' }}
                >
                    {t('sendAnother')}
                </button>
            </div>
        );
    }

    return (
        <form className={styles.contactForm} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
                <label>{t('name')}</label>
                <input type="text" placeholder={t('namePlaceholder')} className={styles.input} required />
            </div>
            <div className={styles.formGroup}>
                <label>{t('email')}</label>
                <input type="email" placeholder={t('emailPlaceholder')} className={styles.input} required />
            </div>
            <div className={styles.formGroup}>
                <label>{t('message')}</label>
                <textarea placeholder={t('messagePlaceholder')} className={styles.textarea} required></textarea>
            </div>
            <button type="submit" className={styles.submitBtn}>{t('send')}</button>
        </form>
    );
}
