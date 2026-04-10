'use client';

import { useEffect, useState } from 'react';
import styles from './TableOfContents.module.css';

interface ToCItem {
    id: string;
    text: string;
    level: number;
}

export default function TableOfContents() {
    const [headings, setHeadings] = useState<ToCItem[]>([]);
    const [activeId, setActiveId] = useState<string>('');

    useEffect(() => {
        const elements = Array.from(document.querySelectorAll('.blog-post-body h2, .blog-post-body h3'))
            .map((elem) => {
                const text = elem.textContent || '';
                // Create an ID from the text if it doesn't have one
                if (!elem.id) {
                    elem.id = text
                        .toLowerCase()
                        .replace(/[^\w\s-]/g, '')
                        .replace(/\s+/g, '-');
                }
                return {
                    id: elem.id,
                    text: text,
                    level: Number(elem.tagName.replace('H', '')),
                };
            });
        setHeadings(elements);

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '-10% 0% -80% 0%' }
        );

        document.querySelectorAll('.blog-post-body h2, .blog-post-body h3').forEach((elem) => observer.observe(elem));

        return () => observer.disconnect();
    }, []);

    if (headings.length === 0) return null;

    return (
        <nav className={styles.tocContainer}>
            <h3 className={styles.tocTitle}>Table of Contents</h3>
            <ul className={styles.tocList}>
                {headings.map((heading) => (
                    <li
                        key={heading.id}
                        className={`${styles.tocItem} ${heading.level === 3 ? styles.tocSubItem : ''} ${
                            activeId === heading.id ? styles.active : ''
                        }`}
                    >
                        <a href={`#${heading.id}`} onClick={(e) => {
                            e.preventDefault();
                            const element = document.getElementById(heading.id);
                            if (element) {
                                const headerOffset = 100;
                                const elementPosition = element.getBoundingClientRect().top;
                                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                                window.scrollTo({
                                     top: offsetPosition,
                                     behavior: 'smooth'
                                });
                            }
                        }}>
                            {heading.text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
