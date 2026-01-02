import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkRateLimit } from '@/lib/redis';

// Config: Apply to API routes
export const config = {
    matcher: '/api/:path*',
};

export async function middleware(request: NextRequest) {
    // 1. Get IP
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';

    // 2. Rate Limit Check (e.g., 60 requests per minute per IP)
    // We use a higher limit for general API use, but strict for sensitive endpoints
    const isAllowed = await checkRateLimit(ip, 60, 60);

    if (!isAllowed) {
        return new NextResponse(
            JSON.stringify({ error: 'Too many requests. Please try again later.' }),
            { status: 429, headers: { 'Content-Type': 'application/json' } }
        );
    }

    return NextResponse.next();
}
