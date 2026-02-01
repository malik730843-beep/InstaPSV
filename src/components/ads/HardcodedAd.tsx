'use client';

import { useEffect, useRef } from 'react';

interface HardcodedAdProps {
    adCode: string;
    width?: number;
    height?: number;
    className?: string;
}

export default function HardcodedAd({ adCode, width, height, className }: HardcodedAdProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const scriptsExecuted = useRef(false);

    useEffect(() => {
        if (!containerRef.current || scriptsExecuted.current) return;
        scriptsExecuted.current = true;

        const container = containerRef.current;

        // Parse the ad code to find all script tags
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = adCode;

        // Find all inline scripts and external scripts
        const scripts = tempDiv.querySelectorAll('script');

        scripts.forEach((oldScript) => {
            const newScript = document.createElement('script');

            // Copy all attributes (including src, async, etc.)
            Array.from(oldScript.attributes).forEach(attr => {
                newScript.setAttribute(attr.name, attr.value);
            });

            // Copy inline script content
            if (oldScript.textContent) {
                newScript.textContent = oldScript.textContent;
            }

            // Append to container to execute
            container.appendChild(newScript);
        });

        // Also set non-script HTML content
        const nonScriptContent = adCode.replace(/<script[\s\S]*?<\/script>/gi, '');
        if (nonScriptContent.trim()) {
            const contentDiv = document.createElement('div');
            contentDiv.innerHTML = nonScriptContent;
            container.insertBefore(contentDiv, container.firstChild);
        }
    }, [adCode]);

    return (
        <div
            ref={containerRef}
            className={className}
            style={{
                width: width ? `${width}px` : 'auto',
                minHeight: height ? `${height}px` : 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
            }}
        />
    );
}
