require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const email = 'malik730843@gmail.com';

async function updateCredits() {
    try {
        console.log(`Checking for user: ${email}`);
        const { data: user, error: fetchError } = await supabase
            .from('user_subscriptions')
            .select('*')
            .eq('email', email)
            .single();

        if (fetchError || !user) {
            console.log('User not found, creating new entry with 10 credits...');
            const { data: newUser, error: createError } = await supabase
                .from('user_subscriptions')
                .insert({ email, plan: 'free', credits_remaining: 10, credits_total: 10 })
                .select()
                .single();
            if (createError) throw createError;
            console.log('User created:', newUser);
        } else {
            console.log('User found, updating to 10 credits...');
            const { data: updatedUser, error: updateError } = await supabase
                .from('user_subscriptions')
                .update({ credits_remaining: 10, credits_total: 10, updated_at: new Date().toISOString() })
                .eq('id', user.id)
                .select()
                .single();
            if (updateError) throw updateError;
            console.log('User updated:', updatedUser);
        }
    } catch (err) {
        console.error('Error:', err.message);
    }
}

updateCredits();
