'use client';

import { useEffect, useRef } from 'react';

export default function AdsterraBanner() {
    const bannerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!bannerRef.current) return;
        if (bannerRef.current.childElementCount > 0) return;

        const conf = document.createElement('script');
        conf.type = 'text/javascript';
        conf.innerHTML = `
            atOptions = {
                'key' : '06d7516f56b7c747ae02a0028f55071f',
                'format' : 'iframe',
                'height' : 90,
                'width' : 728,
                'params' : {}
            };
        `;

        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = "https://www.highperformanceformat.com/06d7516f56b7c747ae02a0028f55071f/invoke.js";

        bannerRef.current.appendChild(conf);
        bannerRef.current.appendChild(script);
    }, []);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0', width: '100%', minHeight: '90px', overflow: 'hidden' }}>
            <div ref={bannerRef}></div>
        </div>
    );
}
