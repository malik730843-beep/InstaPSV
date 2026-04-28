'use client';

export default function AdsterraVerticalBanner() {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '0', width: '160px', height: '600px', overflow: 'hidden' }}>
            <iframe
                src="/adsterra-160x600.html"
                width="160"
                height="600"
                frameBorder="0"
                scrolling="no"
                style={{ overflow: 'hidden', border: 'none', background: 'transparent' }}
                title="Advertisement"
            ></iframe>
        </div>
    );
}
