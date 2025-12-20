'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import styles from './FAQ.module.css';

export default function FAQ() {
    const t = useTranslations('faq');
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    // Get FAQ items from translations
    const faqItems = t.raw('items') as Array<{ question: string; answer: string }>;

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className={styles.faq}>
            <div className={styles.container}>
                {/* Section Header */}
                <div className={styles.header}>
                    <span className={styles.badge}>❓ {t('badge')}</span>
                    <h2 className={styles.title}>
                        {t('titleStart')} <span className={styles.highlight}>{t('titleHighlight')}</span> {t('titleEnd')}
                    </h2>
                    <p className={styles.subtitle}>
                        {t('subtitle')}
                    </p>
                </div>

                {/* FAQ Items */}
                <div className={styles.faqList}>
                    {faqItems.map((faq, index) => (
                        <div
                            key={index}
                            className={`${styles.faqItem} ${openIndex === index ? styles.open : ''}`}
                        >
                            <button
                                className={styles.faqQuestion}
                                onClick={() => toggleFAQ(index)}
                                aria-expanded={openIndex === index}
                            >
                                <span>{faq.question}</span>
                                <span className={styles.faqIcon}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 5v14M5 12h14" />
                                    </svg>
                                </span>
                            </button>
                            <div className={styles.faqAnswer}>
                                <p>{faq.answer}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Contact CTA */}
                <div className={styles.contactCta}>
                    <p>{t('contactCta')}</p>
                    <a href="/contact" className={styles.contactLink}>
                        {t('contactLink')}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </a>
                </div>
            </div>
        </section>
    );
}
