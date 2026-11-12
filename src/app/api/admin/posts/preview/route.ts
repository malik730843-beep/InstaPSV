import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin, unauthorizedResponse } from '@/lib/adminAuth';
import { createPostPreviewUrl } from '@/lib/postPreview';

export async function GET(request: NextRequest) {
    const user = await verifyAdmin(request);
    if ('error' in user) return unauthorizedResponse(user.error);
    const slug = request.nextUrl.searchParams.get('slug') || '';
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
        return NextResponse.json({ error: 'Invalid post slug' }, { status: 400 });
    }
    return NextResponse.json({ url: createPostPreviewUrl(slug) }, {
        headers: { 'Cache-Control': 'private, no-store' },
    });
}
