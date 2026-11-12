import { createHmac, timingSafeEqual } from 'node:crypto';

const PREVIEW_TTL_SECONDS = 15 * 60;

function sign(slug: string, expires: string) {
    const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!secret) throw new Error('Preview signing is not configured');
    return createHmac('sha256', secret).update(`${slug}:${expires}`).digest('hex');
}

export function createPostPreviewUrl(slug: string, now = Date.now()) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error('Invalid post slug');
    const expires = String(Math.floor(now / 1000) + PREVIEW_TTL_SECONDS);
    return `/${slug}?preview=true&expires=${expires}&token=${sign(slug, expires)}`;
}

export function isValidPostPreview(slug: string, params: Record<string, string | string[] | undefined>, now = Date.now()) {
    const { token, expires } = params;
    if (params.preview !== 'true' || typeof token !== 'string' || typeof expires !== 'string') return false;
    if (!/^[a-f0-9]{64}$/.test(token) || !/^\d+$/.test(expires)) return false;
    const remaining = Number(expires) - Math.floor(now / 1000);
    if (remaining <= 0 || remaining > PREVIEW_TTL_SECONDS || !process.env.SUPABASE_SERVICE_ROLE_KEY) return false;
    return timingSafeEqual(Buffer.from(token, 'hex'), Buffer.from(sign(slug, expires), 'hex'));
}
