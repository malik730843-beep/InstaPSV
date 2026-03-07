'use client';

import React from 'react';
import styles from '../sections/HowItWorks.module.css';

interface ScrollToSearchProps {
    label: string;
}

export default function ScrollToSearch({ label }: ScrollToSearchProps) {
    const handleScroll = () => {
        const searchSection = document.getElementById('search');
        if (searchSection) {
            searchSection.scrollIntoView({ behavior: 'smooth' });
            // Small delay to let scroll finish before focusing
            setTimeout(() => {
                const input = searchSection.querySelector('input');
                if (input) input.focus();
            }, 600);
        }
    };

    return (
        <button
            onClick={handleScroll}
            className={styles.ctaButton}
        >
            {label}
        </button>
    );
}
