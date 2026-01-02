import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

// Client for verifying tokens (using Anon key is sufficient to verify JWT signature if we trust Supabase)
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function verifyAdmin(request: Request) {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader) {
        return null;
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
        console.error("Admin Auth Failed:", error?.message);
        return null;
    }

    // STRICT SECURITY: Only allow specific email
    if (ADMIN_EMAIL && user.email !== ADMIN_EMAIL) {
        console.warn(`Unauthorized access attempt by ${user.email}`);
        return null;
    }

    // If ADMIN_EMAIL is not set, we BLOCK access for safety in production
    if (!ADMIN_EMAIL) {
        console.error("ADMIN_EMAIL environment variable is not set! Blocking all admin access for security.");
        return null;
    }

    return user;
}

export function unauthorizedResponse() {
    return NextResponse.json({ error: 'Unauthorized: Admin Access Required' }, { status: 401 });
}
