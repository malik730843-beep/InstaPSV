'use client';

export default function AdsterraVerticalBanner() {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '0', width: '160px', height: '600px', overflow: 'hidden' }}>
            <iframe
                srcDoc={`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <style>body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; }</style>
                    </head>
                    <body>
                        <script type="text/javascript">
                            atOptions = {
                                'key' : '4f319d74c2a31c41d92de9782ade7d37',
                                'format' : 'iframe',
                                'height' : 600,
                                'width' : 160,
                                'params' : {}
                            };
                        </script>
                        <script type="text/javascript" src="https://www.highperformanceformat.com/4f319d74c2a31c41d92de9782ade7d37/invoke.js"></script>
                    </body>
                    </html>
                `}
                width="160"
                height="600"
                frameBorder="0"
                scrolling="no"
                style={{ overflow: 'hidden', border: 'none' }}
                title="Advertisement"
            ></iframe>
        </div>
    );
}
