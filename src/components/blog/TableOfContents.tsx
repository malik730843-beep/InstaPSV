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
        // Use a small delay to ensure dangerouslySetInnerHTML has populated the DOM
        const timer = setTimeout(() => {
            const usedIds = new Set<string>();
            const contentBody = document.querySelector('.blog-post-body');
            
            if (!contentBody) return;

            const elements = Array.from(contentBody.querySelectorAll('h2, h3'))
                .map((elem) => {
                    const text = (elem.textContent || '').trim();
                    if (!text) return null;

                    let baseId = elem.id || text
                        .toLowerCase()
                        .replace(/[^\w\s-]/g, '')
                        .replace(/\s+/g, '-');
                    
                    let id = baseId;
                    let counter = 1;
                    while (usedIds.has(id)) {
                        id = `${baseId}-${counter}`;
                        counter++;
                    }
                    
                    usedIds.add(id);
                    elem.id = id;

                    return {
                        id: id,
                        text: text,
                        level: Number(elem.tagName.replace('H', '')),
                    };
                }).filter(Boolean) as ToCItem[];

            setHeadings(elements);

            if (elements.length > 0) {
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

                elements.forEach((h) => {
                    const el = document.getElementById(h.id);
                    if (el) observer.observe(el);
                });

                return () => observer.disconnect();
            }
        }, 300); // 300ms delay for content stabilization

        return () => clearTimeout(timer);
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
