'use client';

import { useEffect, useRef } from 'react';

export default function AdsterraBanner() {
    const bannerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!bannerRef.current) return;
        if (bannerRef.current.hasChildNodes()) return; // Prevent multiple loads

        const conf = document.createElement('script');
        conf.type = 'text/javascript';
        conf.innerHTML = `
            atOptions = {
                'key' : '593354ffe4f9cbe99ac9c6ba4c93023d',
                'format' : 'iframe',
                'height' : 90,
                'width' : 728,
                'params' : {}
            };
        `;
        
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://www.highperformanceformat.com/593354ffe4f9cbe99ac9c6ba4c93023d/invoke.js';

        bannerRef.current.appendChild(conf);
        bannerRef.current.appendChild(script);
    }, []);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            margin: '2rem auto',
            width: '100%',
            maxWidth: '100vw',
            overflow: 'hidden'
        }}>
            <div style={{
                position: 'relative',
                width: '728px',
                height: '90px',
                maxWidth: '100%',
                display: 'flex',
                justifyContent: 'center',
            }}>
                <style>{`
                    .adsterra-wrapper {
                        width: 728px;
                        height: 90px;
                        transform-origin: center top;
                    }
                    @media (max-width: 768px) {
                        .adsterra-wrapper {
                            transform: scale(0.43);
                        }
                    }
                    @media (max-width: 480px) {
                        .adsterra-wrapper {
                            transform: scale(0.40);
                        }
                    }
                `}</style>
                <div className="adsterra-wrapper" ref={bannerRef}></div>
            </div>
        </div>
    );
}
