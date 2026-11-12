'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from '@/app/pricing/pricing.module.css';

interface FAQ {
    q: string;
    a: string;
}

const faqs: FAQ[] = [
    { q: 'What is included in the Free plan?', a: 'A new anonymous session starts with 6 local credits, enough for 3 successful profile searches at 2 credits per search. Posts and returned video items can be viewed when available. Stories and downloads have Pro gates.' },
    { q: 'What does Pro change?', a: 'The $5 monthly plan removes monthly search-credit deductions and enables the premium controls. Provider rate limits, account eligibility and source availability still apply. Full highlight collection retrieval is not implemented.' },
    { q: 'How is a payment activated?', a: 'Submit the transaction details through Checkout. An administrator reviews the payment before activating access. There is no guaranteed approval time and submitting a transaction ID does not itself activate Pro.' },
    { q: 'Does no Instagram login guarantee anonymity?', a: 'No. The form does not ask for Instagram credentials, but site infrastructure processes requests. Account, credit and payment features also process information. Read the privacy policy before use.' },
    { q: 'Can Pro retrieve private or missing content?', a: 'No. Pro does not bypass private account settings, recover deleted media or add data that the provider does not return. Confirm coverage before buying for a specific account or feature.' },
    { q: 'How does renewal work?', a: 'Payments use a manual renewal flow. Check the expiry shown for your account and the payment terms before renewing. Choosing not to make another manual payment does not delete your account data.' },
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
