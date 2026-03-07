import { getTranslations } from 'next-intl/server';
import styles from './FAQ.module.css';
import FAQClient from './FAQClient';

export default async function FAQ() {
    const t = await getTranslations('faq');

    // Get FAQ items from translations
    const faqItems = t.raw('items') as Array<{ question: string; answer: string }>;

    return (
        <section className={styles.faq}>
            <div className={styles.container}>
                {/* Section Header */}
                <div className={styles.header}>
                    <span className={styles.badge}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
                            <circle cx="12" cy="12" r="10" />
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                            <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                        {t('badge')}
                    </span>
                    <h2 className={styles.title}>
                        {t('titleStart')} <span className={styles.highlight}>{t('titleHighlight')}</span> {t('titleEnd')}
                    </h2>
                    <p className={styles.subtitle}>
                        {t('subtitle')}
                    </p>
                </div>

                {/* FAQ Interactive List */}
                <FAQClient items={faqItems} />

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
