'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './MediaTabs.module.css';

export default function MediaTabs() {
    const pathname = usePathname();

    const tabs = [
        {
            name: 'Posts',
            path: '/instagram-photo-downloader',
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                </svg>
            ),
        },
        {
            name: 'Reels',
            path: '/instagram-reels-downloader',
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
                    <line x1="7" y1="2" x2="7" y2="22" />
                    <line x1="17" y1="2" x2="17" y2="22" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <line x1="2" y1="7" x2="7" y2="7" />
                    <line x1="2" y1="17" x2="7" y2="17" />
                    <line x1="17" y1="17" x2="22" y2="17" />
                    <line x1="17" y1="7" x2="22" y2="7" />
                </svg>
            ),
        },
        {
            name: 'Stories',
            path: '/instagram-story-viewer',
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polygon points="10 8 16 12 10 16 10 8" />
                </svg>
            ),
        },
        {
            name: 'Highlights',
            path: '/instagram-highlights-viewer',
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="16" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
            ),
        },
    ];

    return (
        <div className={styles.tabsContainer}>
            <div className={styles.tabsList}>
                {tabs.map((tab) => {
                    const isActive = pathname === tab.path;
                    return (
                        <Link 
                            key={tab.path} 
                            href={tab.path}
                            className={`${styles.tabItem} ${isActive ? styles.active : ''}`}
                        >
                            <span className={styles.icon}>{tab.icon}</span>
                            <span className={styles.name}>{tab.name}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
