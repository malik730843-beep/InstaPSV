'use client';

import { useState } from 'react';
import styles from '@/app/contact/page.module.css';
import { useTranslations } from 'next-intl';

export default function ContactForm() {
    const [prepared, setPrepared] = useState(false);
    const t = useTranslations('contact');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const body = `Name: ${data.get('name')}\nReply email: ${data.get('email')}\n\n${data.get('message')}`;
        window.location.href = `mailto:support@instapsv.com?subject=${encodeURIComponent('InstaPSV support request')}&body=${encodeURIComponent(body)}`;
        setPrepared(true);
    };

    return (
        <form className={styles.contactForm} onSubmit={handleSubmit}>
            <p>This form opens your email app. Send the email there to contact us, or email <a href="mailto:support@instapsv.com">support@instapsv.com</a> directly.</p>
            <div className={styles.formGroup}>
                <label htmlFor="contact-name">{t('name')}</label>
                <input id="contact-name" name="name" type="text" autoComplete="name" maxLength={100} placeholder={t('namePlaceholder')} className={styles.input} required />
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="contact-email">{t('email')}</label>
                <input id="contact-email" name="email" type="email" autoComplete="email" maxLength={254} placeholder={t('emailPlaceholder')} className={styles.input} required />
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="contact-message">{t('message')}</label>
                <textarea id="contact-message" name="message" maxLength={3000} placeholder={t('messagePlaceholder')} className={styles.textarea} required />
            </div>
            <button type="submit" className={styles.submitBtn}>Open email app</button>
            {prepared && <p role="status">Your message is ready in your email app. It has not been sent by this website. If the app did not open, email support@instapsv.com directly.</p>}
        </form>
    );
}
