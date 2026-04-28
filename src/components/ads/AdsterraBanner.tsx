'use client';

export default function AdsterraBanner() {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '2rem auto',
            width: '100%',
            maxWidth: '100vw',
            overflow: 'hidden',
        }}>
            {/* Responsive wrapper: scales the fixed 728x90 down on small screens */}
            <div style={{
                width: '728px',
                height: '90px',
                maxWidth: '100%',
                overflow: 'hidden',
            }}>
                <iframe
                    src="/ads/horizontal-banner.html"
                    width="728"
                    height="90"
                    frameBorder="0"
                    scrolling="no"
                    style={{
                        overflow: 'hidden',
                        border: 'none',
                        background: 'transparent',
                        display: 'block',
                        // Scale down on smaller screens via inline CSS transform
                        // We achieve this with a CSS class below
                        transformOrigin: 'left top',
                    }}
                    title="Advertisement"
                    loading="lazy"
                    className="adsterra-horizontal"
                />
            </div>
            <style>{`
                @media (max-width: 768px) {
                    .adsterra-horizontal {
                        transform: scale(0.43);
                    }
                }
                @media (max-width: 480px) {
                    .adsterra-horizontal {
                        transform: scale(0.38);
                    }
                }
            `}</style>
        </div>
    );
}
