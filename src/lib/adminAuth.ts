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
        return { error: "Missing Authorization Header" };
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
        console.error("Admin Auth Failed:", error?.message);
        return { error: `Invalid Token: ${error?.message || 'User not found'}` };
    }

    // STRICT SECURITY: Only allow specific email
    // STRICT SECURITY: Only allow specific email
    const allowedEmails = ['malik730843@gmail.com'];
    if (ADMIN_EMAIL) allowedEmails.push(ADMIN_EMAIL);

    if (!allowedEmails.includes(user.email || '')) {
        console.warn(`Unauthorized access attempt by ${user.email}`);
        return { error: `Unauthorized Email: ${user.email} is not admin` };
    }

    // If ADMIN_EMAIL is not set, we BLOCK access for safety in production
    if (!ADMIN_EMAIL) {
        console.error("ADMIN_EMAIL environment variable is not set! Blocking all admin access for security.");
        return { error: "Configuration Error: ADMIN_EMAIL not set on server" };
    }

    return user;
}

export function unauthorizedResponse(reason: string = 'Admin Access Required') {
    return NextResponse.json({ error: `Unauthorized: ${reason}` }, { status: 401 });
}
