'use client';

export default function AdsterraVerticalBanner() {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            margin: '0',
            width: '160px',
            height: '600px',
            overflow: 'hidden',
        }}>
            <iframe
                src="/ads/vertical-banner.html"
                width="160"
                height="600"
                frameBorder="0"
                scrolling="no"
                style={{
                    overflow: 'hidden',
                    border: 'none',
                    background: 'transparent',
                    display: 'block',
                }}
                title="Advertisement"
                loading="lazy"
            />
        </div>
    );
}
