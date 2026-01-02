'use client';

import { useState } from 'react';
import styles from './FAQ.module.css';

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQClientProps {
    items: FAQItem[];
    // Pass translated strings for static parts inside the interactive area if needed,
    // but here the interactive part is just the list.
}

export default function FAQClient({ items }: FAQClientProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className={styles.faqList}>
            {items.map((faq, index) => (
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
    );
}
