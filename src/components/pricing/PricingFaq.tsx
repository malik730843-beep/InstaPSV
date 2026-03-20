'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from '@/app/pricing/pricing.module.css';

interface FAQ {
    q: string;
    a: string;
}

const faqs: FAQ[] = [
    {
        q: 'What’s included in the Free plan?',
        a: 'You get 1 profile search credit. You can view all posts of any public profile anonymously. Stories, Reels, and Highlights are reserved for Pro users to ensure high-speed service for premium members.',
    },
    {
        q: 'What are the benefits of the Pro plan?',
        a: 'The Pro plan ($5/mo) gives you Unlimited Searches and full access to Stories, Reels, and Highlights. You also get high-speed HD downloads, priority search results, and 24/7 email support.',
    },
    {
        q: 'How do I pay and get activated?',
        a: 'We use a secure manual payment system. After choosing Pro, you will receive payment instructions. Once you submit your Transaction ID via the checkout form, our admin team verifies it (usually in under 15 minutes) and your account is upgraded instantly.',
    },
    {
        q: 'Is my browsing truly anonymous?',
        a: 'Yes, 100%. We use specialized servers to fetch data directly from Instagram. Your personal account is never linked, and the profile owner will never see your name in their viewer list.',
    },
    {
        q: 'Can I view private accounts?',
        a: 'No. InstaPSV only supports public Instagram profiles. We do not bypass Instagram\'s core privacy settings for private accounts to ensure the longevity and legality of our service.',
    },
    {
        q: 'Can I cancel my subscription?',
        a: 'Yes, you can stop at any time. Since payments are manual for 30-day periods, you simply choose not to renew. Your Pro features will remain active until the full 30 days from your last payment have passed.',
    },
];

export default function PricingFaq() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleFaq = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className={styles.faqSection}>
            <h2 className={styles.faqTitle}>
                Frequently Asked <span className={styles.gradientText}>Questions</span>
            </h2>
            <div className={styles.faqAccordion}>
                {faqs.map((faq, i) => (
                    <div 
                        key={i} 
                        className={`${styles.faqItem} ${openIndex === i ? styles.faqOpen : ''}`}
                    >
                        <button 
                            className={styles.faqHeader}
                            onClick={() => toggleFaq(i)}
                            aria-expanded={openIndex === i}
                        >
                            <span className={styles.faqQuestion}>{faq.q}</span>
                            <ChevronDown className={styles.faqChevron} size={20} />
                        </button>
                        <div className={styles.faqContent}>
                            <div className={styles.faqInner}>
                                <p className={styles.faqAnswer}>{faq.a}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
