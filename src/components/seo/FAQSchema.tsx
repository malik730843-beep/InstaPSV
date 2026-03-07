import { getTranslations } from 'next-intl/server';

export default async function FAQSchema() {
    const t = await getTranslations('faq');
    const faqItems = t.raw('items') as Array<{ question: string; answer: string }>;

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

    return (
        <script
            type="application/ld+json"
            id="faq-schema"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
