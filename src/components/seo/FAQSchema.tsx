'use client';

import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

export default function FAQSchema() {
    const t = useTranslations('faq');
    const faqItems = t.raw('items') as Array<{ question: string; answer: string }>;

    useEffect(() => {
        const schema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqItems.map((item) => ({
                "@type": "Question",
                "name": item.question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": item.answer
                }
            }))
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(schema);
        script.id = 'faq-schema';

        // Remove existing schema if present
        const existing = document.getElementById('faq-schema');
        if (existing) existing.remove();

        document.head.appendChild(script);

        return () => {
            const el = document.getElementById('faq-schema');
            if (el) el.remove();
        };
    }, [faqItems]);

    return null;
}
