'use client';

import { useState, useEffect } from 'react';
import styles from './Header.module.css';

interface HeaderShellProps {
    children: React.ReactNode;
    alwaysDark?: boolean;
}

export default function HeaderShell({ children, alwaysDark }: HeaderShellProps) {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        // Initial check
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`${styles.header} ${isScrolled || alwaysDark ? styles.scrolled : ''}`}>
            <div className={styles.container}>
                {children}
            </div>
        </header>
    );
}
