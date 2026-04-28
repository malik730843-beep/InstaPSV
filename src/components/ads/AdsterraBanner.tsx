'use client';

export default function AdsterraBanner() {
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
                            transform: scale(0.43); /* scales 728 down to ~313px for mobile */
                        }
                        .adsterra-container {
                            height: 40px !important; /* adjust height to match scaled down banner */
                        }
                    }
                    @media (max-width: 480px) {
                        .adsterra-wrapper {
                            transform: scale(0.40); /* scales 728 down to ~290px */
                        }
                        .adsterra-container {
                            height: 38px !important;
                        }
                    }
                `}</style>
                <div className="adsterra-wrapper">
                    <iframe
                        src="/adsterra-728x90.html"
                        width="728"
                        height="90"
                        frameBorder="0"
                        scrolling="no"
                        style={{ overflow: 'hidden', border: 'none', background: 'transparent' }}
                        title="Advertisement"
                    ></iframe>
                </div>
            </div>
        </div>
    );
}
