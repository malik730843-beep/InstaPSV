'use client';

import HardcodedAd from './HardcodedAd';

const FEATURE_AD_CODE = `<script>
  atOptions = {
    'key' : '4f319d74c2a31c41d92de9782ade7d37',
    'format' : 'iframe',
    'height' : 600,
    'width' : 160,
    'params' : {}
  };
</script>
<script src="https://www.highperformanceformat.com/4f319d74c2a31c41d92de9782ade7d37/invoke.js"></script>`;

export default function FeatureSectionAd() {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            background: 'linear-gradient(135deg, rgba(121, 40, 202, 0.1) 0%, rgba(255, 0, 128, 0.1) 100%)',
            borderRadius: '16px',
            margin: '20px 0',
        }}>
            <div style={{
                textAlign: 'center',
            }}>
                <div style={{
                    fontSize: '10px',
                    color: '#999',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginBottom: '10px',
                }}>
                    Advertisement
                </div>
                <HardcodedAd
                    adCode={FEATURE_AD_CODE}
                    width={160}
                    height={600}
                />
            </div>
        </div>
    );
}
