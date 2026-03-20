import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
    try {
        // 1. Get Top 10 Searched Usernames
        const { data: topSearches, error: topError } = await supabase
            .from('search_logs')
            .select('username_searched')
            .not('username_searched', 'is', null);

        if (topError) throw topError;

        // Group and count in memory (Supabase doesn't support GROUP BY easily via JS client for count)
        const counts: Record<string, number> = {};
        topSearches.forEach((item: any) => {
            const user = item.username_searched.toLowerCase();
            counts[user] = (counts[user] || 0) + 1;
        });

        const sortedTop = Object.entries(counts)
            .map(([username, count]) => ({ username, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);

        // 2. Get Recent 20 Searches
        const { data: recentSearches, error: recentError } = await supabase
            .from('search_logs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(20);

        if (recentError) throw recentError;

        // 3. Get Search Stats (Today vs Total)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const { count: totalCount, error: totalCountError } = await supabase
            .from('search_logs')
            .select('*', { count: 'exact', head: true });

        const { count: todayCount, error: todayCountError } = await supabase
            .from('search_logs')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', today.toISOString());

        return NextResponse.json({
            topSearches: sortedTop,
            recentSearches,
            stats: {
                totalSearches: totalCount || 0,
                todaySearches: todayCount || 0
            }
        });
    } catch (error: any) {
        console.error('Analytics API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
