'use client';

import { useEffect } from 'react';

/**
 * MultiSideAdPanel
 * This component handles the injection of specialized ad scripts 
 * like Popunders and Social Bars that typically need to be 
 * placed at the end of the body and trigger global behaviors.
 */
export default function MultiSideAdPanel() {
    useEffect(() => {
        // We only want to run this once on the client
        if (typeof window === 'undefined') return;

        // Check if the script is already added to avoid duplicates
        const scriptId = 'multi-side-ad-script';
        if (document.getElementById(scriptId)) return;

        // Create the script element
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = 'https://pl28623282.effectivegatecpm.com/9e/56/08/9e56086be477870aa0b191662c4e455a.js';
        script.async = true;

        // Append to body to ensure it's outside the main React root if possible,
        // or just let it load after the main content.
        document.body.appendChild(script);

        return () => {
            // Optional: Cleanup script on unmount if needed
            // const existingScript = document.getElementById(scriptId);
            // if (existingScript) existingScript.remove();
        };
    }, []);

    // This component doesn't render any visible UI itself; 
    // it just facilitates the script injection.
    return null;
}
