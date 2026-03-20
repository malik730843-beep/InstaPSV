import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email') || process.env.ADMIN_EMAIL;
    const password = searchParams.get('password');

    if (!email || !password) {
        return NextResponse.json({ 
            error: 'Email and password are required. Usage: /api/admin/reset-password?email=xxx&password=yyy' 
        }, { status: 400 });
    }

    try {
        // 1. Check if user exists
        const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
        if (listError) throw listError;

        const existingUser = users.find(u => u.email === email);

        if (existingUser) {
            // Update password
            const { error: updateError } = await supabase.auth.admin.updateUserById(
                existingUser.id,
                { password: password }
            );
            if (updateError) throw updateError;
            return NextResponse.json({ success: true, message: `Password updated for ${email}` });
        } else {
            // Create user
            const { error: createError } = await supabase.auth.admin.createUser({
                email,
                password,
                email_confirm: true
            });
            if (createError) throw createError;
            return NextResponse.json({ success: true, message: `Admin user created: ${email}` });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
