'use client';

import { supabase } from '@/lib/supabaseClient';

// Every admin API request must carry the signed-in user's token.
export async function adminFetch(input: string, init: RequestInit = {}) {
    if (!input.startsWith('/api/admin/')) {
        throw new Error('adminFetch only supports local admin API routes');
    }
    const { data: { session } } = await supabase.auth.getSession();
    const headers = new Headers(init.headers);
    if (session?.access_token) {
        headers.set('Authorization', `Bearer ${session.access_token}`);
    }
    return fetch(input, { ...init, headers });
}

export async function openPostPreview(slug: string) {
    const response = await adminFetch(`/api/admin/posts/preview?slug=${encodeURIComponent(slug)}`);
    if (!response.ok) throw new Error('Could not open preview. Please sign in again.');
    const { url } = await response.json();
    window.open(url, '_blank', 'noopener,noreferrer');
}
