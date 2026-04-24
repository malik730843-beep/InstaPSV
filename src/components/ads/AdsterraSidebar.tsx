'use client';

import { useEffect, useRef } from 'react';

export default function AdsterraSidebar() {
    const executed = useRef(false);

    useEffect(() => {
        if (executed.current) return;
        executed.current = true;

        try {
            (function(s){
                s.dataset.zone='10919820';
                s.src='https://nap5k.com/tag.min.js';
            })([document.documentElement, document.body].filter(Boolean).pop()!.appendChild(document.createElement('script')));
        } catch(e) {
            console.error('Adsterra Sidebar Error:', e);
        }
    }, []);

    // Return an empty div because this script appends to the document body natively
    // We still render a spacer div to take up the sidebar layout space if needed
    return <div style={{ width: '100%', height: '100%', minHeight: '600px' }}></div>;
}
