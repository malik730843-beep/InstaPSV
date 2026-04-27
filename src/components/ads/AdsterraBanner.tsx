'use client';

import { useEffect, useRef } from 'react';

export default function AdsterraBanner() {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0', width: '100%', minHeight: '90px', overflow: 'hidden' }}>
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
                                'key' : '593354ffe4f9cbe99ac9c6ba4c93023d',
                                'format' : 'iframe',
                                'height' : 90,
                                'width' : 728,
                                'params' : {}
                            };
                        </script>
                        <script type="text/javascript" src="https://www.highperformanceformat.com/593354ffe4f9cbe99ac9c6ba4c93023d/invoke.js"></script>
                    </body>
                    </html>
                `}
                width="728"
                height="90"
                frameBorder="0"
                scrolling="no"
                style={{ overflow: 'hidden', border: 'none' }}
                title="Advertisement"
            ></iframe>
        </div>
    );
}
