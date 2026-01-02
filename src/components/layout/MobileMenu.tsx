'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import styles from './Header.module.css';

interface NavLink {
    href: string;
    label: string;
}

interface MobileMenuProps {
    links: NavLink[];
}

export default function MobileMenu({ links }: MobileMenuProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const closeMenu = () => setIsMobileMenuOpen(false);

    const menuDrawer = (
        <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ''}`}>
            {/* Close Button */}
            <button
                className={styles.closeBtn}
                onClick={closeMenu}
                aria-label="Close menu"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                </svg>
            </button>

            <nav className={styles.mobileNav}>
                {links.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={styles.mobileNavLink}
                        onClick={closeMenu}
                    >
                        {link.label}
                    </Link>
                ))}
            </nav>
        </div>
    );

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                className={`${styles.mobileMenuBtn} ${isMobileMenuOpen ? styles.active : ''}`}
                onClick={toggleMenu}
                aria-label="Toggle menu"
            >
                <span></span>
                <span></span>
                <span></span>
            </button>

            {/* Mobile Menu Drawer - Rendered via Portal */}
            {mounted && typeof document !== 'undefined' ? createPortal(menuDrawer, document.body) : null}
        </>
    );
}
