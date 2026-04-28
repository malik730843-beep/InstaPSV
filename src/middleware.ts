import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkRateLimit } from '@/lib/redis';

// Config: Apply to all routes except static files and images
export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};

// List of blocked country codes (ISO 3166-1 alpha-2)
const BLOCKED_COUNTRIES = ['PK', 'IN', 'SA', 'IL'];

export async function middleware(request: NextRequest) {
    // 1. Country Blocking
    // Vercel provides the country code in this header
    const country = request.headers.get('x-vercel-ip-country');
    
    if (country && BLOCKED_COUNTRIES.includes(country)) {
        return new NextResponse(
            `
            <!DOCTYPE html>
            <html>
                <head>
                    <title>Access Denied</title>
                    <style>
                        body { background: #0a0a1a; color: white; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
                        .container { text-align: center; padding: 2rem; background: rgba(255,255,255,0.05); border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); }
                        h1 { color: #ff0080; margin-bottom: 1rem; }
                        p { font-size: 1.1rem; line-height: 1.5; opacity: 0.9; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Access Denied</h1>
                        <p>Use IP of USA, UK or Canada to access the site.</p>
                    </div>
                </body>
            </html>
            `,
            { 
                status: 403, 
                headers: { 'Content-Type': 'text/html; charset=utf-8' } 
            }
        );
    }

    // 2. Rate Limiting (Only apply to API routes to save Redis calls)
    if (request.nextUrl.pathname.startsWith('/api')) {
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
        const isAllowed = await checkRateLimit(ip, 60, 60);

        if (!isAllowed) {
            return new NextResponse(
                JSON.stringify({ error: 'Too many requests. Please try again later.' }),
                { status: 429, headers: { 'Content-Type': 'application/json' } }
            );
        }
    }

    return NextResponse.next();
}
