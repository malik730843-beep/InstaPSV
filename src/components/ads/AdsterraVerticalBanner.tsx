'use client';

import { useEffect, useRef } from 'react';

export default function AdsterraVerticalBanner() {
    const bannerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!bannerRef.current) return;
        if (bannerRef.current.hasChildNodes()) return;

        const conf = document.createElement('script');
        conf.type = 'text/javascript';
        conf.innerHTML = `
            atOptions = {
                'key' : '4f319d74c2a31c41d92de9782ade7d37',
                'format' : 'iframe',
                'height' : 600,
                'width' : 160,
                'params' : {}
            };
        `;
        
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://www.highperformanceformat.com/4f319d74c2a31c41d92de9782ade7d37/invoke.js';

        bannerRef.current.appendChild(conf);
        bannerRef.current.appendChild(script);
    }, []);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '0', width: '160px', height: '600px', overflow: 'hidden' }}>
            <div ref={bannerRef} style={{ width: '160px', height: '600px' }}></div>
        </div>
    );
}
